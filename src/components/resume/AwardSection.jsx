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
        <div
            className={`resume-section__list-item ${isActive ? 'is-active' : ''} ${isAnyActive && !isActive ? 'is-dimmed' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="resume-section__list-item-content">
                <div className="resume-section__list-item-title">
                    {title}
                </div>
                <div className="resume-section__content-item-meta">
                    <span className="resume-section__content-item-meta-subtitle">
                        {organization}
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <span className="resume-section__content-item-meta-item">
                            {date}
                        </span>
                        <span className="resume-section__content-item-meta-item" style={{ backgroundColor: getColor(type), borderColor: getColor(type) }}>
                            {type}
                        </span>
                    </div>
                </div>
                {description && (
                    <p className="resume-section__content-item-description">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

const AwardSection = ({ title, items }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleItemClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="awards" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className={`resume-section__list ${activeIndex !== null ? 'has-active' : ''}`}>
                {items.map((item, index) => (
                    <AwardItem
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

export default AwardSection;
