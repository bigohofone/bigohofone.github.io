import React from 'react';

const Navigation = ({ sections, active, setActive }) => (
  <nav className="nav">
    {sections.map(([key, section]) => (
      <button
        key={key}
        className={active === key ? 'nav-btn active' : 'nav-btn'}
        onClick={() => setActive(key)}
      >
        {section.label}
      </button>
    ))}
  </nav>
);

export default Navigation;