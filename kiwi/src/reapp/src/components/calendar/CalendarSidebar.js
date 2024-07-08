import React, { useState } from 'react';
import '../../styles/components/calendar/CalendarSidebar.css';
import { useTranslation } from 'react-i18next';

import TimeIcon from '../../images/svg/buttons/TimeIcon';
import EmptyCalendarIcon from '../../images/emptycalendar.png';

import FilterIcon from '../../images/svg/buttons/FilterIcon'
import SelectedIcon from '../../images/svg/buttons/SelectedIcon'

const CalendarSidebar = ({ events, selectedCalendar }) => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');

  const upcomingEvents = events
    .map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }))
    .filter(event => {
      const now = new Date();
      return event.startDate >= now;
    })
    .sort((a, b) => a.startDate - b.startDate);

  const finishedEvents = events
    .map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }))
    .filter(event => {
      const now = new Date();
      return event.endDate < now;
    })
    .sort((a, b) => b.startDate - a.startDate);

  const allEvents = events
    .map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }))
    .sort((a, b) => a.startDate - b.startDate);

  const getEventsToDisplay = () => {
    switch (filter) {
      case 'all':
        return allEvents;
      case 'finished':
        return finishedEvents;
      default:
        return upcomingEvents;
    }
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatDateWithSuffix = (date) => {
    const day = date.getDate();
    const monthKey = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const month = t(`months.${monthKey}`);
    const daySuffix = getDaySuffix(day);

    if (i18n.language === 'ko') {
      return `${month} ${day}일`;
    } else {
      return `${month} ${day}${daySuffix}`;
    }
  };

  const getTimeDifference = (startDate) => {
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const diffMs = eventDate - currentDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let dayLabel;
    if (diffDays === 0) {
      dayLabel = t('today');
    } else if (diffDays === 1) {
      dayLabel = t('tomorrow');
    } else if (diffDays > 1) {
      dayLabel = t('in-days', { count: diffDays });
    }

    return {
      dayLabel,
      dateString: formatDateWithSuffix(eventDate)
    };
  };

  const getTimeUntilEvent = (startDate) => {
    const now = new Date();
    const diffMs = startDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const formatTimeUnit = (value, unit) => {
      const unitLabel = t(value === 1 ? unit : `${unit}s`);
      return `${value} ${unitLabel}`;
    };

    if (diffDays > 0) {
      return `${formatTimeUnit(diffDays, 'day')}, ${formatTimeUnit(diffHours, 'hour')}`;
    } else if (diffHours > 0) {
      return `${formatTimeUnit(diffHours, 'hour')}, ${formatTimeUnit(diffMinutes, 'minute')}`;
    } else {
      return `${formatTimeUnit(diffMinutes, 'minute')}`;
    }
  };

  const groupEventsByDay = (events) => {
    const groupedEvents = new Map();

    events.forEach(event => {
      const { dayLabel, dateString } = getTimeDifference(event.startDate);
      const key = dayLabel;
      if (!groupedEvents.has(key)) {
        groupedEvents.set(key, { dateString, events: [] });
      }
      groupedEvents.get(key).events.push(event);
    });

    return groupedEvents;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const groupedEvents = groupEventsByDay(getEventsToDisplay());

  return (
    <div className="sidebar">
      <div className='calendar-sidebar-top'>
        <TimeIcon className='calendar-sidebar-time-icon' />
        <div className='calendar-sidebar-title'>
          {selectedCalendar === 'personal' ? t('personal-events') : t('team-events')}
        </div>
      </div>

      {getEventsToDisplay().length === 0 ? (
        <div className="calendar-sidebar-no-events-container">
          <img className='event-empty-icon img-enable-darkmode' src={EmptyCalendarIcon} alt='No events' />
          <div className='event-empty-text'>
            {t('no-events')}
          </div>
          <div className='event-empty-subtext'>
            {t('no-events-explanation')}
          </div>
        </div>
      ) : (
        [...groupedEvents.keys()].map((day, index) => (
          <div key={index}>
            <div className="event-day-group">
              <span className="day-label">{day}</span>
              <span className="date-label"> {groupedEvents.get(day).dateString}</span>
            </div>
            <ul>
              {groupedEvents.get(day).events.map((event, eventIndex) => (
                <li key={eventIndex} className="event-item" style={{ backgroundColor: `rgba(${parseInt(event.color.slice(1, 3), 16)}, ${parseInt(event.color.slice(3, 5), 16)}, ${parseInt(event.color.slice(5, 7), 16)}, 0.25)` }}>
                  <div className="event-time-info">
                    <div className="event-start-time">
                      {formatTime(event.startDate)}
                    </div>
                    <div className="time-until-event">
                      {getTimeUntilEvent(event.startDate)}
                    </div>
                  </div>
                  <div className="event-title-container">
                    <div
                      className="event-color-circle"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <div className="event-title">{event.title}</div>
                  </div>
                  <div className="event-description-sidebar">
                    {event.description}
                  </div>
                  {event.location && (
                    <div className="event-location-container-sidebar">
                      <svg className="event-location-icon bi bi-geo-alt-fill" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                      </svg>
                      <div className="event-location-sidebar">
                        {event.location}
                      </div>
                    </div>
                  )}
                  <div className="event-duration">
                    {formatDate(event.startDate)}{' '}
                    {formatTime(event.startDate)}
                    &nbsp; - &nbsp;
                    {formatDate(event.startDate) === formatDate(event.endDate) ? (
                      formatTime(event.endDate)
                    ) : (
                      <>
                        {formatDate(event.endDate)}{' '}
                        {formatTime(event.endDate)}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <div className="calendar-sidebar-filter-container">
        <div className='calendar-sidebar-filter-header'>
          <FilterIcon className='calendar-sidebar-filter-icon' />
          <div>
          Event Filter

          </div>
        </div>
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {/* {t('view-all-events')} */}
          All events
          {filter === 'all' && <SelectedIcon className='calendar-sidebar-selected-icon' />}

        </button>
        <button
          className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
          
        >
          {/* {t('upcoming-events')} */}
          Upcoming events
          {filter === 'upcoming' && <SelectedIcon className='calendar-sidebar-selected-icon' />}

        </button>
        <button
          className={`filter-button ${filter === 'finished' ? 'active' : ''}`}
          onClick={() => setFilter('finished')}
        >
          {/* {t('finished-events')} */}
          Finished events
          {filter === 'finished' && <SelectedIcon className='calendar-sidebar-selected-icon' />}

        </button>
      </div>
    </div>
  );
};

export default CalendarSidebar;
