import React, { useState } from 'react';
import { FiBookmark, FiCalendar } from 'react-icons/fi';
import Section from './SectionBase';

const AwardItem = ({ title, organization, date, type, description, isActive, isAnyActive, onClick }) => {
    const getColor = (type) => {
        switch (type) {
            case 'Award':
                return '#AECBFA'; // 차분한 파스텔 블루
            case 'Scholarship':
                return '#CCFFD1'; // 부드러운 민트 그린
            case 'Honor':
                return '#FFF2B2'; // 따뜻한 파스텔 옐로우
            default:
                return 'transparent'; // 혹은 적절한 기본값
        }
    };

    return (
        <>
            <div
                className={`resume-list-content__wrapper ${isActive ? 'is-active' : ''} ${isAnyActive && !isActive ? 'is-dimmed' : ''}`}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
            >
                <div className="resume-content__box">
                    <div className="resume-content__meta-box">
                        <span className="resume-content__meta">{date}</span>
                    </div>
                    <div className="resume-content__title">{title}</div>
                    <div className="resume-content__subtitle">{organization}</div>
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
                <p className="resume-list-content__description">{description}</p>
            </div>
        </>
    );
};

const AwardSection = ({ title, items }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [showSelectedOnly, setShowSelectedOnly] = useState(true);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const selectedCount = items.filter(item => item.selected).length;
    const totalCount = items.length;

    return (
        <section id="awards" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>

            <div className="resume-section__toggle-container">
                <button
                    className={`resume-section__toggle-btn ${showSelectedOnly ? 'is-active' : ''}`}
                    onClick={() => setShowSelectedOnly(true)}
                >
                    Selected ({selectedCount})
                </button>
                <button
                    className={`resume-section__toggle-btn ${!showSelectedOnly ? 'is-active' : ''}`}
                    onClick={() => setShowSelectedOnly(false)}
                >
                    All ({totalCount})
                </button>
            </div>

            <div className={`resume-section__list-content ${activeIndex !== null ? 'has-active' : ''}`}>
                {items.map((item, index) => (
                    (!showSelectedOnly || item.selected) && <AwardItem
                        key={index}
                        {...item}
                        isActive={activeIndex === index}
                        isAnyActive={activeIndex !== null}
                        onClick={() => handleItemClick(index)}
                    />
                ))}
            </div>
        </section >
    );
};

export default AwardSection;
