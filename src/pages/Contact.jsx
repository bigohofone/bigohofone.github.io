import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../contexts/AppContext';

const Contact = () => {

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

return (
    <>
        <div
                ref={contactRef}
                style={{
                        maxWidth: 'var(--section-width-default)',
                        padding: 'calc(var(--header-height) + 2rem) 2rem 2rem',
                        margin: '0 auto',
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: '500',
                }}
        >
                <p
                        style={{
                                color: 'var(--color-on-text-subtle)',
                        }}
                >   
                {locale === 'ko'
                        ? <>연구 문의 및 협업 제안은 언제든지 환영합니다. 편하게 연락해 주세요.</>
                        : <>For research inquiries or collaboration opportunities, feel free to reach out.</>
                }
                </p>
                <p
                        style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'var(--color-on-text-primary)',
                                gap: '0.5rem'
                        }}
                >   
                        <div>
                                {
                                locale === 'ko'
                                        ? <>메일: </>
                                        : <>Mail: </>
                                }
                                <a href="mailto:owj0421@naver.com">owj0421@naver.com</a>
                        </div>
                        <div className="material-symbols-outlined">arrow_outward</div>
                </p>

                <p
                        style={{
                                paddingTop: '4rem',
                                color: 'var(--color-on-text-subtle)',
                        }}
                >   
                {locale === 'ko'
                        ? <>여기서 만날 수 있습니다. 오시기 전에 먼저 연락해주세요.</>
                        : <>Come find me here. Please contact me in advance.</>
                }
                </p>
                <p
                        style={{
                                color: 'var(--color-on-text-primary)',
                        }}
                >   
                {locale === 'ko'
                        ? <>위치: 서울, 대한민국</>
                        : <>Location: Seoul, South Korea</>
                }
                </p>
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
    </>
);
};

export default Contact;