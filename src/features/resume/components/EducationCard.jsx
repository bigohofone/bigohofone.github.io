
import React from 'react';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

const EducationCard = ({
    title,
    organization,
    date,
    location,
    logo
}) => {
    return (
        <div className="wonjunoh-resume-experience-card" style={{ alignItems: 'flex-start' }}>
            <div className="wonjunoh-resume-experience-logo-container">
                {logo ? (
                    <img
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                        className="wonjunoh-resume-experience-logo"
                    />
                ) : (
                    <FaGraduationCap />
                )}
            </div>

            <div className="wonjunoh-resume-experience-content">
                {/* 1. School Name on Top */}
                <h3 className="wonjunoh-resume-experience-title">
                    {organization}
                </h3>

                {/* 2. Date and Location with Icons */}
                <div className="wonjunoh-resume-experience-meta">
                    <span className="wonjunoh-resume-meta-item">
                        <FiCalendar /> {date}
                    </span>
                    <span className="wonjunoh-resume-meta-item">
                        <FiMapPin /> {location}
                    </span>
                </div>

                {/* 3. Degree and GPA (Smaller) */}
                <p style={{
                    fontSize: 'var(--wr-font-s)',
                    color: 'var(--wr-text-secondary)',
                    margin: 0,
                    fontWeight: 'var(--wr-weight-normal)'
                }}>
                    {title}
                </p>
            </div>
        </div>
    );
};

export default EducationCard;
