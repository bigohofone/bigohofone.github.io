import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { contactStyles } from './contactStyles';

export function ContactComponent() {

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

    const style = contactStyles();

    return (
        <div style={style.container}>
            <div ref={contactRef} style={style.inner}>
                <div style={style.innerTitleContainer}>
                    <div style={style.innerTitle}>
                        {
                            locale === 'ko'
                            ? <>연락처</>
                            : <>Contact</>
                        }
                    </div>
                </div>
                <div style={style.innerContainer}>
                    <div style={style.innerContent}>
                        <p style={style.innerContentText}>   
                        {
                            locale === 'ko'
                            ? <>연구 문의 및 협업 제안은 언제든지 환영합니다. 편하게 연락해 주세요.</>
                            : <>For research inquiries or collaboration opportunities, feel free to reach out.</>
                        }
                        </p>
                        <p style={style.innerContentShortcut} >   
                            <div className="material-symbols-rounded" style={{ fontSize: 'var(--font-size-lg)', transform: 'translateY(0.025em)'}}>mail</div>
                            <a href="mailto:owj0421@naver.com">owj0421@naver.com</a>
                            <div className="material-symbols-rounded" style={{ fontSize: 'var(--font-size-md)'}}>arrow_outward</div>
                        </p>
                    </div>
                    <div style={style.innerContent}>
                        <p style={style.innerContentText}>
                            {
                                locale === 'ko'
                                ? <>여기서 만날 수 있습니다. 오시기 전에 먼저 연락해주세요.</>
                                : <>Come find me here. Please contact me in advance.</>
                            }
                        </p>
                        <p style={style.innerContentShortcut} >
                            <div className="material-symbols-rounded" style={{ fontSize: 'var(--font-size-lg)'}}>location_on</div>
                            <p>{ locale === 'ko' ? <>서울, 대한민국</> : <>Seoul, South Korea</>}</p>
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: mapHeight, overflow: 'hidden' }}>
                    <iframe
                            title="google-map-preview"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12652.173316085665!2d126.9779698!3d37.566535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28e3f0df2d9%3A0xf65ba58ff13c474f!2sSeoul!5e0!3m2!1sen!2skr!4v1700000000000"
                    ></iframe>
            </div>
        </div>
    );
};