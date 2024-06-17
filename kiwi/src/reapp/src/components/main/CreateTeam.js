// // CreateTeam 모달 컴포넌트
// import {useState} from "react";
//
//
// const CreateTeam = ({show, handleClose, handleSubmit, inputValue, setInputValue}) => {
//
//     // create team state
//     const [show, setShow] = useState(false);
//     const [inputValue, setInputValue] = useState('');
//
//     const handleShow = () => setShow(true);
//     const handleClose = () => setShow(false);
//
//     const handleSubmit = () => {
//         alert(`Submitted: ${inputValue}`);
//         setInputValue('');
//         handleClose();
//     };
//     // create team state
//
//     return (
//         <div className={`create-team-modal ${show ? 'create-team-display-block' : 'create-team-display-none'}`}>
//             <div className='create-team-modal-inner'>
//                 <div className="create-team-modal-main">
//                     <h2>Create Team</h2>
//                     <input
//                         type="text"
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         placeholder="Enter text"
//                     />
//                     <button onClick={handleSubmit}>Send</button>
//                     <button onClick={handleClose}>Close</button>
//                     <div><span className='main-create-team-duplicate'></span></div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default CreateTeam;