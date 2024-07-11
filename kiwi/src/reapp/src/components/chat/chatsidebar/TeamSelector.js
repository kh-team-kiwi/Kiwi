import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamSelector = ({ onTeamSelect }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        axios.get('/api/team')
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    }, []);

    const handleTeamChange = (e) => {
        const team = e.target.value;
        setSelectedTeam(team);
        onTeamSelect(team);
    };

    return (
        <div>
            <h2>Select Team</h2>
            <select value={selectedTeam} onChange={handleTeamChange}>
                <option value="">Select a team</option>
                {teams.map((team) => (
                    <option key={team.team} value={team.team}>{team.teamName}</option>
                ))}
            </select>
        </div>
    );
};

export default TeamSelector;
