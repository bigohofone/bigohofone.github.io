import { React } from 'react';
import { useAppContext } from '../../contexts/AppContext.jsx';

export function cvStyles() {
    const { width } = useAppContext();


    return {
        container: {
            width: '100%', 
        },
        inner: {
            width: '100%', maxWidth: 'var(--section-width-default)',
            padding: '0 var(--section-padding-default)', margin: '0 auto',
            paddingTop: 'calc(var(--header-height) + 2rem)', paddingBottom: '2rem',
            display: 'flex', flexDirection: 'column',
        },
        innerTitleContainer: {
            marginBottom: '4rem',
        },
        innerTitle: {
            fontSize: 'var(--font-size-lg)',
            lineHeight: '1',
        },
        innerContainer: {
            display: 'flex', flexDirection: 'column', gap: '2rem',
        },
        innerContent: {
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
        },
        innerContentText: {
            fontSize: 'var(--font-size-md)', fontWeight: '500',
            color: 'var(--color-on-text-subtle)',
        },
        innerContentShortcut: {
            fontSize: 'var(--font-size-md)', fontWeight: '500',
            color: 'var(--color-on-text-primary)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
        }
    };
}