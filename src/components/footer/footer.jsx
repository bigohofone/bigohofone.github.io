import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext.jsx';

import Shortcuts from './shortcuts.jsx';


function FooterMid(width) {
  let containerStyle = {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    gap: '1rem', width: '100%',
  }

  return (
    <div
      style={{
        ...containerStyle,
        width: '100%',
        fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--color-on-text-subtle)',
        paddingTop: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%',
        }}
      >
        Designed &amp; Developed by Wonjun Oh
      </div>
      <div
        style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%',
        }}
      >
        © {new Date().getFullYear()} Wonjun Oh
      </div>
    </div>
  );
}


function FooterTop(width) {
  let containerStyle = {};
  if (width >= 768) {
    containerStyle = {
      display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      gap: 0, width: '100%',
    }
  } else {
    containerStyle = {
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
      gap: '2rem', width: '100%',
    }
  }

  return (
    <div
      style={containerStyle}
    >
      <Shortcuts size='medium' variant='icon-only'/>
    </div>
  );
}


function Footer() {
    const width = useAppContext().width;

    return (
      <footer
        style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            gap: '2rem',
            width: '100%',
            maxWidth: '1280px',
            padding: '4rem 2rem', 
            margin: '0 auto',
          }}
        >
          {FooterTop(width)}
          {FooterMid(width)}
        </div>
      </footer>
    );
}

export default Footer;
export { Footer };