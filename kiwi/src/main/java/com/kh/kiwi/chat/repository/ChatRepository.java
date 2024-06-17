package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByTeam(String team);
}
