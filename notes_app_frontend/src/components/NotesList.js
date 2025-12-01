import React from 'react';
import { useNotes } from '../context/NotesContext';
import NoteItem from './NoteItem';

/**
 * PUBLIC_INTERFACE
 * NotesList renders a list of notes with an empty-state if none.
 */
export default function NotesList() {
  const { notes } = useNotes();

  if (!notes || notes.length === 0) {
    return (
      <div className="empty" role="status" aria-live="polite">
        No notes yet. Create your first note using the form.
      </div>
    );
  }

  return (
    <div className="list" role="list">
      {notes.map(n => (
        <div role="listitem" key={n.id}>
          <NoteItem note={n} />
        </div>
      ))}
    </div>
  );
}
