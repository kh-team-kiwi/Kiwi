package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.dto.CreateChatRequest;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public List<Chat> getChatsByTeam(@RequestParam String team) {
        return chatService.getChatsByTeam(team);
    }

    @PostMapping("/createWithUsers")
    public Chat createChatWithUsers(@RequestBody CreateChatRequest request) {
        return chatService.createChatWithUsers(request);
    }

    @GetMapping("/{chatNum}")
    public Chat getChatById(@PathVariable Integer chatNum) {
        return chatService.getChatById(chatNum);
    }

    @DeleteMapping("/{chatNum}")
    public void deleteChatById(@PathVariable Integer chatNum) {
        chatService.deleteChatById(chatNum);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("team") String team, @RequestParam("chatName") String chatName) throws IOException {
        String fileUrl = chatService.uploadFile(file, team, chatName);
        return ResponseEntity.ok(fileUrl);
    }
}
