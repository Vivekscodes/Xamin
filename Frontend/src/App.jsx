import React from 'react';
import Admin from './Pages/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Admin />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;