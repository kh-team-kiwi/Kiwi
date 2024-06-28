package com.kh.kiwi.chat.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class MessageReadId implements Serializable {
    private String messageNum;
    private String memberId;

    public MessageReadId() {}

    public MessageReadId(String messageNum, String memberId) {
        this.messageNum = messageNum;
        this.memberId = memberId;
    }

    // equals()와 hashCode()를 오버라이드 해야 함
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageReadId that = (MessageReadId) o;
        return Objects.equals(messageNum, that.messageNum) &&
                Objects.equals(memberId, that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageNum, memberId);
    }

    // getters and setters
}
