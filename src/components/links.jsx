import React, { useState } from 'react';
import content from '../data/content';
import { MdEmail, MdCheck } from 'react-icons/md';
import { FaXTwitter, FaLinkedin, FaGithub } from 'react-icons/fa6';
import { SiGooglescholar } from 'react-icons/si';

// ── Component ──────────────────────────────────────────────────────────────────
const { contact } = content;

const displayItems = contact.items.filter(item => item.label !== 'Website');

const iconMap = {
    // 'Email': <MdEmail />,
    'X (Twitter)': <FaXTwitter />,
    'LinkedIn': <FaLinkedin />,
    'GitHub': <FaGithub />,
    'Google Scholar': <SiGooglescholar />
};

const Links = () => {
    const [copied, setCopied] = useState(false);

    const handleEmailClick = (e, value) => {
        e.preventDefault();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="links">
            <ul className="links__list">
                {displayItems.map((item, i) => {
                    if (item.label === 'Email') {
                        return (
                            /* links__item--email */
                            // <li key={i} className="links__item">
                            //     <button
                            //         className="links__email-box"
                            //         onClick={(e) => handleEmailClick(e, item.value)}
                            //         title="Copy Email"
                            //     >
                            //         <p className="links__icon">{copied ? <MdCheck /> : iconMap[item.label]}</p>
                            //         {/* <p className="links__text">Contact Me</p> */}
                            //     </button>
                            // </li>
                            <></>
                        );
                    }
                    return (
                        <li key={i} className="links__item">
                            <a
                                href={item.link}
                                className="links__icon-box"
                                title={item.label}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p className="links__icon">{iconMap[item.label]}</p>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Links;
