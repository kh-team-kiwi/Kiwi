package com.kh.kiwi.s3drive.repository;

import com.kh.kiwi.s3drive.entity.DriveUsers;
import com.kh.kiwi.s3drive.entity.DriveUsersId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DriveUsersRepository extends JpaRepository<DriveUsers, DriveUsersId> {
    @Transactional
    void deleteByDriveCode(String driveCode);
}
