import React from 'react';
import ResumeLayout from '../layouts/ResumeLayout';
import Section from '../features/resume/components/Section';
import ResumeCard from '../features/resume/components/ResumeCard';
import AwardCard from '../features/resume/components/AwardCard';
import EducationCard from '../features/resume/components/EducationCard';
import PublicationCard from '../features/resume/components/PublicationCard';
import content from '../data/content';

const ResumePage = () => {
    const { intro, news, education, experience, publications, awards, footer } = content;

    return (
        <ResumeLayout>
            <Section id="intro" title={intro.title}>
                {intro.paragraphs.map((text, index) => (
                    <p
                        key={index}
                        style={{
                            fontSize: 'var(--wr-font-m)',
                            lineHeight: '1.7',
                            color: 'var(--wr-text-main)',
                            marginBottom: index !== intro.paragraphs.length - 1 ? '24px' : '0'
                        }}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                ))}
            </Section>

            <Section id="education" title={education.title}>
                {education.items.map((item, index) => (
                    <EducationCard
                        key={index}
                        title={item.title}
                        organization={item.organization}
                        date={item.date}
                        location={item.location}
                        logo={item.logo}
                    />
                ))}
            </Section>

            <Section id="experience" title={experience.title}>
                {experience.items.map((item, index) => (
                    <ResumeCard
                        key={index}
                        title={item.title}
                        organization={item.organization}
                        date={item.date}
                        location={item.location}
                        description={item.description}
                        logo={item.logo}
                    />
                ))}
            </Section>

            <Section id="publications" title={publications.title}>
                {publications.items.map((item, index) => (
                    <PublicationCard
                        key={index}
                        index={index + 1}
                        title={item.title}
                        authors={item.authors}
                        venue={item.venue}
                        tags={item.tags}
                        links={item.links}
                    />
                ))}
            </Section>

            <Section id="awards" title={awards.title}>
                {awards.items.map((item, index) => (
                    <AwardCard
                        key={index}
                        title={item.title}
                        organization={item.organization}
                        date={item.date}
                        type={item.type}
                        description={item.description}
                    />
                ))}
            </Section>

            <footer style={{
                marginTop: '80px',
                paddingBottom: '120px', // Extra space to not be hidden by navigation dock
                color: 'var(--wr-text-main)',
                fontSize: 'var(--wr-font-m)',
                fontWeight: 'var(--wr-weight-normal)',
                textAlign: 'left',
                width: '100%',
                maxWidth: '540px'
            }}>
                <p>{footer.copyright}</p>
            </footer>
        </ResumeLayout>
    );
};

export default ResumePage;
