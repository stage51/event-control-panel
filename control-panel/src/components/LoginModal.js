import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import authService from '../services/authService';

const LoginModal = ({ show, handleClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(username, password);
      const token = response.data.token;
      authService.setToken(token);
      onLoginSuccess(token);
      handleClose();
    } catch (err) {
      setError('Неправильное имя пользователя или пароль.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Вход в аккаунт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя (на английском, без пробелов)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Войти
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
