import React, { useState, useRef, useEffect } from "react";

import { motion } from "framer-motion";

import { useAppContext } from '../../contexts/AppContext.jsx';

import { headerPopupStyles } from './headerStyles';


export const LANGUAGES = {
  'ko': { code: 'ko', label: '한국어', flag: '🇰🇷' },
  'en': { code: 'en', label: 'English', flag: '🇺🇸' },
};


export default function Locale() {
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
                    language{/* globe_asia */}
                </span>
            </button>

            {isOpen && (<>
                <div style={style.background}></div>
                <div style={style.popupContainer} role="dialog">
                    <div style={style.popup}>
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
                        {Object.values(LANGUAGES).map(l => (
                            <div
                                key={l.code}
                                style={{
                                    ...style.popupItem,
                                    ...(locale === l.code ? style.popupItemSelected : {}),
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = style.popupItemHover.background;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = locale === l.code
                                        ? style.popupItemSelected.background
                                        : "transparent";
                                }}
                                onClick={() => {
                                    setLocale(l.code);
                                    setOpen(false);
                                }}
                                role="button"
                                aria-selected={locale === l.code}
                            >
                                <span>{l.flag}</span>
                                <span>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </>)}
        </div>
    );
}