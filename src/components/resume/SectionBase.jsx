import React from 'react';

const Section = ({ id, title, children }) => {
    return (
        <section id={id} className="resume-section">
            <h2 className="resume-section__title">{title}</h2>
            {children}
        </section>
    );
};

export default Section;
