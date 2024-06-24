package com.kh.kiwi.chat.dto;

import com.kh.kiwi.chat.entity.FileMessage;
import com.kh.kiwi.chat.entity.MessageChatnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MessageChatnumDto {
    private String messageNum;
    private Integer chatNum;
    private String memberId;
    private LocalDateTime chatTime;
    private String chatContent;
    private List<FileMessage> fileMessages;

    public MessageChatnumDto(MessageChatnum messageChatnum, List<FileMessage> fileMessages) {
        this.messageNum = messageChatnum.getMessageNum();
        this.chatNum = messageChatnum.getChat().getChatNum();
        this.memberId = messageChatnum.getMember().getMemberId();
        this.chatTime = messageChatnum.getChatTime();
        this.chatContent = messageChatnum.getChatContent();
        this.fileMessages = fileMessages;
    }
}
