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
import selfimprove from './covers/self-improvement-icon-sm.png';    


const books = [
    { title: 'Self Improve', image: selfimprove },
  { title: 'Aki Notes', image: aki },
  { title: 'Akuma Notes', image: akuma },
  { title: 'Blanka Notes', image: blanka },
  { title: 'Cammy Notes', image: cammy },
  { title: 'Chun Li Notes', image: chunli },
  { title: 'Dee Jay Notes', image: deejay },
  { title: 'Dhalsim Notes', image: dhalsim },
  { title: 'E. Honda Notes', image: ehonda },
  { title: 'Ed Notes', image: ed },
  { title: 'Elena Notes', image: elena },
  { title: 'Guile Notes', image: guile },
  { title: 'Jamie Notes', image: jamie },
  { title: 'JP Notes', image: jp },
  { title: 'Juri Notes', image: juri },
  { title: 'Ken Notes', image: ken },
  { title: 'Kimberly Notes', image: kimberly },
  { title: 'Lily Notes', image: lily },
  { title: 'Luke Notes', image: luke },
  { title: 'M. Bison Notes', image: mbison },
  { title: 'Mai Notes', image: mai },
  { title: 'Manon Notes', image: manon },
  { title: 'Marisa Notes', image: marisa },
  { title: 'Rashid Notes', image: rashid },
  { title: 'Ryu Notes', image: ryu },
  { title: 'Terry Notes', image: terry },
  { title: 'Zangief Notes', image: zangief },

];

const colors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#22d3ee', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#eab308', '#db2777', '#0ea5e9', '#a855f7',
  '#d946ef', '#4ade80', '#fde047'
];

function getRandomRotation() {
  const angles = [-5, -3, -2, 0, 2, 3, 5, 0, 0, 0];
  return angles[Math.floor(Math.random() * angles.length)];
}

const ROW_SIZE = 7;

export default function Bookshelf({ onSelectBook }) {
  // Split into rows
  const rows = [];
  for (let i = 0; i < books.length; i += ROW_SIZE) {
    rows.push(books.slice(i, i + ROW_SIZE));
  }

  // Store stable random rotations using useMemo
  const rotations = useMemo(() => (
    books.map(() => getRandomRotation())
  ), []);

  return (
    <div className="bookshelf">
      {rows.map((row, rowIndex) => (
        <div className="shelf-row" key={rowIndex}>
          {row.map((book, index) => {
            const bookIndex = rowIndex * ROW_SIZE + index;
            const bgColor = colors[bookIndex % colors.length];
            const rotation = rotations[bookIndex];

            return (
              <div
                className="book"
                key={index}
                onClick={() => onSelectBook(book)}
                style={{
                  backgroundColor: bgColor,
                  '--rotate-angle': `${rotation}deg`
                }}
              >
                <img src={book.image} alt={book.title} />
                <p>{book.title}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
