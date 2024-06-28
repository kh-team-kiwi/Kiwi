package com.kh.kiwi.aram.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
@RequiredArgsConstructor
public class EmitterRepository {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(String memberId, SseEmitter emitter) {
        emitters.put(memberId, emitter);
    }

    public void deleteById(String memberId) {
        emitters.remove(memberId);
    }

    public SseEmitter get(String memberId) {
        return emitters.get(memberId);
    }
}
