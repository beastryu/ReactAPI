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
  const apiBaseUrl = process.env.REACT_APP_API_ENDPOINT;
  
  const [id, setID] = useState('');
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState(null);

  console.log('API Base URL:', apiBaseUrl); // Debugging log
  console.log(process.env.REACT_APP_API_ENDPOINT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/generate-image`, {
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
      const response = await fetch(`${apiBaseUrl}/check-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, id: parseInt(id) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      /*Waiter*/
      const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          if (Array.isArray(data)) {
            setGallery(data);
          } else {
            setGallery([data]);
          }
        } catch (error) {
          setGalleryError(error.message);
        } finally {
          setGalleryLoading(false);
        }
      };
  const expandImage = (src) => {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modal.style.display = 'block';
    modalImg.src = src;
  };

  const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  };

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
      <form onSubmit={handleSubmit} className="form-container">
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
          <img src={imageUrl} alt="Generated" onClick={() => expandImage(imageUrl)} />
          <a href={`data:image/png;base64,${imageData}`} download="generated-image.png">
            <button type="button">Download Image</button>
          </a>
        </div>
      )}
<p className="App-intro">Gallery</p>
      <form onSubmit={handleGallerySubmit} className="form-container">
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
          placeholder="ID (Enter 0 to list all)"
          required
        />
        <button type="submit">Retrieve Images</button>
      </form>
      {galleryLoading && <p className="loading">Loading...</p>}
      {galleryError && <p className="error">Error: {galleryError}</p>}
      {gallery.length > 0 && (
        <div className="gallery">
          <h2>Generated Image Gallery</h2>
          {gallery.map((item) => (
            <div className="gallery-item" key={item.id}>
              <img src={`data:image/png;base64,${item.imageData}`} alt={`Generated From SQL ${item.id}`} onClick={() => expandImage(`data:image/png;base64,${item.imageData}`)} />
              <div className="gallery-item-div">
                <p>The associated prompt: {item.prompt}</p>
                <a href={`data:image/png;base64,${item.imageData}`} download={`generated-image-${item.id}.png`}>
                  <button type="button">Download Image</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      <div id="modal" className="modal" onClick={closeModal}>
        <span className="close" onClick={closeModal}>&times;</span>
        <img className="modal-content" id="modal-img" alt=""/>
      </div>
    </div>
  );
};

export default App;
