package com.kh.kiwi.aram.controller;

import com.kh.kiwi.aram.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @GetMapping(value = "/api/notifications/subscribe/{memberId}", produces = "text/event-stream;charset=UTF-8")
    public SseEmitter subscribe(@PathVariable(value="memberId") String memberId){
        return notificationService.subscribe(memberId);
    }

    @GetMapping(value = "/test/{memberId}")
    public String subscribe2(@PathVariable(value="memberId") String memberId){
        scheduler.scheduleAtFixedRate(() -> {
            try {
                System.out.println("보내기!!!");
                notificationService.customNotify(memberId , "aaa", "bbb", "sse");
            } catch (Exception e) {
                System.out.println("보내기!!!");
                e.printStackTrace();
            }
        }, 3, 1, TimeUnit.SECONDS); // 30초마다 전송
        notificationService.customNotify(memberId , "aaa", "bbb", "sse");
        return null;
    }
}
