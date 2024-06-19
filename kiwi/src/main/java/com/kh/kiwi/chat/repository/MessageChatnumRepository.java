package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.MessageChatnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageChatnumRepository extends JpaRepository<MessageChatnum, String> {
    List<MessageChatnum> findByChatAndChatTimeBetween(Chat chat, LocalDateTime start, LocalDateTime end);
    List<MessageChatnum> findByChatOrderByChatTimeAsc(Chat chat);
    List<MessageChatnum> findByChat_ChatNum(Integer chatNum);
}
