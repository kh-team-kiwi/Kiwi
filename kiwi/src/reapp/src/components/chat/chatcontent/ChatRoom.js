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
    const textAreaRef = useRef();

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
        if (!message.trim() && files.length === 0) {
            return; // 메시지가 공백이거나 파일이 없을 때 전송하지 않음
        }

        if (stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: profile.username,
                content: message.trim(),
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
                if (textAreaRef.current) {
                    textAreaRef.current.style.height = 'auto';
                }
            } catch (error) {
                console.error('Error sending message or uploading files:', error);
            }
        } else {
            console.error('There is no underlying STOMP connection');
        }
    };

    const handleFileChange = (event) => {
        setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
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

    const isImage = (fileName) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const fileExtension = fileName.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    };

    const handleDownload = (event, filePath, fileName) => {
        event.preventDefault();
        axios({
            url: `http://localhost:8080/api/chat/message/download?fileKey=${filePath}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleInput = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className="chat-room-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message-container">
                        <div className="message-sender">
                            {msg.memberNickname}
                        </div>
                        <div className="message-content-container">
                            <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
                                {msg.files && msg.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="message-file-container">
                                        <a href={`http://localhost:8080/api/chat/message/download?fileKey=${file.filePath}`} onClick={(e) => handleDownload(e, file.filePath, file.originalFileName)}>
                                            {isImage(file.originalFileName) ? (
                                                <div className="image-container">
                                                    <img src={`http://localhost:8080/api/chat/message/download?fileKey=${file.filePath}`} alt="Uploaded" className="uploaded-image" />
                                                    <div className="download-icon">↓</div>
                                                </div>
                                            ) : (
                                                <div className="file-link-container">
                                                    <span className="file-link">{file.originalFileName}</span>
                                                    <span className="file-download-icon">↓</span>
                                                </div>
                                            )}
                                        </a>
                                    </div>
                                ))}
                                {msg.chatContent.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>{line}<br /></React.Fragment>
                                ))}
                            </div>
                            <small className="message-time">{formatTime(msg.chatTime)}</small>
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
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Enter your message"
                    rows="1"
                    ref={textAreaRef}
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
