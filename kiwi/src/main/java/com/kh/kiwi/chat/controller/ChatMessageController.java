package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.service.MessageChatnumService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/message")
public class ChatMessageController {

    private static final Logger log = LoggerFactory.getLogger(ChatMessageController.class);

    @Autowired
    private MessageChatnumService messageChatnumService;

    @MessageMapping("/chat.sendMessage/{chatNum}")
    @SendTo("/topic/chat/{chatNum}")
    public ChatMessage sendMessage(ChatMessage message) {
        message.setChatTime(LocalDateTime.now());
        String memberNickname = messageChatnumService.getNicknameByEmail(message.getSender());
        message.setMemberNickname(memberNickname);
        message.setChatContent(message.getContent());
        messageChatnumService.saveMessage(message);
        return message;
    }

    @PostMapping("/upload")
    public List<ChatMessage.FileInfo> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                                  @RequestParam("team") String team,
                                                  @RequestParam("chatNum") String chatNum) throws IOException {
        return messageChatnumService.uploadFiles(files, team, chatNum);
    }

    @GetMapping("/messages/{chatNum}")
    public List<ChatMessage> getMessagesByChatNum(@PathVariable Integer chatNum) {
        return messageChatnumService.getMessagesByChatNum(chatNum);
    }

    @GetMapping("/download")
    public byte[] downloadFile(@RequestParam String fileKey) {
        return messageChatnumService.downloadFile(fileKey);
    }

    @DeleteMapping("/delete/{messageId}")
    public void deleteMessage(@PathVariable String messageId, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        log.info("Received request to delete message with ID: {} by user: {}", messageId, username);
        messageChatnumService.deleteMessageByIdAndUsername(messageId, username);
    }
}
