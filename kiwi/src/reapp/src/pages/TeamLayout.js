import React, {useEffect} from 'react';
import Header from "../components/common/Header";
import {Outlet, useNavigate, useParams} from "react-router-dom";

const TeamLayout = () => {

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default TeamLayout;