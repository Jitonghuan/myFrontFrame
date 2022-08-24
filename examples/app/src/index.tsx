import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import KeepAliveLayout, { useKeepOutlets, KeepAliveContext } from '@myfrontframe/keepalive';
import Layout from './layouts/index';
import Hello from './pages/home';
import Users from './pages/users';


const App = () => {
    return (
        <KeepAliveLayout keepalive={[/./]}>
        <HashRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route path="/" element={<Hello />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
        </HashRouter>
        </KeepAliveLayout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('myfrontframe'));
root.render(React.createElement(App));
