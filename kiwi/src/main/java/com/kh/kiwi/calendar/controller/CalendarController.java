package com.kh.kiwi.calendar.controller;

import com.kh.kiwi.calendar.dto.CalendarRequestDto;
import com.kh.kiwi.calendar.dto.ResponseDto;
import com.kh.kiwi.calendar.entity.Schedule;
import com.kh.kiwi.calendar.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/team")
public class CalendarController {
    /*
    int SC_OK = 200;
    int SC_CREATED = 201;
    int SC_ACCEPTED = 202;
    int SC_NON_AUTHORITATIVE_INFORMATION = 203;
    int SC_NO_CONTENT = 204;
    int SC_RESET_CONTENT = 205;
    int SC_BAD_REQUEST = 400;
    int SC_UNAUTHORIZED = 401;
    int SC_PAYMENT_REQUIRED = 402;
    int SC_FORBIDDEN = 403;
    int SC_NOT_FOUND = 404;
    int SC_METHOD_NOT_ALLOWED = 405;
    int SC_NOT_ACCEPTABLE = 406;
    int SC_PROXY_AUTHENTICATION_REQUIRED = 407;
    int SC_REQUEST_TIMEOUT = 408;
    * */

    private final CalendarService calendarService;

    @PostMapping("/{team}/calendar/list/{memberId}")
    public ResponseEntity<ResponseDto<Map<String, Object>>> getSchedules(@PathVariable  String team, @PathVariable String memberId){
        ResponseDto<Map<String, Object>> result = calendarService.getSchedules(memberId,team);
        if(!result.isResult())
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{team}/calendar/create/{memberId}")
    public ResponseEntity<?> addSchedule(@PathVariable  String team, @PathVariable String memberId, @RequestBody CalendarRequestDto dto){
        dto.setMemberId(memberId);
        dto.setTeam(team);
        ResponseDto<Schedule> result = calendarService.addSchedule(dto);
        if(!result.isResult())
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{team}/calendar/delete/{scheduleNo}")
    public ResponseEntity<?> deleteSchedule(@PathVariable String scheduleNo){
        ResponseDto<?> result = calendarService.deleteSchedule(scheduleNo);
        if(!result.isResult())
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{team}/calendar/update")
    public ResponseEntity<?> updateSchedule(@RequestBody Schedule dto){
        ResponseDto<?> result = calendarService.updateSchedule(dto);
        if(!result.isResult())
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);

        return ResponseEntity.ok(result);
    }

}
