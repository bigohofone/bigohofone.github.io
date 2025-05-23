import React from 'react';
import { SECTIONS } from '../utils/sectionConfig';

function Navigation({
	sectionActive,
	isNavFixed,
	navHeight,
	navRef,
	navContainerRef,
	onNavClick,
}) {
	const navClass = `nav${isNavFixed ? ' nav-fixed' : ''}`;

	return (
		<div ref={navContainerRef}>
			<nav ref={navRef} className={navClass}>
				{Object.entries(SECTIONS).map(([key, section]) => (
					<button
						key={key}
						className={`nav-btn${sectionActive === key ? ' active' : ''}`}
						onClick={() => onNavClick(key)}
						type="button"
					>
						{section.label}
					</button>
				))}
			</nav>
			{isNavFixed && <div style={{ height: navHeight }} />}
		</div>
	);
}

export default Navigation;