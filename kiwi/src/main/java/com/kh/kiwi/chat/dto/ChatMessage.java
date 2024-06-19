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

    // Getters and setters
    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public Integer getChatNum() {
        return chatNum;
    }

    public void setChatNum(Integer chatNum) {
        this.chatNum = chatNum;
    }

    public LocalDateTime getChatTime() {
        return chatTime;
    }

    public void setChatTime(LocalDateTime chatTime) {
        this.chatTime = chatTime;
    }

    public List<String> getFiles() {
        return files;
    }

    public void setFiles(List<String> files) {
        this.files = files;
    }
}
