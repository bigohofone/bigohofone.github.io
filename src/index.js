import React from 'react';
import ReactDOM from 'react-dom/client'; // 수정: 'react-dom'에서 'react-dom/client'로 변경
import './styles/App.css';
import './styles/SectionCard.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 수정: createRoot 사용
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);