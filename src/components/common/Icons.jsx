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
            <span
                className="btn__circle"
                style={{}}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        padding: '0 0 0 0.05rem',
                        transform: expanded ? 'rotate(-90deg)' : 'rotate(90deg)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    chevron_right
                </span>
            </span>
        </button>
    );
}