import React, {useEffect} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {getSessionItem} from "../../jwt/storage";
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = () => {

    const memberId = getSessionItem('profile').username;

    useEffect(() => {
        const eventSource = new EventSource(`/api/notifications/subscribe/${memberId}`);
        console.log("ToastMessage : ",eventSource);
        eventSource.onmessage = (e)=>{
            toast(e.data);
        };
        eventSource.onerror= (e)=>{
            console.error("Error:",e);
            eventSource.close();
        }

        toast("wow so easy!");

        return ()=> {
            eventSource.close();
        }
    }, [memberId]);

    return (
        <div>
            <ToastContainer
            position='bottom-right'
            limit={1}
            closeButton={true}
            autoClose={4000}
            hideProgressBar/>
        </div>
    );
};

export default ToastMessage;