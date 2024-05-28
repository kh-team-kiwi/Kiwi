import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileManagement from './components/FileManagement';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/message')
        .then(response => setMessage(response.data.text))
        .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
      <div>
        <div className="App">
          <header className="App-header">
            <FileManagement />
          </header>
        </div>
      </div>
  );
}

export default App;
