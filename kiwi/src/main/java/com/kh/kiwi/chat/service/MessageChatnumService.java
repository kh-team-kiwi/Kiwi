package com.kh.kiwi.chat.service;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.repository.MessageChatnumRepository;
import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.service.FileDriveFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Autowired
    private FileDriveFileService fileDriveFileService;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public void saveMessage(ChatMessage message) {
        MessageChatnum messageChatnum = new MessageChatnum();
        messageChatnum.setMessageNum(message.getChatNum() + "-" + System.currentTimeMillis());
        Chat chat = chatService.getChatById(message.getChatNum());
        messageChatnum.setChat(chat);

        Member member = memberRepository.findById(message.getSender())
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID: " + message.getSender()));
        messageChatnum.setMember(member);

        messageChatnum.setChatTime(LocalDateTime.now());
        messageChatnum.setChatContent(message.getContent());

        if (message.getFiles() != null && !message.getFiles().isEmpty()) {
            messageChatnum.setChatContent(message.getContent() + "\n" + String.join("\n", message.getFiles()));
        }

        messageChatnumRepository.save(messageChatnum);
    }

    public List<String> uploadFiles(MultipartFile[] files, String team, String chatName) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            FileDriveFileDTO uploadedFile = fileDriveFileService.uploadFile(team, file, chatName);
            fileUrls.add(uploadedFile.getFilePath());
        }
        return fileUrls;
    }

    public List<MessageChatnum> getMessagesByChatNum(Integer chatNum) {
        return messageChatnumRepository.findByChat_ChatNum(chatNum);
    }

    public byte[] downloadFile(String fileKey) {
        return fileDriveFileService.downloadFile(fileKey, bucketName);
    }

    public String getNicknameByEmail(String email) {
        Member member = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member email: " + email));
        return member.getMemberNickname();
    }
}
