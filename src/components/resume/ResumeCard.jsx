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
        <div className="card">
            <div className="card-logo-container">
                {logo ? (
                    <img
                        src={logo.startsWith('http') ? logo : process.env.PUBLIC_URL + logo}
                        alt={`${organization} logo`}
                        className="card-logo"
                    />
                ) : (
                    <FiBookmark />
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{title}</h3>

                <div className="card-meta">
                    <span className="meta-item">
                        <FiBookmark /> {organization}
                    </span>
                    <span className="meta-item">
                        <FiCalendar /> {date}
                    </span>
                    <span className="meta-item">
                        <FiMapPin /> {location}
                    </span>
                </div>

                <p className="card-desc">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ResumeCard;
