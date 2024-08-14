import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EventService from '../services/eventService';

const EventStatistics = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('2024-01-01T00:00');
    const [endDate, setEndDate] = useState('2024-01-31T23:59');
    const [loading, setLoading] = useState(false);

    const fetchStatistics = () => {
        setLoading(true);
        EventService.statistic(startDate, endDate)
            .then(response => {
                const formattedData = formatData(response.data);
                setData(formattedData);
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formatData = (events) => {
        const countByDate = events.reduce((acc, event) => {
            const date = event.eventTime.split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});

        return Object.keys(countByDate).map(date => ({
            date,
            count: countByDate[date]
        }));
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSearch = () => {
        fetchStatistics();
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Статистика</h2>
            <Card>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={400} className="mt-4">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                    <Form>
                        <Form.Group controlId="startDate">
                            <Form.Label>Начальная дата</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="endDate" className="mt-2">
                            <Form.Label>Конечная дата</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-3" onClick={handleSearch} disabled={loading}>
                            {loading ? 'Загрузка...' : 'Обновить'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EventStatistics;
