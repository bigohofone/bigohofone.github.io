
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Font } from '@react-pdf/renderer';

// Import data
import { profile } from '../data/profile';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { publications } from '../data/publications';
import { awards } from '../data/awards';
import { advising } from '../data/advising';
import { extracurricular } from '../data/extracurricular';
import { contact } from '../data/contact';

// Register standard fonts if needed, but Helvetica is default
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '25mm',
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.25,
        color: '#000',
    },
    header: {
        marginBottom: 16,
        paddingBottom: 12,
    },
    name: {
        fontSize: 24, // Approx 32px
        fontWeight: 'bold',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 6,
        color: '#000',
        textDecoration: 'none',
    },
    section: {
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 12, // var(--wr-font-m)
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    entry: {
        marginBottom: 10,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    entryDate: {
        fontStyle: 'italic', // Helvetica-Oblique
    },
    entryOrganization: {
        fontStyle: 'italic',
        marginBottom: 2,
    },
    entryDescription: {
        marginTop: 0,
    },
    list: {
        marginLeft: 12,
    },
    listItem: {
        marginBottom: 4,
        flexDirection: 'row',
    },
    listItemBullet: {
        width: 10,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontWeight: 'bold',
    },
});

const CVPdfDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{profile.name}</Text>
                <View style={styles.contactRow}>
                    {contact.items.map((item, index) => (
                        <Link key={index} src={item.link} style={styles.contactItem}>
                            <Text>{item.label}: {item.value}</Text>
                        </Link>
                    ))}
                </View>
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{education.title}</Text>
                {education.items.map((item, index) => (
                    <View key={index} style={styles.entry} wrap={false}>
                        <View style={styles.entryHeader}>
                            <Text style={styles.entryTitle}>{item.organization}, {item.location}</Text>
                            <Text style={styles.entryDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.entryDescription}>{item.title}</Text>
                    </View>
                ))}
            </View>

            {/* Experience */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{experience.title}</Text>
                {experience.items.map((item, index) => (
                    <View key={index} style={styles.entry} wrap={false}>
                        <View style={styles.entryHeader}>
                            <Text style={styles.entryTitle}>{item.title}</Text>
                            <Text style={styles.entryDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.entryOrganization}>{item.organization}, {item.location}</Text>
                        <Text style={styles.entryDescription}>{item.description}</Text>
                    </View>
                ))}
            </View>

            {/* Publications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{publications.title}</Text>
                {publications.items.map((item, index) => (
                    <View key={index} style={styles.listItem} wrap={false}>
                        <Text style={styles.listItemBullet}>•</Text>
                        <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>{item.title}</Text>
                            <Text>{item.authors}</Text>
                            <Text>
                                <Text style={{ fontStyle: 'italic' }}>{item.venue}</Text>
                                {item.tags && item.tags.length > 0 && ` (${item.tags.join(', ')})`}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Awards */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{awards.title}</Text>
                {awards.items.map((item, index) => (
                    <View key={index} style={styles.listItem} wrap={false}>
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
                ))}
            </View>

            {/* Advising */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{advising.title}</Text>
                {advising.items.map((item, index) => (
                    <View key={index} style={styles.listItem} wrap={false}>
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
                ))}
            </View>

            {/* Extracurricular */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{extracurricular.title}</Text>
                {extracurricular.items.map((item, index) => (
                    <View key={index} style={styles.listItem} wrap={false}>
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
                ))}
            </View>
        </Page>
    </Document>
);

export default CVPdfDocument;
