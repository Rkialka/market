import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Home from './components/Home';
import MarketConfig from './components/MarketConfig';
import CartView from './components/CartView';
import './index.css';

const ScreenRouter = () => {
  const { currentScreen } = useApp();

  switch (currentScreen.name) {
    case 'MARKET_CONFIG':
      return <MarketConfig />;
    case 'CART_VIEW':
      return <CartView marketId={currentScreen.params.marketId} />;
    case 'HOME':
    default:
      return <Home />;
  }
};

function App() {
  return (
    <AppProvider>
      <div className="container">
        <ScreenRouter />
      </div>
    </AppProvider>
  );
}

export default App;
