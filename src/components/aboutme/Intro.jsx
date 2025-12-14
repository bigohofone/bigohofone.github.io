import React, { useState, useEffect, useRef } from 'react';

import { useAppContext } from '../../contexts/AppContext.jsx';
import { IntroStyles } from './aboutmeStyles.jsx';

import { mobileBreakpoint } from '../../assets/styles/breakpoints.jsx';

const BACKGROUND_IMG_FPATH = "/assets/img/intro-background.jpeg"
const INTRO_SCOLL_HEIGHT = window.innerHeight * 2;


export default function Intro() {
    const app = useAppContext();
    const locale = app?.locale || 'en';

    const style = IntroStyles();

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let maskSize = 'none';
    if (app?.width < app?.height) {
        const start = 50;
        const end = 500;
        maskSize = `auto ${Math.min(start + (end-start) * (scrollY * 2 / INTRO_SCOLL_HEIGHT), end)}vh`
    } else {
        const start = 25;
        const end = 500;
        maskSize = `${Math.min(start + (end-start) * (scrollY * 2 / INTRO_SCOLL_HEIGHT), end)}vw auto`
    }

    return (
        <div style={{
            height: `${INTRO_SCOLL_HEIGHT}px`
        }}>
            <div style={style.container}>
                <div 
                    style={{
                        ...style.imgContainer,
                        maskImage: 'url(/assets/logo/cloud-mask.svg)',
                        WebkitMaskImage: 'url(/assets/logo/cloud-mask.svg)', // For Safari compatibility
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskSize: maskSize,
                        WebkitMaskSize: maskSize,
                        maskPosition: `50% 50%`,
                        WebkitMaskPosition: `50% 50%`,
                    }}

                >
                    <div style={style.inner}>
                        <span style={{...style.Text, color: 'white'}}>Hello, 안녕하세요!</span>
                    </div>
                    <img 
                        src={BACKGROUND_IMG_FPATH}
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