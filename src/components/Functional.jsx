import React, { useState, useRef, useEffect } from "react";

import { useAppContext } from '../contexts/AppContext';

import '../assets/styles/Functional.css';

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];


export function LocaleDropdownButton({ locale, setLocale }) {
    const [isOpen, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = 40 * LANGUAGES.length;
            const spaceBelow = window.innerHeight - rect.bottom;
            setDropUp(spaceBelow < dropdownHeight + 8);
        }
    }, [isOpen]);

    const selected = LANGUAGES.find(l => l.code === locale);

    return (
        <div className="btn__container" ref={dropdownRef}>
            <button
                ref={buttonRef}
                className={`btn-sm${isOpen ? " open" : ""}`}
                onClick={() => setOpen(v => !v)}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="material-symbols-outlined btn-sm__icon">translate</span>
                <span className="btn-sm__label">
                    LANGUAGE
                    {/* {selected?.label} */}
                </span>
            </button>

            {isOpen && (
                <ul
                    className={`dropdown__list${dropUp ? " drop-up" : ""}`}
                    role="listbox"
                >
                    {LANGUAGES.map(l => (
                        <li
                            key={l.code}
                            className={`dropdown__item${locale === l.code ? ' selected' : ''}`}
                            onClick={() => {
                                setLocale(l.code);
                                setOpen(false);
                            }}
                            role="option"
                            aria-selected={locale === l.code}
                        >
                            <span className="dropdown__icon">
                                {l.flag}
                            </span>
                            <span className="dropdown__label">
                                {l.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


export default function FloatingControls() {
    const { locale, setLocale, darkMode, toggleDarkMode } = useAppContext();

    return (
        <div
            aria-hidden="false"
            className="float-container"
        >
            <LocaleDropdownButton locale={locale} setLocale={setLocale} />
        </div>
    );
}