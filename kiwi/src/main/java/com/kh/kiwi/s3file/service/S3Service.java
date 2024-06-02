package com.kh.kiwi.s3file.service;

import com.kh.kiwi.s3file.dto.FileDriveDto;
import com.kh.kiwi.s3file.repository.FileDriveRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final FileDriveRepository fileDriveRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(S3Client s3Client, FileDriveRepository fileDriveRepository) {
        this.s3Client = s3Client;
        this.fileDriveRepository = fileDriveRepository;
    }
    public List<FileDriveDto> listFiles() {
        return fileDriveRepository.findAll().stream().map(file -> {
            FileDriveDto fileDTO = new FileDriveDto();
            fileDTO.setFileCode(file.getFileCode());
            fileDTO.setTeam(file.getTeam());
            fileDTO.setFileName(file.getFileName());
            fileDTO.setFilePath(file.getFilePath());
            fileDTO.setUploadTime(file.getUploadTime());
            return fileDTO;
        }).collect(Collectors.toList());
    }
    public List<String> uploadFiles(List<MultipartFile> files) throws IOException {
        return files.stream()
                .map(file -> {
                    try {
                        return uploadFile(file);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                    }
                })
                .collect(Collectors.toList());
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
    public String uploadFile(MultipartFile file) throws IOException {
        String key = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

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
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new IOException("Failed to upload file to S3", e);
        } finally {
            tempFile.delete();
        }

        return key;
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

    public void renameFile(String oldKey, String newKey) {
        try {
            CopyObjectRequest copyObjectRequest = CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(oldKey)
                    .destinationBucket(bucketName)
                    .destinationKey(newKey)
                    .build();
            s3Client.copyObject(copyObjectRequest);
            deleteFile(oldKey);
        } catch (S3Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to rename file in S3", e);
        }
    }
}
