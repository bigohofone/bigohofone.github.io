import React from 'react';

const PublicationCard = ({ _index, title, authors, venue, tags = [], links }) => {
    return (
        <div className="wonjunoh-resume-list-entry">
            {/* Header: Title */}
            <div className="wonjunoh-resume-list-header">
                <div className="wonjunoh-resume-list-title">{title}</div>
            </div>

            {/* Authors */}
            <div className="wonjunoh-resume-list-desc" style={{ marginBottom: '4px' }}>
                {authors}
            </div>

            {/* Venue, Tags, & Links */}
            <div className="wonjunoh-resume-list-sub" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>

                {/* Venue Name */}
                <span style={{ fontWeight: 'var(--wr-weight-normal)', fontSize: 'var(--wr-font-s)' }}>
                    {venue}
                </span>

                {/* Tags Logic */}
                {tags.map((tag, i) => {
                    const lowerTag = tag.toLowerCase();
                    if (lowerTag === 'main') return null;
                    if (lowerTag === 'findings') {
                        return (
                            <span key={i} style={{ color: 'var(--wr-text-secondary)', fontWeight: 300, marginRight: '4px' }}>
                                {tag}
                            </span>
                        );
                    }
                    // Default badge style for Oral, Spotlight, Awards
                    return (
                        <span key={i} className="wonjunoh-resume-badge" style={{ color: '#000', borderColor: '#000', fontWeight: 500 }}>
                            {tag}
                        </span>
                    );
                })}

                {/* Links */}
                {links && links.map((link, i) => (
                    <a
                        key={`link-${i}`}
                        href={link.url}
                        className="wonjunoh-resume-badge"
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

export default PublicationCard;
