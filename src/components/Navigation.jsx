/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import { ContentConfig } from '../utils/contentConfig';

function Navigation({
	sectionActive,
	navRef,
	onNavClick,
}) {

	return (
		<div className="nav">
			<nav ref={navRef} className='nav_inner'>
				{/* <p class='nav-title'>Index.</p> */}
				{Object.entries(ContentConfig).map(([key, value]) => (
					<button
						key={key}
						className={`nav-btn${sectionActive === key ? ' nav-btn--active' : ''}`}
						onClick={() => onNavClick(key)}
						type="button"
					>
						{value.contentName}
					</button>
				))}
			</nav>
		</div>
	);
}

export default Navigation;