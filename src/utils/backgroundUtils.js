import React, { useRef, useEffect, useState } from 'react';

// 화면 크기에 따라 레이어/노드 수 계산
function getLayerAndNodeCount(width, height) {
  // 레이어: 3~6, 노드: 12~36 (화면 크기에 따라 가변)
  const layers = Math.max(2, Math.min(6, Math.round(width / 300)));
  const nodeCount = Math.max(8, Math.min(64, layers * Math.round(height / 600)));
  return { layers, nodeCount };
}

const rand = (a, b) => a + Math.random() * (b - a);

function generateNodes(width, height, LAYERS, NODE_COUNT) {
  const marginX = width * 0.1;
  const marginY = height * 0.12;
  const layerGap = (width - 2 * marginX) / (LAYERS - 1);
  const nodes = [];

  for (let l = 0; l < LAYERS; l++) {
    const count = Math.floor(NODE_COUNT / LAYERS) + (l === 1 ? 2 : 0);
    for (let i = 0; i < count; i++) {
      const x = marginX + l * layerGap + rand(-10, 10);
      const y = marginY + ((height - 2 * marginY) * (i + 0.5)) / count + rand(-10, 10);
      nodes.push({
        layer: l,
        idx: nodes.length,
        baseX: x,
        baseY: y,
        appearOffset: rand(-0.15, 0.15), // 각 노드별 랜덤 전파 속도
      });
    }
  }
  return nodes;
}

function generateEdges(nodes) {
  const edges = [];
  for (let from of nodes) {
    for (let to of nodes) {
      if (to.layer === from.layer + 1) {
        edges.push({ from, to });
      }
    }
  }
  return edges;
}

function getCSSVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const root = document.documentElement;
  const val = getComputedStyle(root).getPropertyValue(name);
  return val ? val.trim() : fallback;
}

function getNodeOffset(t, idx) {
  const a = Math.sin(t * 0.7 + idx * 0.3) * 1.2;
  const b = Math.cos(t * 0.9 + idx * 0.2) * 1.2;
  return [a, b];
}

function getEdgePulse(t, a, b) {
  return 0.5 + 0.5 * Math.sin(t + a * 0.3 + b * 0.25);
}

const NeuralNetBackground = () => {
  const canvasRef = useRef();
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const animRef = useRef();
  const progressRef = useRef(0);
  const [layout, setLayout] = useState({ layers: 4, nodeCount: 18 });

  // 화면 크기 변화에 따라 레이어/노드 수 갱신
  useEffect(() => {
    function updateLayout() {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight * 0.75, 320);
      setLayout(getLayerAndNodeCount(width, height));
    }
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let LAYERS = layout.layers;
    let NODE_COUNT = layout.nodeCount;

    function resize() {
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight * 0.75, 320);
      canvas.width = width;
      canvas.height = height;
      nodesRef.current = generateNodes(width, height, LAYERS, NODE_COUNT);
      edgesRef.current = generateEdges(nodesRef.current);
    }

    function onScroll() {
      const screenH = window.innerHeight * 0.25;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      progressRef.current = Math.min(1, Math.max(0, scrollY / screenH));
    }

    function draw(t) {
      const width = canvas.width;
      const height = canvas.height;

      const edgeColor = getCSSVar('--nn-edge-color', '#6a7ad1');
      const edgeWidth = parseFloat(getCSSVar('--nn-edge-width', '2'));
      const nodeColor = getCSSVar('--nn-node-color', '#e7eafc');
      const nodeStroke = getCSSVar('--nn-node-stroke', '#b6bde9');
      const nodeHighlightColor = getCSSVar('--nn-node-highlight-color', '#fff');
      const nodeHighlightStroke = getCSSVar('--nn-node-highlight-stroke', '#6a7ad1');
      const nodeSize = parseFloat(getCSSVar('--nn-node-size', '22'));
      const nodeShape = getCSSVar('--nn-node-shape', 'rect');

      ctx.clearRect(0, 0, width, height);

      const progress = progressRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      const activeSet = new Set(
        nodes
          .filter(n => {
            const adjustedProgress = (n.layer + n.appearOffset) / (LAYERS - 1);
            return progress >= adjustedProgress;
          })
          .map(n => n.idx)
      );

      for (let { from, to } of edges) {
        if (activeSet.has(from.idx) && activeSet.has(to.idx)) {
          const pulse = getEdgePulse(t, from.idx, to.idx);
          ctx.save();
          ctx.globalAlpha = 0.15 + 0.2 * pulse;
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = edgeWidth + pulse * 1.5;
          ctx.beginPath();
          const [fx, fy] = getNodeOffset(t, from.idx).map((d, i) =>
            i === 0 ? from.baseX + d : from.baseY + d
          );
          const [tx, ty] = getNodeOffset(t, to.idx).map((d, i) =>
            i === 0 ? to.baseX + d : to.baseY + d
          );
          ctx.moveTo(fx, fy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.restore();
        }
      }

      for (let node of nodes) {
        if (!activeSet.has(node.idx)) continue;
        const [dx, dy] = getNodeOffset(t, node.idx);
        const x = node.baseX + dx;
        const y = node.baseY + dy;
        const isLast = node.layer === LAYERS - 1;
        ctx.save();
        ctx.globalAlpha = isLast ? 0.9 : 0.6;
        ctx.fillStyle = isLast ? nodeHighlightColor : nodeColor;
        ctx.strokeStyle = isLast ? nodeHighlightStroke : nodeStroke;
        ctx.lineWidth = isLast ? edgeWidth + 1 : edgeWidth;
        ctx.beginPath();
        if (nodeShape === 'circle') {
          ctx.arc(x, y, nodeSize / 2, 0, Math.PI * 2);
        } else {
          ctx.rect(x - nodeSize / 2, y - nodeSize / 2, nodeSize, nodeSize);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    function animate() {
      const t = Date.now() * 0.001;
      draw(t);
      animRef.current = requestAnimationFrame(animate);
    }

    resize();
    onScroll();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animRef.current);
    };
  }, [layout]);

  // introduction 클래스 내부에서 항상 최하단에 위치하도록 스타일 적용
  return (
    <canvas
      ref={canvasRef}
      className="neuralnet-bg-canvas"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '75vh',
        minHeight: 320,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralNetBackground;