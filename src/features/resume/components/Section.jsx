import React from 'react';

const Section = ({ id, title, children }) => {
    return (
        <section id={id} className="section">
            <h2 className="section-title">{title}</h2>
            {children}
        </section>
    );
};

export default Section;
