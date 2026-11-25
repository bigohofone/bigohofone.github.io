# wonjunoh.com

개인 홈페이지. Vite + React + Tailwind CSS 로 만들고 GitHub Pages(gh-pages 브랜치)로 배포한다.

## 준비

```sh
npm install
brew install tectonic   # CV PDF 를 만드는 LaTeX 엔진
```

## 명령

```sh
npm run dev      # 개발 서버
npm run deploy   # 빌드(사이트 + CV PDF) 후 gh-pages 로 배포
```

## 내용 고치기

모든 내용은 `src/resume/` 에 있다. JSON 파일 하나가 [JSON Resume](https://jsonresume.org/schema) 의 키 하나이고, 불러올 때 하나로 합친다.

- `basics.json`: 이름, 직함(`label`), 사진, 이메일, 웹사이트, 짧은 소개(`summary`), `profiles`(GitHub 등)
- `summary.md`: 사이트 맨 위 소개 글(마크다운). CV 의 Research Interest 도 여기서 뽑는다
- `work.json`, `education.json`, `awards.json`, `publications.json`, `volunteer.json`: 목록

목록은 적힌 순서대로 나온다. 날짜는 `2025`, `2025-05`, `2025-05-27` 꼴이고, 아직 다니는 곳은 `endDate` 를 뺀다.

표준에 없어서 덧붙인 키:

- `type`: 모든 목록 항목의 종류. 사이트 아이콘과 범례, CV 순서에 쓴다
  - `work`: industry·academia
  - `awards`: honor·award·competition
  - `publications`: conference·journal·preprint·tech report
  - `education`: undergraduate·graduate
  - `volunteer`: club
- `publications[].authors`: 저자 (`*` 공동 1저자, `†` 교신저자)
- `publications[].links`: `url`(Paper) 말고 더 붙일 링크, `{ "Code": "https://…" }`
- `awards[].selected`: `false` 면 사이트에서 숨김(CV 에는 나옴)
- `education[].location`, `education[].summary`: CV 에 쓰는 위치와 설명

## 블로그

`src/blog/` 에 글 하나당 `.md` 하나. 파일 이름이 주소다(`hello.md` → `/blog/hello/`). `_` 로 시작하는 파일은 개발 서버에서만 보인다(예시·초안).

```md
---
date: "2026-11-24"
tags: [notes]
---

# 제목 (글에 하나만)

## 소제목

### 그 아래

본문. 수식은 $E = mc^2$, 따로 떼면 $$ … $$. 코드는 ``` 로 감싸고 언어를 적는다.
```

목록에는 작성일과 읽는 시간(영어 분당 230 단어, 한글 분당 500 글자, 코드·수식 제외)이 붙는다.

빌드 때 MDX 로 컴포넌트가 되고, 수식(KaTeX)과 코드 색(Shiki)도 이때 입힌다. 태그 쪽(`/blog/tags/<태그>/`), RSS(`/blog/feed.xml`), sitemap 도 빌드 때 만든다.

CV(`/Wonjun_Oh_CV.pdf`)는 같은 데이터로 `src/cv.js` 가 빌드 때 만든다.

빌드 때 페이지를 HTML 로 미리 그려 넣어(`vite-plugin-prerender.js`) 검색 엔진이 JavaScript 없이도 내용을 읽는다.
