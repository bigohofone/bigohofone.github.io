export const footnotes = [
  { mark: "*", text: "Denotes equal contribution" },
  { mark: "†", text: "Denotes corresponding author" },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthYear = (date) => (/^\d{4}-\d{2}/.test(date) ? `${MONTHS[date.slice(5, 7) - 1]}. ${date.slice(0, 4)}` : date)
export const period = (start, end) => `${monthYear(start)} – ${end ? monthYear(end) : "Present"}`
