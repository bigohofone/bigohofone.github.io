import React from 'react';
import { FaRegUser, FaRegNewspaper, FaRegBuilding, FaRegFileAlt, FaRegStar, FaRegEnvelope } from 'react-icons/fa';

const NavigationDock = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed header/spacing if needed, though centered alignment handles most
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

    return (
        <div className="wonjunoh-resume-dock-container">
            <nav className="wonjunoh-resume-dock">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="wonjunoh-resume-dock-item"
                        aria-label={item.label}
                    >
                        {item.icon}
                        <span className="wonjunoh-resume-tooltip">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default NavigationDock;
