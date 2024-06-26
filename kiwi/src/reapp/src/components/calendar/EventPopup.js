import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/calendar/EventPopup.css';

import ExitIcon from '../../images/svg/buttons/ExitIcon';
import EditIcon from '../../images/svg/buttons/EditIcon';
import DescriptionIcon from '../../images/svg/buttons/DescriptionIcon';
import LocationIcon from '../../images/svg/buttons/LocationIcon';
import DeleteIcon from '../../images/svg/buttons/DeleteIcon';
import TimeIcon from '../../images/svg/buttons/TimeIcon';
import axiosHandler from "../../jwt/axiosHandler";
import {getSessionItem} from "../../jwt/storage";
import {useLocation} from "react-router-dom";



const EventPopup = ({ event, position, onClose }) => {
  const { t, i18n } = useTranslation();
  const popupRef = useRef(null);

  useEffect(() => {
    const popup = popupRef.current;
    if (popup) {
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;

      let top = position.top - 250;
      let left = position.left - 250;

      console.log('left + popup with' +(left + popupWidth + 250))
      console.log('window width' + window.innerWidth)

      if (left + popupWidth + 260 > window.innerWidth) {
        console.log('exceeded right')
        left = window.innerWidth - popupWidth - 270; 
      }

      if (top + popupHeight > window.innerHeight) {
        top = window.innerHeight - popupHeight - 100; 
      }

      if (left < 0) {
        left = 10;
      }

      if (top < 0) {
        top = 10; 
      }

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
    }
  }, [position]);

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
    if (!(date instanceof Date)) {
        date = new Date(date); 
      }
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

  const formatDate = (inputdate) => {
    const date = new Date(inputdate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatTime = (inputdate) => {
    const date = new Date(inputdate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
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
  


  const blendWithWhite = (color, ratio) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const blendedR = Math.round(r + (255 - r) * ratio);
    const blendedG = Math.round(g + (255 - g) * ratio);
    const blendedB = Math.round(b + (255 - b) * ratio);

    return `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
  };

  const backgroundColor = blendWithWhite(event.color, 0.85);

  const handleScheduleEdit = async (event) => {
    console.log("handleScheduleEdit : ");
    try {
      const response = await axiosHandler.post("/api" + location.pathname + "/update",{event});
      const data = response.data.data;
      if(data){
        // setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  }

  const location = useLocation();

  const handleScheduleDelete = async (event) => {
    const scheduleNo = event.scheduleNo;
    console.log("handleScheduleDelete : ");
    try {
      const response = await axiosHandler.get("/api" + location.pathname + "/delete/" + scheduleNo);
      if(response.data){
        // response.data.result==true 삭제 성공...
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  }

  return (
    <div ref={popupRef} className="event-popup-container" style={{ backgroundColor }}>
      <div className='event-popup-top'>
        <div className='event-popup-delete-container'>
            <DeleteIcon className='event-popup-delete'/>
        </div>
        <div className='event-popup-edit-container'>
            <EditIcon className='event-popup-edit'/>
        </div>
        
        <div className='event-popup-exit-container' onClick={onClose}>
            <ExitIcon className='event-popup-exit'/>
        </div>

      </div>

      <div className="event-popup-time-info">
        <TimeIcon className='event-popup-time-icon'/>
        <div className="event-popup-start-time">
            <div className='event-popup-bold-text'>
             {formatTime(event.startDate)}
            </div>
            <div>
                {formatDate(event.startDate)} 
            </div>
        </div>

        {/* <div className="event-popup-time-until-event">
        {getTimeUntilEvent(event.startDate)}

        </div> */}
    </div>

      <div className="event-popup-title-container">
        <div
        className="event-popup-color-circle"
        style={{ backgroundColor: event.color }}
        ></div>
        <div className="event-popup-title">{event.title}</div>
      </div>

      <div className='event-popup-description-container'>
        <DescriptionIcon className='event-popup-description-icon' />
        <div className='event-popup-description'>
            {event.description}
        </div>
      </div>
      <div className='event-popup-location-container'>
          <LocationIcon className='event-popup-location-icon' />

        <div className='event-popup-location'>
            {event.location}
        </div>
    </div>

    <div>

    </div>

        <p>{t('endDate')}: {formatDate(event.endDate)}</p>
    </div>
  );
};

export default EventPopup;
