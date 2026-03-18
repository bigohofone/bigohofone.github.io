import React from 'react';

import Links from './links'

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer">
                <div className="footer__copyright">Copyright © {new Date().getFullYear()} Wonjun Oh. All rights reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;