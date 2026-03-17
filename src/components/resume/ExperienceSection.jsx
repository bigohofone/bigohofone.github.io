import React, { useState } from 'react';
import { FiBookmark, FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const ExperienceItem = ({
    role,
    organization,
    date,
    location,
    description,
    logo,
    isActive,
    isAnyActive,
    onClick
}) => {
    return (
        <>
            <div
                className={`resume-content__wrapper is-interactive ${isActive ? 'is-active' : ''} ${isAnyActive && !isActive ? 'is-dimmed' : ''}`}
                onClick={onClick}
            >
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: '100%' }}>
                    <div className="resume-content__logo-box">
                        {logo ? (
                            <img
                                src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                                alt={`${organization} logo`}
                            />
                        ) : (
                            <FiBookmark />
                        )}
                    </div>

                    <div className="resume-content__box">
                        <div className="resume-content__meta-box">
                            <span className="resume-content__meta">{date}</span>
                        </div>
                        <div className="resume-content__title">{organization}</div>
                        <div className="resume-content__subtitle">{role}</div>
                    </div>
                </div>

                <div style={{ margin: 'auto 0 auto 0.25rem', display: 'flex', alignItems: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                            transform: isActive ? 'rotate(-90deg)' : 'rotate(90deg)',
                            transition: 'transform 0.3s ease',
                            color: 'var(--sys-color-text-tertiary)'
                        }}
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </div>

            <div className={`resume-list-content__description-box ${isActive ? 'is-active' : ''}`}>
                <div className="resume-list-content__description" style={{ paddingTop: '0' }}>{description}</div>
            </div>
        </>
    );
};

const ExperienceSection = ({ title, items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="experience" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className={`resume-section__content ${activeIndex !== null ? 'has-active' : ''}`}>
                {items.map((item, index) => (
                    <ExperienceItem
                        key={index}
                        {...item}
                        isActive={activeIndex === index}
                        isAnyActive={activeIndex !== null}
                        onClick={() => handleItemClick(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection;
