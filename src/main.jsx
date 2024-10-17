import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Pages/App.jsx'; 
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
       <TonConnectUIProvider manifestUrl="https://resilient-madeleine-9ff7c2.netlify.app/tonconnect-manifest.json">
            <BrowserRouter>
                <App />
            </BrowserRouter>  
        </TonConnectUIProvider>
  </React.StrictMode>
);