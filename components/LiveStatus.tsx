import { useEffect, useState } from "react";

export default function LiveStatus() {
  const [token, setToken] = useState<number>(0);

  const fetchToken = async () => {
    const res = await fetch("http://<your-server-ip>:5000/api/getToken");
    const data = await res.json();
    setToken(data.token);
  };

  useEffect(() => {
    const interval = setInterval(fetchToken, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold">Current Token</h2>
      <p className="text-4xl mt-2">{token}</p>
    </div>
  );
}
