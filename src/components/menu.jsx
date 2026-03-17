import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { routeConfig } from '../route';

// ── Component ──────────────────────────────────────────────────────────────────

const Menu = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;

        // Always show menu if mobile full-screen menu is open
        if (isMobileMenuOpen) return;

        // Show when scrolling up or at top, hide when scrolling down
        if (currentScrollY === 0 || currentScrollY < lastScrollY.current) {
            setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current + 10) {
            setIsVisible(false);
        }

        lastScrollY.current = currentScrollY;
    }, [isMobileMenuOpen]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (isVisible) {
            document.body.classList.add('menu-visible');
            document.body.classList.remove('menu-hidden');
        } else {
            document.body.classList.add('menu-hidden');
            document.body.classList.remove('menu-visible');
        }
    }, [isVisible]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className={`top-menu-container ${isVisible ? 'visible' : 'hidden'}`}>
                <div className="top-menu-inner">

                    <div className="desktop-menu">
                        {routeConfig.filter(route => route.isMenu).map(route => (
                            <NavLink
                                key={route.path}
                                to={route.path}
                                className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
                            >
                                {route.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="mobile-menu-toggle">
                        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Open Menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                style={{ color: 'var(--sys-color-text-tertiary)' }}
                            >
                                <line x1="5" y1="7" x2="19" y2="7" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <line x1="5" y1="17" x2="19" y2="17" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className={`mobile-full-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span className="mobile-menu-title">Menu</span>
                    <button className="close-btn" onClick={closeMobileMenu} aria-label="Close Menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ color: 'var(--sys-color-text-tertiary)' }}
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="mobile-menu-links">
                    {routeConfig.filter(route => route.isMenu).map(route => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) => `mobile-menu-link ${isActive ? 'active' : ''}`}
                            onClick={closeMobileMenu}
                        >
                            {route.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Menu;
