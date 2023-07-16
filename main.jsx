import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import { Home } from './routes/Home.jsx';
import { NewAccount } from './routes/NewAccount.jsx';
import { NewTransaction } from './routes/NewTransaction.jsx';
import {FilterTransaction} from './routes/FilterTransaction.jsx'


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/newAccount",
        element: <NewAccount />,
      },
      {
        path: "/newTransaction",
        element: <NewTransaction />,
      },
      {
        path: "/filterTransaction",
        element: <FilterTransaction />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);