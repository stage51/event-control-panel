import React, { useState } from 'react';
import { Button, Link } from 'react-bootstrap';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { Nav } from 'react-bootstrap';
import authService from '../services/authService';

const Auth = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [token, setToken] = useState(null);

    const handleLoginSuccess = (token) => {
        setToken(token);
    };

    const handleLogout = async () => {
        try {
          await authService.logout();
          setToken(null);
        } catch (err) {
          console.error('Logout failed', err);
        }
    };

    return (
        <div className="app-container">
            <Nav className="flex-column p-3">
            {!token ? (
            <>
                <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-link" variant="link" onClick={() => setShowLogin(true)}>
                Войти в аккаунт
                </Nav.Link>
                <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-link" variant="link" onClick={() => setShowRegister(true)}>
                Регистрация
                </Nav.Link>
            </>
            ) : (
            <>
                <Nav.Link as={Button} className="justify-content-start d-flex text-white sidebar-link" variant="link" onClick={handleLogout}>
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