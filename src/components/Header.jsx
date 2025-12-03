import React from 'react';
// import '../assets/styles/Header.css';
import { useAppContext } from '../contexts/AppContext';
import { Nav } from './Nav.jsx';
import { Link } from 'react-router-dom';

export function Header({
}) {
  const { locale, setLocale, width } = useAppContext();

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(0.5rem)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--section-width-default)', 
          padding: '0 var(--section-padding-default)', 
          margin: '0 auto',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '500',
            color: 'var(--color-on-text-primary)',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Wonjun Oh
          </Link>
        </span>
        <Nav />
      </div>
    </header>
  );
}