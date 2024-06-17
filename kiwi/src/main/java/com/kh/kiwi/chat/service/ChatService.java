package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    public List<Chat> getChatsByTeam(String team) {
        return chatRepository.findByTeam(team);
    }

    public Chat createChat(Chat chat) {
        return chatRepository.save(chat);
    }

    public Chat getChatById(Integer chatNum) {
        return chatRepository.findById(chatNum).orElse(null);
    }

    public void deleteChatById(Integer chatNum) {
        chatRepository.deleteById(chatNum);
    }
}
