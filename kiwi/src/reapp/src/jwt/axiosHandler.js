import axios from 'axios';
import {removeLocalItem, removeSessionItem, setLocalItem} from "./storage";
import {useNavigate} from "react-router-dom";

const navigate = useNavigate();

// Axios 인스턴스 생성
const axiosHandler = axios.create({
    withCredentials: true
});

// 요청 인터셉터 추가
axiosHandler.interceptors.request.use(
    config => {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            accessToken = accessToken.replace(/"/g, '');
        }
        const jwt = `Bearer ${accessToken}`;
        console.log("axiosHandler.interceptors.request : "+jwt);
        if (jwt) {
            // 요청을 보내기 전에 Authorization 헤더에 토큰 추가
            config.headers.Authorization = jwt;
        }
        return config;
    },
    error => {
        // 요청 오류가 있는 경우
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
axiosHandler.interceptors.response.use(
    response => {
        // 응답 데이터 가공 등 작업
        return response;
    },
    error => {

        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {

            axios.post('/api/auth/reissue', { withCredentials: true })
                .then(response => {

                    const accessToken = response.headers['access'];
                    console.log("axiosHandler.interceptors.response : "+ accessToken);

                    if (accessToken) {
                        // Access Token을 로컬 스토리지에 저장
                        setLocalItem('accessToken', accessToken);
                    } else {
                        console.error('Access Token not found in response headers')
                        alert("서버와 통신에서 에러가 발생했습니다. 다시 로그인해 주세요.");
                        removeLocalItem("accessToken");
                        removeSessionItem("profile");
                        navigate('/');
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        console.error('Refresh Token is invalid')
                        alert("토큰이 만료 되었습니다. 다시 로그인해 주세요.");
                        removeLocalItem("accessToken");
                        removeSessionItem("profile");
                        navigate('/');
                    }
                });
        }


        return Promise.reject(error);
    }
);

export default axiosHandler;
