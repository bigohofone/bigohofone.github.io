// 파일 이름이 곧 JSON Resume 의 키다(work.json → resume.work)
const files = import.meta.glob("./*.json", { eager: true, import: "default" })
const resume = Object.fromEntries(Object.entries(files).map(([path, value]) => [path.slice(2, -5), value]))

export default resume
