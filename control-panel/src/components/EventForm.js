import React, { useState, useEffect } from 'react';
import EventService from '../services/eventService';
import ControllerService from '../services/controllerService';
import EventTypeService from '../services/eventTypeService';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const EventForm = () => {
    const [event, setEvent] = useState({
        eventType: '',
        controller: '',
        eventTime: '',
        comment: ''
    });
    const [eventTypes, setEventTypes] = useState([]);
    const [controllers, setControllers] = useState([]);
    const [error, setError] = useState({ code: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            loadEvent(id);
        }
        loadEventTypes();
        loadControllers();
    }, [id]);

    const loadEvent = (id) => {
        setLoading(true);
        EventService.getEventById(id)
            .then(response => {
                const eventData = response.data;
                setEvent({
                    eventType: eventData.eventType.id,
                    controller: eventData.controller.guid,
                    eventTime: formatDateTime(eventData.eventTime),
                    comment: eventData.comment
                });
            })
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error loading event'
                });
            })
            .finally(() => setLoading(false));
    };

    const loadEventTypes = () => {
        EventTypeService.getAllEventTypes(0, 100, '')
            .then(response => setEventTypes(response.data.content))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error loading event types'
                });
            });
    };

    const loadControllers = () => {
        ControllerService.getAllControllers(0, 100, '')
            .then(response => setControllers(response.data.content))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error loading controllers'
                });
            });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            eventType: event.eventType,
            controller: event.controller,
            eventTime: formatToServerDateTime(event.eventTime),
            comment: event.comment
        };

        const promise = id ? EventService.updateEvent(id, payload) : EventService.createEvent(payload);
        promise
            .then(() => navigate('/events'))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error saving event'
                });
            })
            .finally(() => setLoading(false));
    };

    const formatToServerDateTime = (dateTime) => {
        if (!dateTime) return '';
        return dateTime.replace('T', ' ');
    };

    return (
        <Container>
            <h2>{id ? 'Редактировать событие' : 'Добавить событие'}</h2>
            <AlertMessage 
                variant="danger" 
                error={error} 
                show={!!error.message} 
                onClose={() => setError({ code: '', message: '' })} 
            />
            {loading && <p>Загрузка...</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="eventType" className='mt-3'>
                    <Form.Label>Тип события</Form.Label>
                    <Form.Control
                        as="select"
                        name="eventType"
                        value={event.eventType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите тип события</option>
                        {eventTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.eventCode} - {type.comment}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="controller" className='mt-3'>
                    <Form.Label>Контроллер</Form.Label>
                    <Form.Control
                        as="select"
                        name="controller"
                        value={event.controller}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите контроллер</option>
                        {controllers.map(controller => (
                            <option key={controller.guid} value={controller.guid}>
                                {controller.serialNumber} - {controller.guid}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="eventTime" className='mt-3'>
                    <Form.Label>Время события</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="eventTime"
                        value={event.eventTime.replace(' ', 'T')}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="comment" className='mt-3'>
                    <Form.Label>Комментарий</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="comment"
                        value={event.comment}
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

export default EventForm;
