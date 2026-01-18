import React, { useState, useEffect } from 'react';
import { FaRegUser, FaRegFileAlt, FaRegFile, FaRegBuilding, FaRegStar } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import LiquidGlass from 'liquid-glass-react';
import { pdf } from '@react-pdf/renderer';
import CVPdfDocument from '../../../components/CVPdfDocument';

const NavigationDock = () => {
    const navigate = useNavigate();
    const navRef = React.useRef(null);
    const [maskStyle, setMaskStyle] = useState({});
    const [dockLeft, setDockLeft] = useState('50%');
    const [dockTop, setDockTop] = useState('0px');

    const checkScrollState = () => {
        const el = navRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const isScrollable = scrollWidth > clientWidth;

        if (!isScrollable) {
            setMaskStyle({});
            return;
        }

        const isAtStart = scrollLeft <= 0;
        // Check if scrolled to end (allow 1px error margin)
        const isAtEnd = scrollWidth - clientWidth - scrollLeft <= 1;

        let mask = '';
        if (isAtStart) {
            // Only right side fade
            mask = 'linear-gradient(to right, black 50%, transparent 100%)';
        } else if (isAtEnd) {
            // Only left side fade
            mask = 'linear-gradient(to right, transparent 0%, black 50%)';
        } else {
            // Both sides fade
            mask = 'linear-gradient(to right, transparent 0%, black 50%, black 50%, transparent 100%)';
        }

        setMaskStyle({
            WebkitMaskImage: mask,
            maskImage: mask
        });
    };

    useEffect(() => {
        // Initial check and on resize
        checkScrollState();
        window.addEventListener('resize', checkScrollState);
        return () => window.removeEventListener('resize', checkScrollState);
    }, []);

    useEffect(() => {
        const calculateDockPosition = () => {
            const mainElement = document.querySelector('.wonjunoh-resume-main');
            if (mainElement) {
                const mainRect = mainElement.getBoundingClientRect();
                const centerX = mainRect.left + mainRect.width / 2;
                setDockLeft(`${centerX}px`);
            } else {
                // Fallback to viewport center
                setDockLeft('50%');
            }

            if (navRef.current) {
                const navHeight = navRef.current.offsetHeight;
                const topPosition = window.innerHeight - navHeight - 8 - 12;
                setDockTop(`${topPosition}px`);
            }
        };

        calculateDockPosition();
        window.addEventListener('resize', calculateDockPosition);

        return () => window.removeEventListener('resize', calculateDockPosition);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 40;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navItems = [
        { id: 'intro', icon: <FaRegUser />, label: 'Intro' },
        { id: 'education', icon: <FaRegFile />, label: 'Education' },
        { id: 'experience', icon: <FaRegBuilding />, label: 'Experience' },
        { id: 'publications', icon: <FaRegFileAlt />, label: 'Publications' },
        { id: 'awards', icon: <FaRegStar />, label: 'Awards' },
    ];

    const handleCVClick = async () => {
        try {
            const blob = await pdf(<CVPdfDocument />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Fallback to navigation if PDF generation fails? 
            // The prompt says "CVPage를 PDF로 바꿔서 출력해", so maybe fallback is not desired if explicitly asked to replace.
            // But good to have error handling.
            navigate('/cv');
        }
    };

    const [activeSection, setActiveSection] = useState('');

    // Active Section Detection (Scroll Spy)
    useEffect(() => {
        const observerOptions = {
            root: null,
            threshold: 0,
            rootMargin: '-10% 0px -90% 0px', // Trigger when section is near top of viewport
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        navItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        // Also observe footer to clear active section or set to last item if needed
        // For now, sticking to the defined items.

        return () => observer.disconnect();
    }, []);

    // Auto-scroll Dock for Mobile
    useEffect(() => {
        if (!activeSection || !navRef.current) return;

        const activeBtn = navRef.current.querySelector(`button[data-id="${activeSection}"]`);
        if (activeBtn) {
            const dock = navRef.current;
            const btnRect = activeBtn.getBoundingClientRect();
            const dockRect = dock.getBoundingClientRect();

            // Check if button is out of view (horizontal)
            const isOutOfViewLeft = btnRect.left < dockRect.left;
            const isOutOfViewRight = btnRect.right > dockRect.right;

            if (isOutOfViewLeft || isOutOfViewRight) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [activeSection]);



    return (
        <LiquidGlass
            displacementScale={64}
            blurAmount={0.05}
            saturation={130}
            aberrationIntensity={5}
            elasticity={0.1}
            cornerRadius={9999}
            padding="8px"
            style={{ position: 'fixed', top: dockTop, left: dockLeft }}
        >
            <nav
                className="wonjunoh-resume-dock"
                ref={navRef}
                onScroll={checkScrollState}
                style={maskStyle}
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            data-id={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`wonjunoh-resume-dock-item ${isActive ? 'active' : ''}`}
                            aria-label={item.label}
                            style={isActive ? { color: '#FF2D55' } : {}}
                        >
                            {/* Clamp icon color change manually or via CSS if prefers */}
                            {React.cloneElement(item.icon, { style: isActive ? { color: '#FF2D55' } : {} })}
                            <span
                                className="wonjunoh-resume-dock-label"
                                style={isActive ? { color: '#FF2D55' } : {}}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
                <button
                    onClick={handleCVClick}
                    className="wonjunoh-resume-dock-item wonjunoh-resume-dock-item-cv"
                    aria-label="Download CV"
                >
                    <FaDownload />
                    <span className="wonjunoh-resume-dock-label">CV</span>
                </button>
            </nav>
        </LiquidGlass>
    );
};

export default NavigationDock;


