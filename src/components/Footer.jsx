import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-links">
      <a href="mailto:owj0421@naver.com" target="_blank" rel="noopener noreferrer">
        <FaEnvelope style={{ verticalAlign: 'middle', marginRight: 4 }} />
      </a>
      <a href="https://github.com/owj0421" target="_blank" rel="noopener noreferrer">
        <FaGithub style={{ verticalAlign: 'middle', marginRight: 4 }} />
      </a>
      <a href="https://www.linkedin.com/in/wonjun-oh-8067b5265/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin style={{ verticalAlign: 'middle', marginRight: 4 }} />
      </a>
    </div>
    <div className="footer-title">
      <span>WONJUN OH © {new Date().getFullYear()}</span>
    </div>
    <div className="footer-date">
      <span>Updated: 24.5.2025</span>
    </div>
  </footer>
);

export default Footer;