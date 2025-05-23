// Nav가 fixed 상태가 바뀔 때 navHeight를 재측정하는 함수 (getBoundingClientRect 대신 offsetHeight 사용)
export function updateNavHeightState(isNavFixed, navContainerRef, setNavHeight) {
    const containerEl = navContainerRef.current;
    if (!containerEl) return;
    setNavHeight(isNavFixed ? containerEl.offsetHeight : 0);
    console.log('navHeight:', containerEl.offsetHeight);
    console.log('isNavFixed:', isNavFixed);
}

// Nav Container fixed 처리: 스크롤 시 fixed 여부를 판단
export function updateIsNavFixedState(navContainerRef, setFixed) {
    const containerEl = navContainerRef.current;
    if (!containerEl) return;
    setFixed(containerEl.getBoundingClientRect().top <= 0);
}

// 네비게이션 컨테이너 클릭 시 섹션 이동 함수
export function scrollToNavSection(navContainerRef) {
    const containerEl = navContainerRef.current;
    if (!containerEl) return;
    const top = containerEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
}
