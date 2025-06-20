/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const iconStyle = { verticalAlign: 'middle', marginRight: 4, color: 'inherit', backgroundColor: 'inherit', fill: 'inherit', stroke: 'inherit' };

const Footer = () => (
  <footer className="footer">
    <div className="footer-block">
      <div className="footer-links">
        <a href="mailto:owj0421@naver.com" target="_blank" rel="noopener noreferrer">
          <FaEnvelope style={iconStyle} />
        </a>
        <a href="https://github.com/owj0421" target="_blank" rel="noopener noreferrer">
          <FaGithub style={iconStyle} />
        </a>
        <a href="https://www.linkedin.com/in/wonjun-oh-8067b5265/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin style={iconStyle} />
        </a>
      </div>
      <p className="footer-date"> UPDATED @ 24.5.2025</p>
    </div>

    <div className="footer-block">
      <p className="footer-title">WONJUN OH © {new Date().getFullYear()}</p>
    </div>
    
  </footer>
);

export default Footer;