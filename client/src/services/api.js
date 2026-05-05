import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Student endpoints
export const studentAPI = {
    register: (data) => api.post('/student', data),
    getById: (id) => api.get(`/student/${id}`),
    getAll: (params) => api.get('/student', { params }),
    update: (id, data) => api.put(`/student/${id}`, data),
    delete: (id) => api.delete(`/student/${id}`),
    regenerateToken: (id) => api.post(`/student/${id}/token`)
};

// Dashboard endpoints
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getExpiringWorkouts: () => api.get('/dashboard/expiring-workouts'),
    getCharts: () => api.get('/dashboard/charts')
};

// AI endpoints
export const aiAPI = {
    generate: (student_id) => api.post('/ai/generate', { student_id }),
    getSuggestion: (id) => api.get(`/ai/suggestion/${id}`)
};

// Trainer endpoints
export const trainerAPI = {
    getSuggestions: () => api.get('/trainer/suggestions'),
    approve: (suggestionId, data) => api.post(`/trainer/approve/${suggestionId}`, data),
    getWorkouts: () => api.get('/trainer/workouts'),
    getWorkoutById: (id) => api.get(`/trainer/workout/${id}`),
    deleteWorkout: (id) => api.delete(`/trainer/workout/${id}`),
    updateWorkout: (id, data) => api.put(`/trainer/workout/${id}`, data),
    getPDF: (workoutId) => `/api/trainer/pdf/${workoutId}`,
    createManual: (data) => api.post('/trainer/workout/manual', data)
};

// Exercise endpoints
export const exerciseAPI = {
    getAll: (params) => api.get('/exercises', { params }),
    getById: (id) => api.get(`/exercises/${id}`),
    create: (data) => api.post('/exercises', data),
    update: (id, data) => api.put(`/exercises/${id}`, data),
    delete: (id) => api.delete(`/exercises/${id}`),
    uploadImage: (formData) => api.post('/exercises/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

// Financial endpoints
export const financialAPI = {
    create: (data) => api.post('/financial', data),
    list: (params) => api.get('/financial', { params }),
    updateStatus: (id, data) => api.put(`/financial/${id}`, data),
    getStats: () => api.get('/financial/stats')
};

// Check-in endpoints
export const checkinAPI = {
    doCheckIn: (data) => api.post('/checkin', data),
    list: (params) => api.get('/checkin', { params }),
    getToday: () => api.get('/checkin/today')
};

// Reference endpoints (Muscle Groups & Equipment)
export const referenceAPI = {
    getMuscleGroups: (includeInactive = false) => api.get(`/reference/musclegroups?includeInactive=${includeInactive}`),
    createMuscleGroup: (data) => api.post('/reference/musclegroups', data),
    toggleMuscleGroup: (id, active) => api.put(`/reference/musclegroups/${id}/status`, { active }),

    getEquipment: (includeInactive = false) => api.get(`/reference/equipment?includeInactive=${includeInactive}`),
    createEquipment: (data) => api.post('/reference/equipment', data),
    toggleEquipment: (id, active) => api.put(`/reference/equipment/${id}/status`, { active })
};

// Student Area endpoints
export const studentAreaAPI = {
    loginPublic: (email) => api.post('/student-area/login-public', { email }),
    getByToken: (token) => api.get(`/student-area/by-token/${token}`),

    getWorkout: (studentId) => api.get(`/student-area/${studentId}/workout`),
    logExercise: (data) => api.post('/student-area/log', data),
    finishSession: (data) => api.post('/student-area/finish-session', data),
    sendMessage: (data) => api.post('/student-area/message', data),
    getEvolution: (studentId) => api.get(`/student-area/evolution/${studentId}`),
    getPublications: (studentId) => api.get(`/publications/student/${studentId}`)
};

export const standardWorkoutAPI = {
    getAll: (params) => api.get('/standard-workouts', { params }),
    getById: (id) => api.get(`/standard-workouts/${id}`),
    create: (data) => api.post('/standard-workouts', data),
    update: (id, data) => api.put(`/standard-workouts/${id}`, data),
    delete: (id) => api.delete(`/standard-workouts/${id}`)
};

export default api;
