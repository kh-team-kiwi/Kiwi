package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private S3Client s3Client;

    private final String bucketName = "YOUR_BUCKET_NAME";

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

    public String uploadFile(MultipartFile file, String team, String chatName) throws IOException {
        String fileCode = UUID.randomUUID().toString();
        String uniqueFileName = "chat/" + team + "/" + chatName + "/" + fileCode + "-" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .build();

        s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return uniqueFileName;
    }

    public byte[] downloadFile(String fileKey) {
        return s3Client.getObjectAsBytes(builder -> builder.bucket(bucketName).key(fileKey)).asByteArray();
    }
}
