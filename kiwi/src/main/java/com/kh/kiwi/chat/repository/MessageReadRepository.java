package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.MessageRead;
import com.kh.kiwi.chat.entity.MessageReadId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MessageReadRepository extends JpaRepository<MessageRead, MessageReadId> {
    boolean existsById(MessageReadId id);

    @Query("SELECT COUNT(mr) FROM MessageRead mr WHERE mr.id.messageNum = :messageNum")
    int countByIdMessageNum(String messageNum);

    @Modifying
    @Transactional
    @Query("DELETE FROM MessageRead mr WHERE mr.id.messageNum = :messageNum")
    void deleteByIdMessageNum(String messageNum);

    @Transactional
    void deleteByIdMemberId(String memberId);
}
