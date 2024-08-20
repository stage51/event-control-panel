import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/event-types';

class EventTypeService {
    getAllEventTypes(page, size, sort) {
        return axios.get(API_URL, {
            params: {
                page,
                size,
                sortBy: sort
            }
        });
    }

    getEventTypeById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    createEventType(eventType) {
        return axios.post(API_URL, eventType);
    }

    updateEventType(id, eventType) {
        return axios.put(`${API_URL}/${id}`, eventType);
    }

    deleteEventType(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    generateEventTypes(){
        return axios.get(`${API_URL}/generate`)
    }
}
export default new EventTypeService();
