const STORAGE_KEY = 'notes_app_notes_v1';
const SEEDED_KEY = 'notes_app_seeded_v1';

function uuid() {
  // Simple UUID v4-ish generator suitable for client usage
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// PUBLIC_INTERFACE
export function getBackendBaseUrl() {
  /**
   * Returns the backend base URL if environment variables are set.
   * This is a future-proof helper allowing HTTP data provider later.
   */
  return process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
}

// PUBLIC_INTERFACE
export function listNotes() {
  /**
   * List all notes from storage, newest first.
   */
  const notes = readAll();
  return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// PUBLIC_INTERFACE
export function createNote({ title, body }) {
  /**
   * Create a new note and persist it.
   */
  const now = new Date().toISOString();
  const note = { id: uuid(), title, body, createdAt: now, updatedAt: now };
  const notes = readAll();
  notes.unshift(note);
  writeAll(notes);
  return note;
}

// PUBLIC_INTERFACE
export function updateNote(id, patch) {
  /**
   * Update an existing note by id with fields from patch.
   */
  const notes = readAll();
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated = { ...notes[idx], ...patch, updatedAt: now };
  notes[idx] = updated;
  writeAll(notes);
  return updated;
}

// PUBLIC_INTERFACE
export function deleteNote(id) {
  /**
   * Delete note by id.
   */
  const notes = readAll();
  const filtered = notes.filter(n => n.id !== id);
  writeAll(filtered);
  return notes.length !== filtered.length;
}

// PUBLIC_INTERFACE
export function getNote(id) {
  /**
   * Get a note by id.
   */
  return readAll().find(n => n.id === id) || null;
}

// PUBLIC_INTERFACE
export function seedIfEmpty() {
  /**
   * Seed a sample note on first load if storage is empty.
   */
  const seededFlag = localStorage.getItem(SEEDED_KEY);
  const current = readAll();
  if (!seededFlag && current.length === 0) {
    createNote({
      title: 'Welcome to Notes',
      body:
        'This is your personal notes app. Use the form to create a new note, select an existing note to edit, and use the search to filter by title.\n\nTips:\n- Title is required.\n- Click Edit to populate the form.\n- Delete asks for confirmation.'
    });
    localStorage.setItem(SEEDED_KEY, 'true');
  }
}
