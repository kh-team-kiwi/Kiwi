import React, { createContext, useState } from 'react';

const TeamContext = createContext(null);

const TeamProvider = ({ children }) => {
    const [teams, setTeams] = useState([]);
    const [role, setRole] = useState(null);
    const [teamProfile, setTeamProfile] = useState('');
    const [headerRefresh, setHeaderRefresh] = useState(false);

    const joinTeam = (role) => {
        setRole(role);
    };

    const leaveTeam = () => {
        setRole(null);
    };

    const updateTeamProfile = (profile) => {
        setTeamProfile(profile);
    };

    const triggerHeaderRefresh = () => {
        setHeaderRefresh(prevState => !prevState);
    };

    return (
        <TeamContext.Provider value={{
            teams, setTeams, joinTeam, leaveTeam,
            role, setRole, teamProfile, updateTeamProfile,
            headerRefresh, triggerHeaderRefresh
        }}>
            {children}
        </TeamContext.Provider>
    );
};

export { TeamContext, TeamProvider };
