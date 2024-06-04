import React, { useState, useEffect } from 'react';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import CalendarApi from '../components/calendar/CalendarApi';

import '../styles/pages/Page.css';
import '../styles/pages/Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);

  // Load events from sessionStorage when the component mounts
  useEffect(() => {
    const storedEvents = sessionStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    const event = { ...newEvent, startDate: new Date(newEvent.startDate), endDate: new Date(newEvent.endDate) };
    setEvents((prevEvents) => [...prevEvents, event]);
  };


  return (
    <>
      <CalendarSidebar events={events} />
      <div className='content-container'>
          <CalendarApi events={events} addEvent={addEvent} />

      </div>
    </>
  );
};

export default Calendar;