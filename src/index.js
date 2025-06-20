import React from 'react';
import ReactDOM from 'react-dom/client'; // 수정: 'react-dom'에서 'react-dom/client'로 변경
import './styles/base.css'
import './styles/introduction.css';
import './styles/nav.css';
import './styles/content_elem.css';
import './styles/footer.css';
import './styles/content.css'
import './styles/layout.css'
import './styles/contact.css'

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // 수정: createRoot 사용

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);