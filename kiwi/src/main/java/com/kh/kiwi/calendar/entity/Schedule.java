package com.kh.kiwi.calendar.entity;

import com.kh.kiwi.calendar.dto.CalendarRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String scheduleNo;
    private String memberId;
    private String team;
    private String calendar;
    private String title;
    private String description;
    private String color;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public Schedule(CalendarRequestDto dto) {
        this.scheduleNo = dto.getScheduleNo();
        this.memberId = dto.getMemberId();
        this.team = dto.getTeam();
        this.calendar = dto.getCalendar();
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.color = dto.getColor();
        this.location = dto.getLocation();

        LocalDate date = LocalDate.parse(dto.getStartDate(), DateTimeFormatter.ISO_DATE);
        LocalTime time = LocalTime.parse(dto.getStartTime(), DateTimeFormatter.ofPattern("HH:mm"));
        this.startDate = LocalDateTime.of(date, time);
        date = LocalDate.parse(dto.getEndDate(), DateTimeFormatter.ISO_DATE);
        time = LocalTime.parse(dto.getEndTime(), DateTimeFormatter.ofPattern("HH:mm"));
        this.endDate = LocalDateTime.of(date, time);
    }
}
