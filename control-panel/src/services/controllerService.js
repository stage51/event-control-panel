import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/controllers';

class ControllerService {
    getAllControllers(page, size, sort) {
        return axios.get(API_URL, {
            params: {
                page,
                size,
                sortBy: sort
            }
        });
    }

    getControllerById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    createController(controller) {
        return axios.post(API_URL, controller);
    }

    updateController(id, controller) {
        return axios.put(`${API_URL}/${id}`, controller);
    }

    deleteController(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
}

export default new ControllerService();

