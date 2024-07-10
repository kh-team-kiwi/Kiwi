import React, { useState, useEffect } from 'react';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import CalendarApi from '../components/calendar/CalendarApi';

import '../styles/pages/Page.css';
import '../styles/pages/Calendar.css';
import axiosHandler from "../jwt/axiosHandler";
import {getSessionItem} from "../jwt/storage";
import {useLocation, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const Calendar = () => {
  const [events, setEvents] = useState({ personal: [], team: [] });
  const [selectedCalendar, setSelectedCalendar] = useState('personal');
  const calendars = ['personal', 'team'];
  const {teamno} = useParams();

  // useEffect(() => {
  //   const fetchEvents = () => {
  //     const storedEvents = JSON.parse(sessionStorage.getItem('events')) || {
  //       personal: [],
  //       team: []
  //     };
  //     setEvents(storedEvents);
  //   };
  //   fetchEvents();
  // }, []);

  useEffect(() => {
    const fetchEvents = () => {
      const storedEvents = {
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


  const location = useLocation();

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axiosHandler.get("/api/calendar/team/" + teamno + "/member/" + getSessionItem("profile").username);
      const data = response.data.data;
      if(data){
        setEvents(data);
      }
    } catch (error) {
      if(error.data.message) toast.error(error.data.message);
    }
  }

  return (
    <>
      <CalendarSidebar 
        events={events[selectedCalendar]} selectedCalendar={selectedCalendar}
      />
      <div className='content-container'>
        <CalendarApi events={events[selectedCalendar]} addEvent={addEvent} calendars={calendars} setSelectedCalendar={setSelectedCalendar} selectedCalendar={selectedCalendar} setEvents={setEvents}  />
      </div>
    </>
  );
};

export default Calendar;
