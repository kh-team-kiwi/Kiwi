package com.kh.kiwi.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "message_read")
public class MessageRead {
    @EmbeddedId
    private com.kh.kiwi.chat.entity.MessageReadId id;

    @Column(name = "READ_TIME", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime readTime;

    // constructors, getters, and setters
}
