import { useState } from 'react';
import axios from 'axios';

export const useAdForm = (initialState) => {
    const [input, setInput] = useState(initialState);
    const [citySuggestions, setCitySuggestions] = useState([]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value) => {
        setInput((prev) => ({
            ...prev,
            type: value,
            file: value === 'SKILL' ? null : prev.file
        }));
    };

    const handleCityChange = async (e) => {
        const value = e.target.value;
        setInput((prev) => ({ ...prev, city: value }));

        if (value.length > 2) {
            try {
                const response = await axios.get(`https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,codesPostaux&limit=5`);
                setCitySuggestions(response.data);
            } catch (error) {
                console.error("Erreur API Géo", error);
                setCitySuggestions([]);
            }
        } else {
            setCitySuggestions([]);
        }
    };

    const selectCity = (cityName, zipCode) => {
        setInput((prev) => ({ ...prev, city: `${cityName} (${zipCode})` }));
        setCitySuggestions([]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setInput((prev) => ({
                ...prev,
                file: e.target.files[0],
            }));
        }
    };

    return {
        input,
        setInput,
        citySuggestions,
        changeEventHandler,
        handleTypeChange,
        handleCityChange,
        selectCity,
        handleFileChange
    };
};