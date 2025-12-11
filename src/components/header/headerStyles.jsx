import { useAppContext } from '../../contexts/AppContext.jsx';
import { desktopBreakpoint, mobileBreakpoint } from '../../assets/styles/breakpoints.jsx';


const functionalContainerGap = 16*3;

export function logoStyles() {
    return {
        logoContainer: {
            display: 'flex', alignItems: 'center', gap: '0.125rem',
            cursor: 'pointer',
        },
        logoImg: {
            height: '2rem',
            objectFit: 'contain',
            // transform: 'translateX(-50%)',
        },
        logoText: {
            fontFamily: 'Bitcount Grid Double',
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            color: 'var(--color-on-text-primary)',
            // transform: 'translateX(-1.25rem)',
        }
    };
}

export function headerStyles() {
    const { width } = useAppContext();

    let MaxWidth = 'none';
    if (width >= desktopBreakpoint) {
        MaxWidth = desktopBreakpoint;
    } else {
        MaxWidth = '100%';
    }

    let functionalContainerGap = 16*3;
    if (width < mobileBreakpoint) {
        functionalContainerGap = 16*1;
    } else if (width < desktopBreakpoint) {
        functionalContainerGap = 16*2;
    }

    return {
        container: {
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
            background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(1rem)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
        inner: {
            padding: '0 2rem', 
            margin: '0 auto',
            width: '100%', height: 'var(--header-height)', maxWidth: MaxWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        functionalContainer: {
            display: 'flex', alignItems: 'center', gap: functionalContainerGap,
        }
    };
}


export function headerPopupStyles() {
    const { width } = useAppContext();

    let popupMaxWidth = 'none';
    if (width >= mobileBreakpoint) {
        popupMaxWidth = '640px';
    } else {
        popupMaxWidth = '100%';
    }

    let popupContainerPaddingRight = '0px';
    if (width >= desktopBreakpoint) {
        popupContainerPaddingRight = ((width - desktopBreakpoint) / 2) + 'px';
    }

    return {
        background: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: '999',
            width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.25)',
        },
        containerExpanded: {
            display: 'flex', alignItems: 'center', gap: functionalContainerGap,
        },
        popupContainer: {
            position: "relative", display: "inline-block",
        },
        button: {
            display: "flex", alignItems: "center", gap: '2rem',
            height: '2rem', padding: "0",
            fontSize: 'var(--font-size-sm)', fontWeight: "500", color: "var(--color-on-text-primary)",
            cursor: "pointer",
            transition: "background 0.2s ease",
            boxSizing: "border-box",
            border: "none",
        },
        buttonIcon: {
            background: 'none',
            border: 'none',
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-on-text-primary)',
            cursor: 'pointer',
        },
        popupContainer: {
            width: '100%', height: '100vh', maxWidth: popupMaxWidth,
            position: "fixed", top: "0", right: "0", zIndex: "1000",
            overflow: "hidden",
            boxSizing: "border-box",
            background: "var(--color-on-bg)",
            paddingRight: popupContainerPaddingRight,
        },
        popup: {
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '0.5rem',
            width: '100%',
            padding: '0 var(--section-padding-default)',
            margin: '0 auto',
        },
        popupHeader: {
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            width: '100%', height: 'var(--header-height)', padding: '0',
            fontSize: 'var(--font-size-xl)', fontWeight: '500',
            color: 'var(--color-on-text-primary)',
            marginBottom: '2rem',
        },
        popupItem: {
            display: "flex", justifyContent: "flex-start", alignItems: 'center', gap: '0.5rem',
            width: '100%', height: '3rem', padding: '0 1rem',
            fontSize: 'var(--font-size-md)', fontWeight: "500", color: "var(--color-on-text-primary)",
            cursor: "pointer",
            transition: "background 0.2s ease",
            boxSizing: "border-box",
            borderRadius: "0.75rem", border: "none",
        },
        popupItemHover: {
            background: "rgba(0, 0, 0, 0.05)",
        },
        popupItemSelected: {
            background: "rgba(0, 0, 0, 0.1)",
        },
    };
}