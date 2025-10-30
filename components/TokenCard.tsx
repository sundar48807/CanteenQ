import React, { useState } from 'react';
import { Token, TokenStatus } from '../types';
import { generateNotificationMessage } from '../services/geminiService';

interface TokenCardProps {
  token: Token;
  updateTokenStatus: (tokenId: number, newStatus: TokenStatus) => void;
}

const WhatsAppIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.28 13.72a.5.5 0 01-.71 0l-2-2a.5.5 0 01.71-.71L8 12.29l3.29-3.29a.5.5 0 01.71.71l-3.5 3.5a.5.5 0 01-.22.21z" /></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);


const NotificationModal: React.FC<{ title: string; content: string; isLoading: boolean; onConfirm: () => void; onClose: () => void }> = ({ title, content, isLoading, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {isLoading ? <div className="animate-pulse h-24 bg-gray-200 rounded-md"></div> : <p className="text-gray-700 bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{content}</p>}
            <div className="flex justify-end mt-6 space-x-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    {isLoading ? 'Generating...' : 'Send (Simulated)'}
                </button>
            </div>
        </div>
    </div>
);

const TokenCard: React.FC<TokenCardProps> = ({ token, updateTokenStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'whatsapp' | 'call' | null>(null);
    const [notificationContent, setNotificationContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleNotify = async (type: 'whatsapp' | 'call') => {
        setModalType(type);
        setIsModalOpen(true);
        setIsLoading(true);
        const message = await generateNotificationMessage(token, type);
        setNotificationContent(message);
        setIsLoading(false);
    };
    
    const confirmNotification = () => {
        alert(`Notification sent to ${token.customerName} via ${modalType}!`);
        closeModal();
    }
    
    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        setNotificationContent('');
    };

    const timeSinceBooking = Math.round((new Date().getTime() - token.bookingTime.getTime()) / 60000);

    const cardBorderColor = {
        [TokenStatus.WAITING]: 'border-blue-500',
        [TokenStatus.PREPARING]: 'border-yellow-500',
        [TokenStatus.READY]: 'border-green-500',
        [TokenStatus.COMPLETED]: 'border-gray-400',
    }[token.status];

    return (
        <>
            <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${cardBorderColor} transition-transform transform hover:scale-105 duration-200`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-xl text-primary">Token #{token.id}</p>
                        <p className="text-lg text-dark flex items-center"><UserIcon/>{token.customerName}</p>
                        <p className="text-sm text-gray-500">{token.phoneNumber}</p>
                    </div>
                    <p className="text-xs text-gray-400">{timeSinceBooking} min ago</p>
                </div>

                {token.status !== TokenStatus.COMPLETED && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                        {token.status === TokenStatus.WAITING && (
                             <button onClick={() => updateTokenStatus(token.id, TokenStatus.PREPARING)} className="flex-1 text-sm bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 font-semibold flex items-center justify-center">
                                Start Preparing
                            </button>
                        )}
                        {token.status === TokenStatus.PREPARING && (
                            <button onClick={() => updateTokenStatus(token.id, TokenStatus.READY)} className="flex-1 text-sm bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 font-semibold flex items-center justify-center">
                                <CheckIcon /> Mark Ready
                            </button>
                        )}
                        {token.status === TokenStatus.READY && (
                            <>
                                <button onClick={() => handleNotify('whatsapp')} className="flex-1 text-sm bg-teal-500 text-white px-3 py-2 rounded-md hover:bg-teal-600 font-semibold flex items-center justify-center">
                                    <WhatsAppIcon /> WhatsApp
                                </button>
                                <button onClick={() => handleNotify('call')} className="flex-1 text-sm bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 font-semibold flex items-center justify-center">
                                    <PhoneIcon /> Call
                                </button>
                                <button onClick={() => updateTokenStatus(token.id, TokenStatus.COMPLETED)} className="w-full mt-2 text-sm bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 font-semibold flex items-center justify-center">
                                    Mark Completed
                                </button>
                            </>
                        )}
                    </div>
                )}
                 {token.status === TokenStatus.COMPLETED && (
                     <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                        <p className="text-sm font-semibold text-gray-500">Order Collected</p>
                     </div>
                 )}
            </div>
            {isModalOpen && modalType && (
                 <NotificationModal 
                    title={`AI Generated ${modalType === 'whatsapp' ? 'WhatsApp Message' : 'Call Script'}`}
                    content={notificationContent}
                    isLoading={isLoading}
                    onConfirm={confirmNotification}
                    onClose={closeModal}
                 />
            )}
        </>
    );
};

export default TokenCard;
