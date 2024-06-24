// import React from 'react';
// import '../../styles/components/documents/ErrorBoundary.css';
//
// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false };
//     }
//
//     static getDerivedStateFromError(error) {
//         // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
//         return { hasError: true };
//     }
//
//     componentDidCatch(error, errorInfo) {
//         // 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
//         console.log("Error caught by ErrorBoundary: ", error, errorInfo);
//     }
//
//     render() {
//         if (this.state.hasError) {
//             // 폴백 UI를 커스터마이징할 수 있습니다.
//             return <h1>문서 정보를 불러오는 중 오류가 발생했습니다.</h1>;
//         }
//
//         return this.props.children;
//     }
// }
//
// export default ErrorBoundary;
