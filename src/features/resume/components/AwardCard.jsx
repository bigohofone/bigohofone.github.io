import { FiBookmark, FiCalendar, FiMapPin } from 'react-icons/fi';

const AwardCard = ({ title, organization, date, type, description }) => {
    const getEmoji = (type) => {
        switch (type) {
            case 'award': return '🏆';
            case 'scholarship': return '💰';
            case 'honor': return '✨';
            default: return null;
        }
    };

    return (
        <div className="wonjunoh-resume-list-entry">
            {/* Header: Title */}
            <div className="wonjunoh-resume-list-header">
                <div className="wonjunoh-resume-list-title">
                    {getEmoji(type)} {title}
                </div>
            </div>

            {/* Sub: Organization & Date */}
            <div className="wonjunoh-resume-list-sub" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiBookmark />
                    {organization}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCalendar />
                    {date}
                </span>
            </div>

            {/* Description */}
            {description && (
                <p className="wonjunoh-resume-list-desc">
                    {description}
                </p>
            )}
        </div>
    );
};

export default AwardCard;
