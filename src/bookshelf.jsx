import React, { useMemo } from 'react';

// importing all the cover images for the default books
import aki from './covers/aki.png';
import akuma from './covers/akuma.png';
import blanka from './covers/blanka.png';
import cammy from './covers/cammy.png';
import chunli from './covers/chun li.png';
import deejay from './covers/dee jay.png';
import dhalsim from './covers/dhalsim.png';
import ehonda from './covers/e honda.png';
import ed from './covers/ed.png';
import elena from './covers/elena.png';
import guile from './covers/guile.png';
import jamie from './covers/jamie.png';
import jp from './covers/jp.png';
import juri from './covers/juri.png';
import ken from './covers/ken.png';
import kimberly from './covers/kimberly.png';
import lily from './covers/lily.png';
import luke from './covers/luke.png';
import mbison from './covers/m bison.png';
import mai from './covers/mai.png';
import manon from './covers/manon.png';
import marisa from './covers/marisa.png';
import rashid from './covers/rashid.png';
import ryu from './covers/ryu.png';
import terry from './covers/terry.png';
import zangief from './covers/zangief.png';
import improve from './covers/self-improvement-icon-sm.png';

// function to darken the book color a bit for contrast (used on book spine)
function darkenColor(rgbString, percent) {
  const [r, g, b] = rgbString.match(/\d+/g).map(Number); // split rgb string into numbers
  const factor = 1 - percent;

  const darkR = Math.max(0, Math.round(r * factor));
  const darkG = Math.max(0, Math.round(g * factor));
  const darkB = Math.max(0, Math.round(b * factor));

  return `rgb(${darkR}, ${darkG}, ${darkB})`;
}

// list of all default books with their images and colors
const defaultBooks = [
  { title: 'Self improve', image: improve, color: 'rgb(59, 130, 246)' },
  { title: 'Aki Notes', image: aki, color: 'rgb(59, 130, 246)' },
  { title: 'Akuma Notes', image: akuma, color: 'rgb(16, 185, 129)' },
  { title: 'Blanka Notes', image: blanka, color: 'rgb(245, 158, 11)' },
  { title: 'Cammy Notes', image: cammy, color: 'rgb(239, 68, 68)' },
  { title: 'Chun Li Notes', image: chunli, color: 'rgb(139, 92, 246)' },
  { title: 'Dee Jay Notes', image: deejay, color: 'rgb(236, 72, 153)' },
  { title: 'Dhalsim Notes', image: dhalsim, color: 'rgb(34, 211, 238)' },
  { title: 'E. Honda Notes', image: ehonda, color: 'rgb(249, 115, 22)' },
  { title: 'Ed Notes', image: ed, color: 'rgb(20, 184, 166)' },
  { title: 'Elena Notes', image: elena, color: 'rgb(99, 102, 241)' },
  { title: 'Guile Notes', image: guile, color: 'rgb(132, 204, 22)' },
  { title: 'Jamie Notes', image: jamie, color: 'rgb(234, 179, 8)' },
  { title: 'JP Notes', image: jp, color: 'rgb(219, 39, 119)' },
  { title: 'Juri Notes', image: juri, color: 'rgb(14, 165, 233)' },
  { title: 'Ken Notes', image: ken, color: 'rgb(168, 85, 247)' },
  { title: 'Kimberly Notes', image: kimberly, color: 'rgb(217, 70, 239)' },
  { title: 'Lily Notes', image: lily, color: 'rgb(74, 222, 128)' },
  { title: 'Luke Notes', image: luke, color: 'rgb(253, 224, 71)' },
  { title: 'M. Bison Notes', image: mbison, color: 'rgb(96, 165, 250)' },
  { title: 'Mai Notes', image: mai, color: 'rgb(244, 114, 182)' },
  { title: 'Manon Notes', image: manon, color: 'rgb(248, 113, 113)' },
  { title: 'Marisa Notes', image: marisa, color: 'rgb(250, 204, 21)' },
  { title: 'Rashid Notes', image: rashid, color: 'rgb(45, 212, 191)' },
  { title: 'Ryu Notes', image: ryu, color: 'rgb(59, 130, 246)' },
  { title: 'Terry Notes', image: terry, color: 'rgb(16, 185, 129)' },
  { title: 'Zangief Notes', image: zangief, color: 'rgb(245, 158, 11)' },
];

const ROW_SIZE = 8; // how many books per row

export default function Bookshelf({ books, onSelectBook, selectedBook }) {
  // if no custom books passed in, use the default character books
  books = books && books.length ? books : defaultBooks;



  // break the book list into rows (so layout is grid-like)
  const rows = [];
  for (let i = 0; i < books.length; i += ROW_SIZE) {
    rows.push(books.slice(i, i + ROW_SIZE));
  }

  // memoized array of random rotation values for each book so they look hand-placed
  const rotations = useMemo(() => (
    books.map(() => {
      const angles = [-5, -3, -2, 0, 2, 3, 5, 0, 0];
      return angles[Math.floor(Math.random() * angles.length)];
    })
  ), [books]);

  return (
    <div className="bookshelf" style={{ minHeight: '80vh', maxWidth: '800px', width: '100%' }}>
      {/* go through each row of books */}
      {rows.map((row, rowIndex) => (
        <div className="shelf-row" key={rowIndex}>
          {/* go through each book in the row */}
          {row.map((book, index) => {
            const bookIndex = rowIndex * ROW_SIZE + index;
            const color = book.color || 'rgb(136, 136, 136)'; // fallback color
            const rotation = rotations[bookIndex]; // get that random rotation
            const rotationClass = `rotate-${rotation.toString().replace('-', '--')}`; // convert to class name
            const isOpened = selectedBook?.title === book.title; // is this book open?

            return (
              <div
                id={`book-${book.title}`}
                className={`book ${rotationClass} ${isOpened ? 'opened' : ''}`}
                key={index}
                onClick={() => {
                  onSelectBook({ ...book, color }); // open this book
                  setTimeout(() => {
                    const el = document.getElementById(`book-${book.title}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); // scroll to it
                  }, 0);
                }}
                style={{ backgroundColor: color, '--bookColor': color }}
              >
                {/* book spine section */}
                <div
                  className="book-image"
                  style={{ backgroundColor: darkenColor(color, 0.15) }}
                >
                  {book.image && <img src={book.image} alt={book.title} />}
                </div>
                <p>{book.title}</p>

                {/* if this is a custom book (has a delete button), show ✕ */}
                {book.onDelete && (
                  <button
                    className="delete-book"
                    onClick={(e) => {
                      e.stopPropagation(); // don't open the book
                      book.onDelete(); // just trigger delete
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
