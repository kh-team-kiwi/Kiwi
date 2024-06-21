package com.kh.kiwi.calendar.repository;

import com.kh.kiwi.calendar.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarRepository extends JpaRepository<Schedule, String> {
}
