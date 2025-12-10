import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

function getTitleStyle(width) {
    const commonStyles = {
        width: '100%',
        maxWidth: 'var(--page-width-default)', 
        padding: '0 var(--page-padding-default) var(--page-padding-default)', 
        margin: '0 auto',
        color: 'var(--color-on-text-primary)',
        fontSize: 'var(--font-size-2xl)',
    };

    if (typeof width !== 'number') {
        width = 1024;
    }

    if (width < 768) {
        return {
            ...commonStyles,
        }
    } else if (width < 960) {
        return {
            ...commonStyles,
        };
    } else {
        return {
            ...commonStyles,
        }
    }
}

function Title({title}) {
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
        <h2
            ref={containerRef}
            style={getTitleStyle(width)}
        >
            {title}
        </h2>
    );
}
export default Title;
export { Title };