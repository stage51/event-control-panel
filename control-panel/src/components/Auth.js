import React, { useState, useEffect } from 'react';
import { Button, Nav } from 'react-bootstrap';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import authService from '../services/authService';
import './Sidebar.css';

const Auth = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            authService.setToken(savedToken);
        }
    }, []);

    const handleLoginSuccess = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
        authService.setToken(token);
        window.location.reload();
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            localStorage.removeItem('token');
            setToken(null);
            window.location.reload();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div className="app-container">
            <Nav className="flex-column p-3">
                {!token ? (
                    <>
                        <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-button" variant="link" onClick={() => setShowLogin(true)}>
                            Войти в аккаунт
                        </Nav.Link>
                        <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-button" variant="link" onClick={() => setShowRegister(true)}>
                            Регистрация
                        </Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-button" variant="link" onClick={handleLogout}>
                            Выйти
                        </Nav.Link>
                    </>
                )}
            </Nav>
            <LoginModal
                show={showLogin}
                handleClose={() => setShowLogin(false)}
                onLoginSuccess={handleLoginSuccess}
            />
            <RegisterModal
                show={showRegister}
                handleClose={() => setShowRegister(false)}
            />
        </div>
    );
};

export default Auth;
