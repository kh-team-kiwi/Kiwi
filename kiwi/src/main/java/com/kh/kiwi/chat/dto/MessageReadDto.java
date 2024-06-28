package com.kh.kiwi.chat.dto;

public class MessageReadDto {
    private String messageNum;
    private String memberId;
    private int chatNum;

    // Getters and Setters
    public String getMessageNum() {
        return messageNum;
    }

    public void setMessageNum(String messageNum) {
        this.messageNum = messageNum;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public int getChatNum() {
        return chatNum;
    }

    public void setChatNum(int chatNum) {
        this.chatNum = chatNum;
    }
}
