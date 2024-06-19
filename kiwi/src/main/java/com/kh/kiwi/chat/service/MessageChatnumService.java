package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.repository.MessageChatnumRepository;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessageChatnumService {

    @Autowired
    private MessageChatnumRepository messageChatnumRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ChatService chatService;

    public void saveMessage(ChatMessage message) {
        MessageChatnum messageChatnum = new MessageChatnum();
        messageChatnum.setMessageNum(message.getChatNum() + "-" + System.currentTimeMillis());
        Chat chat = chatService.getChatById(message.getChatNum());
        messageChatnum.setChat(chat);

        // Fetch the member entity using the sender ID
        Member member = memberRepository.findById(message.getSender())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID: " + message.getSender()));
        messageChatnum.setMember(member);

        messageChatnum.setChatTime(LocalDateTime.now());
        messageChatnum.setChatContent(message.getContent());

        messageChatnum.setChatRef(false); // 기본값으로 false 설정
        messageChatnum.setChatRefMessageNum(null); // 기본값 설정

        if (message.getFiles() != null && !message.getFiles().isEmpty()) {
            messageChatnum.setChatContent(messageChatnum.getChatContent() + "\n" + String.join("\n", message.getFiles()));
        }

        messageChatnumRepository.save(messageChatnum);
    }

    public List<String> uploadFiles(MultipartFile[] files, String team, String chatName) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileUrl = chatService.uploadFile(file, team, chatName);
            fileUrls.add(fileUrl);
        }
        return fileUrls;
    }

    public List<MessageChatnum> getMessagesByChatNum(Integer chatNum) {
        return messageChatnumRepository.findByChat_ChatNum(chatNum);
    }

    public byte[] downloadFile(String fileKey) {
        // 다운로드 로직 구현
        return new byte[0];
    }

    public List<MessageChatnum> getAllMessages() {
        return messageChatnumRepository.findAll();
    }

    public MessageChatnum createMessage(MessageChatnum message) {
        return messageChatnumRepository.save(message);
    }
}
