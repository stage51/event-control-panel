import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-dark text-white vh-100" style={{ width: '200px', position: 'fixed', top: 0, left: 0, paddingTop: '56px' }}>
            <Nav className="flex-column p-3">
                <Nav.Link as={Link} to="/controllers" className="text-white">Контроллеры</Nav.Link>
                <Nav.Link as={Link} to="/events" className="text-white">События</Nav.Link>
                <Nav.Link as={Link} to="/event-types" className="text-white">Типы событий</Nav.Link>
                <Nav.Link as={Link} to="/statistics" className="text-white">Статистика</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
