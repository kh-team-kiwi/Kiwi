package com.kh.kiwi.s3file.service;

import com.kh.kiwi.s3drive.repository.FileDriveRepository;
import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.entity.FileDriveFile;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
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

    public List<FileDriveFileDTO> getFilesByDriveCode(String driveCode) {
        return fileDriveFileRepository.findByDriveCode(driveCode).stream()
                .map(file -> new FileDriveFileDTO(file.getFileCode(), file.getDriveCode(), file.getFileName(), file.getFilePath(), file.isFolder(), file.getUploadTime()))
                .collect(Collectors.toList());
    }

    public FileDriveFileDTO uploadFile(String driveCode, MultipartFile file) {
        // 드라이브가 존재하는지 확인
        if (!fileDriveRepository.existsById(driveCode)) {
            throw new IllegalArgumentException("Drive does not exist: " + driveCode);
        }

        String fileCode = UUID.randomUUID().toString();
        String s3Key = driveCode + "/" + fileCode + "/" + file.getOriginalFilename();

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
        fileDriveFile.setFolder(false);
        fileDriveFileRepository.save(fileDriveFile);

        return new FileDriveFileDTO(fileDriveFile.getFileCode(), fileDriveFile.getDriveCode(), fileDriveFile.getFileName(), fileDriveFile.getFilePath(), fileDriveFile.isFolder(), fileDriveFile.getUploadTime());
    }
}
