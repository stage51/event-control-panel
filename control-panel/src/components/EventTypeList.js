import React, { useState, useEffect } from 'react';
import EventTypeService from '../services/eventTypeService';
import { Button, Table, Container, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import './Pagination.css';

const EventTypeList = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState('eventCode,asc');
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEventTypes();
    }, [page, size, sort]);

    const loadEventTypes = () => {
        setLoading(true);
        EventTypeService.getAllEventTypes(page, size, sort)
            .then(response => {
                console.log('Full response:', response);

                if (response.data && Array.isArray(response.data.content)) {
                    setEventTypes(response.data.content);
                    setTotalPages(response.data.totalPages || 0);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    setEventTypes([]);
                    setTotalPages(0);
                }
            })
            .catch(error => {
                console.error('Error fetching event types:', error);
                setError('Ошибка при загрузке типов событий. Попробуйте еще раз позже.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSizeChange = (e) => {
        setSize(Number(e.target.value));
        setPage(0);
    };

    const handleSortChange = (field) => {
        setSort(prevSort => {
            const [currentField, currentOrder] = prevSort.split(',');
            const newOrder = (currentField === field && currentOrder === 'asc') ? 'desc' : 'asc';
            return `${field},${newOrder}`;
        });
    };

    const getSortIndicator = (field) => {
        const [currentField, currentOrder] = sort.split(',');
        if (currentField === field) {
            return currentOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const handleDelete = (id) => {
        EventTypeService.deleteEventType(id)
            .then(() => {
                loadEventTypes();
            })
            .catch(error => {
                console.error('Error deleting event type:', error);
                setError('Ошибка при удалении типа события. Попробуйте еще раз позже.');
            });
    };
    const handleGenerate = () => {
        EventTypeService.generateEventTypes()
        .then(() => {
            loadEventTypes();
        }
        );
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Типы событий</h2>
            <Link to="/add-event-type">
                <Button variant="dark" className="mb-3">Добавить тип события</Button>
            </Link>
            <Button onClick={() => handleGenerate()} variant="dark" className="ms-3 mb-3">Сгенерировать стандартные события </Button>
            <AlertMessage
                variant="danger"
                message={error}
                show={!!error}
                onClose={() => setError('')}
            />

            {loading ? (
                <p>Загрузка типов событий...</p>
            ) : (
                <>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('eventCode')}>
                                    Код события {getSortIndicator('eventCode')}
                                </th>
                                <th onClick={() => handleSortChange('comment')}>
                                    Комментарий {getSortIndicator('comment')}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(eventTypes) && eventTypes.length > 0 ? (
                                eventTypes.map(eventType => (
                                    <tr key={eventType.id}>
                                        <td>{eventType.eventCode}</td>
                                        <td>{eventType.comment}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <Link to={`/edit-event-type/${eventType.id}`}>
                                                    <Button variant="dark" className="me-2">Редактировать</Button>
                                                </Link>
                                                <Button variant="danger" onClick={() => handleDelete(eventType.id)}>Удалить</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Типы событий не найдены</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center">
                        <label>
                            Размер страницы:
                            <select value={size} onChange={handleSizeChange} className="form-select">
                                <option value={1}>1</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </label>
                        <Pagination className="justify-content-center dark-pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    active={i === page}
                                    className="dark-pagination-item"
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
};

export default EventTypeList;
