import React from 'react';
import { SECTIONS } from '../utils/sectionConfig';

function SectionCard({ sectionKey, data }) {
    const [expanded, setExpanded] = React.useState(false);

    const sectionConfig = SECTIONS?.[sectionKey];
    if (!sectionConfig || typeof sectionConfig.component !== 'function') return null;

    const handleToggle = () => setExpanded((prev) => !prev);

    const CardComponent = sectionConfig.component;

    return (
        <CardComponent data={data} expanded={expanded} onToggle={handleToggle} />
    );
}

function SectionCardList({ sectionKey, items }) {
    if (!Array.isArray(items) || items.length === 0) {
        return <div>No data available.</div>;
    }
    return (
        <>
            {items.map((item, idx) => (
                <SectionCard key={idx} sectionKey={sectionKey} data={item} />
            ))}
        </>
    );
}

export default function Content({
    sectionActive,
    sectionData,
    loading,
    error,
    isNavFixed,
    navHeight,
}) {
    const contentStyle = isNavFixed && navHeight ? { marginTop: navHeight } : undefined;

    if (loading) {
        return (
            <main className="content" style={contentStyle}>
                <div>Loading...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="content" style={contentStyle}>
                <div>Error!</div>
            </main>
        );
    }

    return (
        <div className="card-container" style={contentStyle}>
            <SectionCardList sectionKey={sectionActive} items={sectionData} />
        </div>
    );
}
