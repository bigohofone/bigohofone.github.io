import React from 'react';

const PublicationItem = ({ _index, title, authors, venue, tags = [], links }) => {
    return (
        <a href={links[0].url} target="_blank" rel="noreferrer" className="resume-list-content__wrapper" style={{ cursor: 'pointer' }}>
            <div className="resume-content__box">
                {venue ? (
                    <div className="resume-content__venue">{venue}</div>
                ) : (
                    <div className="resume-content__prepint">Preprint</div>
                )}
                <div className="resume-content__title">{title}</div>
                <div className="resume-content__subtitle">
                    {authors.split(/(Wonjun Oh)/g).map((part, i) =>
                        part === 'Wonjun Oh' ? <span key={i} style={{ textDecoration: 'underline' }}>{part}</span> : part
                    )}
                </div>
            </div>
            <div style={{ margin: 'auto 0 auto 0.25rem', display: 'flex', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 0.3s ease', color: 'var(--sys-color-text-tertiary)' }}>
                    <line x1="8" y1="16" x2="16" y2="8" />
                    <polyline points="8 8 16 8 16 16" />
                </svg>
            </div>
        </a>
    );
};

const PublicationSection = ({ title, items }) => {
    return (
        <section id="publications" className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            <div className="resume-section__list-content">
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
