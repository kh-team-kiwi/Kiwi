package com.kh.kiwi.calendar.service;

import com.kh.kiwi.calendar.dto.CalendarRequestDto;
import com.kh.kiwi.calendar.dto.ResponseDto;
import com.kh.kiwi.calendar.entity.Schedule;
import com.kh.kiwi.calendar.repository.CalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final CalendarRepository calendarRepository;

    // 첫 로딩시 로드 스케쥴
    public ResponseDto<Map<String, Object>> getSchedules(String memberId, String team) {
        Map<String, Object> result = null;

        try{
            List<Schedule> personalSchedules = calendarRepository.findByTeamAndMemberIdAndCalendar(team,memberId,"personal");
            List<Schedule> teamSchedules = calendarRepository.findByTeamAndCalendar(team,"team");
            result = new HashMap<>();
            result.put("personal", personalSchedules);
            result.put("team", teamSchedules);
        }  catch (Exception e) {
            System.out.println("CalendarService >> getSchedules : db오류");
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류가 발생하여 데이터를 정삭적으로 불러올 수 없습니다.");
        }

        return ResponseDto.setSuccessData("",result);
    }

    // 스캐쥴 생성
    public ResponseDto<Schedule> addSchedule(CalendarRequestDto dto) {
        try {
            Schedule savedSchedule = null;
            savedSchedule = calendarRepository.save(new Schedule(dto));
            if(savedSchedule != null)
                return ResponseDto.setSuccessData("스케쥴이 저장되었습니다.",savedSchedule);
            else
                return ResponseDto.setFailed("저장에 실패했습니다.");
        } catch (Exception e) {
            System.out.println("CalendarService >> addSchedule : db오류");
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류가 발생하여 데이터를 정삭적으로 불러올 수 없습니다.");
        }
    }

    // 스케쥴 삭제
    public ResponseDto<?> deleteSchedule(String scheduleNo) {
        try {
            if(calendarRepository.existsById(scheduleNo)){
                calendarRepository.deleteById(scheduleNo);
                if(!calendarRepository.existsById(scheduleNo))
                    return ResponseDto.setSuccess("스케쥴이 삭제되었습니다.");
                else
                    return ResponseDto.setFailed("데이터베이스에 일치하는 스케쥴이 없어 삭제에 실패했습니다.");
            } else {
                System.out.println("CalendarService >> deleteSchedule : DB에 일치하는 스케쥴ID가 없습니다.");
                return ResponseDto.setFailed("DB에 일치하는 스케쥴ID가 없습니다.");
            }
        } catch (Exception e) {
            System.out.println("CalendarService >> deleteSchedule : db오류");
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류가 발생하여 데이터를 정삭적으로 불러올 수 없습니다.");
        }
    }

    // 스케쥴 수정
    public ResponseDto<?> updateSchedule(CalendarRequestDto dto) {
        try{
            if(calendarRepository.existsById(dto.getScheduleNo())){
                Schedule newS = new Schedule(dto);
                calendarRepository.save(newS);
                return ResponseDto.setSuccess("스케쥴이 수정되었습니다.");
            }
        } catch (Exception e) {
            System.out.println("CalendarService >> updateSchedule : db오류");
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류가 발생하여 데이터를 정삭적으로 불러올 수 없습니다.");
        }

        System.out.println("CalendarService >> updateSchedule : DB에 일치하는 스케쥴ID가 없습니다.");
        return ResponseDto.setFailed("데이터베이스에 일치하는 스케쥴이 없어 수정에 실패했습니다.");
    }
}
