import React from 'react';
import { FiBookmark, FiCalendar, FiMapPin } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const ResumeCard = ({
    title,
    organization,
    date,
    location,
    description,
    logo
}) => {
    return (
        <div className="wonjunoh-resume-experience-card">
            <div className="wonjunoh-resume-experience-logo-container">
                {logo ? (
                    <img
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                        className="wonjunoh-resume-experience-logo"
                    />
                ) : (
                    <FiBookmark />
                )}
            </div>

            <div className="wonjunoh-resume-experience-content">
                <h3 className="wonjunoh-resume-experience-title">{title}</h3>

                <div className="wonjunoh-resume-experience-meta">
                    <span className="wonjunoh-resume-meta-item">
                        <FiBookmark /> {organization}
                    </span>
                    <span className="wonjunoh-resume-meta-item">
                        <FiCalendar /> {date}
                    </span>
                    <span className="wonjunoh-resume-meta-item">
                        <FiMapPin /> {location}
                    </span>
                </div>

                <p className="wonjunoh-resume-experience-desc">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ResumeCard;
