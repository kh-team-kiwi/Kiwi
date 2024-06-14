import axios from 'axios';

// Axios 인스턴스 생성
const axiosHandler = axios.create({
    baseURL: 'https://localhost:8080'
});

// 요청 인터셉터 추가
axiosHandler.interceptors.request.use(
    config => {
        // 요청을 보내기 전에 토큰 추가
        config.headers.Authorization = `Bearer token`;
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
        // 응답 오류가 있는 경우
        console.error('Error:', error.response ? error.response.data : 'Unknown error');
        return Promise.reject(error);
    }
);

export default axiosHandler;
