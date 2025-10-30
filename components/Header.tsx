
import React from 'react';

interface HeaderProps {
  currentView: 'customer' | 'canteen';
  setView: (view: 'customer' | 'canteen') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Canteen<span className="text-accent">Q</span>
        </h1>
        <div className="mt-4 sm:mt-0 bg-gray-200 rounded-full p-1 flex space-x-1">
          <button
            onClick={() => setView('customer')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              currentView === 'customer'
                ? 'bg-primary text-white shadow'
                : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            Customer View
          </button>
          <button
            onClick={() => setView('canteen')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              currentView === 'canteen'
                ? 'bg-primary text-white shadow'
                : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            Canteen View
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
