import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabase';

// Supabase Connection Test
console.log('Supabase client initialized successfully:', !!supabase);
console.log('Note: Database tables have not yet been created or connected for data storage.');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
