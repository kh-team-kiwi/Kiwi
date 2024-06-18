package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<MessageChatnum> getAllMessages() {
        return messageService.getAllMessages();
    }

    @PostMapping
    public MessageChatnum createMessage(@RequestBody MessageChatnum message) {
        return messageService.createMessage(message);
    }
}
