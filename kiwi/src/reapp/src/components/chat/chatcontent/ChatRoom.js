import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import '../../../styles/components/chat/chatcontent/chatroom.css'; // CSS 파일을 가져옵니다.

const ChatRoom = ({ chatNum }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState('');
    const [file, setFile] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // 채팅방 메시지 기록 불러오기
        axios.get(`http://localhost:8080/api/chat/messages?chatNum=${chatNum}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });

        // WebSocket 연결 설정
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            client.subscribe(`/topic/chat/${chatNum}`, (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.error('Connection error', error);
        });

        setStompClient(client);

        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, [chatNum]);

    const sendMessage = () => {
        if (stompClient) {
            const chatMessage = {
                sender: sender,
                content: message,
                chatNum: chatNum,
                file: file ? file.name : null // Add file name to message if exists
            };

            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    chatMessage.file = response.data; // Get uploaded file name from response
                    stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                    setMessage('');
                    setFile(null);
                }).catch(error => {
                    console.error('Error uploading file:', error);
                });
            } else {
                stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                setMessage('');
            }
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className="chat-room-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.sender}: {msg.content} <small>{formatTime(msg.chatTime)}</small>
                        {msg.file && <div><img src={`http://localhost:8080/api/upload/${msg.file}`} alt="Uploaded" style={{maxWidth: '200px'}} /></div>}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Enter your ID"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                {file && <div><img src={URL.createObjectURL(file)} alt="Preview" style={{maxWidth: '200px'}} /></div>}
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
