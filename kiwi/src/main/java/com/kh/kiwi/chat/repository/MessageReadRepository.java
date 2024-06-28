package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.MessageRead;
import com.kh.kiwi.chat.entity.MessageReadId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageReadRepository extends JpaRepository<MessageRead, MessageReadId> {
    boolean existsById(MessageReadId id);

    @Query("SELECT COUNT(mr) FROM MessageRead mr WHERE mr.id.messageNum = :messageNum")
    int countByIdMessageNum(String messageNum);
}
