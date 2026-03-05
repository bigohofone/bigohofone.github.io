import React from 'react';
import ReactDOM from 'react-dom/client'; // 수정: 'react-dom'에서 'react-dom/client'로 변경

import './assets/icons/material-symbols.css';
import './assets/fonts.css';
import './assets/styles/global.css';
import './assets/styles/layout.css';
import './assets/styles/resume.css';
import './assets/styles/menu.css';
import './assets/styles/contact.css';
import './assets/styles/footer.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 수정: createRoot 사용

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);