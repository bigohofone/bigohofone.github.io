import React from 'react';
import { useEffect, useState, useRef } from 'react';

import { useAppContext } from '../../contexts/AppContext.jsx';
import { desktopBreakpoint, mobileBreakpoint } from '../../assets/styles/breakpoints.jsx';


export function IntroStyles() {
    const {width} = useAppContext();

    let TextStyle = {};
    if (width <= mobileBreakpoint) {
        TextStyle = {
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            width: '100%',
            fontSize: 'var(--font-size-3xl)', fontWeight: '500',
        };
    } else if (width <= desktopBreakpoint) {
        TextStyle = {
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
            width: '100%',
            fontSize: 'var(--font-size-3xl)', fontWeight: '500',
        };
    } else {
        TextStyle = {
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
            width: '100%',
            fontSize: 'var(--font-size-5xl)', fontWeight: '500',
        };
    }

    return {
        container: { 
            position: 'sticky', top: 0,
            height: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
            overflow: 'hidden',
            paddingTop: 'calc(var(--header-height) + 2rem)',
        },
        inner: {
            width: '100%', maxWidth: 'var(--section-width-default)',
            padding: '0 var(--section-padding-default)', margin: '0 auto',
        },
        Text: TextStyle,
        imgContainer: {
            position: 'absolute', top: 0, left: 0, zIndex: 999,
            width: '100vw', height: '100vh', overflow: 'hidden',
            paddingTop: 'calc(var(--header-height) + 2rem)',
        },
        img: {
            position: 'absolute', top: 0, left: 0, zIndex: -1,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
        }
    };
}


export function DescriptionStyles() {
    const {width} = useAppContext();

    let innerTextSize = 'var(--font-size-lg)';
    if (width <= mobileBreakpoint) {
        innerTextSize = 'var(--font-size-md)';
    }


    return {
        container: { 
            position: 'sticky', top: 0,
            minHeight: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
            overflow: 'hidden',
            paddingTop: 'calc(var(--header-height) + 2rem)',
        },
        inner: {
            maxWidth: 'var(--section-width-default)',
            padding: '0 var(--section-padding-default)', 
            margin: '0 auto'
        },
        innerText: {
            fontSize: innerTextSize,
            fontWeight: '500',
            lineHeight: '1.5',
            wordBreak: 'keep-all',
            marginRight: '0',
            transition: 'all 0.25s ease',
            color: 'var(--color-on-text-primary)',
            whiteSpace: 'pre-wrap'
        }
    };
};


export function NewsStyles() {
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
            display: 'flex', justifyContent: 'center',
            padding: 'calc(var(--header-height) + 2rem) 0 4rem',
        },
        inner: innerStyle,
        innerTitleContainer: {
            marginBottom: (width < desktopBreakpoint) ? '4rem' : '0',
        },
        innerTitle: {
            fontSize: 'var(--font-size-xl)',
            height: 'fit-content',
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
        innerListItemDate: {
            flex: 1, width: '100%',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-on-text-subtle)',
        },
        innerListItemContent: {
            flex: 3, width: '100%',
            fontSize: 'var(--font-size-md)',
            fontWeight: '500',
            wordBreak: 'keep-all',
        },
    };
};