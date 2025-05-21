import React from 'react';

const BaseCard = ({
  expanded,
  onToggle,
  children,
  mainImage,
  description,
  ArrowIcon = null,
}) => (
  <div
    className="card"
    onClick={onToggle}
    style={{ cursor: 'pointer', margin: '0' }}
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
          transition: 'transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '0 0 0 1rem',
        }}
        tabIndex={-1}
      >
        {ArrowIcon ? (
          <ArrowIcon expanded={expanded} />
        ) : (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '2rem',
              fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
              display: 'inline-block',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              margin: 0
            }}
          >
            arrow_forward
          </span>
        )}
      </button>
    </div>
    {expanded && mainImage && (
      <div style={{ marginTop: '1rem' }}>
        <img
          src={mainImage}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '25vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    )}
    {expanded && description && (
      <div className="card-description" style={{ marginTop: '1rem' }}>
        {description}
      </div>
    )}
  </div>
);

export default BaseCard;