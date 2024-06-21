package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.dto.CreateChatRequest;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import com.kh.kiwi.chat.repository.ChatRepository;
import com.kh.kiwi.chat.repository.ChatUsersRepository;
import com.kh.kiwi.s3drive.dto.FileDriveDTO;
import com.kh.kiwi.s3drive.service.FileDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private ChatUsersRepository chatUsersRepository;
    @Autowired
    private S3Client s3Client;
    @Autowired
    private FileDriveService fileDriveService;

    private final String bucketName = "YOUR_BUCKET_NAME";

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    public List<Chat> getChatsByTeam(String team) {
        return chatRepository.findByTeam(team);
    }

    public Chat createChatWithUsers(CreateChatRequest request) {
        if (request.getAdmins() == null || request.getAdmins().isEmpty()) {
            throw new IllegalArgumentException("No admins provided");
        }

        Chat chat = new Chat();
        chat.setChatName(request.getChatName());
        chat.setChatAdminMemberId(request.getAdmins().get(0));
        chat.setTeam(request.getTeam());
        chat.setChatOpen(request.isChatOpen());
        Chat createdChat = chatRepository.save(chat);

        // 드라이브 생성
        FileDriveDTO fileDriveDTO = new FileDriveDTO();
        fileDriveDTO.setDriveName(request.getChatName());
        fileDriveDTO.setTeam(request.getTeam());
        fileDriveService.createDrive(fileDriveDTO);

        // Add admins and participants to the chat
        request.getAdmins().forEach(admin -> {
            ChatUsers chatUser = new ChatUsers();
            ChatUsersId id = new ChatUsersId();
            id.setChatNum(createdChat.getChatNum());
            id.setMemberId(admin);
            chatUser.setId(id);
            chatUser.setChatAdmin(1); // 1 for admin
            chatUser.setChatTime(LocalDateTime.now()); // Set chatTime to current time
            chatUsersRepository.save(chatUser);
        });

        request.getParticipants().forEach(participant -> {
            ChatUsers chatUser = new ChatUsers();
            ChatUsersId id = new ChatUsersId();
            id.setChatNum(createdChat.getChatNum());
            id.setMemberId(participant);
            chatUser.setId(id);
            chatUser.setChatAdmin(0); // 0 for normal participant
            chatUser.setChatTime(LocalDateTime.now()); // Set chatTime to current time
            chatUsersRepository.save(chatUser);
        });

        return createdChat;
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
