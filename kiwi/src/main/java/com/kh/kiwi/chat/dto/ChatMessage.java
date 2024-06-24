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
    private List<String> files;
    private String chatContent;
    private String memberNickname; // 추가된 필드

}
