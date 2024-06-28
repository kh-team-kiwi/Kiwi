package com.kh.kiwi.chat.repository;

import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatUsersRepository extends JpaRepository<ChatUsers, ChatUsersId> {
    List<ChatUsers> findByIdChatNum(int chatNum);

    @Query("SELECT cu FROM ChatUsers cu WHERE cu.id.memberId = :memberId")
    List<ChatUsers> findByMemberId(String memberId);

    @Transactional
    void deleteByIdChatNum(int chatNum);

    @Query("SELECT COUNT(cu) FROM ChatUsers cu WHERE cu.id.chatNum = :chatNum")
    int countMembersByIdChatNum(int chatNum);
}
