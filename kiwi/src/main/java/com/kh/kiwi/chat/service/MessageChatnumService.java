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
import java.util.stream.Collectors;

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
        messageChatnum.setChatRef(message.getType() == ChatMessage.MessageType.COMMENT); // 댓글 여부 설정
        messageChatnum.setChatRefMessageNum(message.getChatRefMessageNum()); // 참조 메시지 번호 설정

        messageChatnumRepository.save(messageChatnum);

        // 파일 메시지가 있는 경우 저장
        if (message.getFiles() != null && !message.getFiles().isEmpty()) {
            for (ChatMessage.FileInfo fileInfo : message.getFiles()) {
                FileMessage fileMessage = new FileMessage();
                fileMessage.setFileCode(fileInfo.getFileCode()); // UUID로 변형된 파일 이름
                fileMessage.setMessageNum(messageChatnum.getMessageNum());
                fileMessage.setFileName(fileInfo.getOriginalFileName()); // 원래 파일 이름
                fileMessage.setFilePath(fileInfo.getFilePath());
                fileMessageRepository.save(fileMessage);
            }
        }
    }

    public List<ChatMessage> getMessagesByChatNum(Integer chatNum) {
        List<MessageChatnum> messages = messageChatnumRepository.findByChat_ChatNum(chatNum);
        return messages.stream().map(message -> {
            List<FileMessage> fileMessages = fileMessageRepository.findByMessageNum(message.getMessageNum());
            List<ChatMessage.FileInfo> fileInfos = fileMessages.stream().map(fileMessage ->
                    new ChatMessage.FileInfo(fileMessage.getFileName(), fileMessage.getFileCode(), fileMessage.getFilePath())
            ).collect(Collectors.toList());

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(message.getChatRef() ? ChatMessage.MessageType.COMMENT : ChatMessage.MessageType.CHAT);
            chatMessage.setSender(message.getMember().getMemberId());
            chatMessage.setChatNum(message.getChat().getChatNum());
            chatMessage.setChatTime(message.getChatTime());
            chatMessage.setFiles(fileInfos);
            chatMessage.setChatContent(message.getChatContent());
            chatMessage.setMemberNickname(message.getMember().getMemberNickname());
            chatMessage.setChatRef(message.getChatRef());
            chatMessage.setChatRefMessageNum(message.getChatRefMessageNum());

            if (message.getChatRefMessageNum() != null) {
                MessageChatnum originalMessage = messageChatnumRepository.findById(message.getChatRefMessageNum()).orElse(null);
                if (originalMessage != null) {
                    chatMessage.setReplyToMessageSender(originalMessage.getMember().getMemberNickname());
                    chatMessage.setReplyToMessageContent(originalMessage.getChatContent());
                }
            }
            return chatMessage;
        }).collect(Collectors.toList());
    }

    public ChatMessage getMessageByMessageNum(String messageNum) {
        MessageChatnum messageChatnum = messageChatnumRepository.findById(messageNum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid message ID: " + messageNum));
        List<FileMessage> fileMessages = fileMessageRepository.findByMessageNum(messageChatnum.getMessageNum());
        List<ChatMessage.FileInfo> fileInfos = fileMessages.stream().map(fileMessage ->
                new ChatMessage.FileInfo(fileMessage.getFileName(), fileMessage.getFileCode(), fileMessage.getFilePath())
        ).collect(Collectors.toList());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setType(messageChatnum.getChatRef() ? ChatMessage.MessageType.COMMENT : ChatMessage.MessageType.CHAT);
        chatMessage.setSender(messageChatnum.getMember().getMemberId());
        chatMessage.setChatNum(messageChatnum.getChat().getChatNum());
        chatMessage.setChatTime(messageChatnum.getChatTime());
        chatMessage.setFiles(fileInfos);
        chatMessage.setChatContent(messageChatnum.getChatContent());
        chatMessage.setMemberNickname(messageChatnum.getMember().getMemberNickname());
        chatMessage.setChatRef(messageChatnum.getChatRef());
        chatMessage.setChatRefMessageNum(messageChatnum.getChatRefMessageNum());

        if (messageChatnum.getChatRefMessageNum() != null) {
            MessageChatnum originalMessage = messageChatnumRepository.findById(messageChatnum.getChatRefMessageNum()).orElse(null);
            if (originalMessage != null) {
                chatMessage.setReplyToMessageSender(originalMessage.getMember().getMemberNickname());
                chatMessage.setReplyToMessageContent(originalMessage.getChatContent());
            }
        }
        return chatMessage;
    }

    public List<ChatMessage.FileInfo> uploadFiles(MultipartFile[] files, String team, String chatNum) throws IOException {
        List<ChatMessage.FileInfo> fileInfos = new ArrayList<>();
        for (MultipartFile file : files) {
            String originalFileName = file.getOriginalFilename();
            String fileCode = UUID.randomUUID().toString();
            String filePath = uploadFileToS3(file, team, chatNum, fileCode);
            fileInfos.add(new ChatMessage.FileInfo(originalFileName, fileCode, filePath));
        }
        return fileInfos;
    }

    private String uploadFileToS3(MultipartFile file, String team, String chatNum, String fileCode) throws IOException {
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

    public String getNicknameByEmail(String email) {
        Member member = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member email: " + email));
        return member.getMemberNickname();
    }

    public void deleteMessageByIdAndUsername(String messageNum, String username) {
        MessageChatnum messageChatnum = messageChatnumRepository.findById(messageNum)
                .orElseThrow(() -> new IllegalArgumentException("Invalid message ID: " + messageNum));
        if (!messageChatnum.getMember().getMemberId().equals(username)) {
            throw new IllegalArgumentException("User not authorized to delete this message");
        }
        messageChatnumRepository.delete(messageChatnum);
    }
}
