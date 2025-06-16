import React, { useState, useEffect, useRef } from 'react';
import Bookshelf from './bookshelf';
import html2pdf from 'html2pdf.js';

export default function App() {
  const [view, setView] = useState('characters');
  const [selectedBook, setSelectedBook] = useState(null);
  const [customBooks, setCustomBooks] = useState(() => {
    const saved = localStorage.getItem('matchup-books');
    return saved ? JSON.parse(saved) : [];
  });

  const [newMatchup, setNewMatchup] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [textColor, setTextColor] = useState('#e4e4e7');

  const notesRef = useRef(null);

  useEffect(() => {
    if (selectedBook && notesRef.current) {
      const saved = localStorage.getItem(`notes-${selectedBook.title}`);
      notesRef.current.innerHTML = saved || '';
    }
  }, [selectedBook]);

  useEffect(() => {
    const handleInput = () => {
      if (selectedBook && notesRef.current) {
        const html = notesRef.current.innerHTML;
        localStorage.setItem(`notes-${selectedBook.title}`, html);
      }
    };

    const node = notesRef.current;
    if (node) node.addEventListener('input', handleInput);
    return () => {
      if (node) node.removeEventListener('input', handleInput);
    };
  }, [selectedBook]);

  const handleRichTyping = (e) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.color = textColor;
      span.appendChild(document.createTextNode(e.key));
      range.deleteContents();
      range.insertNode(span);
      range.setStartAfter(span);
      sel.removeAllRanges();
      sel.addRange(range);
      if (notesRef.current) {
        notesRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const br = document.createElement("br");
      const range = window.getSelection().getRangeAt(0);
      range.insertNode(br);
      range.setStartAfter(br);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      if (notesRef.current) {
        notesRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const exportToPDF = () => {
    if (notesRef.current && selectedBook) {
      const opt = {
        margin: 0.5,
        filename: `${selectedBook.title.replace(/\s+/g, '_')}_notes.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(notesRef.current).set(opt).save();
    }
  };

const presetColors = [
  'rgb(59, 130, 246)',   // blue
  'rgb(16, 185, 129)',   // green
  'rgb(245, 158, 11)',   // orange
  'rgb(239, 68, 68)',    // red
  'rgb(139, 92, 246)',   // violet
  'rgb(236, 72, 153)',   // pink
  'rgb(34, 211, 238)',   // cyan
  'rgb(249, 115, 22)',   // orange deep
  'rgb(20, 184, 166)',   // teal
  'rgb(132, 204, 22)',   // lime
  'rgb(168, 85, 247)',   // purple
  'rgb(244, 114, 182)',  // rose
];

const getRandomColor = () => {
  return presetColors[Math.floor(Math.random() * presetColors.length)];
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
      reader.onloadend();
    }
  };

  const confirmDeleteBook = () => {
    if (bookToDelete) {
      setCustomBooks(prev => prev.filter(book => book.title !== bookToDelete.title));
      if (selectedBook?.title === bookToDelete.title) {
        setSelectedBook(null);
      }
    }
    setBookToDelete(null);
  };

  const cancelDeleteBook = () => setBookToDelete(null);

  const currentBooks =
    view === 'characters'
      ? []
      : customBooks.map((book) => ({
          ...book,
          onDelete: () => setBookToDelete(book)
        }));

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

      <div className="main-layout">
        <Bookshelf
          books={currentBooks}
          onSelectBook={setSelectedBook}
          selectedBook={selectedBook}
        />

        {selectedBook && (
          <div className="notes-panel">
            <div className="notes-header">
              <h2>{selectedBook.title}</h2>
              <div className="color-buttons">
                <button onClick={() => setTextColor('#22d3ee')} style={{ background: '#22d3ee' }}>Cyan</button>
                <button onClick={() => setTextColor('#f97316')} style={{ background: '#f97316' }}>Orange</button>
                <button onClick={() => setTextColor('#84cc16')} style={{ background: '#84cc16' }}>Lime</button>
                <button onClick={() => setTextColor('#a855f7')} style={{ background: '#a855f7' }}>Violet</button>
                <button onClick={() => setTextColor('#ec4899')} style={{ background: '#ec4899' }}>Pink</button>
                <button onClick={() => setTextColor('#e4e4e7')} style={{ background: '#e4e4e7', color: '#111' }}>White</button>
              </div>
              {selectedBook.image && (
                <img src={selectedBook.image} alt={selectedBook.title} className="character-thumb" />
              )}
            </div>
            <div
              className="rich-notes"
              contentEditable
              suppressContentEditableWarning
              ref={notesRef}
              onKeyDown={handleRichTyping}
              style={{ color: textColor }}
            ></div>
            <div className="export-button">
              <button onClick={exportToPDF}>Download PDF</button>
            </div>
          </div>
        )}

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
