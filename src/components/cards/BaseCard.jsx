import React from 'react';

const BaseCard = ({
  expanded,
  onToggle,
  children,
  description,
  ArrowIcon = null,
}) => (
  <div
    className="card"
    onClick={onToggle}
    style={{ cursor: 'pointer' }}
    tabIndex={0}
    role="button"
    aria-expanded={expanded}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') onToggle();
    }}
  >
    <div
      className="card-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>{children}</div>
      <button
        className="arrow-btn"
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={expanded ? '접기' : '더보기'}
        style={{
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '2rem',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}
        tabIndex={-1}
      >
        {ArrowIcon ? <ArrowIcon expanded={expanded} /> : (expanded ? '▼' : '▶')}
      </button>
    </div>
    {expanded && (
      <div className="card-description" style={{ marginTop: '1rem' }}>
        {description}
      </div>
    )}
  </div>
);

export default BaseCard;