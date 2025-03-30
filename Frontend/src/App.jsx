import React from 'react';
import Admin from './Pages/Admin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Student from './Pages/Student';
import AdminLogin from './Login/AdminLogin';
import Admin_first_page from './Pages/Admin_first_page';


const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AdminLogin />} />\
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/student" element={<Student />} />
                    <Route path="/admin_first_page" element={<Admin_first_page />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;