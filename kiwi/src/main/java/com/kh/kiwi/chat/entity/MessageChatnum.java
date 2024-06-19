package com.kh.kiwi.chat.entity;

import com.kh.kiwi.auth.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "message_chatnum")
public class MessageChatnum {
    @Id
    @Column(name = "MESSAGE_NUM", length = 30)
    private String messageNum;

    @ManyToOne
    @JoinColumn(name = "CHAT_NUM", referencedColumnName = "CHAT_NUM", nullable = false)
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID", referencedColumnName = "memberId", nullable = false) // Ensure 'memberId' is correct
    private Member member;

    @Column(name = "CHAT_TIME", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP", nullable = false)
    private LocalDateTime chatTime;

    @Column(name = "CHAT_CONTENT", length = 5000)
    private String chatContent;

    @Column(name = "READ_COUNT")
    private Integer readCount;

    @Column(name = "CHAT_REF", nullable = false, columnDefinition = "BOOLEAN DEFAULT 0")
    private Boolean chatRef = false; // 기본값을 false로 설정

    @Column(name = "CHAT_REF_MESSAGE_NUM", length = 30)
    private String chatRefMessageNum;
}
