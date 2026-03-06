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
        <div className="resume-content__wrapper">
            <div className="resume-content__logo-box">
                {logo ? (
                    <img
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                    />
                ) : (
                    <FaGraduationCap />
                )}
            </div>
            <div className="resume-content__box">
                <div className="resume-content__title">{organization}</div>
                <div className="resume-content__meta-box">
                    <span className="resume-content__subtitle">{major}</span>
                    <span className="resume-content__meta">{date}</span>
                </div>
                <div className="resume-content__description">{description}</div>
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
