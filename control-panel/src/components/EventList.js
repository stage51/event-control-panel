import React, { useState, useEffect } from 'react';
import EventService from '../services/eventService';
import { Table, Button, Container, Pagination, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import './Pagination.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState('eventTime,desc');
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldSearch, setShouldSearch] = useState(true);

    useEffect(() => {
        loadEvents();
        if (shouldSearch) {
            setShouldSearch(false);
        }
    }, [page, size, sort, shouldSearch]);

    const loadEvents = () => {
        setLoading(true);
        EventService.getAllEvents(page, size, sort, searchTerm)
            .then(response => {
                console.log('Full response:', response);
                if (response.data && Array.isArray(response.data.content)) {
                    setEvents(response.data.content);
                    setTotalPages(response.data.totalPages || 0);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    setEvents([]);
                    setTotalPages(0);
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setError('Ошибка при загрузке событий. Попробуйте еще раз позже.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteEvent = (id) => {
        EventService.deleteEvent(id)
            .then(() => {
                loadEvents();
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                setError('Ошибка при удалении события. Попробуйте еще раз позже.');
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        setPage(0);
        setShouldSearch(true);
    };

    const handleClearClick = () => {
        setSearchTerm('');
        setPage(0);
        setShouldSearch(true);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">События</h2>
            <div className="d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="Поиск по событиям"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button variant="dark" onClick={handleSearchClick} className="ms-2">Найти</Button>
                <Button variant="secondary" onClick={handleClearClick} className="ms-2">Очистить</Button>
            </div>
            <Link to="/add-event">
                <Button variant="dark" className="mb-3">Добавить событие</Button>
            </Link>

            <AlertMessage
                variant="danger"
                error={{ message: error }}
                show={!!error}
                onClose={() => setError('')}
            />

            {loading ? (
                <p>Загрузка событий...</p>
            ) : (
                <>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('eventType.eventCode')}>
                                    Тип события (Код) {getSortIndicator('eventType.eventCode')}
                                </th>
                                <th onClick={() => handleSortChange('eventType.comment')}>
                                    Тип события (Комментарий) {getSortIndicator('eventType.comment')}
                                </th>
                                <th onClick={() => handleSortChange('controller.guid')}>
                                    Контроллер (GUID) {getSortIndicator('controller.guid')}
                                </th>
                                <th onClick={() => handleSortChange('controller.serialNumber')}>
                                    Контроллер (Серийный номер) {getSortIndicator('controller.serialNumber')}
                                </th>
                                <th onClick={() => handleSortChange('eventTime')}>
                                    Время события {getSortIndicator('eventTime')}
                                </th>
                                <th onClick={() => handleSortChange('serverTime')}>
                                    Время сервера {getSortIndicator('serverTime')}
                                </th>
                                <th onClick={() => handleSortChange('comment')}>
                                    Комментарий {getSortIndicator('comment')}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? (
                                events.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.eventType.eventCode}</td>
                                        <td>{event.eventType.comment}</td>
                                        <td>{event.controller.guid}</td>
                                        <td>{event.controller.serialNumber}</td>
                                        <td>{new Date(event.eventTime).toLocaleString()}</td>
                                        <td>{new Date(event.serverTime).toLocaleString()}</td>
                                        <td>{event.comment}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <Link to={`/edit-event/${event.id}`}>
                                                    <Button variant="dark" className="me-2">Редактировать</Button>
                                                </Link>
                                                <Button variant="danger" onClick={() => deleteEvent(event.id)}>Удалить</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">События не найдены</td>
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

export default EventList;
