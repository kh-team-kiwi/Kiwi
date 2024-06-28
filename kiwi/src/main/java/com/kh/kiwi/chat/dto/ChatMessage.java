package com.kh.kiwi.chat.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatMessage {

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        COMMENT // 댓글 타입 추가
    }

    private MessageType type;
    private String content;
    private String sender; // Member ID
    private Integer chatNum;
    private LocalDateTime chatTime;
    private List<FileInfo> files;
    private String chatContent;
    private String memberNickname; // 추가된 필드
    private Boolean chatRef = false; // 댓글 여부
    private String chatRefMessageNum; // 참조 메시지 번호
    private String replyToMessageNum; // 참조 메시지 작성자
    private String replyToMessageSender; // 참조 메시지 작성자
    private String replyToMessageContent; // 참조 메시지 내용

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
}
