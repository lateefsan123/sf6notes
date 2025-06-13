import React, { useState, useEffect } from 'react';
import Bookshelf from './bookshelf';

export default function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [notes, setNotes] = useState('');

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

  return (
    <div className="app">
      <div className="main-layout">
        <Bookshelf onSelectBook={setSelectedBook} />

        {selectedBook && (
          <div className="notes-panel">
            <div className="notes-header">
              <h2>{selectedBook.title}</h2>
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
                className="character-thumb"
              />
            </div>

            <textarea
              placeholder="Write notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            
          </div>
        )}
        <div className="change-char-wrapper">
              <a href="https://fightercenter.net/" target='_blank'><button className="change-char">Change Character</button></a>
            </div>
      </div>
    </div>
  );
}
