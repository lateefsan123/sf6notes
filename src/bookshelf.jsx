import React, { useMemo } from 'react';
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

const defaultBooks = [
    { title: 'Self improve', image: improve, color: '#3b82f6' },
  { title: 'Aki Notes', image: aki, color: '#3b82f6' },
  { title: 'Akuma Notes', image: akuma, color: '#10b981' },
  { title: 'Blanka Notes', image: blanka, color: '#f59e0b' },
  { title: 'Cammy Notes', image: cammy, color: '#ef4444' },
  { title: 'Chun Li Notes', image: chunli, color: '#8b5cf6' },
  { title: 'Dee Jay Notes', image: deejay, color: '#ec4899' },
  { title: 'Dhalsim Notes', image: dhalsim, color: '#22d3ee' },
  { title: 'E. Honda Notes', image: ehonda, color: '#f97316' },
  { title: 'Ed Notes', image: ed, color: '#14b8a6' },
  { title: 'Elena Notes', image: elena, color: '#6366f1' },
  { title: 'Guile Notes', image: guile, color: '#84cc16' },
  { title: 'Jamie Notes', image: jamie, color: '#eab308' },
  { title: 'JP Notes', image: jp, color: '#db2777' },
  { title: 'Juri Notes', image: juri, color: '#0ea5e9' },
  { title: 'Ken Notes', image: ken, color: '#a855f7' },
  { title: 'Kimberly Notes', image: kimberly, color: '#d946ef' },
  { title: 'Lily Notes', image: lily, color: '#4ade80' },
  { title: 'Luke Notes', image: luke, color: '#fde047' },
  { title: 'M. Bison Notes', image: mbison, color: '#60a5fa' },
  { title: 'Mai Notes', image: mai, color: '#f472b6' },
  { title: 'Manon Notes', image: manon, color: '#f87171' },
  { title: 'Marisa Notes', image: marisa, color: '#facc15' },
  { title: 'Rashid Notes', image: rashid, color: '#2dd4bf' },
  { title: 'Ryu Notes', image: ryu, color: '#3b82f6' },
  { title: 'Terry Notes', image: terry, color: '#10b981' },
  { title: 'Zangief Notes', image: zangief, color: '#f59e0b' },
];

function darkenColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) - 255 * percent;
  let g = ((num >> 8) & 0x00FF) - 255 * percent;
  let b = (num & 0x0000FF) - 255 * percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${r}, ${g}, ${b})`;
}

const ROW_SIZE = 8;

export default function Bookshelf({ books, onSelectBook }) {
  books = books && books.length ? books : defaultBooks;

  const rows = [];
  for (let i = 0; i < books.length; i += ROW_SIZE) {
    rows.push(books.slice(i, i + ROW_SIZE));
  }

  const rotations = useMemo(() => (
    books.map(() => {
      const angles = [-5, -3, -2, 0, 2, 3, 5, 0, 0];
      return angles[Math.floor(Math.random() * angles.length)];
    })
  ), [books]);

  return (
    <div className="bookshelf" style={{ minHeight: '80vh', maxWidth: '800px', width: '100%' }}>
      {rows.map((row, rowIndex) => (
        <div className="shelf-row" key={rowIndex}>
          {row.map((book, index) => {
            const bookIndex = rowIndex * ROW_SIZE + index;
            const color = book.color || '#888';
            const rotation = rotations[bookIndex];
            const rotationClass = `rotate-${rotation.toString().replace('-', '--')}`;

            return (
              <div
                className={`book ${rotationClass}`}
                key={index}
                onClick={() => onSelectBook({ ...book, color })}
                style={{ backgroundColor: color }}
              >
                <div
                  className="book-image"
                  style={{ backgroundColor: darkenColor(color, 0.15) }}
                >
                  {book.image && (
                    <img src={book.image} alt={book.title} />
                  )}
                </div>
                <p>{book.title}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
