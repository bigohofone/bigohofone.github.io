import React, { useState, useRef, useEffect } from "react";

import { Link } from 'react-router-dom';

import { useAppContext } from '../../contexts/AppContext.jsx';

import { headerPopupStyles } from './headerStyles';

import { desktopBreakpoint, mobileBreakpoint } from '../../assets/styles/breakpoints.jsx';


const links = [
  { to: '/', label_en: 'About Me', label_ko: '소개' },
  { to: '/publications', label_en: 'Publications', label_ko: '논문' },
  { to: '/resume', label_en: 'Resume', label_ko: '이력서' },
  { to: '/contact', label_en: 'Contact', label_ko: '연락처' },
];


function Nav() {
    const { locale, setLocale, width } = useAppContext();
    const [isOpen, setOpen] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const style = headerPopupStyles();

    return (
        <div 
            style={style.container} 
            ref={popupRef}
        >
            <button
                style={style.button}
                onClick={() => setOpen(v => !v)}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span 
                    className="material-symbols-rounded"
                    style={style.buttonIcon}
                >
                    menu
                </span>
            </button>

            {isOpen && (<>
                <div style={style.background}></div>
                <div style={style.popupContainer} role="dialog">
                    <nav style={style.popup}>
                        <div style={style.popupHeader}>
                            <button
                                className='material-symbols-rounded'
                                style={style.buttonIcon}
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                            >
                                undo
                            </button>
                        </div>
                        {links.map(l => (
                            <Link to={l.to}
                                key={l.code}
                                style={style.popupItem}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = style.popupItemHover.background;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = locale === l.code
                                        ? style.popupItemSelected.background
                                        : "transparent";
                                }}
                                onClick={() => {
                                    setOpen(false);
                                }}
                                role="button"
                            >
                                <span>{locale === 'ko' ? l.label_ko : l.label_en}</span>
                                <span className="material-symbols-rounded" style={{ fontSize: 'var(--font-size-md)' }}>arrow_outward</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </>)}
        </div>
    );
}

function NavExpanded() {
    const { locale } = useAppContext();
    const style = headerPopupStyles();

    return (
        <nav
            style={style.containerExpanded}
        >
            {links.map(l => (
                <Link key={l.to} to={l.to}>
                    {locale === 'ko' ? l.label_ko : l.label_en}
                </Link>
            ))}
        </nav>
    );
}

export default function HeaderNav() {
    const { width } = useAppContext();
    const isBelowDesktop = width < desktopBreakpoint;

    return isBelowDesktop ? <Nav /> : <NavExpanded />;
}