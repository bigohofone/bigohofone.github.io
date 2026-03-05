import React from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const EducationItem = ({
    major,
    description,
    organization,
    date,
    location,
    logo
}) => {
    return (
        <div className="resume-section__content-item">
            <div className="resume-section__content-item-logo-container">
                {logo ? (
                    <img
                        className="resume-section__content-item-logo"
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                    />
                ) : (
                    <FaGraduationCap />
                )}
            </div>
            <div className="resume-section__content-item-container">
                <h3 className="resume-section__content-item-title">{organization}</h3>
                <div className="resume-section__content-item-meta">
                    <span className="resume-section__content-item-meta-subtitle">
                        {major}
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

const EducationSection = ({ title, items }) => {
    return (
        <section id="education" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className="resume-section__content">
                {items.map((item, index) => (
                    <EducationItem
                        key={index}
                        {...item}
                    />
                ))}
            </div>
        </section>
    );
};

export default EducationSection;
