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

- 소개 글·이름·사진: `src/data/profile.md`
- 논문·수상·학력·경력·대외 활동: `src/data/` 아래 폴더마다 `.md` 하나씩
- 맨 아래 About Me: `src/data/about_me.md`
- 연락처: `src/data/contact.js`

CV(`/Wonjun_Oh_CV.pdf`)는 같은 데이터로 `src/cv.js` 가 빌드 때 만든다.
