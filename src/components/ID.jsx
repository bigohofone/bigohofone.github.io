import React, { useState, useMemo } from "react";
import { koreaUnivID } from "./IDCards/KoreaUniv.jsx";
import { shadow } from "pdfjs-dist";

const CARDS = [koreaUnivID, koreaUnivID];

function ID() {
  const [selectedIndex, setSelectedIndex] = useState(CARDS.length - 1);
  const [isCarousel, setIsCarousel] = useState(false);

  const handleCardClick = (index) => {
    if (!isCarousel) {
      // 기본 모드 → 캐러셀 모드 전환
      setIsCarousel(true);
    } else {
      // 캐러셀 모드 → 카드 선택 + 기본 모드로 복귀
      setSelectedIndex(index);
      setIsCarousel(false);
    }
  };

  const positions = useMemo(() => {
    const total = CARDS.length;
    const center = Math.floor(total / 2);
    const angleStep = 12; // 부채 펼침 각도
    const spread = 60; // 좌우 이동 거리(px)

    return CARDS.map((_, i) => {
      if (!isCarousel) {
        // 기본 겹침 모드
        const offset = (i - selectedIndex) * 4;
        return {
          transform: `translateX(${offset}px)`,
          zIndex: i === selectedIndex ? 100 : i,
        //   top: "var(--section-padding-with-header)",
        };
      }

      // 캐러셀 모드 (부채 모양)
      const angle = (i - center) * angleStep;
      const x = (i - center) * spread;
      return {
        transform: `translate(${x}px, 0px) rotate(${angle}deg)`,
        zIndex: i,
        // top: "var(--section-padding-with-header)",
      };
    });
  }, [isCarousel, selectedIndex]);

  return (
    <div
      style={{
        marginTop: "calc(var(--section-padding-with-header) * 1.5)",
        width: "100%",
        height: "calc(20rem * 1.58)",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {CARDS.map((Card, i) => (
        <div
          key={i}
          onClick={() => handleCardClick(i)}
          style={{
            filter: "drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.25))",
            position: "absolute",
            transition: "transform 0.4s ease, top 0.2s ease",
            cursor: "pointer",
            ...positions[i],
          }}
          onMouseEnter={(e) => {
            if (isCarousel) e.currentTarget.style.top = positions[i].top - 20 + "px";
          }}
          onMouseLeave={(e) => {
            if (isCarousel) e.currentTarget.style.top = positions[i].top + "px";
          }}
        >
          {Card}
        </div>
      ))}
    </div>
  );
}

export default ID;
export { ID };
