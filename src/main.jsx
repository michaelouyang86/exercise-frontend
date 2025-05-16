import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';
import './index.css'
import App from './App.jsx'

async function initialize() {
  try {
    const response = await axios.get('/config.json');
    window.RUNTIME_CONFIG = response.data;

    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    console.error('Failed to load runtime config:', error);
  }
}

initialize();
