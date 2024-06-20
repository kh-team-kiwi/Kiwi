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
    const fileInputRef = useRef();

    useEffect(() => {
        // 채팅방 메시지 기록 불러오기
        axios.get(`http://localhost:8080/api/chat/message/messages/${chatNum}`)
            .then(response => {
                console.log(response.data); // Check the response data
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
            setStompClient(client);
            client.subscribe(`/topic/chat/${chatNum}`, (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.error('Connection error', error);
        });

        return () => {
            if (client) {
                client.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, [chatNum]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            const chatMessage = {
                sender: sender,
                content: message,
                chatNum: chatNum,
                files: files.map(file => file.name), // Add file names to message
                type: 'CHAT'
            };

            if (files.length > 0) {
                const formData = new FormData();
                files.forEach(file => formData.append('files', file));
                formData.append('team', 'your-team-name'); // Replace with actual team name
                formData.append('chatName', 'your-chat-name'); // Replace with actual chat name

                axios.post('http://localhost:8080/api/chat/message/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    chatMessage.files = response.data; // Get uploaded file names from response
                    stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                    console.log("Message sent with files: ", chatMessage); // Add log to confirm message sent
                    setMessage('');
                    setFiles([]);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }).catch(error => {
                    console.error('Error uploading files:', error);
                });
            } else {
                console.log("Sending message without files: ", chatMessage); // Add log before sending message
                stompClient.send(`/app/chat.sendMessage/${chatNum}`, {}, JSON.stringify(chatMessage));
                console.log("Message sent: ", chatMessage); // Add log to confirm message sent
                setMessage('');
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
            fileInputRef.current.value = ''; // Reset file input value
        }
    };

    return (
        <div className="chat-room-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message-container">
                        <div className="message-sender">{msg.member ? msg.member.memberNickname : 'Unknown'}</div>
                        <div className="message-content">
                            {msg.chatContent} <small>{formatTime(msg.chatTime)}</small>
                            {msg.file && (
                                <div>
                                    <a href={`http://localhost:8080/api/chat/message/download?fileKey=${msg.file}`} download>{msg.file}</a>
                                    <img src={`http://localhost:8080/api/chat/message/download?fileKey=${msg.file}`} alt="Uploaded" style={{maxWidth: '200px'}} />
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
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }} // Hide the default file input element
                />
                <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>Choose Files</button>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
