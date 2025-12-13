import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';

import { useAppContext } from '../../contexts/AppContext.jsx';

import Nav from './Nav.jsx';
import Locale from './Locale.jsx';

import { headerStyles, logoStyles } from './headerStyles.jsx';
import { desktopBreakpoint } from '../../assets/styles/breakpoints.jsx';


export default function Header() {
  const { locale, setLocale, width } = useAppContext();
  const style = headerStyles();
  const logoStyle = logoStyles();

  const isDesktop = width >= desktopBreakpoint;

  return (
    <header style={style.container}>
      <div style={style.inner}>
        <Link to="/" style={logoStyle.logoContainer}>
          <img src="/assets/logo/seal.svg" alt="Logo" style={logoStyle.logoImg}/>
          <div style={logoStyle.logoText}>{locale === 'ko' ? '' : ''}</div>
        </Link>
        <div style={style.functionalContainer}>
          {isDesktop ? (<><Nav /> <Locale /></>) : (<><Locale /> <Nav /></>)}
        </div>
      </div>
    </header>
  );
}