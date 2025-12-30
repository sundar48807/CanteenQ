import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../src/firebase";

const functions = getFunctions(app);

export default function LiveStatus() {
  const [token, setToken] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchToken = async () => {
    try {
      const getTokenFunction = httpsCallable(functions, 'getToken');
      const result = await getTokenFunction();
      setToken((result.data as { token: number }).token || 0);
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchToken();

    // Set up polling every 2 seconds
    const interval = setInterval(fetchToken, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold">Current Token</h2>
        <p className="text-4xl mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold">Current Token</h2>
      <p className="text-4xl mt-2">{token}</p>
    </div>
  );
}
