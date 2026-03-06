import React from 'react';
import BioSection from '../components/resume/BioSection';
import HeaderShortcutDock from '../components/headerShortcutDock';

import EducationSection from '../components/resume/EducationSection';
import ExperienceSection from '../components/resume/ExperienceSection';
import PublicationSection from '../components/resume/PublicationSection';
import AwardSection from '../components/resume/AwardSection';
import content from '../data/content';

import { pdf } from '@react-pdf/renderer';
import CVPdfDocument from '../components/cv/cvPDF';

async function downloadCV() {
    try {
        const blob = await pdf(<CVPdfDocument />).toBlob();
        window.open(URL.createObjectURL(blob), '_blank');
    } catch (err) {
        console.error('Error generating PDF:', err);
    }
}

const ResumePage = () => {
    const { education, experience, publications, awards } = content;

    return (
        <main className="base-layout">

            <HeaderShortcutDock />

            <BioSection />

            <EducationSection
                title={education.title}
                items={education.items}
            />

            <ExperienceSection
                title={experience.title}
                items={experience.items}
            />

            <PublicationSection
                title={publications.title}
                items={publications.items}
            />

            <AwardSection
                title={awards.title}
                items={awards.items}
            />

            <div id="download-cv" className="resume-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* <h2 className="resume-section__title">Download CV</h2> */}
                <button className="download-cv-button" aria-label="Download CV" onClick={downloadCV}>
                    {/* <FaDownload /> */}
                    Download CV
                </button>
            </div>
        </main>
    );
};

export default ResumePage;
