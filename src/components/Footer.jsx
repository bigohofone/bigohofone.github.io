import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

import { ResumeIcon, GoogleScholarIcon, GithubIcon, LinkedInIcon, XIcon } from '../assets/icons/icons.jsx';
import { DownloadLinks } from './DownloadLinks.jsx';

function Footer() {
    return (
      <footer style={{ 
          width: '100%',
          maxWidth: 'var(--section-width-default)', 
          padding: '0 var(--section-padding-default) var(--section-padding-default)', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            width: '100%',
            paddingTop: '2rem',
            marginTop: '2rem',
          }}
        >
          <DownloadLinks variant="icon-only" />
          <p
            style={{ 
              fontSize: 'var(--font-size-md)',
              fontWeight: '500',
              color: 'var(--color-on-text-subtle)',
            }}
          >
            © {new Date().getFullYear()} Wonjun Oh
          </p>
        </div>
      </footer>
    );
}

export default Footer;
export { Footer };