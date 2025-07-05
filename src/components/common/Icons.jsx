import React from 'react';

const buttonStyle = {
    color: 'inherit',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '2rem',
    transition: 'transform 0.4s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0, // 패딩 제거
};

const circleStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    background: '#f0f0f0', // 원하는 색상으로 변경 가능
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
};

const iconStyle = {
    fontSize: '1.5rem',
    fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
    display: 'inline-block',
    transition: 'transform 0.4s',
    margin: 0,
};

export default function ArrowButton({ expanded, onClick }) {
    return (
        <button
            className="arrow-btn"
            onClick={e => {
                e.stopPropagation();
                onClick();
            }}
            aria-label={expanded ? '접기' : '더보기'}
            style={buttonStyle}
            tabIndex={-1}
            type="button"
        >
            <span style={circleStyle}>
                <span
                    className="material-symbols-outlined"
                    style={{
                        ...iconStyle,
                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                >
                    arrow_forward
                </span>
            </span>
        </button>
    );
}