import React, { useState, useEffect } from 'react';
import { FaRegUser, FaRegFileAlt, FaRegBuilding, FaRegStar } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import LiquidGlass from 'liquid-glass-react';

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
        { id: 'education', icon: <FaRegFileAlt />, label: 'Education' },
        { id: 'experience', icon: <FaRegBuilding />, label: 'Experience' },
        { id: 'publications', icon: <FaRegFileAlt />, label: 'Publications' },
        { id: 'awards', icon: <FaRegStar />, label: 'Awards' },
    ];

    const handleCVClick = () => {
        navigate('/cv');
    };

    return (
        <LiquidGlass
            displacementScale={64}
            blurAmount={0.1}
            saturation={130}
            aberrationIntensity={2}
            elasticity={0.15}
            cornerRadius={9999}
            padding="8px"
            globalMousePos={{ x: 0, y: 0 }}
            mouseOffset={{ x: 0, y: 0 }}
            style={{ position: 'fixed', top: dockTop, left: dockLeft }}
        >
            <nav
                className="wonjunoh-resume-dock"
                ref={navRef}
                onScroll={checkScrollState}
                style={maskStyle}
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="wonjunoh-resume-dock-item"
                        aria-label={item.label}
                    >
                        {item.icon}
                        <span className="wonjunoh-resume-dock-label">{item.label}</span>
                    </button>
                ))}
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


