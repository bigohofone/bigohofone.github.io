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
        <div className="resume-content__wrapper">
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
                <div className="resume-content__title">{organization}</div>
                <div className="resume-content__meta-box">
                    <span className="resume-content__subtitle">{role}</span>
                    <span className="resume-content__meta">{date}</span>
                </div>
                <div className="resume-content__description">{description}</div>
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
