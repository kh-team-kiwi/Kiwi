package com.kh.kiwi.s3drive.repository;

import java.util.List;

import com.kh.kiwi.s3drive.entity.FileDrive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileDriveRepository extends JpaRepository<FileDrive, String> {
    // 팀에 해당하는 드라이브 가져오기
    List<FileDrive> findByTeam(String team);
}
