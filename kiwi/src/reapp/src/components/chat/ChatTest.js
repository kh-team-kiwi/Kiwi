import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatTest = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws', null, { withCredentials: true });
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            setIsConnected(true); // 연결 성공
            console.log('Connected: ' + frame);
            client.subscribe('/topic/public', (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        }, (error) => {
            setIsConnected(false); // 연결 실패
            console.error('Connection error', error);
        });

        setStompClient(client);

        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
                setIsConnected(false); // 연결 해제
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && isConnected) {
            const chatMessage = {
                sender: "User",
                content: message,
                type: 'CHAT'
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            setMessage('');
        } else {
            console.error('There is no underlying STOMP connection');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.sender}: {msg.content}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatTest;
