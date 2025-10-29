import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt to fetch data from backend endpoint
    axios
      .get("/") 
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to connect to backend");
        setData(null);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      {error && <p className="text-red-600">{error}</p>}
      {data && <pre className="bg-gray-100 p-2 rounded">{data}</pre>}
      {!data && !error && <p>Loading...</p>}
    </div>
  );
}

export default App;
