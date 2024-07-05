import React, {useEffect, useState} from 'react';
import '../../styles/components/teamsettings/Member.css'
import ErrorImageHandler from "../common/ErrorImageHandler";
import axiosHandler from "../../jwt/axiosHandler";
import {useParams} from "react-router-dom";

const Member = () => {
    const {teamno} = useParams();

    const [members, setMembers] = useState([]);
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [invitedMembers, setInvitedMembers] = useState([]);
    const [exiledMembers, setExiledMembers] = useState([]);
    const [displayMembers, setDisplayMembers] = useState([]);

    const [displayMemberStatus, setDisplayMemberStatus] = useState('joined'); // joined,invited,exiled
    const [displaySearchType, setDisplaySearchType] = useState('name'); // name,email
    const [displayCount, setDisplayCount] = useState(10); // 10,20,50

    const [checkedMembers, setCheckedMembers] = useState([]);
    const [displaySort, setDisplaySort] = useState('asc'); // desc,asc
    const [displayRole, setDisplayRole] = useState(['owner','admin','member']);

    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState();
    const [page, setPage] = useState([]);
    const [displayPage, setDisplayPage] = useState([1,2,3,4,5]);


/*    // 더미 데이터
    const data = [
        {
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모1',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모2',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모3',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모4',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모5',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모6',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모7',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모8',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모9',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모10',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모11',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모12',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모13',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },{
            memberId: '구경모14',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모15',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모16',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모17',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모18',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모19',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모20',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
        {
            memberId: '구경모21',
            team: '20240702_000003',
            role: 'MEMBER',
            status: 'JOINED'
        },
    ]
    // 더미 데이터 세팅
    useEffect(() => {
        setMembers(data);
    }, []);*/

    useEffect(() => {
        fetchTeamData();
    }, []);

    // 서버에서 데이터 받아오기
    const fetchTeamData = async () => {
        try {
            const response = await axiosHandler.post("/api/team/"+teamno+"/members");
            if(response.data.result){
                setMembers(response.data.data);
            } else {
                alert(response.data.message);
            }
        } catch (e) {
            console.error(e);
            alert("서버와 통신에서 오류가 발생했습니다.")
        }
    }

    // 서버에서 받아온 데이터 분류
    useEffect(() => {
        if (members) {
            const joined = members.filter(member => member.status === 'JOINED');
            const invited = members.filter(member => member.status === 'INVITED');
            const exiled = members.filter(member => member.status === 'EXILED');

            setJoinedMembers(joined);
            setInvitedMembers(invited);
            setExiledMembers(exiled);

            setDisplayMembers(memberCountFilter(joined)); // joinedMembers 대신 바로 필터링된 joined 사용

            // 총 페이지 수 계산
            setEndPage(Math.ceil(joined.length / displayCount));
            updateDisplayPage(currentPage, Math.ceil(joined.length / displayCount));
        }
    }, [members]);

    // displayMemberStatus 변경 시 페이지네이션 상태 업데이트
    useEffect(() => {
        let totalCount;
        if (displayMemberStatus === 'joined') {
            totalCount = joinedMembers.length;
        } else if (displayMemberStatus === 'invited') {
            totalCount = invitedMembers.length;
        } else {
            totalCount = exiledMembers.length;
        }
        if(totalCount<1) totalCount++;
        setEndPage(Math.ceil(totalCount / displayCount));
        updateDisplayPage(currentPage, Math.ceil(totalCount / displayCount));
    }, [displayMemberStatus, displayCount]);

    // 현재 페이지 변경 시 displayMembers 업데이트
    useEffect(() => {
        let membersToDisplay;
        if (displayMemberStatus === 'joined') {
            membersToDisplay = joinedMembers;
        } else if (displayMemberStatus === 'invited') {
            membersToDisplay = invitedMembers;
        } else {
            membersToDisplay = exiledMembers;
        }
        setDisplayMembers(memberCountFilter(membersToDisplay));
    }, [currentPage, displayMemberStatus, displayCount]);

    // displayCount로 displayMembers filtering 함수
    const memberCountFilter = (members) => {
        return  members.slice((currentPage - 1) * displayCount, currentPage * displayCount);
    }

    const updateDisplayPage = (currentPage, totalPages) => {
        let pages = [];
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, totalPages);

        if (endPage - startPage < 4) {
            startPage = Math.max(endPage - 4, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        setDisplayPage(pages);
    };

    // 셀렉트 이벤트
    const selectStatusHandle = (e) => {
        setDisplayMemberStatus(e.target.value);
        setCurrentPage(1);
    }
    // 셀렉트 이벤트
    const selectSearchHandle = (e) => {
        setDisplaySearchType(e.target.value);
    }
    // 셀렉트 이벤트
    const selectCountHandle = (e) => {
        setDisplayCount(e.target.value);
        setCurrentPage(1);
    }

    // 체크박스 이벤트
    const allCheckHandler = (e) => {
        const checkboxs = document.querySelectorAll('.teamsetings-team-checkbox');
        checkboxs.forEach(item=>{
            item.checked=e.target.checked;
        });
    }

    // 페이지네이션 애로우 버튼 이벤트
    const pagingHandler = (event, pageType) => {
        event.preventDefault();
        let newPage = currentPage;

        if (pageType === 'prev' && currentPage > 1) {
            newPage = currentPage - 1;
        } else if (pageType === 'next' && currentPage < endPage) {
            newPage = currentPage + 1;
        }
        setCurrentPage(newPage);
        updateDisplayPage(newPage, endPage);
    }

    // 페이지네이션 페이지 버튼 이벤트
    const pageClickHandler = (pageNumber) => {
        if(pageNumber===currentPage) return;
        setCurrentPage(pageNumber);
        updateDisplayPage(pageNumber, endPage);
    };

    return (
        <div className='teamsettings-inner'>
            <div className='teamsettings-header'>멤버 관리</div>
            <div className='teamsettings-team-table-header'>
                <div className='teamsettings-team-table-header-top'>
                    <select value={displayMemberStatus} onChange={selectStatusHandle}>
                        <option value='joined'>참여 중인 멤버</option>
                        <option value='invited'>초대 중인 멤버</option>
                        <option value='exiled'>차단 멤버</option>
                    </select>
                    <div>
                        <select value={displaySearchType} onChange={selectSearchHandle}>
                            <option value='name'>멤버 이름</option>
                            <option value='email'>이메일</option>
                        </select>
                        <input type='text'/>
                    </div>
                </div>
                <div className='teamsettings-team-table-header-bottom'>
                    <div className='heder-bottom-btn-box'>
                        <button type='button'>멤버 초대</button>
                        <button type='button'>멤버 관리</button>
                    </div>
                    <div>
                        <select value={displayCount} onChange={selectCountHandle}>
                            <option value={10}>10 명씩 보기</option>
                            <option value={20}>20 명씩 보기</option>
                            <option value={50}>50 명씩 보기</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='teamsettings-team-table-wrapper'>
                <table className='teamsettings-team-table'>
                    <thead>
                    <tr>
                        <th><input id='allCheckBox' onChange={allCheckHandler} type='checkbox'/></th>
                        <th>사진</th>
                        <th>
                            <span>이름</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
                                 className='teamsettings-table-sort-icon'>
                                <path
                                    d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
                            </svg>
                        </th>
                        <th>
                            <span>권한</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='teamsettings-table-filter-icon'>
                                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/>
                            </svg>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        displayMembers.map((member, idx)=> (
                            <tr className={idx % 2 === 0 ? 'odd-column' : ''} key={idx}>
                                <td><input className='teamsetings-team-checkbox' type='checkbox'/></td>
                                <td>
                                    <img className='teamsettigs-team-member-profile' src={member.memberFilepath} alt=''
                                         onError={ErrorImageHandler}></img>
                                </td>
                                <td><span>{member.memberNickname}</span><br/><span>{member.memberId}</span></td>
                                <td>{member.role}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            <div className='teamsettings-team-footer'>
                <button className={`team-paging-prev ${currentPage === 1 ? '':'active'}`}
                        onClick={(event) => pagingHandler(event, 'prev')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="#979797"
                              d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                {
                    displayPage.map((page,idx)=> (
                        <span className={`team-paging-num ${displayPage.length===1?'':'active'} ${currentPage===page?'current':''}`} key={idx} onClick={()=>pageClickHandler(page)}>{page}</span>
                    ))
                }
                <button className={`team-paging-next ${displayPage.length===1||currentPage===endPage ? '':'active'}`}
                        onClick={(event) => pagingHandler(event, 'next')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="#979797"
                              d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Member;

