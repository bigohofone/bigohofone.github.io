import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '1in',
        fontFamily: 'Times-Roman',
        fontSize: 12,
        lineHeight: 1.25,
        color: '#000',
    },
    header: {
        marginBottom: 48,
    },
    name: {
        fontSize: 24, // Approx 32px
        fontWeight: 'bold',
        marginBottom: 24,
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
        color: '#000',
        textDecoration: 'none',
    },
    section: {
        marginBottom: 16,
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
        marginBottom: 8,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    entryTitle: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    entryDate: {
        fontStyle: 'italic',
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
        width: 25,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontWeight: 'bold',
    },
    venue: {
        fontStyle: 'italic',
    },
});

export default styles;
