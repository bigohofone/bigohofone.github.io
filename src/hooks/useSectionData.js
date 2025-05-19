import { useState, useEffect } from 'react';

const useSectionData = (section) => {
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

export default useSectionData;