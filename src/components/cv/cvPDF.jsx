
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Font, Svg, Path, Circle, Polyline, Line } from '@react-pdf/renderer';
import { FiMail as FiMailWeb, FiGlobe as FiGlobeWeb } from 'react-icons/fi';
import { FaGithub as FaGithubWeb } from 'react-icons/fa';

// Import data
import { profile } from '../../data/profile';
import { education } from '../../data/education';
import { experience } from '../../data/experience';
import { publications } from '../../data/publications';
import { awards } from '../../data/awards';
import { talks } from '../../data/talks';
import { extracurricular } from '../../data/extracurricular';
import { contact } from '../../data/contact';
import styles from './cvStyles';

// Icons compatible with @react-pdf/renderer
const FiMail = () => (
    <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="22,6 12,13 2,6" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const FaGithub = () => (
    <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
        <Path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="black" />
    </Svg>
);

const FiGlobe = () => (
    <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
        <Circle cx="12" cy="12" r="10" fill="none" stroke="black" strokeWidth="2" />
        <Line x1="2" y1="12" x2="22" y2="12" fill="none" stroke="black" strokeWidth="2" />
        <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CVPdfDocument = () => {
    const contactItems = contact.items.filter(item =>
        ['Email', 'GitHub', 'Website'].includes(item.label)
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <View style={styles.contactRow}>
                        {contactItems.map((item, index) => (
                            <Link key={index} src={item.link} style={styles.contactItem}>
                                {item.label === 'Email' && <FiMail />}
                                {item.label === 'GitHub' && <FaGithub />}
                                {item.label === 'Website' && <FiGlobe />}
                                <Text>{item.value}</Text>
                            </Link>
                        ))}
                    </View>
                </View>
                {/* Education */}
                <View style={styles.section}>
                    {education.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{education.title}</Text>}
                            <View style={styles.entry}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{item.organization}, {item.location}</Text>
                                    <Text style={styles.entryDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.entryDescription}>{item.title}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Experience */}
                <View style={styles.section}>
                    {experience.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{experience.title}</Text>}
                            <View style={styles.entry}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>{item.title}</Text>
                                    <Text style={styles.entryDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.entryOrganization}>{item.organization}, {item.location}</Text>
                                <Text style={styles.entryDescription}>{item.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Publications */}
                <View style={styles.section}>
                    {publications.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{publications.title}</Text>}
                            <View style={styles.listItem}>
                                <Text style={styles.listItemBullet}>[{publications.items.length - index}]</Text>
                                <View style={styles.listItemContent}>
                                    <Text style={styles.listItemTitle}>{item.title}</Text>
                                    <Text>{item.authors}</Text>
                                    <Text>
                                        <Text style={styles.venue}>{item.venue}</Text>
                                        {item.tags && item.tags.length > 0 && ` (${item.tags.join(', ')})`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Awards */}
                <View style={styles.section}>
                    {awards.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{awards.title}</Text>}
                            <View style={styles.listItem}>
                                <Text style={styles.listItemBullet}>•</Text>
                                <View style={styles.listItemContent}>
                                    <View style={styles.entryHeader}>
                                        <Text style={styles.listItemTitle}>{item.title}</Text>
                                        <Text style={styles.entryDate}>{item.date}</Text>
                                    </View>
                                    <View>
                                        <Text>
                                            {[item.organization, item.description].filter(Boolean).join('; ')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Talks */}
                <View style={styles.section}>
                    {talks.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{talks.title}</Text>}
                            <View style={styles.listItem}>
                                <Text style={styles.listItemBullet}>•</Text>
                                <View style={styles.listItemContent}>
                                    <Text>
                                        <Text style={styles.listItemTitle}>{item.title}</Text>
                                        {' - '}{item.organization}
                                        {`; `}{item.date}
                                        {item.description && `; ${item.description}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Extracurricular */}
                <View style={styles.section}>
                    {extracurricular.items.map((item, index) => (
                        <View key={index} wrap={false}>
                            {index === 0 && <Text style={styles.sectionTitle}>{extracurricular.title}</Text>}
                            <View style={styles.listItem}>
                                <Text style={styles.listItemBullet}>•</Text>
                                <View style={styles.listItemContent}>
                                    <Text>
                                        <Text style={styles.listItemTitle}>{item.title}</Text>
                                        {' - '}{item.organization}
                                        {`; `}{item.date}
                                        {item.description && `; ${item.description}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default CVPdfDocument;