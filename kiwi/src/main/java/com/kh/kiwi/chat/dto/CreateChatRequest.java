package com.kh.kiwi.chat.dto;

import java.util.List;

public class CreateChatRequest {
    private String chatName;
    private String chatAdminMemberId;
    private String team;
    private boolean chatOpen;
    private List<String> admins;
    private List<String> participants;

    // Getters and Setters
    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public String getChatAdminMemberId() {
        return chatAdminMemberId;
    }

    public void setChatAdminMemberId(String chatAdminMemberId) {
        this.chatAdminMemberId = chatAdminMemberId;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public boolean isChatOpen() {
        return chatOpen;
    }

    public void setChatOpen(boolean chatOpen) {
        this.chatOpen = chatOpen;
    }

    public List<String> getAdmins() {
        return admins;
    }

    public void setAdmins(List<String> admins) {
        this.admins = admins;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
}
