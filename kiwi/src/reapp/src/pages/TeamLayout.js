import React, {useEffect} from 'react';
import Header from "../components/common/Header";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";

const TeamLayout = () => {

    const navigate = useNavigate();
    const { teamno } = useParams();
    const location = useLocation();

    useEffect(() => {
        // Check if the current path is exactly the team path without any subpath
        if (location.pathname === `/team/${teamno}`) {
            navigate(`/team/${teamno}/calendar`, { replace: true });
        }
    }, []);

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default TeamLayout;