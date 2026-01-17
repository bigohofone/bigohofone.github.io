import React from 'react';

const Section = ({ id, title, children }) => {
    return (
        <section id={id} className="wonjunoh-resume-section">
            <h2 className="wonjunoh-resume-section-title">{title}</h2>
            {children}
        </section>
    );
};

export default Section;
