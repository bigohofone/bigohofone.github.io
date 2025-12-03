import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

import { ResumeIcon, GoogleScholarIcon, GithubIcon, LinkedInIcon, XIcon } from '../assets/icons/icons.jsx';
import { DownloadLinks } from './DownloadLinks.jsx';

function Footer() {
    return (
      <footer style={{ 
          width: '100%',
          maxWidth: 'var(--section-width-default)', 
          padding: 'var(--section-padding-with-header) var(--section-padding-default) var(--section-padding-default)', 
          margin: '0 auto',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
          <p
            style={{ 
              fontSize: 'var(--font-size-md)',
              fontWeight: '600',
              color: 'var(--color-on-text-subtle)',
            }}
          >
            © {new Date().getFullYear()} Wonjun Oh. All rights reserved.
          </p>
          <DownloadLinks variant="icon-only" />
      </footer>
    );
}

export default Footer;
export { Footer };