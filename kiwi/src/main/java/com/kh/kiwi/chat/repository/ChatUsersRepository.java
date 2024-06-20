package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatUsersRepository extends JpaRepository<ChatUsers, ChatUsersId> {
    List<ChatUsers> findByIdChatNum(int chatNum);
}
