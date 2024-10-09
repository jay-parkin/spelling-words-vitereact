import React, { useEffect, useState } from "react";

const DadJokes = () => {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJokes = async () => {
      const apiUrl = "https://api.api-ninjas.com/v1/dadjokes?";

      // console.log("API Key:", {import.meta.env.VITE_DAD_JOKES_API});

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "X-Api-Key": import.meta.env.VITE_DAD_JOKES_API,
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API Error:", errorResponse);
          setError(`Error: ${response.status} - ${response.statusText}`);
          return;
        }

        const data = await response.json();
        setJokes(data);
      } catch (err) {
        setError(`Fetch failed: ${err.message}`);
      }
    };

    fetchJokes();
  }, []);

  return (
    <>
      {error ? (
        <p className="api-dad-jokes">{error}</p>
      ) : (
        jokes.map((joke, index) => (
          <h3 key={index} className="api-dad-jokes">
            {joke.joke}
          </h3>
        ))
      )}
    </>
  );
};

export default DadJokes;
