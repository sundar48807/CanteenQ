import React, { useState, useEffect } from 'react';
import { Token, Dish, MenuItem } from '../types';
import BookingForm from './BookingForm';
import LiveStatus from './LiveStatus';
import CustomerMenu from './CustomerMenu';
import CustomerAiAssistant from './CustomerAiAssistant';
import DishOfTheDayCard from './DishOfTheDayCard';

interface CustomerViewProps {
  allTokens: Token[];
  dishOfTheDay: Dish | null;
  menuItems: MenuItem[];
  onBookToken: (name: string, phone: string) => Promise<Token>;
}

const CUSTOMER_TOKEN_ID_KEY = 'customer_token_id';

const CustomerView: React.FC<CustomerViewProps> = ({ allTokens, dishOfTheDay, menuItems, onBookToken }) => {
  const [myToken, setMyToken] = useState<Token | null>(null);

  useEffect(() => {
    // Check session storage for an existing token ID for this session
    const storedTokenId = sessionStorage.getItem(CUSTOMER_TOKEN_ID_KEY);
    if (storedTokenId) {
      const existingToken = allTokens.find(t => t.id === parseInt(storedTokenId));
      if (existingToken) {
        setMyToken(existingToken);
      } else {
        // Token not found in allTokens (e.g., cleared by canteen), so clear from session
        sessionStorage.removeItem(CUSTOMER_TOKEN_ID_KEY);
      }
    }
  }, [allTokens]);

  const handleBookToken = (name: string, phone: string) => {
    const newToken = onBookToken(name, phone);
    sessionStorage.setItem(CUSTOMER_TOKEN_ID_KEY, newToken.id.toString());
    setMyToken(newToken);
  };
  
  const handleCompleteAndReset = () => {
    sessionStorage.removeItem(CUSTOMER_TOKEN_ID_KEY);
    setMyToken(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {dishOfTheDay && <DishOfTheDayCard dish={dishOfTheDay} />}

      {!myToken ? (
        <BookingForm onBookToken={handleBookToken} />
      ) : (
        <LiveStatus 
          token={myToken} 
          allTokens={allTokens}
          onCompleteAndReset={handleCompleteAndReset}
        />
      )}

      <div className="mt-12">
        <CustomerMenu menuItems={menuItems} />
      </div>

      <CustomerAiAssistant />
    </main>
  );
};

export default CustomerView;