import React from "react";
import { useAppContext } from '../contexts/AppContext';

export function Contact() {
    const { locale } = useAppContext();

    return (
        <div
            style={{
                maxWidth: 'var(--section-width-default)',
                padding: '0 var(--section-padding-default)',
                // paddingTop: 'var(--section-padding-with-header)',
                margin: '0 auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.125rem',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: '600',
                    color: 'var(--color-on-text-subsubtle)',
                }}
            >   
            {locale === 'ko'
                ? <>연구 문의 및 협업 제안은 언제든지 환영합니다. 편하게 연락해 주세요.</>
                : <>For research inquiries or collaboration opportunities, feel free to reach out.</>
            }
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.125rem',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: '600',
                    color: 'var(--color-on-text-primary)',
                }}
            >   
                <div>
                    <a href="mailto:owj0421@naver.com">owj0421@naver.com</a>
                </div>
                <div className="material-symbols-outlined">arrow_outward</div>
            </div>
        </div>
    );
}