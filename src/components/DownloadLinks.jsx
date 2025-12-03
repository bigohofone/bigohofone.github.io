import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

import { ResumeIcon, GoogleScholarIcon, GithubIcon, LinkedInIcon, XIcon } from '../assets/icons/icons.jsx';

function getButtonContainerStyle(width, variant="default") {
    if (variant === "icon-only") {
        return {
            display: 'flex',
            // justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            listStyleType: 'none',
        }
    }

    const commonStyles = {
        width: '100%',
        maxWidth: 'var(--page-width-default)', 
        padding: '0 var(--page-padding-default)', 
        margin: '0 auto',
        listStyleType: 'none',
    };

    if (typeof width !== 'number') {
        width = 1024;
    }

    if (width < 768) {
        return {
            ...commonStyles,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, auto)',
            columnGap: '1rem',
            rowGap: '1.5rem',
        }
    } else if (width < 960) {
        return {
            ...commonStyles,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            columnGap: '1rem',
            rowGap: '1.5rem',
        };
    } else {
        return {
            ...commonStyles,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, auto)',
            columnGap: '1rem',
            rowGap: '1.5rem',
        }
    }
}

function getButtonStyle(width, variant="default") {
    const commonStyles = {
        textDecoration: 'none',
    };

    if (typeof width !== 'number') {
        width = 1024;
    }

    if (width < 960) {
        return {
            ...commonStyles,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        };
    } else {
        return {
            ...commonStyles,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        };
    }
}

function getButton(width, locale, href, icon, koreanLabel, englishLabel, variant="default") {
    const label = locale === 'ko' ? koreanLabel : englishLabel;
    return (
        <li>
            <a
                className="btn"
                href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={getButtonStyle(width, variant)}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '3rem', 
                        height: '3rem', 
                        background: 'rgba(0, 0, 0, 0.025)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '0.75rem',
                    }}
                >
                    {icon}
                </div>
                {variant === "icon-only" ? null :
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.125rem',
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: '600',
                            color: 'var(--color-on-text-primary)',
                        }}
                    >   
                        <span>{label}</span>
                        <div className="material-symbols-outlined">arrow_outward</div>
                    </div>
                }
            </a>
        </li>
    );
}

function DownloadLinks({ variant="default" }) {
    
    const app = useAppContext();
    const locale = app?.locale || 'en';

    const containerRef = useRef(null);
    const [width, setWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // If container width changes due to layout, observe it
        let ro;
        if (containerRef.current && typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const w = entry.contentRect?.width;
                    if (typeof w === 'number') {
                        setWidth(w);
                    }
                }
            });
            ro.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            if (ro && containerRef.current) ro.unobserve(containerRef.current);
        };
    }, []);

    return (
        <ul 
            ref={containerRef}
            style={getButtonContainerStyle(width, variant)}
        >
            {getButton(width, locale, "/data/resume_wonjunoh.pdf", ResumeIcon, "이력서", "Resume", variant)}
            {getButton(width, locale, "https://scholar.google.com/citations?user=owj0421", GoogleScholarIcon, "구글 스칼라", "Google Scholar", variant)}
            {getButton(width, locale, "https://github.com/bigohofone", GithubIcon, "GitHub", "GitHub", variant)}
            {getButton(width, locale, "https://www.linkedin.com/in/wonjun-oh-8067b5265/", LinkedInIcon, "LinkedIn", "LinkedIn", variant)}
            {getButton(width, locale, "https://x.com/bigohofone", XIcon, "X", "X", variant)}
        </ul>
    );
}
export default DownloadLinks;
export { DownloadLinks };