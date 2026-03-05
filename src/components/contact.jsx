import React, { useState, useEffect, useRef, useCallback } from 'react';

import content from '../data/content';

// ── Component ──────────────────────────────────────────────────────────────────
const { contact } = content;

const contactDisplayItems = contact.items.filter(item =>
    ['Email', 'Phone', 'Website'].includes(item.label)
);

const socialFooterItems = contact.items.filter(item =>
    ['X (Twitter)', 'Threads', 'LinkedIn', 'GitHub', 'Google Scholar'].includes(item.label)
);

const Contact = () => {

    return (
        <div className="contact">
            <ul className="contact__list">
                {contactDisplayItems.map((item, i) => (
                    <li key={i}>
                        <a href={item.link} className="contact__list-item" title={item.label}>
                            <div className="contact__list-item-label">{item.label}</div>
                            <div className="contact__list-item-line"></div>
                            {item.value && <div className="contact__list-item-value">{item.value}</div>}
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="contact__list">
                {socialFooterItems.map((item, i) => (
                    <li key={i}>
                        <a href={item.link} title={item.label} className="contact__list-item">
                            <div className="contact__list-item-label">
                                {item.label}
                                {['X (Twitter)', 'LinkedIn', 'GitHub', 'Google Scholar'].includes(item.label) && (
                                    <span className="contact__list-item-arrow">↗</span>
                                )}
                            </div>
                            <div className="contact__list-item-line"></div>
                        </a>
                    </li>
                ))}
            </ul>
        </div >

    );
};

export default Contact;
