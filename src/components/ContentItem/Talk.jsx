/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import BaseContentItem from './Base';
import { formatDate } from '../../utils/contentUtils';

const TalkContentItem = ({ data, expanded, onToggle }) => (
  <BaseContentItem
    expanded={expanded}
    onToggle={onToggle}
    details={data.details}
  >
    <div className="content-item__header-top">
      {formatDate(data.start)}{' '}
    </div>
    <div className="content-item__header-mid">
      <h3>{data.title}</h3>
    </div>
    <div className="content-item__header-bottom">
      <p>{data.client}</p>
    </div>
  </BaseContentItem>
);

export default TalkContentItem;