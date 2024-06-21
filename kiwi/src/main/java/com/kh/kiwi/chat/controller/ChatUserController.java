package com.kh.kiwi.chat.controller;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.chat.service.ChatUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat/user")
public class ChatUserController {

    @Autowired
    private ChatUserService chatUserService;

    @GetMapping("/{chatNum}")
    public List<Member> getUsersInChat(@PathVariable int chatNum) {
        return chatUserService.getUsersInChat(chatNum);
    }

    @GetMapping("/members")
    public List<Member> getUsersByTeam(@RequestParam String team) {
        System.out.print("aaa");
        return chatUserService.getUsersInTeam(team);
    }
}
