package com.kh.kiwi.s3file.repository;

import com.kh.kiwi.s3file.entity.FileDriveFile;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FileDriveFileRepository extends JpaRepository<FileDriveFile, String> {

}
