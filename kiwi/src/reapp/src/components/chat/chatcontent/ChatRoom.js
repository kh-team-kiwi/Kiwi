import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import '../../../styles/components/chat/chatcontent/chatroom.css';

const ChatRoom = ({ chatNum }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [sender, setSender] = useState('');
    const [files, setFiles] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const fileInputRef = useRef(null);

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
                files: files.map(file => file.name) // Add file names to message if exists
            };

            if (files.length > 0) {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('files', file);
                });

                axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    chatMessage.files = response.data; // Get uploaded file names from response
                    stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                    setMessage('');
                    setFiles([]);
                    fileInputRef.current.value = ''; // Reset file input
                }).catch(error => {
                    console.error('Error uploading files:', error);
                });
            } else {
                stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                setMessage('');
            }
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = files.slice();
        newFiles.splice(index, 1);
        setFiles(newFiles);
        if (newFiles.length === 0) {
            fileInputRef.current.value = ''; // Reset file input if no files left
        }
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
                        {msg.files && msg.files.map((file, i) => (
                            <div key={i}>
                                <img src={`http://localhost:8080/api/upload/${file}`} alt="Uploaded" style={{maxWidth: '200px'}} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                {files.length > 0 && (
                    <div className="files-preview">
                        {files.map((file, index) => (
                            <div key={index} className="file-preview">
                                <div className="file-preview-overlay" onClick={() => handleRemoveFile(index)}>
                                    <span className="remove-file">✖</span>
                                </div>
                                <span>{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}
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
                <div className="file-input-wrapper">
                    <button className="file-input-button">Choose Files</button>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="file-input"
                        ref={fileInputRef}
                        multiple
                    />
                </div>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
