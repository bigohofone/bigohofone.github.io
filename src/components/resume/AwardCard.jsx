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
        <div className="list-entry">
            {/* Header: Title */}
            <div className="list-header">
                <div className="list-title">
                    {getEmoji(type)} {title}
                </div>
            </div>

            {/* Sub: Organization & Date */}
            <div className="list-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                <p className="list-desc">
                    {description}
                </p>
            )}
        </div>
    );
};

export default AwardCard;
