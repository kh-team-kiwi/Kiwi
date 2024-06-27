package com.kh.kiwi.s3drive.repository;

import com.kh.kiwi.s3drive.entity.DriveUsers;
import com.kh.kiwi.s3drive.entity.DriveUsersId;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DriveUsersRepository extends JpaRepository<DriveUsers, DriveUsersId> {
    @Transactional
    void deleteByDriveCode(String driveCode);

    @Query("SELECT du FROM DriveUsers du JOIN FileDrive fd ON du.driveCode = fd.driveCode WHERE du.memberId = :memberId AND fd.team = :team")
    List<DriveUsers> findByMemberIdAndTeam(@Param("memberId") String memberId, @Param("team") String team);
}
