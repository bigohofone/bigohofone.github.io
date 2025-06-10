/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import { useRef, useState, useEffect, useCallback } from 'react';


const getNavHeight = (ref) => ref.current?.offsetHeight || 0;


const isNavFixed = (ref) => ref.current?.getBoundingClientRect().top <= 0;


const scrollToNextSection = (ref) => {
	const el = ref.current;
	if (el) {
		const rect = el.getBoundingClientRect();
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const bottom = rect.bottom + scrollTop;
		window.scrollTo({ top: bottom, behavior: 'smooth' });
	}
};

export default function useNavigation(initialSection = 'papers') {
	const [sectionActive, setSectionActive] = useState(initialSection);
	const [sectionPending, setSectionPending] = useState(initialSection);
	const [isFixed, setIsFixed] = useState(false);
	const [navHeight, setNavHeight] = useState(0);

	const navRef = useRef(null);
	const navContainerRef = useRef(null);
	const prevSectionRef = useRef(null);

	// 섹션 클릭 처리
	const handleNavClick = useCallback((section) => {
		setSectionPending(section);
	}, []);

	// 스크롤 핸들러
	const handleScroll = useCallback(() => {
		setIsFixed(isNavFixed(navContainerRef));
	}, []);

	// 섹션 변경 시 스크롤
	useEffect(() => {
		if (sectionPending !== sectionActive) {
			setSectionActive(sectionPending);
			scrollToNextSection(prevSectionRef);
		}
	}, [sectionPending, sectionActive]);

	// 스크롤 이벤트 리스너 등록
	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	// 고정 상태일 때 네비게이션 높이 측정
	useEffect(() => {
		if (isFixed) {
			setNavHeight(getNavHeight(navRef));
		}
	}, [isFixed]);

	return {
		sectionActive,
		sectionPending,
		isNavFixed: isFixed,
		navHeight,
		navRef,
		navContainerRef,
		prevSectionRef,
		handleNavClick,
	};
}