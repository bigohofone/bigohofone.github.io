import React, { useState, useEffect, useRef, useCallback } from 'react';


// ── Hooks ──────────────────────────────────────────────────────────────────────

/** DOM의 h2 태그를 스캔해 { id, label } 목록을 반환 */
function useNavItems() {
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const items = [...document.querySelectorAll('h2')]
                .map((h2) => ({
                    id: h2.closest('[id]')?.id ?? null,
                    label: h2.textContent.trim(),
                }))
                .filter(({ id, label }) => id && label);
            setNavItems(items);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return navItems;
}

/** 스크롤 위치에 따라 현재 뷰포트에 가장 가까운 섹션 id를 추적 */
function useActiveSection(navItems) {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (!navItems || navItems.length === 0) return;

        const handleScroll = () => {
            let closestSection = '';
            let minDistance = Infinity;

            navItems.forEach(({ id }) => {
                const el = document.getElementById(id);
                if (!el) return;

                // 뷰포트 상단으로부터의 거리 (절대값 아님, top 기준)
                const rect = el.getBoundingClientRect();

                /**
                 * '최상단에 가장 가까운' 기준:
                 * rect.top이 0에 가까울수록 현재 활성화된 섹션일 확률이 높음.
                 * 단, 이미 지나간 섹션(음수)도 고려해야 하므로 절대값을 사용하거나, 
                 * 특정 오차 범위(예: 상단 100px 이내)를 우선순위로 둡니다.
                 */
                const distance = Math.abs(rect.top);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = id;
                }
            });

            setActiveSection(closestSection);
        };

        // 초기 실행 (첫 로드 시 위치 파악)
        handleScroll();

        // 성능 최적화를 위한 틱 처리
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [navItems]);

    return activeSection;
}

function useScrollMask(navRef) {
    const [maskStyle, setMaskStyle] = useState({});

    const update = useCallback(() => {
        const el = navRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollWidth <= clientWidth) { setMaskStyle({}); return; }

        const atStart = scrollLeft <= 0;
        const atEnd = scrollWidth - clientWidth - scrollLeft <= 1;

        const mask = atStart
            ? 'linear-gradient(to right, black 50%, transparent 100%)'
            : atEnd
                ? 'linear-gradient(to right, transparent 0%, black 50%)'
                : 'linear-gradient(to right, transparent 0%, black 50%, black 50%, transparent 100%)';

        setMaskStyle({ WebkitMaskImage: mask, maskImage: mask });
    }, [navRef]);

    useEffect(() => {
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [update]);

    return { maskStyle, onScroll: update };
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

// ── Component ──────────────────────────────────────────────────────────────────

const HeaderShortcutDock = () => {
    const navRef = useRef(null);

    const navItems = useNavItems();
    const activeSection = useActiveSection(navItems);
    const { maskStyle, onScroll } = useScrollMask(navRef);

    // 활성 버튼을 독 가운데로 자동 스크롤
    useEffect(() => {
        if (!activeSection || !navRef.current) return;
        navRef.current
            .querySelector(`button[data-id="${activeSection}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeSection]);

    return (
        <div
            className="dock-container"
        >
            <div className="dock-wrapper" ref={navRef} onScroll={onScroll} style={maskStyle}>
                <nav className="dock" >
                    {/* enumerate items */}
                    {navItems.map(({ id, label }, i) => {
                        const isActive = activeSection === id;
                        return (
                            <button
                                key={id}
                                data-id={id}
                                className={`dock__item${isActive ? ' active' : ''}`}
                                aria-label={label}
                                onClick={() => scrollToSection(id)}
                            >
                                <span className="dock__number">{String(i + 1).padStart(2, '0')}</span>
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
