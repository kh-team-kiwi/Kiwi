import React, {useEffect, useRef} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {getLocalItem, getSessionItem} from "../../jwt/storage";
import 'react-toastify/dist/ReactToastify.css';
import { EventSourcePolyfill } from 'event-source-polyfill';

const ToastMessage = () =>{

    useEffect(() => {

        const memberId = getSessionItem('profile').username;
        const access = getLocalItem("accessToken");
        const EventSource = EventSourcePolyfill || window.EventSource;

        const eventSource = new EventSource("/api/notifications/subscribe/"+memberId);

        console.log("ToastMessage : EventSource created");

        eventSource.onopen = async () => {
            await  console.log(eventSource.readyState);
            console.log("EventSource connection opened");
        };

        // eventSource.onmessage = (e) => {
        //     console.log("!!!!!! 받았다!!!!! Event received:");  // 데이터가 올바르게 오는지 확인
        //     toast(`Event: ${e.data}`);
        // };


        eventSource.addEventListener("sse",(e) => {
            console.log("mmmmmmmmm Event received:");  // 데이터가 올바르게 오는지 확인
            toast(`Event: ${e.data}`);
        });

        eventSource.onerror = async (e) => {
            await console.error("EventSource failed:", e);
            //eventSource.close();
        };

        toast("왜 뭐가문젠데.");

        return () => {
            console.log("EventSource closed");
            eventSource.close();
        };

    }, []);

    return (
        <ToastContainer
        position='bottom-right'
        limit={1}
        closeButton={true}
        autoClose={4000}
        hideProgressBar/>
    );
};

export default ToastMessage;