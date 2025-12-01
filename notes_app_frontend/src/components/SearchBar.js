import React from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * SearchBar filters notes by title (case-insensitive, in-memory).
 */
export default function SearchBar() {
  const { query, actions } = useNotes();
  return (
    <div style={{ minWidth: 220 }}>
      <label htmlFor="search" className="label">Search by title</label>
      <input
        id="search"
        type="search"
        className="input"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => actions.search(e.target.value)}
        aria-label="Search notes by title"
      />
    </div>
  );
}
