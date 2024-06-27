package com.kh.kiwi.s3drive.service;

import com.kh.kiwi.s3drive.dto.FileDriveDTO;
import com.kh.kiwi.s3drive.entity.DriveUsers;
import com.kh.kiwi.s3drive.entity.FileDrive;
import com.kh.kiwi.s3drive.repository.DriveUsersRepository;
import com.kh.kiwi.s3drive.repository.FileDriveRepository;
import com.kh.kiwi.s3file.entity.FileDriveFile;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDriveService {

    private final S3Client s3Client;
    private final FileDriveRepository fileDriveRepository;
    private final DriveUsersRepository driveUsersRepository;
    private final FileDriveFileRepository fileDriveFileRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public FileDriveService(S3Client s3Client, FileDriveRepository fileDriveRepository, DriveUsersRepository driveUsersRepository, FileDriveFileRepository fileDriveFileRepository) {
        this.s3Client = s3Client;
        this.fileDriveRepository = fileDriveRepository;
        this.driveUsersRepository = driveUsersRepository;
        this.fileDriveFileRepository = fileDriveFileRepository;
    }

    public FileDriveDTO createDrive(FileDriveDTO fileDriveDTO, List<String> userIds) {
        // 드라이브 코드 생성
        String driveCode = UUID.randomUUID().toString();
        String s3FolderPath = fileDriveDTO.getTeam() + "/drive/" + driveCode + "/";

        // S3에 폴더 생성
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3FolderPath) // 폴더 구조를 지정하여 폴더 생성
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(new byte[0]));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create folder in S3", e);
        }

        // 드라이브 정보 저장
        FileDrive fileDrive = new FileDrive();
        fileDrive.setDriveCode(driveCode);
        fileDrive.setDriveName(fileDriveDTO.getDriveName());
        fileDrive.setTeam(fileDriveDTO.getTeam());
        fileDriveRepository.save(fileDrive);

        // 드라이브 사용자 정보 저장
        for (String userId : userIds) {
            DriveUsers driveUser = new DriveUsers();
            driveUser.setDriveCode(driveCode);
            driveUser.setMemberId(userId);
            driveUsersRepository.save(driveUser);
        }

        // 드라이브 DTO 반환
        return new FileDriveDTO(driveCode, fileDriveDTO.getDriveName(), fileDriveDTO.getTeam());
    }

    public List<FileDriveDTO> listDrives() {
        return fileDriveRepository.findAll().stream()
                .map(fileDrive -> new FileDriveDTO(fileDrive.getDriveCode(), fileDrive.getDriveName(), fileDrive.getTeam()))
                .collect(Collectors.toList());
    }

    public List<FileDriveDTO> listDrivesByTeam(String team) {
        return fileDriveRepository.findByTeam(team).stream()
                .map(fileDrive -> new FileDriveDTO(fileDrive.getDriveCode(), fileDrive.getDriveName(), fileDrive.getTeam()))
                .collect(Collectors.toList());
    }

    public List<FileDriveDTO> listDrivesByUserAndTeam(String memberId, String team) {
        List<DriveUsers> driveUsers = driveUsersRepository.findByMemberIdAndTeam(memberId, team);
        List<String> driveCodes = driveUsers.stream().map(DriveUsers::getDriveCode).collect(Collectors.toList());
        return fileDriveRepository.findAllById(driveCodes).stream()
                .map(fileDrive -> new FileDriveDTO(fileDrive.getDriveCode(), fileDrive.getDriveName(), fileDrive.getTeam()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteDrive(String driveCode) {
        // 드라이브 정보 조회
        FileDrive fileDrive = fileDriveRepository.findById(driveCode)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        String s3FolderPath = fileDrive.getTeam() + "/drive/" + driveCode + "/";

        // 드라이브 내 모든 파일 삭제
        List<FileDriveFile> files = fileDriveFileRepository.findByDriveCodeAndFilePathStartingWith(driveCode, s3FolderPath);
        for (FileDriveFile file : files) {
            try {
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(file.getFilePath())
                        .build();
                s3Client.deleteObject(deleteObjectRequest);
                fileDriveFileRepository.delete(file);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to delete file in S3", e);
            }
        }

        // S3에서 폴더 삭제
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3FolderPath) // 폴더 구조를 지정하여 폴더 삭제
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete folder in S3", e);
        }

        // drive_users 테이블에서 관련 레코드 삭제
        driveUsersRepository.deleteByDriveCode(driveCode);

        // 드라이브 정보 삭제
        fileDriveRepository.deleteById(driveCode);
    }

    public void updateDrive(String driveCode, FileDriveDTO fileDriveDTO) {
        FileDrive fileDrive = fileDriveRepository.findById(driveCode)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        fileDrive.setDriveName(fileDriveDTO.getDriveName());
        fileDriveRepository.save(fileDrive);
    }
}
