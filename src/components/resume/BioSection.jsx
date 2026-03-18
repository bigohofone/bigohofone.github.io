import React, { Fragment } from 'react';

import Links from '../links';
import { downloadCV } from '../cv/cvPDF';


const BioSection = () => {
    return (
        <>
            <section className="resume-section-narrow">
                <div className="resume-bio__header-box">
                    <img className="resume-bio__profile" src={process.env.PUBLIC_URL + '/assets/img/profile.jpeg'} alt="Wonjun Oh" />
                    <div className="resume-bio__profile-box">
                        <div>
                            <div className="resume-bio__greeting">Hello! <span className="wave">👋</span></div>
                            <div className="resume-bio__greeting">I'm Wonjun Oh.</div>
                        </div>

                        <div>
                            <div className="resume-bio__desc">
                                Incoming Student, KAIST <br />
                                <a href="mailto:bigohofone@gmail.com" className="resume-bio__mail">bigohofone [AT] gmail.com</a>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <Links />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="resume-section-narrow">
                <div className="resume-bio__content-box">
                    <h2 className="resume-section__title">Bio.</h2>
                    <p className="resume-bio__desc">
                        I am an incoming graduate student at KAIST, where I am a member of the COCOLab under the supervision of Prof. Hyonwoo Kim. I earned my B.S. from Korea University.
                        <br /><br />
                        My research adopts a data-centric approach across NLP and multimodal domains, specifically targeting bottlenecks in training paradigms like Supervised Fine-Tuning and Reinforcement Learning. Currently, I am working on data selection and filtering methods to enhance LLM reasoning capabilities.
                    </p>
                </div >
            </section >
        </>
    );
};

export default BioSection;
