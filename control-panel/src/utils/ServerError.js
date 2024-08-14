import React from 'react';
import { Card } from 'react-bootstrap';
import './ServerError.css';

const ServerError = () => {
    return (
        <div className="overlay">
            <Card className="warning-card text-center">
                <Card.Body>
                    <Card.Title as="h3">Ошибка сервера</Card.Title>
                    <Card.Text>
                        Сервер не отвечает на запрос о его состоянии. Пожалуйста, попробуйте позднее.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ServerError;
