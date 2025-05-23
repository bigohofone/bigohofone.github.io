/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import { useState, useEffect } from 'react';

const useCard = (section) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/data/${section}.json`)
        .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch /data/${section}.json`);
        return res.json();
        })
        .then((json) => {
        setData(json);
        })
        .catch((err) => {
        console.error('Fetch error:', err);
        setError(err);
        })
        .finally(() => setLoading(false));
    }, [section]);

  return { data, loading, error };
};

export default useCard;