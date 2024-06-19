package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.service.MessageChatnumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/chat/message")
public class ChatMessageController {

    @Autowired
    private MessageChatnumService messageChatnumService;

    @MessageMapping("/chat.sendMessage/{chatNum}")
    @SendTo("/topic/chat/{chatNum}")
    public ChatMessage sendMessage(ChatMessage message) {
        System.out.println("Received message: " + message); // Log the received message
        messageChatnumService.saveMessage(message);
        return message;
    }

    @PostMapping("/upload")
    public List<String> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                    @RequestParam("team") String team,
                                    @RequestParam("chatName") String chatName) throws IOException {
        return messageChatnumService.uploadFiles(files, team, chatName);
    }

    @GetMapping("/messages/{chatNum}")
    public List<MessageChatnum> getMessagesByChatNum(@PathVariable Integer chatNum) {
        return messageChatnumService.getMessagesByChatNum(chatNum);
    }

    @GetMapping("/download")
    public byte[] downloadFile(@RequestParam String fileKey) {
        return messageChatnumService.downloadFile(fileKey);
    }
}
