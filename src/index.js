import React from 'react';
import ReactDOM from 'react-dom/client'; // 수정: 'react-dom'에서 'react-dom/client'로 변경

import './assets/icons/material-symbols.css';
import './assets/fonts/pretendard.css';


import './assets/styles/global/base.css'
import './assets/styles/global/grid.css'
import './assets/styles/global/section.css'
import './assets/styles/global/spacer.css'
import './assets/styles/global/btn.css';
import './assets/styles/wonjunoh_resume.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 수정: createRoot 사용

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);