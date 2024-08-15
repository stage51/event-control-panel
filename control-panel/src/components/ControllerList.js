import React, { useState, useEffect } from 'react';
import ControllerService from '../services/controllerService';
import { Button, Table, Container, Alert, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import './Pagination.css';

const ControllerList = () => {
    const [controllers, setControllers] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState('serialNumber,asc');
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadControllers();
    }, [page, size, sort]);

    const loadControllers = () => {
        setLoading(true);
        ControllerService.getAllControllers(page, size, sort)
            .then(response => {
                console.log('Full response:', response);

                if (response.data && response.data.content) {
                    setControllers(response.data.content);
                    setTotalPages(response.data.totalPages || 0);
                } else {
                    console.error('Unexpected data structure:', response.data);
                    setControllers([]);
                    setTotalPages(0);
                }
            })
            .catch(error => {
                console.error('Error fetching controllers:', error);
                setError('Ошибка при загрузке контроллеров. Попробуйте еще раз позже.');
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

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить элемент?')) {
            setLoading(true);
            ControllerService.deleteController(id)
                .then(() => {
                    loadControllers();
                })
                .catch(error => {
                    console.error('Error deleting controller:', error);
                    setError('Ошибка при удалении контроллера. Попробуйте еще раз позже.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const getSortIndicator = (field) => {
        const [currentField, currentOrder] = sort.split(',');
        if (currentField === field) {
            return currentOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Контроллеры</h2>
            <Link to="/add-controller">
                <Button variant="dark" className="mb-3">Добавить контроллер</Button>
            </Link>

            <AlertMessage
                variant="danger"
                message={error}
                show={!!error}
                onClose={() => setError('')}
            />

            {loading ? (
                <p>Загрузка контроллеров...</p>
            ) : (
                <>
                    <Table striped bordered hover className="text-center">
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('serialNumber')}>
                                    Серийный номер {getSortIndicator('serialNumber')}
                                </th>
                                <th onClick={() => handleSortChange('guid')}>
                                    GUID {getSortIndicator('guid')}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {controllers.length > 0 ? (
                                controllers.map(controller => (
                                    <tr key={controller.id}>
                                        <td>{controller.serialNumber}</td>
                                        <td>{controller.guid}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <Link to={`/edit-controller/${controller.id}`}>
                                                    <Button variant="dark" className="me-2">Редактировать</Button>
                                                </Link>
                                                <Button variant="danger" onClick={() => handleDelete(controller.id)}>Удалить</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Контроллеры не найдены</td>
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

export default ControllerList;
