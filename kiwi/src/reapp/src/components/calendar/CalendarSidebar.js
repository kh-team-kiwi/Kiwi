import React from 'react';
import '../../styles/components/calendar/CalendarSidebar.css';

const CalendarSidebar = ({ events }) => {
  const upcomingEvents = events
    .map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }))
    .filter(event => event.startDate >= new Date())
    .sort((a, b) => a.startDate - b.startDate);

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
    const month = date.toLocaleString('default', { month: 'long' });
    return `${month} ${day}${getDaySuffix(day)}`;
  };

  const getTimeDifference = (startDate) => {
    const now = new Date();
    
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    const diffMs = eventDate - currentDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    let dayLabel;
    if (diffDays === 0) {
      dayLabel = 'Today';
    } else if (diffDays === 1) {
      dayLabel = 'Tomorrow';
    } else if (diffDays > 1) {
      dayLabel = `In ${diffDays} days`;
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
    
    if (diffDays > 0) {
      return `${diffDays} days, ${diffHours} hours left`;
    } else if (diffHours > 0) {
      return `${diffHours} hours, ${diffMinutes} minutes left`;
    } else {
      return `${diffMinutes} minutes left`;
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

  const groupedEvents = groupEventsByDay(upcomingEvents);

  return (
    <div className="sidebar">
      <h2>Upcoming Events</h2>
      {[...groupedEvents.keys()].map((day, index) => (
        <div key={index}>
          <div className="event-day-group">
            <span className="day-label">{day}</span>
            <span className="date-label"> {groupedEvents.get(day).dateString}</span>
          </div>
          <ul>
            {groupedEvents.get(day).events.map((event, eventIndex) => (
              <li key={eventIndex} className="event-item" style={{ backgroundColor: `rgba(${parseInt(event.color.slice(1, 3), 16)}, ${parseInt(event.color.slice(3, 5), 16)}, ${parseInt(event.color.slice(5, 7), 16)}, 0.1)` }}>
                <div className="event-title-container">
                  <div
                    className="event-color-circle"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="event-title">{event.title}</div>
                </div>
                <div className="event-time-info">
                  <div className="event-start-time">
                    {formatTime(event.startDate)}
                  </div>

                  <div className="time-until-event">
                    {getTimeUntilEvent(event.startDate)}

                  </div>
                </div>
                <div className="event-description">
                  {event.description}
                </div>
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
      ))}
    </div>
  );
};

export default CalendarSidebar;
