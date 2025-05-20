// Nav가 fixed 상태가 바뀔 때 navHeight를 재측정하는 함수
export function updateNavHeight(isNavFixed, navRef, setNavHeight) {
    setNavHeight(isNavFixed && navRef.current ? navRef.current.offsetHeight : 0);
}

// Nav fixed 처리: 스크롤 시 fixed 여부를 판단
export function handleNavFixed(navContainerRef, setIsNavFixed) {
    const navEl = navContainerRef.current;
    if (!navEl) return;
    setIsNavFixed(navEl.getBoundingClientRect().top <= 0);
}

