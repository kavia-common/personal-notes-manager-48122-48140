import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  seedIfEmpty,
  getBackendBaseUrl
} from '../services/LocalStorageNotesService';

const NotesCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * NotesProvider supplies the app with notes state and CRUD operations.
 * Storage is localStorage-backed for now, but the design allows future HTTP swap.
 */
export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [alert, setAlert] = useState({ kind: 'info', message: '' });

  // seed and load notes on mount
  useEffect(() => {
    seedIfEmpty();
    setNotes(listNotes());
  }, []);

  // helper to refresh list from storage
  const refresh = () => {
    setNotes(listNotes());
  };

  const clearAlert = () => setAlert({ kind: 'info', message: '' });

  const actions = {
    select: (id) => setSelectedId(id),
    clearSelection: () => setSelectedId(null),
    create: (data) => {
      const note = createNote(data);
      setSelectedId(note.id);
      setAlert({ kind: 'success', message: 'Note created.' });
      refresh();
      return note;
    },
    update: (id, patch) => {
      const updated = updateNote(id, patch);
      if (updated) {
        setSelectedId(updated.id);
        setAlert({ kind: 'success', message: 'Note updated.' });
        refresh();
      } else {
        setAlert({ kind: 'error', message: 'Note not found.' });
      }
      return updated;
    },
    remove: (id) => {
      const ok = deleteNote(id);
      if (ok) {
        if (selectedId === id) setSelectedId(null);
        setAlert({ kind: 'success', message: 'Note deleted.' });
        refresh();
      } else {
        setAlert({ kind: 'error', message: 'Delete failed.' });
      }
      return ok;
    },
    search: (q) => setQuery(q),
    clearAlert,
  };

  const filtered = useMemo(() => {
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(n => (n.title || '').toLowerCase().includes(q));
  }, [notes, query]);

  const selected = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const value = {
    notes: filtered,
    allNotes: notes,
    selected,
    selectedId,
    query,
    alert,
    actions,
    backendBaseUrl: getBackendBaseUrl()
  };

  return <NotesCtx.Provider value={value}>{children}</NotesCtx.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useNotes provides access to the notes store and actions.
 */
export function useNotes() {
  const ctx = useContext(NotesCtx);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
