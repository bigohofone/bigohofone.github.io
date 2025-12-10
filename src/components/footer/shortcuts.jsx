import React, { useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext.jsx';

// icons
import {
    MailIcon,
    ResumeIcon,
    GoogleScholarIcon,
    GithubIcon,
    LinkedInIcon,
    XIcon
} from '../../assets/icons/icons.jsx';

function ButtonLink({
    href,
    icon,
    label,
    iconBoxSize,
    fontSize,
    variant = "default",
}) {

    return (
        <li>
            <a
                className="btn"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                    display: 'flex',
                    gap: 'calc(' + iconBoxSize + ' * 1/6)',
                    textDecoration: 'none',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: iconBoxSize,
                        height: iconBoxSize,
                        // background: 'var(--color-on-text-subsubtle)',
                        border: '1px solid var(--color-on-text-subsubtle)',
                        borderRadius: '9999px'
                    }}
                >
                    <div style={{ width: 'calc(' + iconBoxSize + ' * 4/6)', height: 'calc(' + iconBoxSize + ' * 4/6)' }}>{icon}</div>
                </div>

                {variant === "icon-only" ? null : (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'calc(' + fontSize + ' * 1/6)',
                            fontSize,
                            fontWeight: 500,
                            color: 'var(--color-on-text-primary)',
                        }}
                    >
                        <span>{label}</span>
                        <span className="material-symbols-outlined" style={{ fontSize }}>
                            arrow_outward
                        </span>
                    </div>
                )}
            </a>
        </li>
    );
}

// 버튼 목록을 데이터만으로 관리
const linkItems = [
    { icon: MailIcon(), ko: "메일", en: "Mail", href: "mailto:owj0421@naver.com" },
    // { icon: ResumeIcon(), ko: "이력서", en: "Resume", href: "/data/resume_wonjunoh.pdf" },
    { icon: GoogleScholarIcon(), ko: "구글 스칼라", en: "Google Scholar", href: "https://scholar.google.com/citations?user=owj0421" },
    { icon: GithubIcon(), ko: "GitHub", en: "GitHub", href: "https://github.com/bigohofone" },
    { icon: LinkedInIcon(), ko: "LinkedIn", en: "LinkedIn", href: "https://www.linkedin.com/in/wonjun-oh-8067b5265/" },
    { icon: XIcon(), ko: "X", en: "X", href: "https://x.com/bigohofone" },
];

// size 설정을 맵핑
const sizeMap = {
    big:    { iconBoxSize: "3rem", fontSize: "var(--font-size-md)", gapSize: 'calc(3rem * 1/3)'},
    small: { iconBoxSize: "2.5rem", fontSize: "var(--font-size-sm)", gapSize: 'calc(2.5rem * 1/3)'},
};

function getContainerStyle(width, variant, gapSize) {
    if (variant === "icon-only") {
        return {
            display: 'flex',
            gap: gapSize,
            listStyleType: 'none',
        };
    }

    const base = {
        width: "100%",
        margin: "0 auto",
        listStyleType: "none",
    };

    if (width < 768)
        return { ...base, display: "grid", gridTemplateColumns: "1fr", rowGap: gapSize };
    if (width < 960)
        return { ...base, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", rowGap: gapSize };

    return { ...base, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: gapSize };
}

export default function Shortcuts({ size = "small", variant = "default" }) {
    const app = useAppContext();
    const locale = app?.locale || "en";
    const width = app?.width || 1024;

    const { iconBoxSize, fontSize, gapSize } = sizeMap[size] || sizeMap.small;

    return (
        <ul style={getContainerStyle(width, variant, gapSize)}>
            {linkItems.map((item) => (
                <ButtonLink
                    key={item.href}
                    href={item.href}
                    label={locale === "ko" ? item.ko : item.en}
                    icon={item.icon}
                    iconBoxSize={iconBoxSize}
                    fontSize={fontSize}
                    variant={variant}
                />
            ))}
        </ul>
    );
}