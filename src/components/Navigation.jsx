/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

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
		</div>
	);
}

export default Navigation;