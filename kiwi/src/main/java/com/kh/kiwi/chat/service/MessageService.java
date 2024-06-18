package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.repository.MessageChatnumRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageChatnumRepository messageChatnumRepository;

    public MessageService(MessageChatnumRepository messageChatnumRepository) {
        this.messageChatnumRepository = messageChatnumRepository;
    }

    public List<MessageChatnum> getAllMessages() {
        return messageChatnumRepository.findAll();
    }

    public MessageChatnum createMessage(MessageChatnum message) {
        return messageChatnumRepository.save(message);
    }
}
