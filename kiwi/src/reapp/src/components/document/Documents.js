import React, { useState } from 'react';
// import Header from './src/components/Header';
import Header from '../common/Header';
import Sidebar from './src/components/Sidebar';
import Footer from './src/components/Footer';
import DocumentList from './src/components/DocumentList';
import NewDocument from './src/components/NewDocument';
import './src/css/documents.css';


const Documents = () => {
    const [view, setView] = useState('documentList');

    const handleMenuClick = (view) => {
        setView(view);
    };

    return (
        <div className="appContainer">
            <Header />
            <div className="bodyContainer">
                <Sidebar handleMenuClick={handleMenuClick} />
                <div className="mainContent">
                    {view === 'documentList' && <DocumentList />}
                    {view === 'newDocument' && <NewDocument />}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Documents;

