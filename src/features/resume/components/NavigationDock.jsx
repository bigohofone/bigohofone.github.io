import React, { useState, useEffect } from 'react';
import { FaRegUser, FaRegFileAlt, FaRegBuilding, FaRegStar } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import LiquidGlass from 'liquid-glass-react';

const NavigationDock = () => {
    const navigate = useNavigate();
    const [dockLeft, setDockLeft] = useState('50%');

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
            saturation={50}
            aberrationIntensity={2}
            elasticity={0.15}
            cornerRadius={9999}
            padding="8px"
            style={{
                position: 'fixed',
                bottom: '0px',
                left: dockLeft,
                transform: 'translateX(-50%)',
                zIndex: 1000,
            }}
        >
            <nav className="wonjunoh-resume-dock">
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


