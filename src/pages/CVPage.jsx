import React from 'react';
import '../assets/styles/cv_page.css';
import { FaLinkedin, FaGithub, FaXTwitter, FaEnvelope, FaGlobe, FaDownload } from 'react-icons/fa6';
import { SiGooglescholar } from 'react-icons/si';
import LiquidGlass from 'liquid-glass-react';

// Import all data
import { profile } from '../data/profile';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { publications } from '../data/publications';
import { awards } from '../data/awards';
import { advising } from '../data/advising';
import { extracurricular } from '../data/extracurricular';
import { contact } from '../data/contact';

// Helper: Get icon for contact item
const getContactIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes('email')) return <FaEnvelope />;
    if (l.includes('website')) return <FaGlobe />;
    if (l.includes('x (twitter)') || l === 'x') return <FaXTwitter />;
    if (l.includes('linkedin')) return <FaLinkedin />;
    if (l.includes('github')) return <FaGithub />;
    if (l.includes('google scholar')) return <SiGooglescholar />;
    return null;
};

const CVPage = () => {
    const cvRef = React.useRef(null);
    const wrapperRef = React.useRef(null);
    const dockRef = React.useRef(null);
    const [dockTop, setDockTop] = React.useState('0px');

    const [pageCount, setPageCount] = React.useState(1);
    const [scale, setScale] = React.useState(1);

    // Add cv-page-body class to body for dark background
    React.useEffect(() => {
        document.documentElement.classList.add('cv-page-html');
        document.body.classList.add('cv-page-body');
        return () => {
            document.documentElement.classList.remove('cv-page-html');
            document.body.classList.remove('cv-page-body');
        };
    }, []);

    // Calculate scale for mobile responsiveness
    React.useEffect(() => {
        const calculateScale = () => {
            const a4WidthMm = 210;
            const pxPerMm = 3.7795275591;
            const a4WidthPx = a4WidthMm * pxPerMm;
            const viewportWidth = window.innerWidth;
            const padding = 32; // 16px padding on each side
            const availableWidth = viewportWidth - padding;

            if (availableWidth < a4WidthPx) {
                setScale(availableWidth / a4WidthPx);
            } else {
                setScale(1);
            }
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, []);

    // Calculate dock position
    React.useEffect(() => {
        const calculateDockPosition = () => {
            if (dockRef.current) {
                const navHeight = dockRef.current.offsetHeight;
                const topPosition = window.innerHeight - navHeight - 8 - 12;
                setDockTop(`${topPosition}px`);
            }
        };

        calculateDockPosition();
        window.addEventListener('resize', calculateDockPosition);
        return () => window.removeEventListener('resize', calculateDockPosition);
    }, []);

    // Dynamic Pagination for Web View
    React.useLayoutEffect(() => {
        const paginate = () => {
            const container = cvRef.current;
            if (!container) return;

            // Group elements by category to handle section behavior
            const sections = container.querySelectorAll('.cv-section');
            const elements = [];

            sections.forEach(sec => {
                const title = sec.querySelector('.cv-section-title');
                const items = sec.querySelectorAll('.cv-entry, .cv-list-item');

                if (title) elements.push({ el: title, isTitle: true, section: sec });
                items.forEach((item, idx) => {
                    elements.push({ el: item, isFirstInSec: idx === 0, section: sec });
                });
            });

            // Reset all margins before recalculating
            elements.forEach(obj => {
                obj.el.style.marginTop = '';
            });

            const pageHeightMm = 297;
            const pxPerMm = 3.7795275591; // Standard 96 DPI conversion
            const pageHeightPx = pageHeightMm * pxPerMm;

            const containerTop = container.getBoundingClientRect().top + window.scrollY;

            for (let i = 0; i < elements.length; i++) {
                const obj = elements[i];
                const rect = obj.el.getBoundingClientRect();
                const elTop = rect.top + window.scrollY - containerTop;
                const elBottom = rect.bottom + window.scrollY - containerTop;

                const paddingMm = 20; // Matches @page margin
                const paddingPx = paddingMm * pxPerMm;

                // Current page index and boundaries
                const pageIndex = Math.floor((elTop + 2) / pageHeightPx);
                const pageBottomBoundary = (pageIndex + 1) * pageHeightPx - paddingPx;
                const nextPageTopBoundary = (pageIndex + 1) * pageHeightPx + paddingPx;

                let shouldShift = false;

                // 1. If element itself crosses the bottom padding boundary
                if (elTop < pageBottomBoundary && elBottom > pageBottomBoundary - 5) {
                    shouldShift = true;
                }

                // 2. If it's a title, peek at the first item
                if (obj.isTitle) {
                    const nextObj = elements[i + 1];
                    if (nextObj && nextObj.isFirstInSec) {
                        const nextRect = nextObj.el.getBoundingClientRect();
                        const nextTop = nextRect.top + window.scrollY - containerTop;
                        const nextPageIndex = Math.floor((nextTop + 2) / pageHeightPx);

                        // If first item is split OR already pushed to next page usable area
                        const firstItemIsSplit = nextTop < pageBottomBoundary && nextTop > pageBottomBoundary - 30;
                        const firstItemOnNextPage = nextPageIndex > pageIndex;

                        if (firstItemIsSplit || firstItemOnNextPage) {
                            shouldShift = true;
                        }
                    }
                }

                if (shouldShift) {
                    // Shift to the start of the next page's usable area (after its top padding)
                    const shift = (nextPageTopBoundary - elTop);
                    obj.el.style.marginTop = `${shift}px`;
                }
            }

            // Calculate total pages after pagination
            const totalHeight = container.scrollHeight;
            const computedPages = Math.ceil(totalHeight / pageHeightPx);
            setPageCount(computedPages);

            // Set container height to exact multiple of page height for full A4 display
            container.style.minHeight = `${computedPages * 297}mm`;
        };

        // Run on mount and a bit after to ensure fonts/layout are stable
        paginate();
        const timer = setTimeout(paginate, 500);
        window.addEventListener('resize', paginate);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', paginate);
        };
    }, []);

    const handleDownload = () => {
        window.print();
    };

    const PageMarkers = ({ pages }) => {
        const markers = [];
        for (let i = 0; i < pages; i++) {
            const top = i * 297;
            const isLastPage = i === pages - 1;
            markers.push(
                <React.Fragment key={i}>
                    <div className="cv-page-marker corner-tl" style={{ top: `${top}mm`, left: 0 }} />
                    <div className="cv-page-marker corner-tr" style={{ top: `${top}mm`, right: 0 }} />
                    {/* Skip bottom markers on last page to prevent extra blank page in PDF */}
                    {!isLastPage && (
                        <>
                            <div className="cv-page-marker corner-bl" style={{ top: `${top + 297}mm`, left: 0 }} />
                            <div className="cv-page-marker corner-br" style={{ top: `${top + 297}mm`, right: 0 }} />
                        </>
                    )}
                </React.Fragment>
            );
        }
        return <div className="cv-page-markers-container">{markers}</div>;
    };

    return (
        <>
            <div
                className="cv-page-wrapper"
                ref={wrapperRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: scale < 1 ? `${100 / scale}%` : '100%',
                    marginLeft: scale < 1 ? `${-(100 / scale - 100) / 2}%` : 0,
                    marginBottom: scale < 1 ? `${-(pageCount * 297 * 3.7795275591 * (1 - scale))}px` : 0,
                }}
            >
                <div className="cv-page" ref={cvRef}>
                    <PageMarkers pages={pageCount} />
                    {/* Header */}
                    <header className="cv-header">
                        <h1 className="cv-name">{profile.name}</h1>
                        <div className="cv-contact">
                            {contact.items.map((item, index) => (
                                <a key={index} href={item.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4pt' }}>
                                    {getContactIcon(item.label)} {item.value}
                                </a>
                            ))}
                        </div>
                    </header>

                    {/* Education */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{education.title}</h2>
                        {education.items.map((item, index) => (
                            <div key={index} className="cv-entry">
                                <div className="cv-entry-header">
                                    <span className="cv-entry-title">{item.organization}, {item.location}</span>
                                    <span className="cv-entry-date">{item.date}</span>
                                </div>
                                <p className="cv-entry-description">{item.title}</p>
                            </div>
                        ))}
                    </section>

                    {/* Experience */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{experience.title}</h2>
                        {experience.items.map((item, index) => (
                            <div key={index} className="cv-entry">
                                <div className="cv-entry-header">
                                    <span className="cv-entry-title">{item.title}</span>
                                    <span className="cv-entry-date">{item.date}</span>
                                </div>
                                <div className="cv-entry-organization">{item.organization}, {item.location}</div>
                                <p className="cv-entry-description">{item.description}</p>
                            </div>
                        ))}
                    </section>

                    {/* Publications */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{publications.title}</h2>
                        <ul className="cv-list">
                            {publications.items.map((item, index) => (
                                <li key={index} className="cv-list-item">
                                    <div className="cv-list-item-title">{item.title}</div>
                                    <div>{item.authors}</div>
                                    <div>
                                        <em>{item.venue}</em>
                                        {item.tags && item.tags.length > 0 && ` (${item.tags.join(', ')})`}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Awards */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{awards.title}</h2>
                        <ul className="cv-list">
                            {awards.items.map((item, index) => (
                                <li key={index} className="cv-list-item">
                                    <span className="cv-list-item-title">{item.title}</span>
                                    {' - '}{item.organization}
                                    {`; `}{item.date}
                                    {item.description && `; ${item.description}`}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Advising & Mentoring */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{advising.title}</h2>
                        <ul className="cv-list">
                            {advising.items.map((item, index) => (
                                <li key={index} className="cv-list-item">
                                    <span className="cv-list-item-title">{item.title}</span>
                                    {' - '}{item.organization}
                                    {`; `}{item.date}
                                    {item.description && `; ${item.description}`}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Extracurricular Activities */}
                    <section className="cv-section">
                        <h2 className="cv-section-title">{extracurricular.title}</h2>
                        <ul className="cv-list">
                            {extracurricular.items.map((item, index) => (
                                <li key={index} className="cv-list-item">
                                    <span className="cv-list-item-title">{item.title}</span>
                                    {' - '}{item.organization}
                                    {`; `}{item.date}
                                    {item.description && `; ${item.description}`}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Download Button - Dock Style */}
            <LiquidGlass
                displacementScale={64}
                blurAmount={0.1}
                saturation={130}
                aberrationIntensity={2}
                elasticity={0.15}
                cornerRadius={9999}
                padding="8px"
                // mouseOffset={{ x: 0, y: 0 }}/
                style={{
                    position: 'fixed',
                    top: dockTop,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    // zIndex: 1000,
                }}
            >
                <nav className="cv-download-dock" ref={dockRef}>
                    <button className="cv-download-btn" onClick={handleDownload}>
                        <span className="cv-download-tooltip">Download PDF</span>
                        <FaDownload />
                    </button>
                </nav>
            </LiquidGlass>
        </>
    );
};

export default CVPage;
