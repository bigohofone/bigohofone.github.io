import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import CLOUDS from "vanta/dist/vanta.clouds.min"

import { skyLocation } from "@/data/sky"
import { skyColorsAt, textToneFor } from "@/lib/sky"

// 화면 뒤에 깔리는 하늘. 구름 그리기와 움직임은 Vanta CLOUDS 가 맡고,
// 여기서는 skyLocation 의 해 고도에 맞는 색만 1분마다 넘겨준다.
// 개발 서버에서는 오른쪽 위 게이지로 시각을 옮겨 볼 수 있다.

// Vanta CLOUDS 는 구름층 위에서 아래를 내려다본다. 카메라만 바꿔 끼워
// 구름층 안에 떠서 앞을 바라보게 한다 — 구름이 흘러와 몸을 스쳐 지나간다.
// CAMERA_Y 가 낮을수록 구름 속 깊이 들어간다 (구름층 윗면은 대략 0.4).
// uScroll(-1…1)은 스크롤 속도 — 내리면 카메라가 가라앉고 고개를 숙였다가, 멈추면 돌아온다.
const CAMERA_Y = 0.15
// 최종 화면의 채도 (1 = 원래대로, 0 = 흑백). 같은 밝기의 회색 쪽으로 섞는다.
const SATURATION = 0.6
const INSIDE_CLOUDS_MAIN = `
uniform float uScroll;
void main(){
    vec2 p = (-iResolution.xy + 2.0*gl_FragCoord.xy) / iResolution.y;
    vec3 ro = vec3(0.0, ${CAMERA_Y.toFixed(2)} - 0.12*uScroll, 0.0);
    vec3 ta = ro + vec3(-0.3 + 0.1*sin(iTime*0.03), 0.12 - 0.1*uScroll, -1.0);
    mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(p.xy, 1.5) );
    vec4 col = render( ro, rd, ivec2(gl_FragCoord-0.5) );
    float grey = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(mix(vec3(grey), col.rgb, ${SATURATION.toFixed(2)}), 1.0);
}
`

// 스크롤 반응 — 프레임마다 움직인 픽셀에 SCROLL_GAIN 을 곱해 쌓고, SCROLL_DECAY 비율로 0 에 돌아간다
const SCROLL_GAIN = 0.0015
const SCROLL_DECAY = 0.92

// 다크 모드에서 하늘 위에 덮는 검은 막의 불투명도
const DARK_DIM = 0.45

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// <html class="dark"> 가 바뀌는 것을 따라간다 (ThemeToggle 이 바꾼다)
function useDarkClass() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    )
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return dark
}

// date 와 같은 날의 자정에서 minutes 분 지난 시각
function atMinutes(date, minutes) {
  const d = new Date(date)
  d.setHours(0, minutes, 0, 0)
  return d
}

const pad = (n) => String(n).padStart(2, "0")

// 개발 서버에서만 뜨는 시각 게이지
function DevTimeSlider({ now, minutes, onChange }) {
  const value = minutes ?? now.getHours() * 60 + now.getMinutes()
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-3 rounded-full border-[1.5px] border-fg-strong bg-bg/70 px-4 py-2 text-sm/normal text-fg-strong backdrop-blur">
      <input
        type="range"
        min={0}
        max={1439}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Sky time"
        className="w-40 accent-current"
      />
      <span className="w-11 tabular-nums">
        {pad(Math.floor(value / 60))}:{pad(value % 60)}
      </span>
      <button
        type="button"
        onClick={() => onChange(null)}
        disabled={minutes == null}
        className="text-xs underline underline-offset-2"
      >
        Now
      </button>
    </div>
  )
}

export function SkyBackground() {
  const elRef = useRef(null)
  const effectRef = useRef(null)
  const realNow = useNow()
  // 개발용 게이지로 고른 시각(자정부터 몇 분). null 이면 실제 시각을 따른다.
  const [devMinutes, setDevMinutes] = useState(null)
  const now = devMinutes == null ? realNow : atMinutes(realNow, devMinutes)
  const dark = useDarkClass()
  const colors = skyColorsAt(now, skyLocation)
  const textTone = textToneFor(colors.skyColor, dark ? DARK_DIM : 0)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    effectRef.current = CLOUDS({
      el: elRef.current,
      THREE,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      speed: reduceMotion ? 0 : 0.4,
    })
    // 셰이더의 main() 만 갈아 끼우고 다시 그린다
    const effect = effectRef.current
    effect.fragmentShader = effect.fragmentShader.replace(
      /void main\(\)\{[\s\S]*$/,
      INSIDE_CLOUDS_MAIN,
    )
    effect.restart()
    // restart 가 uniforms 를 새로 만들므로 그 뒤에 붙인다
    const scrollUniform = { type: "f", value: 0 }
    effect.uniforms.uScroll = scrollUniform

    // 스크롤 속도를 쌓아 uScroll 로 넘기고, 멈추면 천천히 0 으로 돌아간다
    let frame = 0
    let lastY = window.scrollY
    let offset = 0
    const tick = () => {
      const y = window.scrollY
      offset = Math.max(-1, Math.min(1, offset * SCROLL_DECAY + (y - lastY) * SCROLL_GAIN))
      lastY = y
      scrollUniform.value = offset
      frame = requestAnimationFrame(tick)
    }
    if (!reduceMotion) frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      effectRef.current?.destroy()
    }
  }, [])

  // 색이 바뀔 때마다 효과를 새로 만들지 않고 옵션만 갈아 끼운다
  const colorKey = JSON.stringify(colors)
  useEffect(() => {
    effectRef.current?.setOptions(colors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey])

  // 글자 색은 테마가 아니라 하늘 밝기를 따른다 — index.css 의 [data-sky-text] 참고
  useEffect(() => {
    document.documentElement.dataset.skyText = textTone
  }, [textTone])

  return (
    <>
      {import.meta.env.DEV && (
        <DevTimeSlider now={realNow} minutes={devMinutes} onChange={setDevMinutes} />
      )}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div ref={elRef} className="absolute inset-0" />
        <div
          className="absolute inset-0 bg-black transition-opacity"
          style={{ opacity: dark ? DARK_DIM : 0 }}
        />
      </div>
    </>
  )
}
