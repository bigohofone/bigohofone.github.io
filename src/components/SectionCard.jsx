import React, { useState } from 'react';
import { SECTIONS } from './sectionConfig';

const SectionCard = ({ section, data }) => {
  const [expanded, setExpanded] = useState(false);

  const sectionConfig = SECTIONS[section];
  if (!sectionConfig || !sectionConfig.component) return null;

  const handleToggle = () => setExpanded(prev => !prev);

  const CardComponent = sectionConfig.component;

  return (
    <div className={`section-card${expanded ? ' expanded' : ''}`}>
      <CardComponent
        data={data}
        expanded={expanded}
        onToggle={handleToggle}
      />
    </div>
  );
};

export default SectionCard;