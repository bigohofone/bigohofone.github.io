import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { desktopBreakpoint, mobileBreakpoint } from '../assets/styles/breakpoints';


function PublicationStyles() {
    const {width} = useAppContext();

    let innerStyle = {
        display: 'flex', flexDirection: 'column',
        width: '100%',
        maxWidth: 'var(--section-width-default)',
        padding: '0 var(--section-padding-default)',
        margin: '0 auto'
    };
    if (width >= desktopBreakpoint) {
        innerStyle = {
            ...innerStyle,
            display: 'grid', gridTemplateColumns: '1fr 3fr',
            gap: '2rem',
            alignItems: 'start',
        };
    }

    return {
        container: {
            display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', gap: '4rem',
            minHeight: '100vh',
            padding: 'calc(var(--header-height) + 2rem) 0 4rem',
        },
        inner: innerStyle,
        innerTitleContainer: {
            marginBottom: (width < desktopBreakpoint) ? '4rem' : '0',
        },
        innerTitle: {
            fontSize: 'var(--font-size-lg)',
            height: 'fit-content',
            lineHeight: '1',
        },
        innerListContainer: {
        },
        innerListItem: {
            display: 'flex', flexDirection: 'row', gap: '0.5rem',
            paddingBottom: '1rem', paddingTop: '1rem',
            borderBottom: '1px solid var(--color-on-text-subsubtle)',
        },
        innerListItem_FirstChild: {
            display: 'flex', flexDirection: 'row', gap: '0.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-on-text-subsubtle)',
        },
        innerListItem_LastChild: {
            display: 'flex', flexDirection: 'row', gap: '0.5rem',
            paddingTop: '1rem',
        },
        innerListItem_Alone: {
            display: 'flex', flexDirection: 'row', gap: '0.5rem',
        },
        innerListItemDate: {
            flex: 1, width: '100%',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-on-text-subtle)',
        },
        innerListItemContent: {
            flex: 3, width: '100%',
            wordBreak: 'keep-all',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
        },
    };
}


const Publications = () => {

    const { locale } = useAppContext();
    const contactRef = useRef(null);

    const [mapHeight, setMapHeight] = useState('500px');

    const style = PublicationStyles();

    const conferenceList = [
        {
            conference: 'ACL',
            year: '2025',
            title: 'ReSCORE: Label-free Iterative Retriever Training for Multi-hop Question Answering with Relevance-Consistency Supervision',
            authors: '{ Dosung Lee, Wonjun Oh }, Boyoung Kim, Minyoung Kim, Joonsuk Park, Paul Hongsuck Seo',
            links: {
                paper: 'https://arxiv.org/pdf/2505.21250',
                github: 'https://github.com/leeds1219/ReSCORE',
            }
        }
    ];

    useEffect(() => {
        const updateMapHeight = () => {
            if (!contactRef.current) return;
            const rect = contactRef.current.getBoundingClientRect();
            const remaining = window.innerHeight - rect.height;
            const height = Math.max(200, Math.floor(remaining)); // minimum 200px
            setMapHeight(`${height}px`);
        };

        updateMapHeight();
        window.addEventListener('resize', updateMapHeight);
        return () => window.removeEventListener('resize', updateMapHeight);
    }, []);

    return (
        <div style={style.container}>
            <div style={style.inner}>
                <div style={style.innerTitleContainer}>
                    <div style={style.innerTitle}>Conference</div>
                </div>
                <div style={style.innerListContainer}>
                    {conferenceList.map((news, index) => (
                        <div key={index} style={
                            ( conferenceList.length === 1 )
                            ? style.innerListItem_Alone
                            : ( index === conferenceList.length - 1 )
                            ? style.innerListItem_LastChild
                            : ( index === 0 )
                            ? style.innerListItem_FirstChild 
                            : style.innerListItem
                        }>
                        <div style={style.innerListItemDate}>{news.conference} {news.year}</div>
                            <div style={style.innerListItemContent}>
                                <div style={{ fontSize: 'var(--font-size-md)', fontWeight: '500' }}>{news.title}</div>
                                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--color-on-text-subtle)' }}>{news.authors}</div>
                                <div style={{ 
                                    fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--color-on-link)',
                                    display: 'flex', flexDirection: 'row', gap: '0.5rem',
                                }}>
                                {Object.keys(news.links).map((key, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href={news.links[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', }}
                                    >[ {key.charAt(0).toUpperCase() + key.slice(1)} ]</a>
                                ))}
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
            {/* <div style={style.inner}>
                <div style={style.innerTitleContainer}>
                    <div style={style.innerTitle}>Jornal</div>
                </div>
                <div style={style.innerListContainer}>
                </div>
            </div> */}
        </div>
    );
};

export default Publications;