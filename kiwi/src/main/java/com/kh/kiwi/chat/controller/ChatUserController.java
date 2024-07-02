package com.kh.kiwi.chat.controller;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.chat.service.ChatUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/user")
public class ChatUserController {

    @Autowired
    private ChatUserService chatUserService;

    private static final Logger logger = LoggerFactory.getLogger(ChatUserService.class);


    @GetMapping("/{chatNum}")
    public List<Member> getUsersInChat(@PathVariable int chatNum) {
        logger.debug("Getting users in chat: {}", chatNum);
        return chatUserService.getUsersInChat(chatNum);
    }

    @GetMapping("/members")
    public List<Member> getUsersByTeam(@RequestParam String team) {
        logger.debug("Getting users by team: {}", team);
        return chatUserService.getUsersInTeam(team);
    }

    @PostMapping("/{chatNum}/invite")
    public void inviteUserToChat(@PathVariable int chatNum, @RequestBody Member member) {
        logger.debug("Inviting user to chat: {} with memberId: {}", chatNum, member.getMemberId());
        chatUserService.addChatUser(chatNum, member.getMemberId());
    }

    @PostMapping("/{chatNum}/leave")
    public void leaveChat(@PathVariable int chatNum, @RequestBody Member member) {
        logger.debug("User leaving chat: {} with memberId: {}", chatNum, member.getMemberId());
        chatUserService.removeChatUser(chatNum, member.getMemberId());
    }
}
