package com.kh.kiwi.s3file.service;

import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.entity.FileDriveFile;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import com.kh.kiwi.s3drive.repository.FileDriveRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDriveFileService {

    private static final Logger log = LoggerFactory.getLogger(FileDriveFileService.class);
    private final S3Client s3Client;
    private final FileDriveFileRepository fileDriveFileRepository;
    private final FileDriveRepository fileDriveRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public FileDriveFileService(S3Client s3Client, FileDriveFileRepository fileDriveFileRepository, FileDriveRepository fileDriveRepository) {
        this.s3Client = s3Client;
        this.fileDriveFileRepository = fileDriveFileRepository;
        this.fileDriveRepository = fileDriveRepository;
    }

    private List<FileDriveFileDTO> filterFilesByDepth(List<FileDriveFileDTO> files, String path, boolean isRoot) {
        return files.stream()
                .filter(file -> {
                    String relativePath = file.getFilePath().substring(path.length());
                    int depth = relativePath.split("/").length;
                    return isRoot ? depth == 2 : depth == 1;
                })
                .collect(Collectors.toList());
    }


    public List<FileDriveFileDTO> getFilesByDriveCodeAndPath(String driveCode, String path) {
        String actualPath = (path != null && !path.isEmpty()) ? path : driveCode;
        List<FileDriveFileDTO> allFiles = fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, actualPath).stream()
                .filter(file -> file.getFilePath().startsWith(actualPath) && !file.getFilePath().equals(actualPath))
                .map(file -> new FileDriveFileDTO(file.getFileCode(), file.getDriveCode(), file.getFileName(), file.getFilePath(), file.isFolder(), file.getUploadTime()))
                .collect(Collectors.toList());

        boolean isRoot = path == null || path.isEmpty() || path.equals(driveCode);
        return filterFilesByDepth(allFiles, actualPath, isRoot);
    }


    public FileDriveFileDTO uploadFile(String driveCode, MultipartFile file, String parentPath) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        String fileCode = UUID.randomUUID().toString();
        String s3Key;

        if (parentPath == null || parentPath.isEmpty()) {
            s3Key = driveCode + "/" + fileCode;
        } else {
            s3Key = parentPath.endsWith("/") ? parentPath + fileCode : parentPath + "/" + fileCode;
        }

        // S3에 파일 업로드
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload file to S3", e);
        }

                // 드라이브 정보 저장
        FileDriveFile fileDriveFile = new FileDriveFile();
        fileDriveFile.setFileCode(fileCode);
        fileDriveFile.setDriveCode(driveCode);
        fileDriveFile.setFileName(file.getOriginalFilename());
        fileDriveFile.setFilePath(s3Key); // S3 경로를 저장
        fileDriveFile.setUploadTime(LocalDateTime.now());
        fileDriveFile.setFolder(false); // 파일 업로드 시 폴더가 아님
        fileDriveFileRepository.save(fileDriveFile);

        return new FileDriveFileDTO(fileDriveFile.getFileCode(), fileDriveFile.getDriveCode(), fileDriveFile.getFileName(), fileDriveFile.getFilePath(), fileDriveFile.isFolder(), fileDriveFile.getUploadTime());
    }

    public void deleteFile(String driveCode, String fileCode, String parentPath) {
        FileDriveFile file = fileDriveFileRepository.findById(fileCode).orElseThrow(() -> new RuntimeException("File not found"));
        String s3Key = file.getFilePath();

        // S3에서 파일 삭제
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete file from S3", e);
        }

        // 파일 정보 삭제
        fileDriveFileRepository.deleteById(fileCode);
    }

    public void updateFileName(String driveCode, String fileCode, String newFileName, String parentPath) {
        FileDriveFile file = fileDriveFileRepository.findById(fileCode).orElseThrow(() -> new RuntimeException("File not found"));
        file.setFileName(newFileName.replace("\"", "")); // 파일 이름 끝의 "" 제거
        fileDriveFileRepository.save(file);
    }

    public void updateFolderName(String driveCode, String folderCode, String newFolderName, String parentPath) {
        FileDriveFile folder = fileDriveFileRepository.findById(folderCode).orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.setFileName(newFolderName.replace("\"", "")); // 폴더 이름 끝의 "" 제거
        fileDriveFileRepository.save(folder);
    }

    public byte[] downloadFile(String driveCode, String fileCode) {
        FileDriveFile file = fileDriveFileRepository.findById(fileCode).orElseThrow(() -> new RuntimeException("File not found"));
        String s3Key = file.getFilePath();

        // 파일 경로 로그 출력
        System.out.println("Downloading file from S3 with key: " + s3Key);

        // S3에서 파일 다운로드
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            return s3Client.getObject(getObjectRequest).readAllBytes();
        } catch (NoSuchKeyException e) {
            e.printStackTrace();
            throw new RuntimeException("File not found in S3: " + s3Key, e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to download file from S3", e);
        }
    }

    public void createFolder(String driveCode, String folderName, String parentPath) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        String folderCode = UUID.randomUUID().toString();
        String s3Key = buildS3Key(parentPath, folderCode + "/");

        // 폴더 경로 로그 출력
        System.out.println("Creating folder in S3 with key: " + s3Key);

        // S3에 빈 객체 업로드하여 폴더 생성
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(new byte[0]));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create folder in S3", e);
        }

        FileDriveFile folder = new FileDriveFile();
        folder.setFileCode(folderCode);
        folder.setDriveCode(driveCode);
        folder.setFileName(folderName);
        folder.setFilePath(s3Key); // S3 경로를 저장
        folder.setUploadTime(LocalDateTime.now());
        folder.setFolder(true);
        fileDriveFileRepository.save(folder);
    }

    private String buildS3Key(String parentPath, String filePath) {
        if (parentPath == null || parentPath.isEmpty()) {
            return filePath;
        }
        if (!parentPath.endsWith("/")) {
            parentPath += "/";
        }
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }
        return parentPath + filePath;
    }

    public void deleteFolder(String driveCode, String folderCode, String parentPath) {
        FileDriveFile folder = fileDriveFileRepository.findById(folderCode).orElseThrow(() -> new RuntimeException("Folder not found"));
        String s3Key = folder.getFilePath();

        // S3에서 폴더 및 폴더 내 파일 삭제
        List<FileDriveFile> filesInFolder = fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, s3Key);
        for (FileDriveFile file : filesInFolder) {
            // 파일 삭제
            deleteFile(driveCode, file.getFileCode(), parentPath);
        }

        // S3에서 폴더 삭제
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete folder from S3", e);
        }

        // 폴더 정보 삭제
        fileDriveFileRepository.deleteById(folderCode);
    }
}
