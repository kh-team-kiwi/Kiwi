package com.kh.kiwi.chat.service;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import com.kh.kiwi.chat.repository.ChatUsersRepository;
import com.kh.kiwi.chat.repository.MessageReadRepository;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ChatUserService {

    private static final Logger logger = LoggerFactory.getLogger(ChatUserService.class);

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ChatUsersRepository chatUsersRepository;

    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private MessageReadRepository messageReadRepository;

    public List<Member> getUsersInTeam(String team) {
        logger.debug("Fetching users in team: {}", team);
        List<Group> groupMembers = groupRepository.findAllByTeamAndStatus(team,"JOINED");
        List<String> memberIds = groupMembers.stream()
                .map(Group::getMemberId)
                .collect(Collectors.toList());
        return memberRepository.findAllById(memberIds);
    }

    public List<Member> getUsersInChat(int chatNum) {
        logger.debug("Fetching users in chat: {}", chatNum);
        List<ChatUsers> chatUsers = chatUsersRepository.findByIdChatNum(chatNum);
        return chatUsers.stream()
                .map(chatUser -> memberRepository.findById(chatUser.getId().getMemberId()).orElse(null))
                .collect(Collectors.toList());
    }

    public void addChatUser(int chatNum, String memberId) {
        logger.debug("Adding user to chat: {} with memberId: {}", chatNum, memberId);
        ChatUsersId id = new ChatUsersId();
        id.setChatNum(chatNum);
        id.setMemberId(memberId);

        ChatUsers chatUser = new ChatUsers();
        chatUser.setId(id);
        chatUser.setChatTime(LocalDateTime.now());
        chatUser.setChatAdmin(0);

        chatUsersRepository.save(chatUser);
    }

    public void removeChatUser(int chatNum, String memberId) {
        logger.debug("Removing user from chat: {} with memberId: {}", chatNum, memberId);
        ChatUsersId id = new ChatUsersId();
        id.setChatNum(chatNum);
        id.setMemberId(memberId);

        // chat_users 테이블에서 사용자 제거
        chatUsersRepository.deleteById(id);

        // message_read 테이블에서 해당 사용자의 읽은 메시지 기록 제거
        messageReadRepository.deleteByIdMemberId(memberId);
        logger.debug("User removed from chat and message read records deleted: {} with memberId: {}", chatNum, memberId);
    }
}
