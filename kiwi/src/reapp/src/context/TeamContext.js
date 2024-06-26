import React, { createContext, useState, useEffect } from 'react';
import {setSessionItem} from "../jwt/storage";

// 컨텍스트 생성
const TeamContext = createContext(null);

// 프로바이더 컴포넌트
const TeamProvider = ({ children }) => {

    const [teams,setTeams] = useState([]);

    const [role, setRole] = useState(null);

    const joinTeam = (role) => {
        setRole(role);
    }

    const leaveTeam = () => {
        setRole(null);
    }


    return (
        <TeamContext.Provider value={{ teams, setTeams, joinTeam, leaveTeam, role}}>
            {children}
        </TeamContext.Provider>
    );
};

export { TeamContext, TeamProvider };
