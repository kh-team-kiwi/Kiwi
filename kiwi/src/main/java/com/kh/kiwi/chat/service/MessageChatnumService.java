package com.kh.kiwi.chat.service;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.FileMessage;
import com.kh.kiwi.chat.entity.MessageChatnum;
import com.kh.kiwi.chat.repository.FileMessageRepository;
import com.kh.kiwi.chat.repository.MessageChatnumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MessageChatnumService {

    @Autowired
    private MessageChatnumRepository messageChatnumRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private S3Client s3Client;

    @Autowired
    private FileMessageRepository fileMessageRepository;

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

        messageChatnumRepository.save(messageChatnum);

        // Save file messages if there are files
        if (message.getFiles() != null && !message.getFiles().isEmpty()) {
            for (String filePath : message.getFiles()) {
                FileMessage fileMessage = new FileMessage();
                fileMessage.setFileCode(UUID.randomUUID().toString());
                fileMessage.setMessageNum(messageChatnum.getMessageNum());
                fileMessage.setFileName(filePath.substring(filePath.lastIndexOf("/") + 1));
                fileMessage.setFilePath(filePath);
                fileMessageRepository.save(fileMessage);
            }
        }
    }

    public List<String> uploadFiles(MultipartFile[] files, String team, String chatNum) throws IOException {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileUrl = uploadFileToS3(file, team, chatNum);
            fileUrls.add(fileUrl);
        }
        return fileUrls;
    }

    private String uploadFileToS3(MultipartFile file, String team, String chatNum) throws IOException {
        String fileCode = UUID.randomUUID().toString();
        String uniqueFileName = team + "/chat/" + chatNum + "/" + fileCode;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .build();

        s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return uniqueFileName;
    }

    public List<MessageChatnum> getMessagesByChatNum(Integer chatNum) {
        return messageChatnumRepository.findByChat_ChatNum(chatNum);
    }

    public byte[] downloadFile(String fileKey) {
        return s3Client.getObjectAsBytes(builder -> builder.bucket(bucketName).key(fileKey)).asByteArray();
    }

    public String getNicknameByEmail(String email) {
        Member member = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member email: " + email));
        return member.getMemberNickname();
    }
}
