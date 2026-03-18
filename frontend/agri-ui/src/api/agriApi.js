import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL
    || 'http://localhost:8000';

// Feature 1 - Soil Analysis
export const analyzeSoil = async (formData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/soil-analysis`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    } catch (error) {
        console.error('Soil analysis error:', error);
        throw error;
    }
};

// Feature 2 - Disease Detection
export const detectDisease = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await axios.post(
            `${BASE_URL}/api/disease-detection`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    } catch (error) {
        console.error('Disease detection error:', error);
        throw error;
    }
};