import React, { useState } from 'react';
import { Dish } from '../types';
import { generateDishOfTheDay } from '../services/geminiService';

interface DishOfTheDayGeneratorProps {
    currentDish: Dish | null;
    onUpdateDish: (dish: Dish) => void;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3 13a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 01-1-1zm12-2a1 1 0 01-1 1h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 112 0v1h1a1 1 0 011 1zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const DishOfTheDayGenerator: React.FC<DishOfTheDayGeneratorProps> = ({ currentDish, onUpdateDish }) => {
    const [keywords, setKeywords] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError('Please enter some keywords to generate a dish.');
            return;
        }
        setIsLoading(true);
        setError('');
        const newDish = await generateDishOfTheDay(keywords);
        setIsLoading(false);
        if (newDish) {
            onUpdateDish(newDish);
        } else {
            setError('Could not generate a dish. Please try again.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-dark mb-4">Today's Special Generator</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => { setKeywords(e.target.value); setError(''); }}
                    placeholder="e.g., spicy, chicken, noodles"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-accent text-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SparklesIcon/>
                    {isLoading ? 'Generating...' : 'Generate Special'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            {currentDish && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-sm font-semibold text-gray-500">Current Special:</p>
                    <p className="text-lg font-bold text-primary">{currentDish.name}</p>
                    <p className="text-gray-700">{currentDish.description}</p>
                </div>
            )}
        </div>
    );
};

export default DishOfTheDayGenerator;