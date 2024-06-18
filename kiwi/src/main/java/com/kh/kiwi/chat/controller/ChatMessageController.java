package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.service.MessageChatnumService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ChatMessageController {

    private final MessageChatnumService messageChatnumService;

    public ChatMessageController(MessageChatnumService messageChatnumService) {
        this.messageChatnumService = messageChatnumService;
    }

    @MessageMapping("/chat.sendMessage/{chatNum}")
    @SendTo("/topic/chat/{chatNum}")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        // 메시지를 데이터베이스에 저장
        messageChatnumService.saveMessage(chatMessage, null);
        return chatMessage;
    }

    @GetMapping("/api/chat/messages")
    public List<ChatMessage> getMessages(@RequestParam("chatNum") Integer chatNum) {
        List<MessageChatnum> messages = messageChatnumService.getMessagesByChatNum(chatNum);
        return messages.stream().map(this::convertToChatMessage).collect(Collectors.toList());
    }

    private ChatMessage convertToChatMessage(MessageChatnum messageChatnum) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(messageChatnum.getMember().getMemberId());
        chatMessage.setContent(messageChatnum.getChatContent());
        chatMessage.setChatNum(messageChatnum.getChat().getChatNum());
        chatMessage.setChatTime(messageChatnum.getChatTime());
        return chatMessage;
    }
}
