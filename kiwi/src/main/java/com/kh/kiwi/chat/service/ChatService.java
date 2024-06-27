package com.kh.kiwi.chat.service;

import com.kh.kiwi.chat.dto.CreateChatRequest;
import com.kh.kiwi.chat.entity.Chat;
import com.kh.kiwi.chat.entity.ChatUsers;
import com.kh.kiwi.chat.entity.ChatUsers.ChatUsersId;
import com.kh.kiwi.chat.repository.ChatRepository;
import com.kh.kiwi.chat.repository.ChatUsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private ChatUsersRepository chatUsersRepository;
    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    public List<Chat> getChatsByTeam(String team) {
        return chatRepository.findByTeam(team);
    }

    public List<Chat> getChatsByTeamAndMember(String team, String memberId) {
        log.info("Fetching chat rooms for team: {} and member: {}", team, memberId);
        List<ChatUsers> chatUsersList = chatUsersRepository.findByMemberId(memberId);
        List<Integer> chatNums = chatUsersList.stream()
                .map(chatUser -> chatUser.getId().getChatNum())
                .collect(Collectors.toList());
        log.info("Chat rooms the user belongs to: {}", chatNums);
        return chatRepository.findByTeamAndChatNumIn(team, chatNums);
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

        // S3에 폴더 생성
        createS3Folder(request.getTeam(), createdChat.getChatNum());

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

    private void createS3Folder(String team, Integer chatNum) {
        String folderName = team + "/chat/" + chatNum + "/";
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(folderName)
                .build();
        s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromBytes(new byte[0]));
    }

    public Chat getChatById(Integer chatNum) {
        return chatRepository.findById(chatNum).orElse(null);
    }

    public void deleteChatById(Integer chatNum) {
        chatRepository.deleteById(chatNum);
    }

    public String uploadFile(MultipartFile file, String team, Integer chatNum) throws IOException {
        String fileCode = UUID.randomUUID().toString();
        String uniqueFileName = team + "/chat/" + chatNum + "/" + fileCode;

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
