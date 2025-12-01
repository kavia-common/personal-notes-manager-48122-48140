import React from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * NoteItem displays a single note with Edit and Delete actions.
 */
export default function NoteItem({ note }) {
  const { actions, selectedId } = useNotes();

  const handleDelete = () => {
    // confirm deletion
    const ok = window.confirm('Delete this note? This action cannot be undone.');
    if (!ok) return;
    actions.remove(note.id);
  };

  return (
    <article className="note" aria-label={`Note titled ${note.title || 'Untitled'}`}>
      <div>
        <h3 className="note-title">{note.title || 'Untitled'}</h3>
        <p className="note-body">{note.body || ''}</p>
        <div className="note-meta">
          <span aria-label="updated at">
            Updated: {new Date(note.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="note-actions">
        <button
          className="btn btn-secondary"
          onClick={() => actions.select(note.id)}
          aria-label={`Edit note ${note.title || ''}`}
          disabled={selectedId === note.id}
          title="Edit"
        >
          Edit
        </button>
        <button
          className="btn btn-outline"
          onClick={handleDelete}
          aria-label={`Delete note ${note.title || ''}`}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
