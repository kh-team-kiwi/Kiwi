package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public List<Chat> getAllChats(@RequestParam(required = false) String team) {
        if (team != null && !team.isEmpty()) {
            return chatService.getChatsByTeam(team);
        } else {
            return chatService.getAllChats();
        }
    }

    @PostMapping
    public Chat createChat(@RequestBody Chat chat) {
        return chatService.createChat(chat);
    }

    @GetMapping("/{chatNum}")
    public Chat getChatById(@PathVariable Integer chatNum) {
        return chatService.getChatById(chatNum);
    }

    @DeleteMapping("/{chatNum}")
    public void deleteChatById(@PathVariable Integer chatNum) {
        chatService.deleteChatById(chatNum);
    }
}
