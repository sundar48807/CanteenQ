import React from 'react';
import { MenuItem } from '../types';

interface MenuManagementProps {
    menuItems: MenuItem[];
    onToggleAvailability: (itemId: string) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

const MenuManagement: React.FC<MenuManagementProps> = ({ menuItems, onToggleAvailability }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-dark mb-4">Menu Management</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {menuItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`text-sm font-bold ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                {item.isAvailable ? 'Live' : 'Over'}
                            </span>
                            <ToggleSwitch checked={item.isAvailable} onChange={() => onToggleAvailability(item.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManagement;