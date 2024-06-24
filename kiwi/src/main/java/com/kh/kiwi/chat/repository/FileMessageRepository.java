package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.FileMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileMessageRepository extends JpaRepository<FileMessage, String> {
    List<FileMessage> findByMessageNum(String messageNum);
}
