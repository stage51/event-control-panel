import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import ControllerList from './components/ControllerList';
import ControllerForm from './components/ControllerForm';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import EventTypeList from './components/EventTypeList';
import EventTypeForm from './components/EventTypeForm';
import EventStatistics from './components/EventStatistics';
import ServerError from './utils/ServerError';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [showError, setShowError] = useState(false);

    const HomePage = () => {
        return (
            <Container className="my-5">
                <Card className="text-center">
                    <Card.Body>
                        <Card.Title as="h1">Добро пожаловать в систему управления событиями</Card.Title>
                        <Card.Text className="mt-4">
                            Используйте навигационную панель для доступа к различным разделам приложения.
                        </Card.Text>
                    </Card.Body>
                </Card>
    
                <Card className="warning-card text-center mt-4">
                    <Card.Body>
                        <Card.Title as="h3">Будьте внимательны!</Card.Title>
                        <Card.Text>
                            Удаление контроллеров и типов событий приведет к удалению всех событий, привязанных к ним.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    };

    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const response = await Promise.race([
                    fetch('http://localhost:8080/api/v1/health'),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 5000)
                    )
                ]);

                if (!response.ok) {
                    throw new Error('Server response not ok');
                }
            } catch (error) {
                setShowError(true);
            }
        };

        checkServerHealth();
    }, []);

    return (
        <Router>
            {showError && <ServerError />}
            <NavigationBar />
            <Sidebar />
            <div style={{ marginLeft: '200px', paddingTop: '56px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/controllers" element={<ControllerList />} />
                    <Route path="/add-controller" element={<ControllerForm />} />
                    <Route path="/edit-controller/:id" element={<ControllerForm />} />

                    <Route path="/events" element={<EventList />} />
                    <Route path="/add-event" element={<EventForm />} />
                    <Route path="/edit-event/:id" element={<EventForm />} />

                    <Route path="/event-types" element={<EventTypeList />} />
                    <Route path="/add-event-type" element={<EventTypeForm />} />
                    <Route path="/edit-event-type/:id" element={<EventTypeForm />} />
                    <Route path="/statistics" element={<EventStatistics />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
