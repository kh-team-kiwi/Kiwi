package com.kh.kiwi.calendar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="schedule_list")
public class Schedule {
    @Id
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
}
