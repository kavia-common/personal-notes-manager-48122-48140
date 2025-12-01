import React, { useEffect, useRef, useState } from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * NotesForm provides create and edit functionality with basic validation.
 */
export default function NotesForm() {
  const { selected, selectedId, actions, alert } = useNotes();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    // Populate form when a note is selected; clear when deselected
    if (selected) {
      setTitle(selected.title || '');
      setBody(selected.body || '');
      setError('');
    } else {
      setTitle('');
      setBody('');
      setError('');
    }
  }, [selectedId, selected]);

  useEffect(() => {
    // focus the title when selection changes for quick editing
    if (titleRef.current) titleRef.current.focus();
  }, [selectedId]);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (selectedId) {
      actions.update(selectedId, { title: title.trim(), body });
    } else {
      actions.create({ title: title.trim(), body });
    }
  };

  const onCancel = () => {
    actions.clearSelection();
    resetForm();
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div>
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title"
            ref={titleRef}
            className="input"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'title-error' : undefined}
            required
          />
          {error && (
            <div id="title-error" className="inline-alert error" role="alert">
              {error}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="body" className="label">Body</label>
          <textarea
            id="body"
            className="textarea"
            placeholder="Write your note..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
          />
          <div className="helper">Markdown not supported. Plain text only.</div>
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" aria-label={selectedId ? 'Save changes' : 'Create note'}>
          {selectedId ? 'Save Changes' : 'Create Note'}
        </button>
        {selectedId && (
          <button type="button" className="btn btn-outline" onClick={onCancel} aria-label="Cancel editing">
            Cancel
          </button>
        )}
      </div>

      {!!alert.message && (
        <div className={`inline-alert ${alert.kind === 'error' ? 'error' : alert.kind === 'success' ? 'success' : ''}`} role="status" aria-live="polite">
          {alert.message}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: 8, padding: '6px 10px' }}
            onClick={() => actions.clearAlert()}
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        </div>
      )}
    </form>
  );
}
