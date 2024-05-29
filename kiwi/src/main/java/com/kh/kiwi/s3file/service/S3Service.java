package com.kh.kiwi.s3file.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
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
