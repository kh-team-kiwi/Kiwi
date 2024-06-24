package com.kh.kiwi.calendar.repository;

import com.kh.kiwi.calendar.entity.Schedule;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CalendarRepository extends JpaRepository<Schedule, String> {
    List<Schedule> getScheduleByMemberId(String MemberId);

    @Query("SELECT s FROM Schedule s WHERE s.team = :team AND s.memberId = :memberId AND s.calendar = :calendar")
    List<Schedule> findByTeamAndMemberIdAndCalendar(@Param("team") String team, @Param("memberId") String memberId, @Param("calendar") String calendar);

    @Query("SELECT s FROM Schedule s WHERE s.team = :team AND s.calendar = :calendar")
    List<Schedule> findByTeamAndCalendar(@Param("team") String team, @Param("calendar") String calendar);

}
