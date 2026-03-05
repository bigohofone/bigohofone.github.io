import React from 'react';
import { FiBookmark, FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const ExperienceItem = ({
    role,
    organization,
    date,
    location,
    description,
    logo
}) => {
    return (
        <div className="resume-section__content-item">
            <div className="resume-section__content-item-logo-container">
                {logo ? (
                    <img
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                        className="resume-section__content-item-logo"
                    />
                ) : (
                    <FiBookmark />
                )}
            </div>

            <div className="resume-section__content-item-container">
                <h3 className="resume-section__content-item-title">{organization}</h3>

                <div className="resume-section__content-item-meta">
                    <span className="resume-section__content-item-meta-subtitle">
                        {role}
                    </span>
                    <span className="resume-section__content-item-meta-item">
                        {date}
                        {/* <FiCalendar className="resume-section__content-item-meta-icon" /> {date} */}
                    </span>
                    {/* <span className="resume-section__content-item-meta-item">
                        <FiMapPin className="resume-section__content-item-meta-icon" /> {location}
                    </span> */}
                </div>
                <div className="resume-section__content-item-description">
                    {description}
                </div>
            </div>
        </div>
    );
};

const ExperienceSection = ({ title, items }) => {
    return (
        <section id="experience" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className="resume-section__content">
                {items.map((item, index) => (
                    <ExperienceItem
                        key={index}
                        {...item}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection;
