import { useRef, useState, useEffect } from 'react';
import { 
	updateNavHeightState, 
	updateIsNavFixedState,
	scrollToNavSection,
} from '../utils/navHelpers';

/**
 * Custom hook for navigation bar state and behavior.
 * @param {string} initialSection - The default active section.
 */
export default function useNavigation(
	initialSection = 'papers'
) {
	// 스테이트 관리
	const [sectionActive, setSectionActive] = useState(initialSection);
	const [sectionPending, setSectionPending] = useState(initialSection);
	const [isNavFixed, setIsNavBarFixed] = useState(false);
	const [navHeight, setNavBarHeight] = useState(0);

	// 레퍼런스 관리
	const navRef = useRef(null);
	const navContainerRef = useRef(null);

	// 섹션 클릭 시 active 섹션 변경
	const handleNavClick = (section) => {
		setSectionPending(section)
		scrollToNavSection(navContainerRef);
	};

	useEffect(() => {
		setSectionActive(sectionPending);
	}, [sectionPending]);

	// 스크롤이 발생할 때마다 navContainerRef의 위치를 확인하여 fixed 상태 업데이트
	const onScroll = () => {
		updateIsNavFixedState(navContainerRef, setIsNavBarFixed);
	};
	useEffect(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		if (isNavFixed) {
			updateNavHeightState(isNavFixed, navRef, setNavBarHeight);
		}
	}, [isNavFixed]);

	return {
		sectionActive,
		sectionPending,
		isNavFixed,
		navHeight,
		navRef,
		navContainerRef,
		handleNavClick,
	};
}