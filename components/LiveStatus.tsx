import React from 'react';
import { Token, TokenStatus } from '../types';

interface LiveStatusProps {
  token: Token;
  allTokens: Token[];
  onCompleteAndReset: () => void;
}

const statusConfig = {
    [TokenStatus.WAITING]: { text: "In Queue", color: "bg-blue-100 text-blue-800", icon: "🕒" },
    [TokenStatus.PREPARING]: { text: "Preparing", color: "bg-yellow-100 text-yellow-800", icon: "🍳" },
    [TokenStatus.READY]: { text: "Ready for Pickup", color: "bg-green-100 text-green-800", icon: "✅" },
    [TokenStatus.COMPLETED]: { text: "Completed", color: "bg-gray-200 text-gray-800", icon: "😊" },
};

const LiveStatus: React.FC<LiveStatusProps> = ({ token, allTokens, onCompleteAndReset }) => {
  const waitingTokens = allTokens.filter(t => t.status === TokenStatus.WAITING || t.status === TokenStatus.PREPARING);
  const yourPosition = waitingTokens.findIndex(t => t.id === token.id) + 1;
  const estimatedWaitTime = yourPosition > 0 ? yourPosition * 0.5 : 0; // 30 seconds per token

  const { text, color, icon } = statusConfig[token.status];

  if (token.status === TokenStatus.COMPLETED) {
    return (
      <div className="text-center p-4">
        <h2 className="text-3xl font-bold text-dark mb-4">Thank You!</h2>
        <p className="text-gray-600 mb-6">Your order #{token.id} has been completed.</p>
        <div className="text-6xl mb-8">🎉</div>
        <button
          onClick={onCompleteAndReset}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          Book Another Token
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold text-dark mb-4">Your Live Status</h2>
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 mb-6 inline-block">
        <p className="text-gray-500 text-lg">Your Token Number</p>
        <p className="text-6xl md:text-7xl font-extrabold text-primary my-2">{token.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-600 mb-2">Status</p>
            <span className={`px-4 py-2 rounded-full font-bold text-lg ${color}`}>
              {icon} {text}
            </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-600 mb-2">Position in Queue</p>
            <p className="text-3xl font-bold text-dark">{yourPosition > 0 ? yourPosition : '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-600 mb-2">Est. Wait Time</p>
            <p className="text-3xl font-bold text-dark">{yourPosition > 0 ? `~${estimatedWaitTime.toFixed(0)} min` : 'Ready!'}</p>
        </div>
      </div>
      
      {token.status === TokenStatus.READY && (
        <div className="mt-8 p-4 bg-green-500 text-white rounded-lg shadow-lg animate-pulse">
            <p className="text-xl font-bold">Your order is ready for pickup!</p>
        </div>
      )}
    </div>
  );
};

export default LiveStatus;
