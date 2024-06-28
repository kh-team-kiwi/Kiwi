import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Confetti from 'react-confetti';
import '../../styles/components/common/CongratulationsPopup.css';

const Popup = ({ isOpen, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [numPieces, setNumPieces] = useState(10);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setNumPieces(50);  // Start with 200 pieces for the shooting effect
      setTimeout(() => setNumPieces(0), 2000); // Stop the confetti after 0.5 seconds
      setTimeout(() => setShowConfetti(false), 4000); // Remove the confetti component after 3 seconds
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="congrats-popup-overlay">
      <div className="congrats-popup-content">
        {showConfetti && (
          <Confetti
            numberOfPieces={numPieces}
            gravity={0.35}
            wind={0.00}
            width={540}
            height={600}
          />
        )}
        <h2>Popup Title</h2>
        <p>This is the content of the popup window.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
