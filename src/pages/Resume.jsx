

import React from 'react';

import { useAppContext } from '../contexts/AppContext.jsx';


const RESUME_FPATH = '/data/resume_wonjunoh.pdf'

export default function Publications() {
  const { locale, width } = useAppContext();

  return (
    <div
        style={{
                height: '100vh',
                maxWidth: 'var(--section-width-default)',
                padding: 'calc(var(--header-height) + 2rem) 2rem 2rem',
                margin: '0 auto',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '500',
        }}
    >
        <iframe src={RESUME_FPATH} title="example" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  );
};