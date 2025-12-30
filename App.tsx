import React, { useState } from 'react';
import Header from './components/Header';
import CustomerView from './components/CustomerView';
import CanteenView from './components/CanteenView';
import { useQueue } from './hooks/useQueue';
import { Token } from './types';

function App() {
  const [view, setView] = useState<'customer' | 'canteen'>('customer');
  const { 
      tokens, 
      addToken, 
      updateTokenStatus, 
      dishOfTheDay, 
      updateDishOfTheDay, 
      clearCompletedTokens,
      menuItems,
      toggleMenuItemAvailability
  } = useQueue();

  const handleBookToken = async (name: string, phone: string): Promise<Token> => {
    return await addToken(name, phone);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header currentView={view} setView={setView} />
      {view === 'customer' ? (
        <CustomerView 
          allTokens={tokens} 
          dishOfTheDay={dishOfTheDay}
          menuItems={menuItems}
          onBookToken={handleBookToken}
        />
      ) : (
        <CanteenView 
          tokens={tokens}
          updateTokenStatus={updateTokenStatus}
          dishOfTheDay={dishOfTheDay}
          onUpdateDish={updateDishOfTheDay}
          onClearCompleted={clearCompletedTokens}
          menuItems={menuItems}
          onToggleMenuAvailability={toggleMenuItemAvailability}
        />
      )}
    </div>
  );
}

export default App;