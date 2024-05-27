import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/check");

        if(response.status === 200) {
          console.log('@check success : ', response.data);
        } else {
          console.log('@check failed');
        }
      } catch (err) {
        console.log('@check err : ', err);
      }
    };

    fetchData();
  }, []);

  return (
      <section className="App">
        <form className="loginForm">
          <label htmlFor="name">Username</label>
          <input type="text" className="name" id="name" placeholder="Enter your username"/>

          <label htmlFor="email">Email</label>
          <input type="text" className="email" id="email" placeholder="Enter your email"/>

          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" placeholder="Enter your password"/>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" className="confirmPassword" id="confirmPassword" placeholder="Confirm your password"/>

          <label htmlFor="phone">Phone Number</label>
          <input type="text" className="phone" id="phone" placeholder="Enter your phone number"/>

          <button onClick={registBtn}>계정 생성</button>
        </form>
      </section>
  );
}

const registBtn = async (event)=>{
  event.preventDefault(); // 폼 제출 시 기본 동작인 페이지 리로드를 막음

  // 회원가입 요청에 필요한 데이터 추출
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const phone = document.getElementById('phone').value;

  // 회원가입 요청 보내기
  try {
    const response = await axios.post('/api/auth/signUp', {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      phone: phone
    });

    // 회원가입 성공 시 처리
    console.log('회원가입 성공:', response.data);
    // 추가적으로 필요한 작업 수행
  } catch (error) {
    // 회원가입 실패 시 처리
    console.error('회원가입 실패:', error);
    // 추가적으로 필요한 작업 수행
  }
}

export default App;

