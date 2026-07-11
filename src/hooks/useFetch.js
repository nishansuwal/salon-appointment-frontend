import { useEffect, useState } from "react";

export default function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.resolve(fetcher())
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((fetchError) => {
        if (mounted) setError(fetchError);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}
