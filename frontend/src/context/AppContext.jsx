import React, { createContext, useState } from 'react';
import axios from 'axios';



const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

    const API_BASE_URL = 'http://localhost:5000';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [generatedPaper, setGeneratedPaper] = useState(null);

    const handleError = (error) => {
        setError(error.response?.data?.error || error.message || 'An error occurred');
        setLoading(false);
    };

    const uploadFile = async (file) => {
        try {
            setLoading(true);
            setError(null);
    
            const formData = new FormData();
            formData.append('file', file);
    
            const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // console.log("Upload response:", response);
            setLoading(false);
            return response.data || {}; 
        } catch (error) {
            handleError(error);
            throw error;
        }
    };
    

    const generatePaper = async (config) => {
        try {
            setLoading(true);
            setError(null);
    
            const response = await axios.post(`${API_BASE_URL}/api/generate`, config);
            // console.log("Generate Paper Response Data:", response.data); 
    
            setGeneratedPaper(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            handleError(error);
            console.error("Error generating paper:", error); 
            throw error;
        }
    };
    
    
    const getSubjects = async () => {
        try {
            setLoading(true);
            setError(null);
    
            const response = await axios.get(`${API_BASE_URL}/api/generate/subjects`);
    
            // console.log("Full API Response:", response.data);
    
            if (!response.data || !Array.isArray(response.data.subjects)) {
                throw new Error("Invalid API response format");
            }
    
            setSubjects(response.data.subjects);
            setLoading(false);
            return response.data.subjects;
        } catch (error) {
            handleError(error);
            throw error;
        }
    };
    

    const clearError = () => setError(null);
    const clearGeneratedPaper = () => setGeneratedPaper(null);

    const value = {
        // State
        loading,
        error,
        subjects,
        generatedPaper,

        // API Actions
        uploadFile,
        generatePaper,
        getSubjects,

        // Utility Actions
        clearError,
        clearGeneratedPaper
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


export default AppContext;