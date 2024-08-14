import React, { useState, useEffect } from 'react';
import ControllerService from '../services/controllerService';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ControllerForm = () => {
    const [controller, setController] = useState({ serialNumber: '', guid: '' });
    const [error, setError] = useState({ code: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            loadController(id);
        }
    }, [id]);

    const loadController = (id) => {
        setLoading(true);
        ControllerService.getControllerById(id)
            .then(response => setController(response.data))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error loading controller'
                });
            })
            .finally(() => setLoading(false));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setController(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const promise = id ? ControllerService.updateController(id, controller) : ControllerService.createController(controller);
        promise
            .then(() => navigate('/controllers'))
            .catch(err => {
                setError({
                    code: err.response?.data?.code || 'Unknown Error',
                    message: err.response?.data?.message || 'Error saving controller'
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <Container>
            <h2>{id ? 'Редактировать контроллер' : 'Добавить контроллер'}</h2>
            <AlertMessage 
                variant="danger" 
                error={error} 
                show={!!error.message} 
                onClose={() => setError({ code: '', message: '' })} 
            />
            {loading && <p>Загрузка...</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mt-3' controlId="serialNumber">
                    <Form.Label>Серийный номер</Form.Label>
                    <Form.Control
                        type="text"
                        name="serialNumber"
                        value={controller.serialNumber}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className='mt-3' controlId="guid">
                    <Form.Label>GUID</Form.Label>
                    <Form.Control
                        type="text"
                        name="guid"
                        value={controller.guid}
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

export default ControllerForm;
