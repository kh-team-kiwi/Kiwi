import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axiosHandler from "../../../jwt/axiosHandler";
import { useParams } from "react-router-dom";
import { getSessionItem } from "../../../jwt/storage";
import ReactionMenu from './ReactionMenu';
import MessageDeletePopup from './MessageDeletePopup';
import '../../../styles/components/chat/chatcontent/chatroom.css';
import PaperclipIcon from '../../../images/svg/shapes/PaperclipIcon';
import SendIcon from '../../../images/svg/buttons/SendIcon';
import ErrorImageHandler from "../../common/ErrorImageHandler";

const ChatRoom = ({ chatNum, messages, setMessages }) => {
    const [profile, setProfile] = useState(null);
    const { teamno } = useParams();
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [imageLoaded, setImageLoaded] = useState({}); // State to track image loading
    const stompClient = useRef(null);
    const fileInputRef = useRef();
    const messageEndRef = useRef(null);
    const firstUnreadMessageRef = useRef(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        const storedProfile = getSessionItem("profile");
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        if (!profile) return;

        const fetchMessages = async () => {
            try {
                const response = await axiosHandler.get(`http://localhost:8080/api/chat/message/messages/${chatNum}`);
                const messagesWithUnreadCounts = await Promise.all(response.data.map(async (msg) => {
                    const unreadCount = await fetchUnreadCount(chatNum, msg.messageNum);
                    return { ...msg, unreadCount };
                }));
                setMessages(messagesWithUnreadCounts);
                markMessagesAsRead(messagesWithUnreadCounts);

                const firstUnreadResponse = await axiosHandler.get(`http://localhost:8080/api/chat/message/firstUnread/${chatNum}/${profile.username}`);
                if (firstUnreadResponse.status === 200 && firstUnreadResponse.data) {
                    const firstUnreadMessage = firstUnreadResponse.data;
                    firstUnreadMessageRef.current = firstUnreadMessage.messageNum;
                }

                // 진입 시에만 읽지 않은 메시지 위치로 스크롤
                scrollToUnreadOrBottom();
            } catch (error) {
                console.error('메시지 가져오기 오류:', error);
            }
        };

        fetchMessages();

        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log('연결됨: ' + frame);
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
                    if (!isUserScrolling) {
                        scrollToBottom();
                    }
                }
            });
        }, (error) => {
            console.error('연결 오류', error);
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log('연결 끊김');
                });
            }
        };
    }, [chatNum, profile]);

    useEffect(() => {
        // 메시지가 업데이트될 때마다 항상 최신 메시지 위치로 스크롤
        if (!isUserScrolling) {
            scrollToBottom();
        }
    }, [messages]);

    const fetchUnreadCount = async (chatNum, messageNum) => {
        try {
            const response = await axiosHandler.get(`http://localhost:8080/api/chat/message/unreadCount/${chatNum}/${messageNum}`);
            return response.data;
        } catch (error) {
            console.error('읽지 않은 메시지 수 가져오기 오류:', error);
            return 0;
        }
    };

    const markMessagesAsRead = async (messages) => {
        if (!profile) {
            console.error('프로필이 null입니다. 메시지를 읽음으로 표시할 수 없습니다.');
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
            console.error('멤버 ID가 null입니다. 메시지를 읽음으로 표시할 수 없습니다.');
            return;
        }

        try {
            const response = await axiosHandler.post('http://localhost:8080/api/chat/message/read', {
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
            console.error('메시지를 읽음으로 표시하는 중 오류:', error);
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
                replyTo: replyingTo ? { memberNickname: replyingTo.memberNickname, chatContent: replyingTo.chatContent, chatTime: replyingTo.chatTime } : null,
                memberFilepath: profile.memberFilepath 
            };

            try {
                if (files.length > 0) {
                    const formData = new FormData();
                    files.forEach(file => formData.append('files', file));
                    formData.append('team', teamno);
                    formData.append('chatNum', chatNum);
                    formData.append('messageNum', `${chatNum}-${Date.now()}`);

                    const response = await axiosHandler.post('http://localhost:8080/api/chat/message/upload', formData, {
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
                scrollToBottom();
            } catch (error) {
                console.error('메시지 전송 또는 파일 업로드 중 오류:', error);
            }
        } else {
            console.error('기본 STOMP 연결이 없습니다.');
        }
    };

    const handleFileChange = (event) => {
        setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
    };

    const formatTime = (time) => {
        const date = new Date(time);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // '0'은 '12'로 변경
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
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
        axiosHandler({
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
        }).catch((error) => {
            console.error('파일 다운로드 중 오류:', error);
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
                await axiosHandler.delete(`http://localhost:8080/api/chat/message/delete/${selectedMessage.messageNum}`, {
                    data: { username: profile.username }
                });
                setMessages(prevMessages => prevMessages.filter(msg => msg.messageNum !== selectedMessage.messageNum));
            } catch (error) {
                console.error('메시지 삭제 중 오류:', error);
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

    const scrollToUnreadOrBottom = () => {
        if (firstUnreadMessageRef.current) {
            const firstUnreadElement = document.getElementById(firstUnreadMessageRef.current);
            if (firstUnreadElement) {
                firstUnreadElement.scrollIntoView({ behavior: 'auto' });
                return;
            }
        }
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    };

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        setIsUserScrolling(true);
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsUserScrolling(false);
        }, 1000); // 사용자가 스크롤을 멈춘 후 1초 후에 자동 스크롤 재활성화
    };

    useEffect(() => {
        const chatRoomMessagesElement = document.querySelector('.chat-room-messages');
        chatRoomMessagesElement.addEventListener('scroll', handleScroll);
        return () => {
            chatRoomMessagesElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="chat-room-container">
            <div className="chat-room-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-room-message-container" id={msg.messageNum}>
                        {msg.messageNum === firstUnreadMessageRef.current && (
                            <div className="chat-room-unread-indicator">
                                읽지 않은 메시지
                            </div>
                        )}
                        <div className="chat-room-message-sender">
                            <img
                                className='chat-user-profile-pic'
                                src={msg.memberFilepath || 'default_profile_image_url.jpg'}
                                alt={msg.memberNickname}
                                onLoad={() => setImageLoaded(prev => ({ ...prev, [msg.messageNum]: true }))}
                                onError={ErrorImageHandler}
                            />
                            <div className='chat-room-message-name'>
                                {msg.memberNickname} 
                            </div>
                            <div className="chat-room-message-time">{formatTime(msg.chatTime)}</div>
                        </div>
                        {imageLoaded[msg.messageNum] && (
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
                                            <a href="#" onClick={(e) => handleDownload(e, file.filePath, file.originalFileName)}>
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
                                {msg.unreadCount > 0 && (
                                    <small className="chat-room-unread-count">{msg.unreadCount}</small>
                                )}
                                <ReactionMenu
                                    onClickReaction={(reactionKey) => handleReactionClick(reactionKey, msg)}
                                    isOwnMessage={msg.sender === profile.username}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef}></div>
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
                        placeholder="메시지 보내기"
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
