export default function ArrowButton({ expanded, onClick }) {
    return (
        <button
            className="arrow-btn"
            onClick={e => {
                e.stopPropagation();
                onClick();
            }}
            aria-label={expanded ? '접기' : '더보기'}
            style={{
                color: 'inherit',
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
            type="button"
        >
            <span
                className="material-symbols-outlined"
                style={{
                    fontSize: '2rem',
                    fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
                    display: 'inline-block',
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    margin: 0,
                }}
            >
                arrow_forward
            </span>
        </button>
    );
}