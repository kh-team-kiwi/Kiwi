package com.kh.kiwi.s3file.repository;

import com.kh.kiwi.s3file.entity.FileDriveFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileDriveFileRepository extends JpaRepository<FileDriveFile, String> {
    List<FileDriveFile> findByDriveCode(String driveCode);
}
