// 📁 App.jsx
import React, { useState, useEffect } from 'react';
import Bookshelf from './bookshelf';

export default function App() {
  // toggles between character notes and matchup notes
  const [view, setView] = useState('characters');

  // currently selected book (for notes view)
  const [selectedBook, setSelectedBook] = useState(null);

  // notes for the selected book
  const [notes, setNotes] = useState('');

  // custom matchup books (saved in localStorage)
  const [customBooks, setCustomBooks] = useState(() => {
    const saved = localStorage.getItem('matchup-books');
    return saved ? JSON.parse(saved) : [];
  });

  // input state for new matchup book title
  const [newMatchup, setNewMatchup] = useState('');

  // modal visibility state
  const [showModal, setShowModal] = useState(false);

  // holds image file for new book
  const [newImageFile, setNewImageFile] = useState(null);

  // holds book selected for deletion
  const [bookToDelete, setBookToDelete] = useState(null);

  // load notes when book is selected
  useEffect(() => {
    if (selectedBook) {
      const saved = localStorage.getItem(`notes-${selectedBook.title}`);
      setNotes(saved || '');
    }
  }, [selectedBook]);

  // save notes when they change
  useEffect(() => {
    if (selectedBook) {
      localStorage.setItem(`notes-${selectedBook.title}`, notes);
    }
  }, [notes, selectedBook]);

  // save matchup books list when it changes
  useEffect(() => {
    localStorage.setItem('matchup-books', JSON.stringify(customBooks));
  }, [customBooks]);

  // just picks a random color from a preset list
  const getRandomColor = () => {
    const colors = [
      '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
      '#8b5cf6', '#f43f5e', '#22c55e', '#0ea5e9',
      '#eab308', '#ec4899', '#6366f1', '#f97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // adds a new matchup book
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

    // if there's an image, read it; otherwise just run
    if (newImageFile) {
      reader.readAsDataURL(newImageFile);
    } else {
      reader.onloadend();
    }
  };

  // deletes a book after confirmation
  const confirmDeleteBook = () => {
    if (bookToDelete) {
      setCustomBooks(prev => prev.filter(book => book.title !== bookToDelete.title));
      if (selectedBook?.title === bookToDelete.title) {
        setSelectedBook(null);
      }
    }
    setBookToDelete(null);
  };

  // cancels delete action
  const cancelDeleteBook = () => {
    setBookToDelete(null);
  };

  // books to show based on view (no character books for now)
  const currentBooks =
    view === 'characters'
      ? []
      : customBooks.map((book) => ({
          ...book,
          onDelete: () => setBookToDelete(book)
        }));

  return (
    <div className="app">
      {/* tab switcher */}
      <div className="tab-toggle">
        <button onClick={() => setView('characters')} className={view === 'characters' ? 'active' : ''}>Character Notes</button>
        <button onClick={() => setView('matchups')} className={view === 'matchups' ? 'active' : ''}>Player matchup</button>
        {view === 'matchups' && (
          <button onClick={() => setShowModal(true)} className="open-modal">+ Add Matchup</button>
        )}
      </div>

      {/* add matchup modal */}
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

      {/* delete confirmation modal */}
      {bookToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete <strong>{bookToDelete.title}</strong>?</p>
            <div className="modal-actions">
              <button onClick={confirmDeleteBook}>Yes, delete</button>
              <button onClick={cancelDeleteBook}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* main layout */}
      <div className="main-layout">
        {/* bookshelf section */}
        <Bookshelf
  books={currentBooks}
  onSelectBook={setSelectedBook}
  selectedBook={selectedBook}
/>


        {/* notes section */}
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

        {/* button to change page */}
        <div className="change-char-wrapper">
          <a href="https://www.fightercenter.net">
            <button className="change-char">
              Character Select
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
