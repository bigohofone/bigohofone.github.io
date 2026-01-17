import React from 'react';
import { FiMail, FiGlobe } from "react-icons/fi";
import { FaLinkedin, FaGithub, FaThreads, FaXTwitter, FaRegEnvelope, FaGlobe } from 'react-icons/fa6';
import { SiGooglescholar } from 'react-icons/si';
import { MdVerified } from 'react-icons/md';
// Adjusted import path: src/features/resume/components -> src/data
import content from '../../../data/content';

const Sidebar = () => {
    const { profile, contact } = content;

    // Helper: Contact Icons (Email, Phone, Website)
    const getContactIcon = (label) => {
        const l = label.toLowerCase();
        if (l.includes('email')) return <FiMail size={18} />;
        // if (l.includes('phone')) return <FaRegPhone size={18} />;
        if (l.includes('website')) return <FiGlobe size={18} />;
        return null;
    };

    // Helper: Social Icons
    const getSocialIcon = (label) => {
        const l = label.toLowerCase();
        if (l.includes('x (twitter)') || l === 'x') return <FaXTwitter />;
        if (l.includes('threads')) return <FaThreads />;
        if (l.includes('linkedin')) return <FaLinkedin />;
        if (l.includes('github')) return <FaGithub />;
        if (l.includes('google scholar')) return <SiGooglescholar />;
        return null;
    };

    const contactDisplayItems = contact.items.filter(item =>
        ['Email', 'Phone', 'Website'].includes(item.label)
    );

    const socialFooterItems = contact.items.filter(item =>
        ['X (Twitter)', 'Threads', 'LinkedIn', 'GitHub', 'Google Scholar'].includes(item.label)
    );

    return (
        <aside className="wonjunoh-resume-sidebar">
            <img
                src={process.env.PUBLIC_URL + profile.image}
                alt={profile.name}
                className="wonjunoh-resume-profile-img"
            />

            <div className="wonjunoh-resume-name-wrapper">
                <h1 className="wonjunoh-resume-name">{profile.name}</h1>
                {/* <MdVerified className="wonjunoh-resume-verified" /> */}
            </div>

            <p className="wonjunoh-resume-pronouns">
                {profile.pronouns}
            </p>

            {/* About Section */}
            <div className="wonjunoh-resume-sidebar-section">
                <h3 className="wonjunoh-resume-sidebar-label">About</h3>
                <p className="wonjunoh-resume-sidebar-text">
                    {profile.shortBio}
                </p>
            </div>

            {/* Contact Section */}
            <div className="wonjunoh-resume-sidebar-section">
                <h3 className="wonjunoh-resume-sidebar-label">Contact</h3>
                <ul className="wonjunoh-resume-sidebar-list">
                    {contactDisplayItems.map((item, i) => (
                        <li key={i}>
                            <a href={item.link} className="wonjunoh-resume-sidebar-link" title={item.label}>
                                <span className="wonjunoh-resume-sidebar-icon-wrapper">
                                    {getContactIcon(item.label)}
                                </span>
                                {item.value}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Social Icons Footer */}
            <div className="wonjunoh-resume-social-row">
                {socialFooterItems.map((item, i) => (
                    <a
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        title={item.label}
                        className="wonjunoh-resume-social-icon"
                    >
                        {getSocialIcon(item.label)}
                    </a>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
