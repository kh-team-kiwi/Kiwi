package com.kh.kiwi.chat.service;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.repository.ChatRepository;
import com.kh.kiwi.chat.repository.MessageChatnumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class MessageChatnumService {
    private final MessageChatnumRepository messageChatnumRepository;
    private final ChatRepository chatRepository;
    private final MemberRepository memberRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public MessageChatnumService(MessageChatnumRepository messageChatnumRepository, ChatRepository chatRepository, MemberRepository memberRepository) {
        this.messageChatnumRepository = messageChatnumRepository;
        this.chatRepository = chatRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public MessageChatnum saveMessage(ChatMessage chatMessage, MultipartFile file) {
        MessageChatnum messageChatnum = new MessageChatnum();

        Chat chat = chatRepository.findById(chatMessage.getChatNum())
                .orElseThrow(() -> new IllegalArgumentException("Invalid chat number"));

        Member member = memberRepository.findById(chatMessage.getSender())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID"));

        LocalDateTime now = LocalDateTime.now();
        String dateTimePrefix = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));

        List<MessageChatnum> messagesInSameMinute = messageChatnumRepository.findByChatAndChatTimeBetween(
                chat,
                now.withSecond(0).withNano(0),
                now.withSecond(59).withNano(999999999)
        );

        int sequence = messagesInSameMinute.size() + 1;
        String messageNum = dateTimePrefix + String.format("%04d", sequence);

        messageChatnum.setMessageNum(messageNum);
        messageChatnum.setChat(chat);
        messageChatnum.setMember(member);
        messageChatnum.setChatTime(now);
        messageChatnum.setChatContent(chatMessage.getContent());
        messageChatnum.setReadCount(0);
        messageChatnum.setChatRef(false);
        messageChatnum.setChatRefMessageNum(null);

        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            try {
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                Files.write(filePath, file.getBytes());
                messageChatnum.setChatContent(messageChatnum.getChatContent() + " [File: " + fileName + "]");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return messageChatnumRepository.save(messageChatnum);
    }

    @Transactional(readOnly = true)
    public List<MessageChatnum> getMessagesByChatNum(Integer chatNum) {
        Chat chat = chatRepository.findById(chatNum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid chat number"));
        return messageChatnumRepository.findByChatOrderByChatTimeAsc(chat);
    }
}
