import React from 'react';
import Admin from './Pages/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Student from './Pages/Student';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Admin />} />
					<Route path="/student" element={<Student />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;