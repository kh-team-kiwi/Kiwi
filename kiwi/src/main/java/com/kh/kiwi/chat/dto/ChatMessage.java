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
    private String sender; // Member ID
    private Integer chatNum;
    private LocalDateTime chatTime;
    private List<FileInfo> files;
    private String chatContent;
    private String memberNickname; // 추가된 필드

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
