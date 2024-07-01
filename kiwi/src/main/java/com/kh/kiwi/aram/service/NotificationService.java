package com.kh.kiwi.aram.service;

import com.kh.kiwi.aram.repository.AramRepository;
import com.kh.kiwi.aram.repository.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class NotificationService{

    private final AramRepository aramRepository;
    private final EmitterRepository emitterRepository;

    private static final Long DEFAULT_TIMEOUT = 600L * 1000 * 60;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public SseEmitter subscribe(String memberId){
        SseEmitter emitter = createEmitter(memberId);
        sendToClient(memberId, "EventStream Created. [memberId=" + memberId + "]", "sse 접속 성공");

//        // 주기적으로 빈 이벤트 또는 주석 보내기
//        scheduler.scheduleAtFixedRate(() -> {
//            try {
//                System.out.println("보내기!!!");
//                emitter.send(SseEmitter.event().comment("heartbeat"));
//                sendToClient(memberId, "EventStream Created. [memberId=" + memberId + "]", "sse 접속 성공");
//            } catch (IOException e) {
//                emitter.completeWithError(e);
//            }
//        }, 10, 3, TimeUnit.SECONDS); // 30초마다 전송

        return emitter;
    }

    // 사용자 정의 알림을 보내는 메소드
    public <T> void customNotify(String memberId, T data, String comment, String type) {
        System.out.println("customNotify "+memberId+"/"+data+"/"+comment+"/"+type);
        sendToClient(memberId, data, comment, type);  // 클라이언트에게 알림 전송
    }

    // 기본 알림을 보내는 메소드
    public void notify(String memberId, Object data, String comment) {
        sendToClient(memberId, data, comment);  // 클라이언트에게 알림 전송
    }

    // 클라이언트에게 알림을 전송하는 메소드
    private void sendToClient(String memberId, Object data, String comment) {
        SseEmitter emitter = emitterRepository.get(memberId);  // 저장소에서 Emitter 가져오기
        if (emitter != null) {
            try {
                // Emitter를 통해 알림 전송
                emitter.send(SseEmitter.event()
                        .id(memberId)  // 이벤트 ID 설정
                        .name("sse")  // 이벤트 이름 설정
                        .data(data)  // 데이터 설정
                        .comment(comment));  // 주석 설정
                System.out.println("sendToClient "+memberId+"/"+data+"/"+comment);
            } catch (IOException e) {
                System.out.println("Error sending event: " +e.getMessage());
                // 전송 중 오류 발생 시 처리
                emitterRepository.deleteById(memberId);  // 저장소에서 Emitter 삭제
                emitter.completeWithError(e);  // Emitter를 오류 상태로 완료
            }
        } else {
            System.out.println("Emitter not found for memberId: " + memberId);
        }
    }

    // 클라이언트에게 사용자 정의 타입의 알림을 전송하는 메소드
    private <T> void sendToClient(String memberId, T data, String comment, String type) {
        SseEmitter emitter = emitterRepository.get(memberId);  // 저장소에서 Emitter 가져오기
        if (emitter != null) {
            try {
                // Emitter를 통해 알림 전송
                emitter.send(SseEmitter.event()
                        .id(memberId)  // 이벤트 ID 설정
                        .name(type)  // 이벤트 이름 설정 (사용자 정의 타입)
                        .data(data)  // 데이터 설정
                        .comment(comment));  // 주석 설정
            } catch (IOException e) {
                System.out.println("Error sending event: " +e.getMessage());
                // 전송 중 오류 발생 시 처리
                emitterRepository.deleteById(memberId);  // 저장소에서 Emitter 삭제
                emitter.completeWithError(e);  // Emitter를 오류 상태로 완료
            }
        } else {
            System.out.println("Emitter not found for memberId: " + memberId);
        }
    }

    // 새로운 SseEmitter 생성 메소드
    private SseEmitter createEmitter(String memberId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);  // 새로운 SseEmitter 생성 및 타임아웃 설정
        emitterRepository.save(memberId, emitter);  // 저장소에 Emitter 저장

        // Emitter가 완료되거나 타임아웃될 때 저장소에서 Emitter 삭제
        emitter.onCompletion(() -> emitterRepository.deleteById(memberId));
        emitter.onTimeout(() -> emitterRepository.deleteById(memberId));

        return emitter;
    }

    // 유효한 사용자 확인 메소드
//    private User validUser(Long userId) {
//        // 사용자 저장소에서 사용자 찾기, 없으면 예외 발생
//        return userRepository.findById(userId).orElseThrow(() -> new CustomException(UserErrorCode.NOT_FOUND_USER));
//    }
}
