package com.kh.kiwi.calendar.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalendarRequestDto {
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
