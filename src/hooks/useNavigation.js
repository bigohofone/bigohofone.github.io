/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import { useRef, useState, useEffect, useCallback } from 'react';

export default function useNavigation({
	contentsRef,
	getContentRef,
	getCurrentContentKey,
	scrollToContentKey
}) {
	const navContainerRef = useRef(null);
	const navRefs = useRef({});

	// sectionActive는 getCurrentContentKey가 반환하는 현재 활성화된 콘텐츠의 키를 저장합니다.
	const [sectionActive, setSectionActive] = useState(getCurrentContentKey());

	useEffect(() => {
		const handleScroll = () => {
			const currentKey = getCurrentContentKey();
			setSectionActive(currentKey);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [getCurrentContentKey]);

	const handleNavClick = useCallback((key) => {
		scrollToContentKey(key);
	}, []);

	// You can use contentsRef, contentRefs, getCurrentContentKey, scrollToContentKey as needed here
	

	// Example: expose them if needed
	return {
		navContainerRef,
		navRefs,
		sectionActive,
		handleNavClick
	};
}