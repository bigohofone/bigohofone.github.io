import React from 'react';
import BioSection from '../components/resume/BioSection';
import HeaderShortcutDock from '../components/headerShortcutDock';

import EducationSection from '../components/resume/EducationSection';
import ExperienceSection from '../components/resume/ExperienceSection';
import PublicationSection from '../components/resume/PublicationSection';
import AwardSection from '../components/resume/AwardSection';
import content from '../data/content';
import { downloadCV } from '../components/cv/cvPDF';

const ResumePage = () => {
    const { education, experience, publications, awards } = content;

    return (
        <main className="base-layout">
            <HeaderShortcutDock />

            <BioSection />


            <PublicationSection
                title={publications.title}
                items={publications.items}
            />

            <AwardSection
                title={awards.title}
                items={awards.items}
            />

            <ExperienceSection
                title={experience.title}
                items={experience.items}
            />

            <EducationSection
                title={education.title}
                items={education.items}
            />
        </main>
    );
};

export default ResumePage;
