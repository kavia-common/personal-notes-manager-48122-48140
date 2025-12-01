import React from 'react';
import './App.css';
import './index.css';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import NotesForm from './components/NotesForm';
import NotesList from './components/NotesList';
import SearchBar from './components/SearchBar';

/**
 * PUBLIC_INTERFACE
 * App is the root component that composes the Notes UI with a provider-backed storage layer.
 * - Layout: header, form card, list card side-by-side on wide screens and stacked on small.
 * - Styling: Ocean Professional theme via CSS variables in App.css.
 */
function App() {
  return (
    <NotesProvider>
      <div className="ocean-app">
        <Header />
        <main className="container">
          <section className="cards">
            <div className="card">
              <h2 className="card-title">Create or Edit Note</h2>
              <NotesForm />
            </div>
            <div className="card">
              <div className="list-header">
                <h2 className="card-title">Your Notes</h2>
                <SearchBar />
              </div>
              <NotesList />
            </div>
          </section>
        </main>
        <footer className="footer">
          <span className="footer-text">Notes app • Ocean Professional theme</span>
        </footer>
      </div>
    </NotesProvider>
  );
}

export default App;
