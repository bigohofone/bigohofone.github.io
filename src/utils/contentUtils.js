export function formatDate(dateArr) {
    if (!Array.isArray(dateArr) || dateArr.length < 3) return '';
    const [day, month, year] = dateArr;
    const parts = [month, day, year].filter(v => v != null);
    return parts.join('.');
}