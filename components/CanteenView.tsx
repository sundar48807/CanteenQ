import React, { useMemo } from 'react';
import { Token, TokenStatus, Dish, MenuItem } from '../types';
import TokenCard from './TokenCard';
import DishOfTheDayGenerator from './DishOfTheDayGenerator';
import MenuManagement from './MenuManagement';

interface CanteenViewProps {
  tokens: Token[];
  updateTokenStatus: (tokenId: number, newStatus: TokenStatus) => void;
  dishOfTheDay: Dish | null;
  onUpdateDish: (dish: Dish) => void;
  onClearCompleted: () => void;
  menuItems: MenuItem[];
  onToggleMenuAvailability: (itemId: string) => void;
}

const CanteenView: React.FC<CanteenViewProps> = ({ tokens, updateTokenStatus, dishOfTheDay, onUpdateDish, onClearCompleted, menuItems, onToggleMenuAvailability }) => {
    
    const categorizedTokens = useMemo(() => {
        const waiting = tokens.filter(t => t.status === TokenStatus.WAITING);
        const preparing = tokens.filter(t => t.status === TokenStatus.PREPARING);
        const ready = tokens.filter(t => t.status === TokenStatus.READY);
        // sort by booking time ascending
        return {
            waiting: waiting.sort((a,b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime()),
            preparing: preparing.sort((a,b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime()),
            ready: ready.sort((a,b) => new Date(a.bookingTime).getTime() - new Date(b.bookingTime).getTime()),
        }
    }, [tokens]);

    const completedCount = tokens.filter(t => t.status === TokenStatus.COMPLETED).length;

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DishOfTheDayGenerator currentDish={dishOfTheDay} onUpdateDish={onUpdateDish} />
                <MenuManagement menuItems={menuItems} onToggleAvailability={onToggleMenuAvailability} />
            </div>

            <div className="mt-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-dark">Live Queue</h2>
                {completedCount > 0 && (
                    <button 
                        onClick={onClearCompleted} 
                        className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
                    >
                        Clear {completedCount} Completed
                    </button>
                )}
            </div>

            {tokens.filter(t => t.status !== TokenStatus.COMPLETED).length === 0 ? (
                <div className="text-center py-16 bg-white mt-4 rounded-xl shadow">
                    <p className="text-2xl font-semibold text-gray-500">The queue is empty!</p>
                    <p className="text-gray-400 mt-2">Waiting for new orders.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <section>
                        <h3 className="text-xl font-semibold mb-3 text-blue-600">Waiting ({categorizedTokens.waiting.length})</h3>
                        <div className="space-y-4">
                            {categorizedTokens.waiting.map(token => <TokenCard key={token.id} token={token} updateTokenStatus={updateTokenStatus} />)}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-3 text-yellow-600">Preparing ({categorizedTokens.preparing.length})</h3>
                        <div className="space-y-4">
                            {categorizedTokens.preparing.map(token => <TokenCard key={token.id} token={token} updateTokenStatus={updateTokenStatus} />)}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-xl font-semibold mb-3 text-green-600">Ready for Pickup ({categorizedTokens.ready.length})</h3>
                        <div className="space-y-4">
                            {categorizedTokens.ready.map(token => <TokenCard key={token.id} token={token} updateTokenStatus={updateTokenStatus} />)}
                        </div>
                    </section>
                </div>
            )}
        </div>
    </main>
  );
};

export default CanteenView;