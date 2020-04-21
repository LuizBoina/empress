import React from 'react';
import Store from './pages/store/Store';
import Home from './pages/home/Home';
import Auth from './pages/auth/Auth';
import CreateStore from './pages/create-store/CreateStore';


const routes = {
  '/auth': () => <Auth />,
  '/home': () => <Home />,
  '/store': () => <Store />,
  '/create-store': () => <CreateStore />,
  // '/store/:id': ({userId}) => <Store storeId={userId} />
};

export default routes;
