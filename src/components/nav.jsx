import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { pdf } from '@react-pdf/renderer';
import CVPdfDocument from './cv/cvPDF';

import { Link } from 'react-router-dom';
import { routeConfig } from '../routes';

// ── Component ──────────────────────────────────────────────────────────────────

const Nav = () => {
    return (
        <div className="menu-container">
            <div className="menu-logo">W.J. ΘH</div>
            <nav className="menu" >
                {routeConfig
                    .filter(route => route.isMenu) // 메뉴에 표시할 것만 필터링
                    .map(route => (
                        <Link key={route.path} to={route.path} className='menu__item'>
                            {route.label}
                        </Link>
                    ))}
            </nav>
        </div>
    );
};

export default Nav;
