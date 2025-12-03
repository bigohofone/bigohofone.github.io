import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

export default function Nav() {
    const { width } = useAppContext();

    return (
        <nav className="site-nav">
        <ul className="site-nav__list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
        </nav>
    );
}

export { Nav };