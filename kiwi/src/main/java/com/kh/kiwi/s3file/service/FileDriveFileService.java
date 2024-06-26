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

    public List<FileDriveFileDTO> getFilesByDriveCodeAndPath(String driveCode, String parentPath) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        log.info("Finding files for driveCode: {} with parentPath: {}", driveCode, parentPath);

        List<FileDriveFileDTO> files = fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, parentPath)
                .stream()
                .map(file -> new FileDriveFileDTO(
                        file.getFileCode(),
                        file.getDriveCode(),
                        file.getFileName(),
                        file.getFilePath(),
                        file.isFolder(),
                        file.getUploadTime()))
                .collect(Collectors.toList());

        log.info("Found {} files for driveCode: {} with parentPath: {}", files.size(), driveCode, parentPath);
        return files;
    }

    public FileDriveFileDTO uploadFile(String driveCode, MultipartFile file, String parentPath, String teamNumber) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        if (teamNumber == null || teamNumber.isEmpty()) {
            throw new IllegalArgumentException("Team number must be provided");
        }

        String fileCode = UUID.randomUUID().toString();
        String s3Key = buildS3Key(teamNumber, driveCode, parentPath, fileCode);

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

    public void createFolder(String driveCode, String folderName, String parentPath, String teamNumber) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        if (teamNumber == null || teamNumber.isEmpty()) {
            throw new IllegalArgumentException("Team number must be provided");
        }

        String folderCode = UUID.randomUUID().toString();
        String s3Key = buildS3Key(teamNumber, driveCode, parentPath, folderCode + "/");

        // 폴더 경로 로그 출력
        log.info("Creating folder in S3 with key: " + s3Key);

        // S3에 빈 객체 업로드하여 폴더 생성
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(new byte[0]));
        } catch (Exception e) {
            log.error("Failed to create folder in S3", e);
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

    private String buildS3Key(String teamNumber, String driveCode, String parentPath, String folderCode) {
        StringBuilder keyBuilder = new StringBuilder();

        keyBuilder.append(teamNumber).append("/drive/").append(driveCode).append("/");

        if (parentPath != null && !parentPath.isEmpty()) {
            String adjustedParentPath = parentPath;

            if (parentPath.equals(driveCode)) {
                // parentPath가 드라이브 코드와 동일할 때
                adjustedParentPath = "";
            } else if (parentPath.startsWith(driveCode + "/")) {
                // parentPath가 드라이브 코드로 시작할 때
                adjustedParentPath = parentPath.substring(driveCode.length() + 1);
            }

            adjustedParentPath = adjustedParentPath.replaceAll("^/+", "").replaceAll("/+$", "");

            if (!adjustedParentPath.isEmpty()) {
                keyBuilder.append(adjustedParentPath).append("/");
            }
        }

        keyBuilder.append(folderCode);

        return keyBuilder.toString();
    }

    public void deleteFolder(String driveCode, String folderCode, String parentPath) {
        FileDriveFile folder = fileDriveFileRepository.findById(folderCode).orElseThrow(() -> new RuntimeException("Folder not found"));
        String s3Key = folder.getFilePath();

        List<FileDriveFile> filesInFolder = fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, s3Key);
        for (FileDriveFile file : filesInFolder) {
            deleteFile(driveCode, file.getFileCode(), parentPath);
        }

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

        fileDriveFileRepository.deleteById(folderCode);
    }
}
