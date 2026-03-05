import React from 'react';

const PublicationItem = ({ _index, title, authors, venue, tags = [], links }) => {
    return (
        <div className="resume-section__list-item">
            <div className="resume-section__list-item-title">{title}</div>
            <div className="resume-section__list-item-description">{authors}</div>
            <div className="resume-section__list-item-description">
                {venue}
                {links && links.map((link, i) => (
                    <a
                        key={`link-${i}`}
                        href={link.url}
                        className="resume-section__list-item-description-link"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    );
};

const PublicationSection = ({ title, items }) => {
    return (
        <section id="publications" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className="resume-section__list">
                {items.map((item, index) => (
                    <PublicationItem
                        key={index}
                        _index={index + 1}
                        {...item}
                    />
                ))}
            </div>
        </section>
    );
};

export default PublicationSection;
