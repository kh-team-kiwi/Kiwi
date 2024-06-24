import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import '../../../styles/components/chat/chatcontent/chatroom.css';
import { useParams } from "react-router-dom";
import { getSessionItem } from "../../../jwt/storage";

const ChatRoom = ({ chatNum }) => {
    const [profile, setProfile] = useState(null);
    const { teamno } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const stompClient = useRef(null);
    const fileInputRef = useRef();

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/message/messages/${chatNum}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.current = client;
            client.subscribe(`/topic/chat/${chatNum}`, (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.error('Connection error', error);
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, [chatNum]);

    const sendMessage = async () => {
        if (stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: profile.username,
                content: message,
                chatNum,
                files: [],
                type: 'CHAT'
            };

            try {
                if (files.length > 0) {
                    const formData = new FormData();
                    files.forEach(file => formData.append('files', file));
                    formData.append('team', teamno);
                    formData.append('chatNum', chatNum);
                    formData.append('messageNum', `${chatNum}-${Date.now()}`);

                    const response = await axios.post('http://localhost:8080/api/chat/message/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    chatMessage.files = response.data;
                }

                stompClient.current.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));

                setMessage('');
                setFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('Error sending message or uploading files:', error);
            }
        } else {
            console.error('There is no underlying STOMP connection');
        }
    };

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="chat-room-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message-container">
                        <div className="message-sender">
                            {msg.memberNickname || (msg.member && msg.member.memberNickname)}
                        </div>
                        <div className="message-content">
                            {msg.chatContent} <small>{formatTime(msg.chatTime)}</small>
                            {msg.file && (
                                <div>
                                    <a href={`http://localhost:8080/api/chat/message/download?fileKey=${msg.file}`} download>{msg.file}</a>
                                    <img src={`http://localhost:8080/api/chat/message/download?fileKey=${msg.file}`} alt="Uploaded" style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                {files.length > 0 && (
                    <div className="file-preview-container">
                        {files.map((file, index) => (
                            <div key={index} className="file-preview">
                                <span>{file.name}</span>
                                <button onClick={() => removeFile(index)}>X</button>
                            </div>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                />
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>Choose Files</button>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
