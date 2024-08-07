import React, { useState } from 'react';
import '../../styles/components/calendar/EditPopup.css';
import { useTranslation } from 'react-i18next';
import axiosHandler from "../../jwt/axiosHandler";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';


const EditPopup = ({ event, isOpen, onClose, setEvents }) => {

  const parseDateWithoutTimezone = (dateString) => {
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    console.log(`Parsed date for ${dateString}:`, date);
    return date;
  };

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [startDate, setStartDate] = useState(parseDateWithoutTimezone(event.startDate).toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(parseDateWithoutTimezone(event.endDate).toISOString().slice(0, 16));
  const [calendar, setCalendar] = useState(event.calendar);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const locate = useLocation();

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

  const [selectedColor, setSelectedColor] = useState(event.color);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(t('title-empty-error'));
      return;
    }

    const updatedEvent = {
      ...event,
      title,
      description,
      location,
      startDate: startDate,
      endDate: endDate,
      calendar,
      color: selectedColor
    };
    console.log("before", updatedEvent);
    try {
      const response = await axiosHandler.put("/api/calendar/", updatedEvent);
      if (response.data.result) {
        const data = response.data.data;
        console.log("after", data);
        setEvents((prevEvents) => ({
          ...prevEvents,
          [data.calendar]: prevEvents[data.calendar].map(event =>
            event.scheduleNo === data.scheduleNo ? data : event)
        }));

        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-popup-container">
      <div className='edit-popup-content'>
        <form className="edit-popup-form" onSubmit={handleSave}>
          <div className='edit-popup-calendar-option'>
            <div className="edit-popup-slide-controls">
              <div className="edit-popup-radio-wrapper">
                <input
                  type="radio"
                  name="slide"
                  id="edit-popup-personal"
                  value="personal"
                  checked={calendar === 'personal'}
                  onChange={() => setCalendar('personal')}
                />
                <input
                  type="radio"
                  name="slide"
                  id="edit-popup-team"
                  value="team"
                  checked={calendar === 'team'}
                  onChange={() => setCalendar('team')}
                />
                <label htmlFor="edit-popup-personal" className="edit-popup-slide">{t('personal')}</label>
                <label htmlFor="edit-popup-team" className="edit-popup-slide">{t('team')}</label>
                <div className="edit-popup-slider-tab"></div>
              </div>
            </div>
          </div>

          <div className="edit-popup-title-container">
            <div className='edit-popup-title-input-container'>
              <input
                type="text"
                name="title"
                placeholder={t('title')}
                className="edit-popup-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="edit-popup-color-picker" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div
                  className="edit-popup-color-circle"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                {dropdownOpen && (
                  <ul className="edit-popup-color-dropdown-list">
                    {presetColors.map((color, index) => (
                      <li
                        key={index}
                        className="edit-popup-color-list-item"
                        onClick={() => {
                          setSelectedColor(color);
                          setDropdownOpen(false);
                        }}
                      >
                        <div
                          className="edit-popup-color-circle"
                          style={{ backgroundColor: color }}
                        ></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="edit-popup-description-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='edit-popup-icon' viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
            <div className='edit-popup-input-container'>
              <input
                name="description"
                placeholder={t('description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='edit-popup-description-input'
              />
            </div>
          </div>

          <div className="edit-popup-location-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" className='edit-popup-icon' viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
            <div className='edit-popup-input-container'>
              <input
                type="text"
                name="location"
                className="edit-popup-location-input"
                placeholder={t('location')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="edit-popup-duration-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='edit-popup-icon' style={{ marginTop: '5px', marginLeft: '2px' }} viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
            </svg>
            <div className='edit-popup-duration-input-container'>
              <div className="edit-popup-start-container">
                <input
                  type="time"
                  name="startTime"
                  value={startDate.slice(11, 16)}
                  onChange={(e) => setStartDate(startDate.slice(0, 11) + e.target.value)}
                  className='edit-popup-time-input'
                />
                <input
                  type="date"
                  name="startDate"
                  value={startDate.slice(0, 10)}
                  onChange={(e) => setStartDate(e.target.value + startDate.slice(10))}
                  className='edit-popup-date-input'
                />
              </div>
              <div className="edit-popup-end-container">
                <input
                  type="time"
                  name="endTime"
                  value={endDate.slice(11, 16)}
                  onChange={(e) => setEndDate(endDate.slice(0, 11) + e.target.value)}
                  className='edit-popup-time-input'
                />
                <input
                  type="date"
                  name="endDate"
                  value={endDate.slice(0, 10)}
                  onChange={(e) => setEndDate(e.target.value + endDate.slice(10))}
                  className='edit-popup-date-input'
                />
              </div>
            </div>
          </div>

          <div className="edit-popup-bottom-container">
            <button type="button" className="edit-popup-cancel-button" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="edit-popup-save-button">{t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;
