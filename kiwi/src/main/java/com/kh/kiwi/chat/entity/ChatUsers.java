package com.kh.kiwi.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_users")
@Getter
@Setter
public class ChatUsers {

    @EmbeddedId
    private ChatUsersId id;

    @Column(name = "chat_time", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime chatTime;

    @Column(name = "chat_admin", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int chatAdmin;

    public ChatUsers() {
    }

    public ChatUsers(int chatNum, String memberId) {
        this.id = new ChatUsersId(chatNum, memberId);
        this.chatTime = LocalDateTime.now();
        this.chatAdmin = 0; // Default value
    }

    @Embeddable
    public static class ChatUsersId {
        @Column(name = "chat_num", nullable = false)
        private int chatNum;

        @Column(name = "member_id", nullable = false, length = 320)
        private String memberId;

        public ChatUsersId() {
        }

        public ChatUsersId(int chatNum, String memberId) {
            this.chatNum = chatNum;
            this.memberId = memberId;
        }

        // Getters and Setters
        public int getChatNum() {
            return chatNum;
        }

        public void setChatNum(int chatNum) {
            this.chatNum = chatNum;
        }

        public String getMemberId() {
            return memberId;
        }

        public void setMemberId(String memberId) {
            this.memberId = memberId;
        }

        // hashCode and equals methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            ChatUsersId that = (ChatUsersId) o;

            if (chatNum != that.chatNum) return false;
            return memberId != null ? memberId.equals(that.memberId) : that.memberId == null;
        }

        @Override
        public int hashCode() {
            int result = chatNum;
            result = 31 * result + (memberId != null ? memberId.hashCode() : 0);
            return result;
        }
    }

    // Getters and Setters
    public ChatUsersId getId() {
        return id;
    }

    public void setId(ChatUsersId id) {
        this.id = id;
    }

    public LocalDateTime getChatTime() {
        return chatTime;
    }

    public void setChatTime(LocalDateTime chatTime) {
        this.chatTime = chatTime;
    }

    public int getChatAdmin() {
        return chatAdmin;
    }

    public void setChatAdmin(int chatAdmin) {
        this.chatAdmin = chatAdmin;
    }
}
