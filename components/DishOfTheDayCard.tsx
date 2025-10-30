import React from 'react';
import { Dish } from '../types';

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const DishOfTheDayCard: React.FC<{ dish: Dish }> = ({ dish }) => {
    return (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl border-2 border-primary shadow-lg text-center">
            <div className="flex items-center justify-center mb-3">
                <StarIcon />
                <h3 className="text-xl font-bold text-primary ml-2">Today's Special</h3>
            </div>
            <h4 className="text-2xl font-extrabold text-dark tracking-tight">{dish.name}</h4>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">{dish.description}</p>
        </div>
    );
};

export default DishOfTheDayCard;