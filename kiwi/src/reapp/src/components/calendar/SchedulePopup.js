import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import '../../styles/components/calendar/SchedulePopup.css';
import {getSessionItem} from "../../jwt/storage";
import {useLocation} from "react-router-dom";
import axiosHandler from "../../jwt/axiosHandler";

const SchedulePopup = ({ onClose, addEvent, calendars = [], setEvents }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#FF6F61', // Modern Red
    '#FF8A65', // Light Coral 
    '#FFB347', // Modern Orange
    '#FFF176', // Modern Yellow
    '#AED581', // Light Green 
    '#81C784', // Modern Green
    '#4FC3F7',  // Sky Blue 
    '#64B5F6', // Modern Blue
    '#9575CD', // Modern Indigo
    '#BA68C8' // Modern Violet
  ];

  const [selectedColor, setSelectedColor] = useState(presetColors[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState(calendars.length > 0 ? calendars[0] : '');
  const [selectedEventCalendar, setSelectedEventCalendar] = useState('personal');

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const getInitialEventState = () => ({
    title: '',
    description: '',
    calendar: 'personal',
    location: '',
    startDate: getCurrentDate(),
    startTime: getCurrentTime(),
    endDate: getCurrentDate(),
    endTime: getCurrentTime(),
    color: '#FF6F61'
  });

  const [newEvent, setNewEvent] = useState(getInitialEventState());

  const location = useLocation();

  useEffect(() => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      calendar: selectedEventCalendar
    }));
  }, [selectedEventCalendar]);

  const popupRef = useRef(null);
  const dropdownRef = useRef(null);
  const calendarDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(event.target)
      ) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openPopup = () => {
    setNewEvent(getInitialEventState());
    setSelectedColor(presetColors[0]);
    setSelectedEventCalendar('personal');
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => {
      const updatedEvent = { ...prevEvent, [name]: value };

      if (name === 'startDate' || name === 'startTime') {
        const startDateTime = new Date(`${updatedEvent.startDate}T${updatedEvent.startTime}`);
        const endDateTime = new Date(`${updatedEvent.endDate}T${updatedEvent.endTime}`);

        if (startDateTime > endDateTime) {
          return {
            ...updatedEvent,
            endDate: updatedEvent.startDate,
            endTime: updatedEvent.startTime
          };
        }
      }

      return updatedEvent;
    });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setNewEvent({ ...newEvent, color });
    setDropdownOpen(false);
  };

  const handleCalendarChange = (calendar) => {
    setSelectedEventCalendar(calendar);
    setNewEvent({ ...newEvent, calendar });
  };

  const handleAddEvent = () => {
    console.log("#### handleAddEvent #####");
    addSchedule(); // database save

    // const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    // const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);
    // addEvent({
    //   title: newEvent.title || 'Untitled',
    //   description: newEvent.description,
    //   calendar: newEvent.calendar,
    //   location: newEvent.location,
    //   startDate: startDateTime,
    //   endDate: endDateTime,
    //   color: newEvent.color
    // });
    // setNewEvent(getInitialEventState());
    closePopup();
  };

  const addSchedule = async () => {
    console.log("addSchedule : ");
    try{
    const response = await axiosHandler.post("/api"+location.pathname+"/create/"+getSessionItem("profile").username, newEvent);
    const data = response.data.data;
    if(data){
      setEvents((prevEvents) => ({
        ...prevEvents,
        [data.calendar]: [...prevEvents[data.calendar], data]
      }));
    } else{
      alert("서버 저장에 실패했습니다.");
    }
    } catch (error) {
      console.error("Failed to addSchedule:", error);
    }
  }
  return (
    <>
      <button className="schedule-button" onClick={openPopup}>
        <PlusIcon className='create-event-button-plus-icon'/>
        &nbsp;{t('create')}
      </button>
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content" ref={popupRef}>
            {/* <div className="close-button" onClick={closePopup}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.71 5.29a1 1 0 0 0-1.42 0L12 10.59 7.71 6.29a1 1 0 0 0-1.42 1.42L10.59 12 6.29 16.29a1 1 0 0 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42L13.41 12l4.3-4.29a1 1 0 0 0 0-1.42z"/>
              </svg>
            </div> */}
            <form className="event-form">
              <div className='event-calendar-option'>
                <div className="slide-controls-popup">
                  <div className="radio-wrapper-popup">
                    <input 
                      type="radio" 
                      name="slide" 
                      id="personal" 
                      value="personal" 
                      checked={selectedEventCalendar === 'personal'} 
                      onChange={() => handleCalendarChange('personal')} 
                    />
                    <input 
                      type="radio" 
                      name="slide" 
                      id="team" 
                      value="team" 
                      checked={selectedEventCalendar === 'team'} 
                      onChange={() => handleCalendarChange('team')} 
                    />
                    <label htmlFor="personal" className="slide-popup">{t('personal')}</label>
                    <label htmlFor="team" className="slide-popup">{t('team')}</label>
                    <div className="slider-tab-popup"></div>
                  </div>
                </div>

              </div>


              <div className="event-title-container" >
                <div className='event-title-input-container'>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      className="event-title-input"
                      value={newEvent.title}
                      onChange={handleInputChange}
                    />
                <div className="color-picker" ref={dropdownRef}>
                  <div className="color-dropdown-container">
                    <button 
                      type="button"
                      className="color-dropdown-button" 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <div
                        className="color-circle"
                        style={{ backgroundColor: selectedColor, marginRight: '1px'}}
                      ></div>
                      
                    </button>
                    {dropdownOpen && (
                      <ul className="color-dropdown-list">
                        {presetColors.map((color, index) => (
                          <li
                            key={index}
                            className="color-list-item"
                            onClick={() => handleColorChange(color)}
                          >
                            <div
                              className="color-circle"
                              style={{ backgroundColor: color, marginRight: '1px'}}
                            ></div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                </div>

              </div>

              <div className="event-description-container" >
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='event-popup-icon' viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                  </svg>
                </div>
                <div className='event-input-container'>
                  <input
                    name="description"
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className='event-description-input'
                  />
                </div>

              </div>

              <div className="event-location-container">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='event-popup-icon' viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                </div>
                <div className='event-input-container'>
                  <input
                    type="text"
                    name="location"
                    className="event-location-input"
                    placeholder="Location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                  />

                </div>

              </div>

              <div className="event-duration-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='event-popup-icon' style={{marginTop:'5px'}} viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>

                <div className='event-duration-input-container'>
                  <div className="event-start-container">
                    <input
                      type="time"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                      className='event-time-input'

                    />
                    <input
                      type="date"
                      name="startDate"
                      value={newEvent.startDate}
                      onChange={handleInputChange}
                      className='event-date-input'
                    />

                  </div>
                  <div className="event-end-container">
                    <input
                      type="time"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                      className='event-time-input'

                    />
                    <input
                      type="date"
                      name="endDate"
                      value={newEvent.endDate}
                      onChange={handleInputChange}
                      className='event-date-input'
                    />
                  </div>

                </div>

              </div>
              <div className="event-bottom-container">
                <button type="button" className="event-cancel-button" onClick={closePopup}>Cancel</button>

                <button type="button" className="event-create-button" onClick={handleAddEvent}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulePopup;
