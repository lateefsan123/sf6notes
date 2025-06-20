import React, { useState, useEffect, useRef } from 'react';
import Bookshelf from './bookshelf';
import html2pdf from 'html2pdf.js';
import {darkenColor} from './bookshelf';
import punk from './covers/ppunk.png';
import tokido from './covers/tokido.png';
import leshar from './covers/leshar.png';
import { div } from 'framer-motion/client';
import { use } from 'framer-motion/m';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

export default function App() {
  // color picker for notes
  const [noteColor, setNoteColor] = useState(null);

const [noteModalColor, setNoteModalColor] = useState(
  localStorage.getItem("notes-panel-color") || "rgba(28, 24, 48, 0.85)"
);

const [richnotes, setRichNotes] = useState(
  localStorage.getItem("rich-notes-color") || "rgba(28, 26, 45, 0.65)"
);



  function handleColorChange(color, rich) {
    +setNoteModalColor(color);
    setRichNotes(rich);

    localStorage.setItem("notes-panel-color", color);
    localStorage.setItem("rich-notes-color", rich);

    const panel = document.querySelector(".notes-panel");
    const richArea = document.querySelector(".rich-notes");

    if (panel) panel.style.backgroundColor = color;
    if (richArea) richArea.style.backgroundColor = rich;
    
  }

  useEffect(() => {
  const panel = document.querySelector(".notes-panel");
  const richArea = document.querySelector(".rich-notes");

  if (panel) panel.style.backgroundColor = noteModalColor;
  if (richArea) richArea.style.backgroundColor = richnotes;
}, [noteModalColor, richnotes]);



  // what section we're on (character notes or matchup notes)
  const [view, setView] = useState('characters');

  const [showMobileNotes, setShowMobileNotes] = useState(false);


  // which book is open right now
  const [selectedBook, setSelectedBook] = useState(null);

  // custom matchup books, grab from localStorage if it's already there
const [customBooks, setCustomBooks] = useState(() => {
  const saved = localStorage.getItem('matchup-books');
  const parsed = saved ? JSON.parse(saved) : null;

  if (parsed && parsed.length > 0) return parsed;

  const defaultBooks = [
    {
      title: "Punk",
      image: punk,
      color: "rgb(19, 97, 38)",
      innercolor: darkenColor("rgb(19, 97, 38)", 0.15),
    },
    {
      title: "Tokido",
      image: tokido,
      color: "rgb(43, 43, 43)",
      innercolor: darkenColor("rgb(43, 43, 43)", 0.15),
    },
    {
      title: "Leshar",
      image: leshar,
      color: "rgb(68, 117, 239)",
      innercolor: darkenColor("rgb(68, 117, 239)", 0.15),
    },
  ];

  // Save to localStorage
  localStorage.setItem('matchup-books', JSON.stringify(defaultBooks));

  // Set default notes for each book
  const defaultNotes = {
    "Punk": "<p>Do not whiff  Buttons against him </p>",
    "Tokido": "<p>Do not forget to Breath</p>",
    "Leshar": "<p>Offense Do not Try to hit him with DI</p>",
  };

  for (const [title, html] of Object.entries(defaultNotes)) {
    localStorage.setItem(`notes-${title}`, html);
  }

  return defaultBooks;
});
  // input field stuff for adding new matchups
  const [newMatchup, setNewMatchup] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  // default text color for notes
  const [textColor, setTextColor] = useState('#e4e4e7');

  // to access the note area directly (for contentEditable)
  const notesRef = useRef(null);

  // when a book is selected, load its saved notes from localStorage
  useEffect(() => {
    if (selectedBook && notesRef.current) {
      const saved = localStorage.getItem(`notes-${selectedBook.title}`);
      notesRef.current.innerHTML = saved || '';
    }
  }, [selectedBook]);

  // this makes sure the custom matchup books actually get saved
  useEffect(() => {
    localStorage.setItem('matchup-books', JSON.stringify(customBooks));
  }, [customBooks]);

  // whenever we type in the note box, save it to localStorage
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

  // handles coloring each letter you type with the selected color
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
      // just handle enter key to make a line break manually
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

  // lets you save notes as a downloadable PDF
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

  // this is new — export ALL notes as one .json file
  const exportAllNotes = () => {
    const data = {
      books: customBooks,
      notes: {},
    };

    customBooks.forEach(book => {
      const noteKey = `notes-${book.title}`;
      const savedNote = localStorage.getItem(noteKey);
      if (savedNote) {
        data.notes[book.title] = savedNote;
      }
    });

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sf6_notes_backup.json';
    link.click();
  };

  //import a backup file and restore your stuff on different devices
  const importAllNotes = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (importedData.books && Array.isArray(importedData.books)) {
          setCustomBooks(importedData.books);
          localStorage.setItem('matchup-books', JSON.stringify(importedData.books));
        }

        if (importedData.notes) {
          for (const [title, html] of Object.entries(importedData.notes)) {
            localStorage.setItem(`notes-${title}`, html);
          }
        }

        alert('Notes imported successfully!');
      } catch (err) {
        alert('Failed to import notes. Make sure it\'s a valid file.');
      }
    };
    reader.readAsText(file);
  };

  // colors we cycle through randomly when creating books
  const presetColors = [
    'rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)',
    'rgb(239, 68, 68)', 'rgb(139, 92, 246)', 'rgb(236, 72, 153)',
    'rgb(34, 211, 238)', 'rgb(249, 115, 22)', 'rgb(20, 184, 166)',
    'rgb(132, 204, 22)', 'rgb(168, 85, 247)', 'rgb(244, 114, 182)',
  ];

  const getRandomColor = () => {
    return presetColors[Math.floor(Math.random() * presetColors.length)];
  };

  const [newColor, setNewColor] = useState("#ffffff");


  // adds a new matchup book
  const addMatchupBook = () => {
    if (!newMatchup.trim()) return;
    const title = newMatchup.trim();
    const reader = new FileReader();

    reader.onloadend = () => {
      const newBook = {
        title,
        image: reader.result || null,
        color: newColor,
        innercolor: darkenColor(newColor, 0.15),
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

  // picks which books to display based on current tab
  const currentBooks =
    view === 'characters'
      ? null // fall back to default books for character notes
      : customBooks.length
        ? customBooks.map((book) => ({
            ...book,
            onDelete: () => setBookToDelete(book)
          }))
        : []; // show empty shelf when no matchups

  return (

    
    <div className="app">
      {/* top buttons to switch views */}
      <div className="tab-toggle">
        <button onClick={() => setView('characters')} className={view === 'characters' ? 'active' : ''}>Character Notes</button>
        <button onClick={() => setView('matchups')} className={view === 'matchups' ? 'active' : ''}>Player matchup</button>
        {view === 'matchups' && (
          <button onClick={() => setShowModal(true)} className="open-modal">+ Add Matchup</button>
        )}
      </div>

      
        {/* import/export buttons */}
<div className="import-export" style={{ marginTop: '1rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
  <button
    onClick={exportAllNotes}
    style={{
      background: '#1e40af',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
    }}
  >
    Export Notes
  </button>

  {/* hidden file input, triggered by import button */}
  <input
    id="import-notes-file"
    type="file"
    accept="application/json"
    style={{ display: 'none' }}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) importAllNotes(file);
    }}
  />

  <button
    onClick={() => document.getElementById('import-notes-file').click()}
    style={{
      background: '#059669',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
    }}
  >
    Import Notes
  </button>
</div>

{showMobileNotes && (
  <div className="colorpickerback">
    <div className="color-picker">

      <div className="colorpickerclose">
        <button onClick={() => setShowMobileNotes(!showMobileNotes)}>
          <i className="fa-solid fa-x fa-lg"></i>
        </button>
      </div>

      <div className="colorholder">
        {/* Default color - deep indigo */}
        <button
          data-inner="rgba(28, 26, 45, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(28, 24, 48, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(28, 24, 48, 0.85)" }}></i>
        </button>

        {/* Deep Burgundy */}
        <button
          data-inner="rgba(65, 21, 21, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(88, 28, 28, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(88, 28, 28, 0.85)" }}></i>
        </button>

        {/* Muted Crimson */}
        <button
          data-inner="rgba(94, 22, 30, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(132, 32, 41, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(132, 32, 41, 0.85)" }}></i>
        </button>

        {/* Deep Plum */}
        <button
          data-inner="rgba(55, 25, 58, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(75, 36, 78, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(75, 36, 78, 0.85)" }}></i>
        </button>

        {/* Royal Purple */}
        <button
          data-inner="rgba(75, 38, 112, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(102, 51, 153, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(102, 51, 153, 0.85)" }}></i>
        </button>

        {/* Navy Blue */}
        <button
          data-inner="rgba(18, 29, 66, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(23, 37, 84, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(23, 37, 84, 0.85)" }}></i>
        </button>

        {/* Deep Teal */}
        <button
          data-inner="rgba(10, 42, 48, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(15, 58, 66, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(15, 58, 66, 0.85)" }}></i>
        </button>

        {/* Elegant Olive */}
        <button
          data-inner="rgba(54, 51, 36, 0.65)"
          onClick={(e) =>
            handleColorChange("rgba(72, 69, 49, 0.85)", e.currentTarget.dataset.inner)
          }
        >
          <i className="fa-solid fa-droplet fa-xl" style={{ color: "rgba(72, 69, 49, 0.85)" }}></i>
        </button>
      </div>

    </div>
  </div>
)}





{/* popup to add a matchup book */}
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

      {/* Color Picker Input */}
     <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#f4f4f6',
  borderRadius: '10px',
  padding: '10px 15px',
  margin: '15px 0',
}}>
  <label style={{ color: '#333', fontWeight: '600', fontSize: '14px' }}>
    Pick Book Color:
  </label>
  <input
    type="color"
    value={newColor}
    onChange={(e) => setNewColor(e.target.value)}
    style={{
      width: '50px',
      height: '35px',
      border: 'none',
      cursor: 'pointer',
      background: 'none',
      outline: 'none',
    }}
  />
</div>



      <div className="modal-actions">
        <button onClick={addMatchupBook}>Add</button>
        <button onClick={() => setShowModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


      {/* delete confirmation popup */}
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

      {/* layout container */}
      <div className="main-layout">
        <Bookshelf
          books={currentBooks}
          onSelectBook={setSelectedBook}
          selectedBook={selectedBook}
        />

        {selectedBook && (
  <div className={`notes-panel ${showMobileNotes ? 'open' : ''}`} style={{ backgroundColor: noteModalColor }}>
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
      style={{ color: textColor, backgroundColor: richnotes
       }}
    ></div>
    <div className="export-button">
      <button onClick={exportToPDF} className='download-pdf'>Download PDF</button>
      <button onClick={() => setShowMobileNotes(!showMobileNotes)} style={{height: "auto"}}><i class="fa-solid fa-droplet fa-sm"></i></button>
      <button className="close-notes-btn" onClick={() => setShowMobileNotes(false)}>
      Close
    </button>
    </div>

    {/* Mobile-only close button */}
  


  
  </div>

  
)}

{selectedBook && (
  <button className="mobile-notes-toggle" onClick={() => setShowMobileNotes(true)}>
    Open Notes
  </button>
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
