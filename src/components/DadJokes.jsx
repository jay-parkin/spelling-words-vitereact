import React, { useEffect, useState } from "react";

const DadJokes = () => {
  const [jokes, setJokes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const fetchJokes = async () => {
      setLoading(true);
      setLoadError(null);

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

          setLoadError(`Couldn't find Dad anywhere, try again later.`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setJokes(data);
      } catch (err) {
        setLoadError(`Couldn't find Dad anywhere, try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchJokes();
  }, []);

  if (loading) {
    return <h3 className="api-dad-jokes">Finding Dad...</h3>;
  }

  if (loadError) return <h3 className="api-dad-jokes">{loadError}</h3>;

  return (
    <>
      {loadError ? (
        <p className="api-dad-jokes">{loadError}</p>
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
