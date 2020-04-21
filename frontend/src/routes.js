import React from 'react';
import Stores from './pages/stores/Stores';
import Home from './pages/home/Home';
import Auth from './pages/auth/Auth';
import CreateStore from './pages/create-store/CreateStore';
import Prints from './pages/prints/Prints';
import FinishedPrints from './pages/finished-prints/FInishedPrints';
import Info from './pages/info/Info';

const routes = {
  '/auth': () => <Auth />,
  '/home': () => <Home />,
  '/stores': () => <Stores />,
  '/create-store': () => <CreateStore />,
  // '/store/:id': ({userId}) => <Store storeId={userId} />
  '/prints': () => <Prints />,
  '/finished-prints': () => <FinishedPrints />,
  '/info': () => <Info />,

};

export default routes;
