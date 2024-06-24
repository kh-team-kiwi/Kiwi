package com.kh.kiwi.calendar.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class CalendarRequestDto {
    private String scheduleNo;
    private String memberId;
    private String team;
    private String title;
    private String description;
    private String calendar;
    private String location;
    private String startTime;
    private String startDate;
    private String endTime;
    private String endDate;
    private String color;
}
