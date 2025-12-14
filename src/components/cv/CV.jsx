import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { cvStyles } from './cvStyles';

const CV_FPATH = '/data/cv/cv_20251111.pdf'

export function CVComponent() {

    const { locale } = useAppContext();
    const contactRef = useRef(null);

    const [mapHeight, setMapHeight] = useState('500px');

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

    const style = cvStyles();

    return (
        <div style={style.container}>
            <div ref={contactRef} style={style.inner}>
                <div style={style.innerTitleContainer}>
                    <div style={style.innerTitle}>
                        {
                            locale === 'ko'
                            ? <>CV</>
                            : <>CV</>
                        }
                    </div>
                </div>
                <div style={style.innerContainer}>
                    <div style={style.innerContent}>
                        <p style={style.innerContentShortcut} >  
                            <div className="material-symbols-rounded" style={{ fontSize: 'var(--font-size-lg)' }}>download</div> 
                            <div>
                                <a href={CV_FPATH}>
                                    {
                                    locale === 'ko'
                                    ? <>다운로드</>
                                    : <>Download</>
                                }
                                </a>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: mapHeight, overflow: 'hidden' }}>
                <iframe src={CV_FPATH} title="example" width="100%" height="100%" frameborder="0"></iframe>
            </div>
        </div>
    );
};