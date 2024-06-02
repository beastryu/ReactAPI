import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';

/*Hyper-realism, futuristic, neon cityscape at night*/

const App = () => {
  const [password, setPassword] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.API_ENDPOINT;
  
  const [id, setID] = useState('');
  const [galleryUrl, setGalleryUrl] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [galleryPrompt, setGalleryPrompt] = useState('');
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState(null);

  console.log('API Base URL:', apiBaseUrl); // Debugging log

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://445aa2cd-93d1-4c09-a72e-6e6d543962ca-00-3g1jh9qp6erw2.janeway.replit.dev/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, prompt }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      /*Waiter*/
      const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      setImageUrl(data.imageUrl);
      setImageData(data.imageData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setGalleryLoading(true);
    setGalleryError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/images/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      /*Waiter*/
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setGalleryUrl(data.imageUrl);
      setGalleryData(data.imageData);
      setGalleryPrompt(data.prompt);
    } catch (error) {
      setGalleryError(error.message);
    } finally {
      setGalleryLoading(false);
    }
  }

  return (
    /*Diaplay*/
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <h1 className="App-title">React+API Integration</h1>
      </header>
      <p className="App-intro">
        Demo by Seth
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt"
          required
        />
        <button type="submit">Generate Image</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {imageUrl && (
        <div className="generated-image">
          <h2>Generated Image</h2>
          <img src={imageUrl} alt="Generated" />
          <a href={`data:image/png;base64,${imageData}`} download="generated-image.png">
            <button type="button">Download Image</button>
          </a>
        </div>
      )}
      <p className="App-intro">Gallery</p>
      <form onSubmit={handleGallerySubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={id}
          onChange={(e) => setID(e.target.value)}
          placeholder="ID"
          required
        />
        <button type="submit">Generate Image</button>
      </form>
      {galleryLoading && <p className="loading">Loading...</p>}
      {galleryError && <p className="error">Error: {error}</p>}
      {galleryUrl && (
        <div className="generated-image">
          <h2>Generated Image Gallery</h2>
          <img src={galleryUrl} alt="Generated From SQL" />
          <a href={`data:image/png;base64,${galleryData}`} download="generated-image.png">
            <button type="button">Download Image</button>
          </a>
          <p>The associated prompt: {galleryPrompt}</p>
        </div>
      )}
    </div>
  );
};

export default App;
