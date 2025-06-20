/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import BaseContentElement from './Base';
import { formatDate } from '../../utils/contentUtils';

const HonorAndAwardContentElement = ({ data, expanded, onToggle }) => (
  <BaseContentElement
    expanded={expanded}
    onToggle={onToggle}
    mainImage={data.mainImage}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.date)}{' '}
    </p>
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
  </BaseContentElement>
);

export default HonorAndAwardContentElement;