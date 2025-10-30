import React from 'react';
import { MenuItem } from '../types';

interface CustomerMenuProps {
    menuItems: MenuItem[];
}

const MenuSection: React.FC<{ title: string; items: MenuItem[] }> = ({ title, items }) => (
    <div>
        <h3 className="text-2xl font-bold text-dark border-b-2 border-primary pb-2 mb-4">{title}</h3>
        <ul className="space-y-3">
            {items.map(item => (
                <li key={item.id} className="flex justify-between items-center">
                    <div>
                        <span className={`text-lg ${item.isAvailable ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`text-lg font-semibold ${item.isAvailable ? 'text-primary' : 'text-gray-400'}`}>{item.price}</span>
                        {item.isAvailable ? (
                            <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">Live</span>
                        ) : (
                            <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded-full">Over</span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const CustomerMenu: React.FC<CustomerMenuProps> = ({ menuItems }) => {
    const categories = ['Sandwiches', 'Salads', 'Pizza', 'Beverages'];
    const categorizedItems = categories.reduce((acc, category) => {
        acc[category] = menuItems.filter(item => item.category === category);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-dark mb-8 text-center">Our Menu</h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {categories.map(category => (
                    categorizedItems[category].length > 0 && <MenuSection key={category} title={category} items={categorizedItems[category]} />
                ))}
            </div>
        </div>
    );
};

export default CustomerMenu;