package com.kh.kiwi.s3file.repository;

import com.kh.kiwi.s3file.entity.FileDriveEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FileDriveRepository extends JpaRepository<FileDriveEntity, FileDriveId> {
}
