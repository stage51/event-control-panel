import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import authService from '../services/authService';

const RegisterModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают. Попробуйте еще раз.');
      return;
    }

    try {
      await authService.register(username, password);
      setSuccess('Регистрация успешна. Теперь вы можете войти.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      setError('Регистрация не удалась. Попробуйте еще раз.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Регистрация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <Form onSubmit={handleRegister}>
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
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Подтверждение пароля</Form.Label>
            <Form.Control
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Зарегистрироваться
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
