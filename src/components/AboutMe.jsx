import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';


const SCROLL_PER_STEP = 300;


function fetchText(path) {
    return fetch(path).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        return res.text();
    });
}


function textToParagraph(text) {
    if (!text) return [];
    
    const parts = text.split(/([.?!]+[\s\n]*)/);
    const sentences = [];
    
    for (let i = 0; i < parts.length; i += 2) {
        const core = parts[i];
        const sep = parts[i + 1] || '';
        if (core || sep) {
            sentences.push(core + sep);
        }
    }
    
    return sentences;
}


function parseIntoParagraphs(text) {
    if (!text) return [];
    // CRLF/CR/LF 모두 처리, 연속 개행은 빈 문단('')을 만들어줌
    const rawParagraphs = text.split(/\r?\n/);
    return rawParagraphs.map(p => textToParagraph(p));
}


function AboutMe() {
    const app = useAppContext();
    const locale = app?.locale || 'en';

    const [paragraphs, setParagraphs] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const containerRef = useRef(null);

    // A. 텍스트 데이터 로드
    useEffect(() => {
        const path = `/data/about_me/description.${locale}.txt`;
        
        fetchText(path)
            .then((data) => {
                const parsedParagraphs = parseIntoParagraphs(data);
                setParagraphs(parsedParagraphs);
            })
            .catch((err) => {
                console.error("Text load failed:", err);
                setParagraphs([[ "데이터를 불러오는 중 오류가 발생했습니다." ]]);
            });
    }, [locale]);

    // 전체 문장(flatten) 배열 계산
    const flattened = paragraphs.flat();

    // B. 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrolledDistance = -rect.top;
        if (scrolledDistance < 0) { setCurrentStep(0); return; }

        const step = Math.floor(scrolledDistance / SCROLL_PER_STEP);
        const safeStep = Math.min(step, Math.max(flattened.length - 1, 0));
        setCurrentStep(safeStep);
    };

    // C. 이벤트 리스너 등록
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [paragraphs]); // paragraphs 변경 시 재계산

    if (flattened.length === 0) return null;

    // 전체 트랙 높이: (전체 문장 수 * 스텝당 높이) + 여유공간
    const totalHeight = (flattened.length * SCROLL_PER_STEP) + window.innerHeight;

    // 색상 결정 함수: 현재, 이전 1개, 이전 2개, 그 외로 구분
    const getOpacity = (index, current) => {
        if (index === current) return 1.0;
        if (index === current - 1) return 0.5;
        if (index === current - 2) return 0.3;
        return 0.2;
    };

    return (
        <div 
            ref={containerRef}
            style={{ 
                height: `${totalHeight}px`,
                position: 'relative'
            }}
        >
            <div // 고정 컨테이너
                style={{ 
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    overflow: 'hidden',
                    paddingTop: 'var(--section-padding-with-header)',
                }}
            >
                <div style={{ maxWidth: 'var(--section-width-default)', padding: '0 var(--section-padding-default)', margin: '0 auto' }}>
                    {
                        (() => {
                            let globalIndex = 0;
                            return paragraphs.map((para, pIndex) => {
                                if (!para || para.length === 0) {
                                    return (
                                        <div key={`p-${pIndex}`} style={{ height: '0.5rem' }} />
                                    );
                                }

                                return (
                                    <div key={`p-${pIndex}`} style={{ display: 'block', marginBottom: '0' }}>
                                        {para.map((text, sIndex) => {
                                            const idx = globalIndex++;
                                            const isActive = idx === currentStep;

                                            return (
                                                <span 
                                                    key={`${pIndex}-${sIndex}`}
                                                    style={{
                                                        fontSize: 'var(--font-size-xl)',
                                                        fontWeight: '500',
                                                        lineHeight: '1.5',
                                                        wordBreak: 'keep-all',
                                                        marginRight: '0',
                                                        transition: 'all 0.25s ease',
                                                        color: 'var(--color-on-text-primary)',
                                                        opacity: getOpacity(idx, currentStep),
                                                        whiteSpace: 'pre-wrap' // 탭/연속공백/개행(문단내) 보존
                                                    }}
                                                >
                                                    {text}
                                                </span>
                                            );
                                        })}
                                    </div>
                                );
                            });
                        })()
                    }
                </div>
            </div>
        </div>
    );
};

export default AboutMe;
export { AboutMe };

