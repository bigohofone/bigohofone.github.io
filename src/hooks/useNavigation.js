/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import { useRef, useState, useEffect, useCallback } from 'react';

export default function useNavigation({
	contentRefs,
	contentSectionRef,
	getContentRef,
	getCurrentContentKey
}) {
	const navRef = useRef(null);

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
		const ref = contentRefs.current[key];
		if (ref?.current && navRef.current) {
			const navHeight = navRef.current.offsetHeight || 0;
			const rect = ref.current.getBoundingClientRect();
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const targetY = rect.top + scrollTop - navHeight;
			window.scrollTo({ top: targetY, behavior: 'smooth' });
		} else if (ref?.current) {
			ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, [contentRefs, navRef]);

	// Example: expose them if needed
	return {
		navRef,
		sectionActive,
		handleNavClick
	};
}