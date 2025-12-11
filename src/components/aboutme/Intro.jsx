import React, { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../../contexts/AppContext.jsx';
import { IntroStyles } from './aboutmeStyles.jsx';

import { mobileBreakpoint } from '../../assets/styles/breakpoints.jsx';


const INTRO_SCOLL_HEIGHT = window.innerHeight * 2;


export default function Intro() {
    const app = useAppContext();
    const locale = app?.locale || 'en';

    const style = IntroStyles();

    let maskSizeStart = 66;
    if (app.width >= mobileBreakpoint) {
        maskSizeStart = 33;
    };

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let maskSize = maskSizeStart + ((300-maskSizeStart) * (scrollY * 2 / INTRO_SCOLL_HEIGHT));
    maskSize = Math.min(maskSize, 300); // Cap at 1000



    return (
        <div style={{
            height: `${INTRO_SCOLL_HEIGHT}px`
        }}>
            <div style={style.container}>
                <div 
                    style={{
                        ...style.imgContainer,
                        maskImage: 'url(/data/cloud-mask.svg)',
                        WebkitMaskImage: 'url(/data/cloud-mask.svg)', // For Safari compatibility
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskSize: `${maskSize}vw`,
                        WebkitMaskSize: `${maskSize}vw`,
                        maskPosition: `50% 50%`,
                        WebkitMaskPosition: `50% 50%`,
                    }}

                >
                    <div style={style.inner}>
                        <span style={{...style.Text, color: 'white'}}>Hello, 안녕하세요!</span>
                    </div>
                    <img 
                        src="/data/IMG_2483.jpeg" 
                        alt="intro-background" 
                        style={style.img}
                    />
                </div>
                <div style={style.inner}>
                    <span style={style.Text}>Hello, 안녕하세요!</span>
                </div>
            </div>
        </div>
    );
}