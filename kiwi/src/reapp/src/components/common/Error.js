import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Error() {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 경로를 가져옴, 기본값은 '알 수 없는 경로'
    const from = location.state?.from || '알 수 없는 경로';

    let errormessage = location.state?.msg || "알 수 없는 에러가 발생했습니다.";

    console.log(from);

    if(from !== "알 수 없는 경로"){
        errormessage=from+" 해당 페이지는 존재하지 않습니다."
    }
    else if(errormessage === "No message available") {
        errormessage = "알 수 없는 에러가 발생했습니다.";
    }

    const goBack = () => {
        navigate(-1, { replace: true });
    }

    return (
        <div className="ERROR">
            <h1>Error</h1>
            <div className="box">
                <p>
                    {errormessage}
                </p>
                <div className="btn_area">
                    <button className="btn btn_blue_h46 w_130"
                            onClick={goBack}>이전페이지</button>
                </div>
            </div>
        </div>
    );
}

export default Error;