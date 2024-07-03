import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { getSessionItem } from "../../../jwt/storage";
import ReactionMenu from './ReactionMenu';
import MessageDeletePopup from './MessageDeletePopup';
import '../../../styles/components/chat/chatcontent/chatroom.css';

import PaperclipIcon from '../../../images/svg/shapes/PaperclipIcon';
import SendIcon from '../../../images/svg/buttons/SendIcon';

import ErrorImageHandler from "../../common/ErrorImageHandler";


const ChatRoom = ({ chatNum }) => {
    const [profile, setProfile] = useState(null);
    const { teamno } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const stompClient = useRef(null);
    const fileInputRef = useRef();

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        if (!profile) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/message/messages/${chatNum}`);
                const messagesWithUnreadCounts = await Promise.all(response.data.map(async (msg) => {
                    const unreadCount = await fetchUnreadCount(chatNum, msg.messageNum);
                    return { ...msg, unreadCount };
                }));
                setMessages(messagesWithUnreadCounts);
                markMessagesAsRead(messagesWithUnreadCounts);
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
            client.subscribe(`/topic/chat/${chatNum}`, async (msg) => {
                const newMessage = JSON.parse(msg.body);
                if (newMessage.memberId) {
                    setMessages((prevMessages) =>
                        prevMessages.map((message) =>
                            message.messageNum === newMessage.messageNum
                                ? { ...message, unreadCount: Math.max(0, message.unreadCount - 1) }
                                : message
                        )
                    );
                } else {
                    const unreadCount = await fetchUnreadCount(chatNum, newMessage.messageNum);
                    setMessages(prevMessages => [...prevMessages, { ...newMessage, unreadCount }]);
                    markMessageAsRead(newMessage, profile.username);
                }
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
    }, [chatNum, profile]);

    const fetchUnreadCount = async (chatNum, messageNum) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat/message/unreadCount/${chatNum}/${messageNum}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    };

    const markMessagesAsRead = async (messages) => {
        if (!profile) {
            console.error('Profile is null. Cannot mark messages as read.');
            return;
        }

        for (let msg of messages) {
            if (msg.unreadCount > 0) {
                await markMessageAsRead(msg, profile.username);
            }
        }
    };

    const markMessageAsRead = async (message, memberId) => {
        if (!memberId) {
            console.error('Member ID is null. Cannot mark message as read.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/chat/message/read', {
                messageNum: message.messageNum,
                memberId: memberId
            });

            const { isAlreadyRead } = response.data;

            if (response.status === 200 && !isAlreadyRead) {
                if (stompClient.current && stompClient.current.connected) {
                    stompClient.current.send(`/app/chat.readMessage/${chatNum}`, {}, JSON.stringify({
                        messageNum: message.messageNum,
                        memberId: memberId,
                        chatNum: chatNum
                    }));
                }

                const unreadCount = await fetchUnreadCount(message.chatNum, message.messageNum);
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.messageNum === message.messageNum ? { ...msg, unreadCount } : msg
                    )
                );
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() && files.length === 0) {
            return;
        }

        if (stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: profile.username,
                content: message.trim(),
                chatNum,
                files: [],
                type: 'CHAT',
                replyToMessageNum: replyingTo ? replyingTo.messageNum : null,
                replyTo: replyingTo ? { memberNickname: replyingTo.memberNickname, chatContent: replyingTo.chatContent, chatTime: replyingTo.chatTime } : null
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
                setReplyingTo(null);
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
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
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

    const handleReactionClick = async (reactionKey, message) => {
        if (reactionKey === 'comment') {
            setReplyingTo(message);
        } else if (reactionKey === 'cross') {
            setSelectedMessage(message);
            setShowDeletePopup(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedMessage) {
            try {
                await axios.delete(`http://localhost:8080/api/chat/message/delete/${selectedMessage.messageNum}`, {
                    data: { username: profile.username }
                });
                setMessages(prevMessages => prevMessages.filter(msg => msg.messageNum !== selectedMessage.messageNum));
            } catch (error) {
                console.error('Error deleting message:', error);
            } finally {
                setShowDeletePopup(false);
                setSelectedMessage(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeletePopup(false);
        setSelectedMessage(null);
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-room-message-container">
                        <div className="chat-room-message-sender">
                            <img className='chat-user-profile-pic' src={''} alt={msg.memberNickname} onError={ErrorImageHandler}></img>
                            <div className='chat-room-message-name'>
                            {msg.memberNickname}

                            </div>
                            <div className="chat-room-message-time">{formatTime(msg.chatTime)}</div>


                        </div>
                        <div className="chat-room-message-content-container">
                            <div className="chat-room-message-content">
                                {msg.replyTo ? (
                                    <div className="chat-room-reply-container">
                                        <div className="chat-room-reply-original">
                                            <strong>{msg.replyTo.memberNickname}에게</strong><br/> {msg.replyTo.chatContent} <small>{formatTime(msg.replyTo.chatTime)}</small>
                                        </div>
                                        <div className="chat-room-reply-content">
                                            {msg.chatContent}
                                        </div>
                                    </div>
                                ) : (
                                    msg.chatContent.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>{line}<br /></React.Fragment>
                                    ))
                                )}
                                {msg.files && msg.files.map((file, fileIndex) => (
                                    <div key={fileIndex} className="chat-room-message-file-container">
                                        <a href={`http://localhost:8080/api/chat/message/download?fileKey=${file.filePath}`} onClick={(e) => handleDownload(e, file.filePath, file.originalFileName)}>
                                            {isImage(file.originalFileName) ? (
                                                <div className="chat-room-image-container">
                                                    <img src={`http://localhost:8080/api/chat/message/download?fileKey=${file.filePath}`} alt="Uploaded" className="chat-room-uploaded-image" />
                                                    <div className="chat-room-download-icon">↓</div>
                                                </div>
                                            ) : (
                                                <div className="chat-room-file-link-container">
                                                    <span className="chat-room-file-link">{file.originalFileName}</span>
                                                    <span className="chat-room-file-link">↓</span>
                                                </div>
                                            )}
                                        </a>
                                    </div>
                                ))}
                            </div>
                            {/* <small className="chat-room-message-time">{formatTime(msg.chatTime)}</small> */}
                            <small className="chat-room-unread-count"> {msg.unreadCount}</small>
                            <ReactionMenu
                                onClickReaction={(reactionKey) => handleReactionClick(reactionKey, msg)}
                                isOwnMessage={msg.sender === profile.username}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-room-bottom-container">
                {replyingTo && (
                    <div className="chat-room-replying-to">
                        <strong>{replyingTo.memberNickname}:</strong> {replyingTo.chatContent}
                        <button onClick={() => setReplyingTo(null)}>취소</button>
                    </div>
                )}
                {files.length > 0 && (
                    <div className="chat-room-file-preview-container">
                        {files.map((file, index) => (
                            <div key={index} className="chat-room-file-preview">
                                <span>{file.name}</span>
                                <button onClick={() => removeFile(index)}>X</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="chat-room-input-container">
                    <div onClick={() => fileInputRef.current && fileInputRef.current.click()} className="chat-room-file-upload-button">
                        <PaperclipIcon className='chat-room-paperclip-icon'/>
                    </div>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Send a message"
                        className="chat-room-message-input"
                    />
                    <div onClick={sendMessage} className="chat-room-send-button">
                        <SendIcon className='chat-room-send-icon' />
                    </div>
                </div>
            </div>
            {showDeletePopup && (
                <MessageDeletePopup
                    messageContent={selectedMessage.chatContent}
                    onDeleteConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default ChatRoom;
