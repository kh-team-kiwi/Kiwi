package com.kh.kiwi.chat.service;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import com.kh.kiwi.chat.repository.ChatUsersRepository;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatUserService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ChatUsersRepository chatUsersRepository;

    @Autowired
    private GroupRepository groupRepository;

    public List<Member> getUsersInTeam(String team) {
        List<Group> groupMembers = groupRepository.findByTeam(team);
        List<String> memberIds = groupMembers.stream()
                .map(Group::getMemberId)
                .collect(Collectors.toList());
        return memberRepository.findAllById(memberIds);
    }

    public List<Member> getUsersInChat(int chatNum) {
        List<ChatUsers> chatUsers = chatUsersRepository.findByIdChatNum(chatNum);
        return chatUsers.stream()
                .map(chatUser -> memberRepository.findById(chatUser.getId().getMemberId()).orElse(null))
                .collect(Collectors.toList());
    }

    public void addChatUser(int chatNum, String memberId) {
        ChatUsersId id = new ChatUsersId();
        id.setChatNum(chatNum);
        id.setMemberId(memberId);

        ChatUsers chatUser = new ChatUsers();
        chatUser.setId(id);
        chatUser.setChatTime(LocalDateTime.now());
        chatUser.setChatAdmin(0);

        chatUsersRepository.save(chatUser);
    }
}
