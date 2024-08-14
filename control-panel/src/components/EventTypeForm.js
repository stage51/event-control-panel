import React, { useState, useEffect } from 'react';
import EventTypeService from '../services/eventTypeService';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const EventTypeForm = () => {
    const [eventType, setEventType] = useState({ eventCode: '', comment: '' });
    const [error, setError] = useState({ code: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            loadEventType(id);
        }
    }, [id]);

    const loadEventType = (id) => {
        setLoading(true);
        EventTypeService.getEventTypeById(id)
            .then(response => setEventType(response.data))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error loading event type'
                });
            })
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventType(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const promise = id ? EventTypeService.updateEventType(id, eventType) : EventTypeService.createEventType(eventType);
        promise
            .then(() => navigate('/event-types'))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error saving event type'
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <Container>
            <h2>{id ? 'Редактировать тип события' : 'Добавить тип события'}</h2>
            <AlertMessage 
                variant="danger" 
                error={error} 
                show={!!error.message} 
                onClose={() => setError({ code: '', message: '' })} 
            />
            {loading && <p>Загрузка...</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mt-3' controlId="eventCode">
                    <Form.Label>Код события</Form.Label>
                    <Form.Control
                        type="text"
                        name="eventCode"
                        value={eventType.eventCode}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className='mt-3' controlId="comment">
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control
                        type="text"
                        name="comment"
                        value={eventType.comment}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Row className="mt-5">
                    <Col className="d-flex justify-content-start">
                        <Button variant="primary" type="submit" className="w-25 w-md-100">
                            {id ? 'Обновить' : 'Создать'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default EventTypeForm;
