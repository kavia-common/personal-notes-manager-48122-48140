import React from 'react';
import { useNotes } from '../context/NotesContext';

/**
 * PUBLIC_INTERFACE
 * Header renders the top navigation/brand and environment hint.
 */
export default function Header() {
  const { backendBaseUrl } = useNotes();
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Notes brand">
          <div className="brand-logo" aria-hidden="true" />
          <div className="brand-title">Notes</div>
        </div>
        <div className="header-actions">
          {backendBaseUrl ? (
            <span className="helper" title={backendBaseUrl}>
              Connected: API
            </span>
          ) : (
            <span className="helper" title="Using browser storage">
              Storage: Local
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
