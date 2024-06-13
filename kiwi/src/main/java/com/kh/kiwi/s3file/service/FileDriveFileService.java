package com.kh.kiwi.s3file.service;

import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.entity.FileDriveFile;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import com.kh.kiwi.s3drive.repository.FileDriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDriveFileService {

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

    public List<FileDriveFileDTO> getFilesByDriveCodeAndPath(String driveCode, String path) {
        String actualPath = path != null ? path : driveCode + "/";
        return fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, actualPath).stream()
                .map(file -> new FileDriveFileDTO(file.getFileCode(), file.getDriveCode(), file.getFileName(), file.getFilePath(), file.isFolder(), file.getUploadTime()))
                .collect(Collectors.toList());
    }

    public FileDriveFileDTO uploadFile(String driveCode, MultipartFile file, String parentPath) {
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        String fileCode = UUID.randomUUID().toString();
        String s3Key = (parentPath != null && !parentPath.isEmpty() ? parentPath : driveCode + "/") + fileCode;

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
        String s3Key = parentPath != null ? parentPath + file.getFilePath() : file.getFilePath();

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
        String oldS3Key = parentPath != null ? parentPath + file.getFilePath() : file.getFilePath();
        String newS3Key = (parentPath != null ? parentPath : driveCode + "/") + fileCode + "/" + newFileName.replace("\"", ""); // 파일 이름 끝의 "" 제거

        // S3에서 파일 이름 변경
        try {
            CopyObjectRequest copyObjectRequest = CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(oldS3Key)
                    .destinationBucket(bucketName)
                    .destinationKey(newS3Key)
                    .build();
            s3Client.copyObject(copyObjectRequest);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(oldS3Key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to rename file in S3", e);
        }

        // 파일 정보 업데이트
        file.setFileName(newFileName.replace("\"", "")); // 파일 이름 끝의 "" 제거
        file.setFilePath(newS3Key);
        fileDriveFileRepository.save(file);
    }

    public byte[] downloadFile(String driveCode, String fileCode, String parentPath) {
        FileDriveFile file = fileDriveFileRepository.findById(fileCode).orElseThrow(() -> new RuntimeException("File not found"));
        String s3Key = parentPath != null ? parentPath + file.getFilePath() : file.getFilePath();

        // S3에서 파일 다운로드
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            return s3Client.getObject(getObjectRequest).readAllBytes();
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
        String s3Key = (parentPath != null && !parentPath.isEmpty() ? parentPath : driveCode + "/") + folderCode + "/";

        // S3에 폴더 생성
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

        // 드라이브 정보 저장
        FileDriveFile folder = new FileDriveFile();
        folder.setFileCode(folderCode);
        folder.setDriveCode(driveCode);
        folder.setFileName(folderName);
        folder.setFilePath(s3Key); // S3 경로를 저장
        folder.setUploadTime(LocalDateTime.now());
        folder.setFolder(true);
        fileDriveFileRepository.save(folder);
    }


    public void deleteFolder(String driveCode, String folderCode, String parentPath) {
        FileDriveFile folder = fileDriveFileRepository.findById(folderCode).orElseThrow(() -> new RuntimeException("Folder not found"));
        String s3Key = parentPath != null ? parentPath + folder.getFilePath() : folder.getFilePath();

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
