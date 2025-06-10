import React, { useRef, useEffect } from 'react';

// 인공지능 웹사이트에 어울리는, 부드럽고 미래지향적인 인터렉티브 배경
const NODE_COUNT = 60;
const CONNECT_DIST = 140;
const NODE_RADIUS = 2.2;
const LINE_COLOR = 'rgba(80, 120, 255, 0.18)';
const NODE_COLOR = 'rgba(80, 120, 255, 0.55)';
const HIGHLIGHT_COLOR = 'rgba(0, 200, 255, 0.7)';
const BG_GRADIENT = 'linear-gradient(120deg, #f8fafc 0%, #e3e9f7 100%)';

function randomVelocity() {
  return (Math.random() - 0.5) * 0.7;
}

const IntroductionBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, active: false, radius: 0 });

  // 캔버스 크기 및 DPR 적용
  const setCanvasSize = (canvas, ctx) => {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { width, height };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let { width, height } = setCanvasSize(canvas, ctx);

    // 노드 초기화
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomVelocity(),
      vy: randomVelocity()
    }));
    nodesRef.current = nodes;

    // 마우스 이벤트
    const handleMouseMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
      mouseRef.current.radius = 60;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    const handleClick = e => {
      // 클릭 시 파동 효과
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
      mouseRef.current.radius = 120;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // 애니메이션 루프
    const draw = () => {
      // 배경 그라데이션
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e3e9f7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 노드 간 연결선
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const a = nodesRef.current[i], b = nodesRef.current[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            ctx.save();
            ctx.strokeStyle = LINE_COLOR;
            ctx.globalAlpha = 0.18 + 0.82 * (1 - dist / CONNECT_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 마우스 근처 노드 하이라이트 및 연결선
      if (mouseRef.current.active) {
        for (let i = 0; i < nodesRef.current.length; i++) {
          const node = nodesRef.current[i];
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRef.current.radius) {
            ctx.save();
            ctx.strokeStyle = HIGHLIGHT_COLOR;
            ctx.globalAlpha = 0.25 + 0.75 * (1 - dist / mouseRef.current.radius);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 노드 그리기
      nodesRef.current.forEach(node => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = NODE_COLOR;
        ctx.shadowColor = '#b0bec5';
        ctx.shadowBlur = 2;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
      });

      // 마우스 이펙트(파동 애니메이션)
      if (mouseRef.current.active && mouseRef.current.radius > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${0.09 + 0.09 * Math.sin(Date.now()/300)})`;
        ctx.fill();
        ctx.restore();
        mouseRef.current.radius *= 0.94;
      }

      // 마우스 위치에 작은 원
      if (mouseRef.current.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = HIGHLIGHT_COLOR;
        ctx.shadowColor = '#00c8ff';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();
      }

      // 노드 이동
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // 리사이즈 대응
    const resize = () => {
      const size = setCanvasSize(canvas, ctx);
      width = size.width;
      height = size.height;
      nodesRef.current.forEach(node => {
        node.x = Math.max(0, Math.min(node.x, width));
        node.y = Math.max(0, Math.min(node.y, height));
      });
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        background: BG_GRADIENT,
        transition: 'background 0.5s'
      }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );
};

export default IntroductionBackground;