import "./index.css";
import BackgroundSVG from "./BackgroundSVG";
import React from "react";
import { useState } from "react";
import { OPENAI_API_KEY } from "./config";

function App() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add a handler for the Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      getImages();
    }
  };

  // Function for getting images
  const getImages = async () => {
    setError(null);
    setLoading(true);
    setImages([]);

    if (!value.trim()) {
      setError("Please enter a prompt");
      setLoading(false);
      return;
    }

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: value,
        n: 4,
        size: "1024x1024",
      }),
    };
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        options
      );
      const data = await response.json();
      console.log(data);

      setImages(data.data.map((img) => img.url));
      setLoading(false);
      setValue("");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <BackgroundSVG />
      <header>
        <h1>AI Image Generator</h1>
      </header>
      <section className="imgSection">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {images.map((url, index) => (
          <div key={index} className="imgContainer">
            <img src={url} alt={`Generated image ${index + 1}`} />
          </div>
        ))}
      </section>
      <section className="bottomSection">
        <div className="inputContainer">
          <input
            placeholder="write something..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div id="submitIcon" onClick={getImages}>
            ►
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
