// hex 색상 밝기 조정 함수
function adjustColor(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + Math.round(255 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
    let b = (num & 0x0000FF) + Math.round(255 * percent);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0').toUpperCase();
}

export const colorPalette = [
    { bg: '#FF002E' }, // RED
    // { bg: '#F30064' }, // Magenta
    { bg: '#A000BE' }, // Purple
    // { bg: '#7242EA' }, // Deep Purple
    // { bg: '#4339E3' }, // Indigo
    // { bg: '#2F59CC' }, // Blue
    { bg: '#3795FF' }, // Sky Blue
    // { bg: '#009BE1' }, // Light Blue
    // { bg: '#00908F' }, // Cyan
    // { bg: '#15A37A' }, // Teal
    { bg: '#22B25D' }, // Green
    // { bg: '#8CC44A' }, // Light Green
    // { bg: '#CDDD39' }, // Lime
    { bg: '#FAE735' }, // Yellow
    // { bg: '#FFC008' }, // Amber
    { bg: '#FF9A01' }, // Orange
    // { bg: '#FF5622' }, // Deep Orange
    // { bg: '#795548' }, // Brown
    // { bg: '#9e9e9e' }, // Gray
    // { bg: '#607d8b' }, // BlueGray

].map(({ bg }) => {
    // W3C 권장 대비비(contrast ratio) 기준으로 가독성 높은 폰트 색상 선택
    const getLuminance = (hex) => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = (num >> 16) & 0xFF;
        const g = (num >> 8) & 0xFF;
        const b = num & 0xFF;
        const srgb = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    };

    // 대비비 계산 함수
    const contrastRatio = (lum1, lum2) => {
        const L1 = Math.max(lum1, lum2);
        const L2 = Math.min(lum1, lum2);
        return (L1 + 0.05) / (L2 + 0.05);
    };

    const bgLum = getLuminance(bg);
    const whiteLum = getLuminance('#FFFFFF');
    const blackLum = getLuminance('#000000');

    // 흰색/검정 대비비 계산
    const contrastWithWhite = contrastRatio(bgLum, whiteLum);
    const contrastWithBlack = contrastRatio(bgLum, blackLum);

    // 더 높은 대비비를 가진 색상 선택 (최소 4.5:1 권장)
    // const font = contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#000000';
    // bg = '#FFFFFF'
    const font = '#000000';

    return { bg, font };
})