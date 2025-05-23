import React, { useRef, useEffect } from 'react';

/**
 * 신경망 배경 캔버스 컴포넌트
 * - 반응형, 스크롤 연동, 성능 최적화, 유지보수성 강화
 * - 레이어/노드/엣지 구조를 명확히 분리
 * - CSS 변수 기반 커스터마이즈 지원
 * - 애니메이션 및 렌더링 효율화
 */

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 레이어/노드 수 계산 (반응형)
function calcLayout(width, height) {
  const layers = clamp(Math.round(width / 300), 3, 6);
  const nodeCount = clamp(Math.round(height / 300) * layers, 8, 64);
  return { layers, nodeCount };
}

// 노드 생성 (레이어별 균등 분포)
function createNodes(width, height, layers, nodeCount) {
  const marginX = width * 0.1;
  const marginY = height * 0.12;
  const layerGap = (width - 2 * marginX) / (layers - 1);
  const nodes = [];
  let idx = 0;
  for (let l = 0; l < layers; l++) {
    const count = Math.floor(nodeCount / layers) + (l === 1 ? 2 : 0);
    for (let i = 0; i < count; i++) {
      const x = Math.round(marginX + l * layerGap);
      const y = Math.round(marginY + ((height - 2 * marginY) * (i + 0.5)) / count);
      nodes.push({ layer: l, idx: idx++, x, y });
    }
  }
  return nodes;
}

// 엣지 생성 (인접 레이어 연결)
function createEdges(nodes, layers) {
  const edges = [];
  const nodesByLayer = Array.from({ length: layers }, () => []);
  nodes.forEach(n => nodesByLayer[n.layer].push(n));
  for (let l = 0; l < layers - 1; l++) {
    for (const from of nodesByLayer[l]) {
      for (const to of nodesByLayer[l + 1]) {
        edges.push({ from, to });
      }
    }
  }
  return edges;
}

// CSS 변수 읽기
function cssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(name);
  return val ? val.trim() : fallback;
}

function getScrollProgress(container) {
  const rect = container.getBoundingClientRect();
  const wh = window.innerHeight;
  const visible = clamp(
    (Math.min(rect.bottom, wh) - Math.max(rect.top, 0)) / Math.min(rect.height, wh),
    0, 1
  );
  return 1 - visible;
}

// 노드 활성화 진행률 (레이어별 등장)
function nodeAppearProgress(progress, layer, layers) {
  const appear = layer / layers;
  return clamp((progress - appear) * layers, 0, 1);
}

// 엣지 활성화 진행률 (from → to)
function edgeAppearProgress(progress, fromLayer, toLayer, layers) {
  const fromAppear = fromLayer / layers;
  const toAppear = toLayer / layers;
  if (progress < fromAppear) return 0;
  const raw = clamp((progress - fromAppear) / Math.max(0.0001, toAppear - fromAppear), 0, 1);
  // easeInOutCubic
  return raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
}

const NeuralNetBackground = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const layoutRef = useRef({ width: 0, height: 0, layers: 4, nodeCount: 18 });
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const progressRef = useRef(0);
  const animRef = useRef();

  // 레이아웃 및 데이터 갱신
  const updateLayout = () => {
    if (!containerRef?.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = Math.max(rect.height, 320);
    const { layers, nodeCount } = calcLayout(width, height);
    layoutRef.current = { width, height, layers, nodeCount };
    nodesRef.current = createNodes(width, height, layers, nodeCount);
    edgesRef.current = createEdges(nodesRef.current, layers);
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
  };

  // 스크롤 진행률 갱신
  const updateProgress = () => {
    if (!containerRef?.current) return;
    progressRef.current = getScrollProgress(containerRef.current);
  };

  // 초기화 및 이벤트 바인딩
  useEffect(() => {
    updateLayout();
    updateProgress();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateProgress);
    };
    // eslint-disable-next-line
  }, [containerRef]);

  // 애니메이션 루프
  useEffect(() => {
    function draw() {
      const { width, height, layers } = layoutRef.current;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      // 스타일 변수
      const edgeColor = cssVar('--nn-edge-color', '#222');
      const edgeWidth = clamp(parseFloat(cssVar('--nn-edge-width', 2)), 1, 8);
      const nodeColor = cssVar('--nn-node-color', '#fff');
      const nodeStroke = cssVar('--nn-node-stroke', '#222');
      const nodeHighlightColor = cssVar('--nn-node-highlight-color', '#ff0');
      const nodeHighlightStroke = cssVar('--nn-node-highlight-stroke', '#f80');
      const nodeSize = clamp(parseFloat(cssVar('--nn-node-size', 12)), 6, 32);
      const nodeShape = cssVar('--nn-node-shape', 'circle');

      const progress = progressRef.current;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // 엣지 그리기
      for (const { from, to } of edges) {
        const edgeProg = edgeAppearProgress(progress, from.layer, to.layer, layers);
        let alpha = 0;
        if (edgeProg > 0) {
          alpha = lerp(0.2, 0.8, edgeProg);
        } else {
          // 등장 전 랜덤 깜빡임
          const seed = (from.idx * 97 + to.idx * 53);
          alpha = 0.1 + Math.abs(Math.sin(Date.now() * 0.001 + seed)) * 0.15;
        }
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = edgeWidth;
        ctx.beginPath();
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(from.x + dx * edgeProg, from.y + dy * edgeProg);
        ctx.stroke();
        ctx.restore();
      }

      // 노드 그리기
      for (const node of nodes) {
        const appear = nodeAppearProgress(progress, node.layer, layers);
        let alpha = appear > 0 ? lerp(0.5, 0.9, appear) : 0.1 + Math.abs(Math.sin(Date.now() * 0.001 + node.idx * 113)) * 0.15;
        const isLast = node.layer === layers - 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = isLast ? nodeHighlightColor : nodeColor;
        ctx.strokeStyle = isLast ? nodeHighlightStroke : nodeStroke;
        ctx.lineWidth = isLast ? edgeWidth + 1 : edgeWidth;
        ctx.beginPath();
        if (nodeShape === 'circle') {
          ctx.arc(node.x, node.y, Math.floor(nodeSize / 2), 0, Math.PI * 2);
        } else {
          ctx.rect(node.x - Math.floor(nodeSize / 2), node.y - Math.floor(nodeSize / 2), nodeSize, nodeSize);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    function animate() {
      draw();
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // 캔버스 스타일: 부모 하단에 절대 위치
  return (
    <canvas
      ref={canvasRef}
      className="neuralnet-bg-canvas"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        minHeight: 320,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
};

export default NeuralNetBackground;