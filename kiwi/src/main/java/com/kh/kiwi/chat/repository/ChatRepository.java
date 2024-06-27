package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByTeam(String team);

    @Query("SELECT c FROM Chat c WHERE c.team = :team AND c.chatNum IN :chatNums")
    List<Chat> findByTeamAndChatNumIn(@Param("team") String team, @Param("chatNums") List<Integer> chatNums);
}
