import React, { Fragment } from 'react';
// Adjusted import path: src/components/resume -> src/data
import content from '../../data/content';

import Contact from '../contact';


const BioSection = () => {
    const { profile, contact } = content;

    return (
        <>
            <div className="resume-section">
                <h2 style={{ visibility: 'hidden' }}>Bio</h2>
                <div className="resume-section__content-bio">
                    <p className="resume-section__content-bio-greeting">
                        ✋🏼 Hello World!
                    </p>
                    <p>
                        I am <em>Wonjun Oh</em>, a undergraduate research intern in <em>COCOLab</em> at <em>KAIST</em>, advised by <em>Prof. Hyunwoo Kim</em>.
                    </p>
                    <p>
                        My research interests lie at the intersection of NLP and Machine Learning, with a specific focus on <em>data-centric approaches</em> to addressing obstacles arising from large-scale model training across various paradigms, including SFT and RL. I currently work on enhancing the <em>reasoning capabilities of Large Language Models (LLMs)</em>.
                    </p>
                    <p>
                        I received B.S. in Computer Science from <em>Korea University</em>.
                    </p>
                </div>
            </div>
            <Contact />
        </>
    );
};

export default BioSection;
