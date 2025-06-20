import { useRef, useCallback } from 'react';

export default function useContent() {
    const contentsRef = useRef(null);
    const contentRefs = useRef({});

    // key에 해당하는 ref를 반환, 없으면 새로 생성
    const getContentRef = useCallback((key) => {
        if (!contentRefs.current[key]) {
            contentRefs.current[key] = { current: null };
        }
        return contentRefs.current[key];
    }, []);

    // 가장 가까운(양수) ref의 key 반환
    const getCurrentContentKey = useCallback(() => {
        let closestKey = null;
        let minDistance = Infinity;
        Object.entries(contentRefs.current).forEach(([key, ref]) => {
            if (ref?.current) {
                const distance = ref.current.getBoundingClientRect().top;
                if (distance >= 0 && distance < minDistance) {
                    minDistance = distance;
                    closestKey = key;
                }
            }
        });
        return closestKey;
    }, []);

    const scrollToContentKey = useCallback((key) => {
        const ref = contentRefs.current[key];
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return {
        contentsRef,
        getContentRef,
        getCurrentContentKey,
        scrollToContentKey
    };
}
