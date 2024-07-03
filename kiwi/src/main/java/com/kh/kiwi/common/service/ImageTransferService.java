package com.kh.kiwi.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;

@Service
@RequiredArgsConstructor
public class ImageTransferService {

    @Value("${aws.s3.bucket}")
    private String bucketName;
    private final S3Client s3Client;
    private final String preFilePath = "http://localhost:8080/api/transfer/download?fileKey=";

    public byte[] downloadImage(String fileKey) {
        return s3Client.getObjectAsBytes(builder -> builder.bucket(bucketName).key(fileKey)).asByteArray();
    }
}
