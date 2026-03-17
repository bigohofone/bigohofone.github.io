import React, { Fragment } from 'react';

import Contact from '../contact';
import { downloadCV } from '../cv/cvPDF';


const BioSection = () => {
    return (
        <>
            <section className="resume-section-narrow">
                <div className="resume-bio__header-box">
                    <img className="resume-bio__profile" src={process.env.PUBLIC_URL + '/assets/img/profile.jpeg'} alt="Wonjun Oh" />
                    <h2 className="resume-bio__title">Hello! <br /> I'm Wonjun Oh.</h2>
                </div>
                <div className="resume-bio__content-box">
                    <p className="resume-bio__desc">
                        I'm a incoming graduate student in COCOLab at KAIST advised by Prof. Hyonwoo Kim. before that i got my B.S. from Korea university.
                        <br /><br />
                        I am interested in data-centric approaches to address obstacles arising from model training across various paradigms, including SFT and RL.
                        <br /><br />
                        For more detailed information, please refer to my {' '}
                        <button
                            className="resume-bio__cv-btn"
                            onClick={downloadCV}
                            role="button"
                            tabIndex={0}
                            aria-label="Download CV"
                        >
                            Curriculum Vitae
                            <svg
                                width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round"
                                className="resume-bio__cv-btn-icon"
                            >
                                <line x1="8" y1="16" x2="16" y2="8" />
                                <polyline points="8 8 16 8 16 16" />
                            </svg>
                        </button>
                    </p>
                </div >
                <Contact />
            </section >
        </>
    );
};

export default BioSection;
