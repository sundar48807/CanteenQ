import React, { useState } from 'react';

interface BookingFormProps {
    onBookToken: (name: string, phone: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookToken }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            setError('Please enter both your name and phone number.');
            return;
        }
        if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onBookToken(name, phone);
        } catch (error) {
            setError('Failed to book token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold text-dark mb-4 text-center">Get Your Token</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md mx-auto">
                Enter your details to join the queue. We'll track your order status live.
            </p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Your Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary transition-transform transform hover:scale-105 duration-300 ease-in-out"
                >
                    Join Queue
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
