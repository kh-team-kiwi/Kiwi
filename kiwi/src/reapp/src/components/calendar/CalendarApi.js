import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import SchedulePopup from '../calendar/SchedulePopup';
import EventPopup from './EventPopup';
import { useTranslation } from 'react-i18next';
import '../../styles/components/calendar/CalendarApi.css';
import 'react-calendar/dist/Calendar.css';
import axiosHandler from "../../jwt/axiosHandler";
import { useLocation } from "react-router-dom";
import { getSessionItem } from "../../jwt/storage";

const CalendarApi = ({ events, addEvent, calendars, setSelectedCalendar, selectedCalendar }) => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventPositions, setEventPositions] = useState(new Map());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const normalizeDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleCalendarChange = (e) => {
    setSelectedCalendar(e.target.value);
    console.log('Selected calendar:', e.target.value);
  };



  useEffect(() => {
    const calculateEventPositions = () => {
      const dateSlotMap = {};
      const newEventPositions = new Map();

      events.forEach((event) => {
        const eventStartDate = normalizeDate(new Date(event.startDate));
        const eventEndDate = normalizeDate(new Date(event.endDate));
        let position = 0;

        for (let date = new Date(eventStartDate); date <= eventEndDate; date.setDate(date.getDate() + 1)) {
          const dateKey = date.toDateString();
          if (!dateSlotMap[dateKey]) {
            dateSlotMap[dateKey] = [];
          }

          while (dateSlotMap[dateKey][position]) {
            position++;
          }

          dateSlotMap[dateKey][position] = true;
        }

        newEventPositions.set(event, position);
      });

      setEventPositions(newEventPositions);
    };

    calculateEventPositions();
  }, [events, currentMonth]);

  const handleTileClick = (event, position) => {
    setSelectedEvent(event);
    setClickPosition(position);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const normalizedDate = normalizeDate(date);

      const eventsForDate = events.filter((event) => {
        const eventStartDate = normalizeDate(new Date(event.startDate));
        const eventEndDate = normalizeDate(new Date(event.endDate));

        return normalizedDate >= eventStartDate && normalizedDate <= eventEndDate;
      });

      return (
        <div style={{ position: 'relative' }}>
          {eventsForDate.map((event, index) => {
            const position = eventPositions.get(event);
            const eventStartDate = normalizeDate(new Date(event.startDate));

            const isFirstTile = normalizedDate.getTime() === eventStartDate.getTime();

            return (
              <div
                key={index}
                style={{
                  backgroundColor: event.color,
                  top: `${position * 25}px`,
                  position: 'absolute',
                  width: '400px',
                  height: '20px',
                  cursor: 'pointer'
                }}
                className="event-indicator"
                onClick={(e) => handleTileClick(event, { top: e.clientY, left: e.clientX })}
              >
                {isFirstTile && event.title}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const formatShortWeekday = (locale, date) => {
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' }).toLowerCase();
    return t(weekday);
  };

  const closePopup = () => {
    setSelectedEvent(null);
  };

  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <SchedulePopup addEvent={addEvent} onClose={closePopup} calendars={calendars} />

        <div className="slide-controls">
          <div className="radio-wrapper">
            <input 
              type="radio" 
              name="slide" 
              id="personal" 
              value="personal" 
              checked={selectedCalendar === 'personal'} 
              onChange={handleCalendarChange} 
            />
            <input 
              type="radio" 
              name="slide" 
              id="team" 
              value="team" 
              checked={selectedCalendar === 'team'} 
              onChange={handleCalendarChange} 
            />
            <label htmlFor="personal" className="slide">{t('personal')}</label>
            <label htmlFor="team" className="slide">{t('team')}</label>
            <div className="slider-tab"></div>
          </div>
        </div>

        <div className="date-container">
          {formatMonthYear(currentMonth)}
        </div>

        <div className="month-nav">
          <button className="month-left" onClick={() => handleMonthChange(-1)}>
            <svg className="icon-color" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.79021 0.180771C9.85671 0.237928 9.90947 0.305829 9.94547 0.380583C9.98147 0.455338 10 0.535478 10 0.616412C10 0.697347 9.98147 0.777487 9.94547 0.852242C9.90947 0.926996 9.85671 0.994897 9.79021 1.05205L1.72512 8.00016L9.79021 14.9483C9.9243 15.0638 9.99963 15.2205 9.99963 15.3839C9.99963 15.5473 9.9243 15.704 9.79021 15.8196C9.65612 15.9351 9.47425 16 9.28462 16C9.09499 16 8.91312 15.9351 8.77903 15.8196L0.209794 8.4358C0.143292 8.37865 0.0905301 8.31074 0.0545301 8.23599C0.0185301 8.16124 0 8.0811 0 8.00016C0 7.91923 0.0185301 7.83909 0.0545301 7.76433C0.0905301 7.68958 0.143292 7.62168 0.209794 7.56452L8.77903 0.180771C8.84537 0.123469 8.92417 0.0780065 9.01093 0.0469869C9.09768 0.0159672 9.19069 0 9.28462 0C9.37855 0 9.47156 0.0159672 9.55831 0.0469869C9.64507 0.0780065 9.72387 0.123469 9.79021 0.180771Z" />
            </svg>
          </button>
          <button className="month-right" onClick={() => handleMonthChange(1)}>
            <svg className="icon-color" width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.209794 0.180771C0.143292 0.237928 0.0905304 0.305829 0.0545301 0.380583C0.0185299 0.455338 0 0.535478 0 0.616412C0 0.697347 0.0185299 0.777487 0.0545301 0.852242C0.0905304 0.926996 0.143292 0.994897 0.209794 1.05205L8.27488 8.00016L0.209794 14.9483C0.0757046 15.0638 0.000374794 15.2205 0.000374794 15.3839C0.000374794 15.5473 0.0757046 15.704 0.209794 15.8196C0.343884 15.9351 0.525748 16 0.71538 16C0.905011 16 1.08688 15.9351 1.22097 15.8196L9.79021 8.4358C9.85671 8.37865 9.90947 8.31074 9.94547 8.23599C9.98147 8.16124 10 8.0811 10 8.00016C10 7.91923 9.98147 7.83909 9.94547 7.76433C9.90947 7.68958 9.85671 7.62168 9.79021 7.56452L1.22097 0.180771C1.15463 0.123469 1.07583 0.0780066 0.989072 0.0469869C0.902315 0.0159672 0.809309 0 0.71538 0C0.62145 0 0.528444 0.0159672 0.441688 0.0469869C0.354931 0.0780066 0.276128 0.123469 0.209794 0.180771Z"/>
            </svg>
          </button>
        </div>
      </div>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        activeStartDate={currentMonth}
        onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
        showNavigation={false} 
        formatShortWeekday={formatShortWeekday} 
      />
      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          position={clickPosition}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default CalendarApi;