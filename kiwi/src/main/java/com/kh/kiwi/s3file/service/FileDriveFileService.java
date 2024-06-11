package com.kh.kiwi.s3file.service;

import com.kh.kiwi.s3file.dto.FileDrivefileDto;
import com.kh.kiwi.s3file.entity.FileDriveFile;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDriveFileService {

    private final S3Client s3Client;
    private final FileDriveFileRepository fileDriveRepository;

    public FileDriveFileService(S3Client s3Client, FileDriveFileRepository fileDriveRepository) {
        this.s3Client = s3Client;
        this.fileDriveRepository = fileDriveRepository;
    }

    @Value("${aws.s3.bucket}")
    private String bucketName;


    public FileDrivefileDto uploadFile(MultipartFile file, String team) throws IOException {
        String key = UUID.randomUUID().toString();

        File tempFile = File.createTempFile("upload", null);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromFile(tempFile));
            System.out.println("경로"+putObjectRequest);
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to upload file to S3", e);
        } finally {
            tempFile.delete();
        }

        FileDriveFile fileDrive = new FileDriveFile();
        fileDrive.setFileCode(key);
        fileDrive.setTeam(team);
        fileDrive.setFileName(file.getOriginalFilename());
        fileDrive.setFilePath(key);
        fileDrive.setUploadTime(LocalDateTime.now());

        fileDriveRepository.save(fileDrive);

        FileDrivefileDto fileDTO = new FileDrivefileDto();
        fileDTO.setFileCode(key);
        fileDTO.setTeam(fileDrive.getTeam());
        fileDTO.setFileName(fileDrive.getFileName());
        fileDTO.setFilePath(fileDrive.getFilePath());
        fileDTO.setUploadTime(fileDrive.getUploadTime());

        return fileDTO;
    }

    public List<FileDrivefileDto> listFiles() {
        return fileDriveRepository.findAll().stream().map(file -> {
            FileDrivefileDto fileDTO = new FileDrivefileDto();
            fileDTO.setFileCode(file.getFileCode());
            fileDTO.setTeam(file.getTeam());
            fileDTO.setFileName(file.getFileName());
            fileDTO.setFilePath(file.getFilePath());
            fileDTO.setUploadTime(file.getUploadTime());
            return fileDTO;
        }).collect(Collectors.toList());
    }

    public byte[] downloadFile(String key) throws IOException {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            ResponseInputStream<?> s3Object = s3Client.getObject(getObjectRequest);


            return s3Object.readAllBytes();
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to download file from S3", e);
        }
    }
    public void deleteFile(String key) {
        try {
            fileDriveRepository.deleteById(key);
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);

        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete file from S3", e);
        }
    }

    public void createFolder(String folderName) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(folderName + "/")
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(new byte[0]));
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create folder in S3", e);
        }
    }

    public void deleteFolder(String folderName) {
        try {
            ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(folderName + "/")
                    .build();

            ListObjectsV2Response listObjectsResponse;
            List<String> keysToDelete = new ArrayList<>();

            do {
                listObjectsResponse = s3Client.listObjectsV2(listObjectsRequest);
                keysToDelete.addAll(listObjectsResponse.contents().stream()
                        .map(s3Object -> s3Object.key())
                        .collect(Collectors.toList()));

                listObjectsRequest = listObjectsRequest.toBuilder()
                        .continuationToken(listObjectsResponse.nextContinuationToken())
                        .build();
            } while (listObjectsResponse.isTruncated());

            keysToDelete.forEach(this::deleteFile);
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete folder from S3", e);
        }
    }

}
