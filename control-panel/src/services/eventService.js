import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/events';

class EventService {
    getAllEvents(
        page, 
        size, 
        sort, 
        eventTypeComment,
        controllerSerialNumber,
        comment,
        controllerVehicleNumber, 
        startDate, endDate) {
        return axios.get(API_URL, {
            params: {
                page,
                size,
                sortBy: sort,
                eventTypeComment,
                controllerSerialNumber,
                comment,
                controllerVehicleNumber,
                startDate,
                endDate
            }
        });
    }

    getEventById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    createEvent(event) {
        return axios.post(API_URL, event);
    }

    updateEvent(id, event) {
        return axios.put(`${API_URL}/${id}`, event);
    }

    deleteEvent(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    statistic(startDate, endDate) {
        return axios.get(`${API_URL}/statistics`, {
            params: {
                startDate,
                endDate
            }
        })
    }
}

export default new EventService();
