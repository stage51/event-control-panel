import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" className="fixed-top">
            <div className='ms-4 p-1'>
                <Navbar.Brand as={Link} to="/">Панель событий</Navbar.Brand>
            </div>
        </Navbar>
    );
};

export default NavigationBar;
