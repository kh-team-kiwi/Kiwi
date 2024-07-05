package com.kh.kiwi.chat.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatMessage {

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    private MessageType type;
    private String content;
    private String sender; // 작성자 아이디
    private Integer chatNum; // 채팅방 번호
    private LocalDateTime chatTime;
    private List<FileInfo> files;
    private String chatContent;
    private String memberNickname; // 추가된 필드
    private String messageNum; // 메시지 번호
    private String replyToMessageNum; // 댓글 대상 메시지 번호 추가
    private ReplyTo replyTo; // 댓글 대상 메시지 정보 추가
    private String memberFilepath;

    @Data
    public static class FileInfo {
        private String originalFileName;
        private String fileCode; // UUID로 변형된 파일 이름
        private String filePath;

        public FileInfo(String originalFileName, String fileCode, String filePath) {
            this.originalFileName = originalFileName;
            this.fileCode = fileCode;
            this.filePath = filePath;
        }
    }

    @Data
    public static class ReplyTo {
        private String memberNickname;
        private String chatContent;
        private LocalDateTime chatTime;

        public ReplyTo(String memberNickname, String chatContent, LocalDateTime chatTime) {
            this.memberNickname = memberNickname;
            this.chatContent = chatContent;
            this.chatTime = chatTime;
        }
    }

    // replyTo 설정 메서드 추가
    public void setReplyTo(String memberNickname, String chatContent, LocalDateTime chatTime) {
        this.replyTo = new ReplyTo(memberNickname, chatContent, chatTime);
    }
}
