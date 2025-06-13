import React, { useState, useEffect } from 'react';
import Bookshelf from './bookshelf';

export default function App() {
  const [view, setView] = useState('characters');
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes] = useState('');
  const [customBooks, setCustomBooks] = useState(() => {
    const saved = localStorage.getItem('matchup-books');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMatchup, setNewMatchup] = useState('');
  const [showModal, setShowModal] = useState(false);

  const books = []; // Your default character books should be defined here or passed to Bookshelf
  const [newImageFile, setNewImageFile] = useState(null);


  useEffect(() => {
    if (selectedBook) {
      const saved = localStorage.getItem(`notes-${selectedBook.title}`);
      setNotes(saved || '');
    }
  }, [selectedBook]);

  useEffect(() => {
    if (selectedBook) {
      localStorage.setItem(`notes-${selectedBook.title}`, notes);
    }
  }, [notes, selectedBook]);

  useEffect(() => {
    localStorage.setItem('matchup-books', JSON.stringify(customBooks));
  }, [customBooks]);

  const getRandomColor = () => {
  const colors = [
    '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
    '#8b5cf6', '#f43f5e', '#22c55e', '#0ea5e9',
    '#eab308', '#ec4899', '#6366f1', '#f97316'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const addMatchupBook = () => {
  if (!newMatchup.trim()) return;

  const title = newMatchup.trim();
  const reader = new FileReader();

  reader.onloadend = () => {
    const newBook = {
      title,
      image: reader.result || null,
      color: getRandomColor(),
    };

    setCustomBooks(prev => [...prev, newBook]);
    setNewMatchup('');
    setNewImageFile(null);
    setShowModal(false);
  };

  if (newImageFile) {
    reader.readAsDataURL(newImageFile);
  } else {
    reader.onloadend(); // handle empty image
  }
};




  const currentBooks = view === 'characters' ? books : customBooks;

  return (
    <div className="app">
      <div className="tab-toggle">
        <button onClick={() => setView('characters')} className={view === 'characters' ? 'active' : ''}>Character Notes</button>
        <button onClick={() => setView('matchups')} className={view === 'matchups' ? 'active' : ''}>Player matchup</button>
        {view === 'matchups' && (
          <button onClick={() => setShowModal(true)} className="open-modal">+ Add Matchup</button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <input
              type="text"
              placeholder="(e.g. Lateef's kim)"
              value={newMatchup}
              onChange={e => setNewMatchup(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewImageFile(e.target.files?.[0])}
            />

            <div className="modal-actions">
              <button onClick={addMatchupBook}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="main-layout">
        <Bookshelf books={currentBooks} onSelectBook={setSelectedBook} />

        {selectedBook && (
          <div className="notes-panel">
            <div className="notes-header">
              <h2>{selectedBook.title}</h2>
              {selectedBook.image && (
                <img src={selectedBook.image} alt={selectedBook.title} className="character-thumb" />
              )}
            </div>
            <textarea
              placeholder="Write notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
          </div>

        )}

        <div className="change-char-wrapper">
              <a href="https://www.fightercenter.net">
              <button className="change-char">
                Change Character
              </button>
              </a>
            </div>
      </div>
    </div>
  );
}
