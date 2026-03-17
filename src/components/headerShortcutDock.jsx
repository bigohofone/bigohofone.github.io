import React, { useState, useEffect, useRef, useCallback } from 'react';


// ── Hooks ──────────────────────────────────────────────────────────────────────

/** Scans DOM for h1, h2, h3 tags and returns an array of { index, el, id, label, tagName } */
function useNavItems() {
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const elements = Array.from(document.querySelectorAll('h1, h2, h3'));
            const items = elements
                .map((el, index) => {
                    const id = el.closest('[id]')?.id || null;
                    const label = el.textContent.trim();
                    return { index, el, id, label, tagName: el.tagName.toLowerCase() };
                })
                .filter(item => item.id && item.label);

            setNavItems(items);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return navItems;
}

/** Tracks the index of the header closest to the top of the viewport */
function useActiveSection(navItems) {
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        if (!navItems?.length) return;

        const handleScroll = () => {
            let closestIndex = -1;
            let minDistance = Infinity;

            for (const { el, index } of navItems) {
                if (!el) continue;

                const { top } = el.getBoundingClientRect();
                const distance = Math.abs(top);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            }

            setActiveIndex(closestIndex);
        };

        // Initial check
        handleScroll();

        // Throttled scroll listener using requestAnimationFrame
        let isTicking = false;
        const onScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    isTicking = false;
                });
                isTicking = true;
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [navItems]);

    return activeIndex;
}

/** Controls left/right gradient mask for scrolling dock items overflow */
function useScrollMask(navRef) {
    const [maskStyle, setMaskStyle] = useState({});

    const updateMask = useCallback(() => {
        const el = navRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;

        // No overflow means no mask needed
        if (scrollWidth <= clientWidth) {
            setMaskStyle({});
            return;
        }

        const isAtStart = scrollLeft <= 0;
        const isAtEnd = scrollWidth - clientWidth - scrollLeft <= 1;

        let mask = 'linear-gradient(to right, transparent 0%, black 50%, black 50%, transparent 100%)';
        if (isAtStart) mask = 'linear-gradient(to right, black 50%, transparent 100%)';
        else if (isAtEnd) mask = 'linear-gradient(to right, transparent 0%, black 50%)';

        setMaskStyle({ WebkitMaskImage: mask, maskImage: mask });
    }, [navRef]);

    useEffect(() => {
        updateMask();
        window.addEventListener('resize', updateMask);
        return () => window.removeEventListener('resize', updateMask);
    }, [updateMask]);

    return { maskStyle, onScroll: updateMask };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 40,
        behavior: 'smooth',
    });
}

// ── Main Component ─────────────────────────────────────────────────────────────

const HeaderShortcutDock = () => {
    const navRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const navItems = useNavItems();
    const activeIndex = useActiveSection(navItems);
    const { maskStyle, onScroll } = useScrollMask(navRef);

    // Auto-scroll the dock container to center the active dot
    useEffect(() => {
        if (activeIndex === -1 || !navRef.current) return;

        const activeButton = navRef.current.querySelector(`button[data-index="${activeIndex}"]`);
        activeButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeIndex]);

    const minLevel = navItems.length > 0
        ? Math.min(...navItems.map(item => parseInt(item.tagName.replace('h', ''), 10)))
        : 1;

    return (
        <div
            className={`dock-container ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="dock-wrapper" ref={navRef} onScroll={onScroll} style={maskStyle}>
                <nav className="dock" >
                    {navItems.map(({ id, label, tagName, index }) => {
                        const isActive = activeIndex === index;

                        // Hierarchy mappings: h1 -> 1, h2 -> 2, h3 -> 3
                        const level = parseInt(tagName.replace('h', ''), 10);
                        const relativeLevel = level - minLevel;

                        // Root (relativeLevel 0) uses 's' exactly as requested
                        const fontSize = 'var(--sys-font-s)';

                        return (
                            <button
                                key={`dock-item-${index}`}
                                data-id={id}
                                data-index={index}
                                className={`dock__item ${isActive ? 'active' : ''}`}
                                aria-label={label}
                                onClick={() => scrollToSection(id)}
                                style={{
                                    '--level': level,
                                    '--relative-level': relativeLevel,
                                    '--hover-font-size': fontSize
                                }}
                            >
                                <span className="dock__label">{label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div >
    );
};

export default HeaderShortcutDock;
