import React, { useState, useEffect } from 'react';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import CalendarApi from '../components/calendar/CalendarApi';

import '../styles/pages/Page.css';
import '../styles/pages/Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState({ personal: [], team: [] });
  const [selectedCalendar, setSelectedCalendar] = useState('personal');
  const calendars = ['personal', 'team'];

  useEffect(() => {
    const fetchEvents = () => {
      const storedEvents = JSON.parse(sessionStorage.getItem('events')) || {
        personal: [],
        team: []
      };
      setEvents(storedEvents);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('events', JSON.stringify(events));

    console.log(`Current events for ${selectedCalendar} calendar:`, events[selectedCalendar]);
    console.log('All personal events:', events.personal);
    console.log('All team events:', events.team);
    console.log('events', events);
  }, [events]);

  const addEvent = (newEvent) => {
    const event = { 
      ...newEvent, 
      startDate: new Date(newEvent.startDate), 
      endDate: new Date(newEvent.endDate),
    };

    setEvents((prevEvents) => ({
      ...prevEvents,
      [newEvent.calendar]: [...prevEvents[newEvent.calendar], event]
    }));
    console.log('Event created:', event);
  };

  return (
    <div className='test'>
      <CalendarSidebar 
        events={events[selectedCalendar]}  
        calendars={calendars}
      />
      <div className='content-container'>
        <CalendarApi events={events[selectedCalendar]} addEvent={addEvent} calendars={calendars} setSelectedCalendar={setSelectedCalendar} selectedCalendar={selectedCalendar}  />
      </div>
    </div>
  );
};

export default Calendar;
