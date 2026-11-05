import React, { useState } from 'react';
import { UserNote, SubjectName } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface NotesViewProps {
  notes: UserNote[];
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ notes, onSaveNote, onDeleteNote }) => {
  const [activeTab, setActiveTab] = useState<'All' | SubjectName>('All');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);

  const filteredNotes = notes.filter((n) => {
    const matchesSubject = activeTab === 'All' || n.subject === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.contentHtml.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCreateNew = () => {
    setEditingNote({
      id: 'note-' + Date.now(),
      userId: 'usr-student-1',
      title: 'New Study Note',
      subject: 'Physics',
      chapter: 'General Physics',
      contentHtml: '<p>Write your key formulas, diagrams, and NCERT revision points here…</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  if (editingNote) {
    return (
      <div className="card max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-extrabold">{editingNote.id.startsWith('note-') ? 'Edit Note' : 'New Note'}</h2>

        <div>
          <label className="block text-xs font-bold mb-1">Title</label>
          <input
            type="text"
            value={editingNote.title}
            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
            className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border-0 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1">Subject</label>
            <select
              value={editingNote.subject}
              onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value as SubjectName })}
              className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none text-sm"
            >
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Botany</option>
              <option>Zoology</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Chapter / Tag</label>
            <input
              type="text"
              value={editingNote.chapter}
              onChange={(e) => setEditingNote({ ...editingNote, chapter: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Content</label>
          <textarea
            value={editingNote.contentHtml}
            onChange={(e) => setEditingNote({ ...editingNote, contentHtml: e.target.value })}
            rows={8}
            className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-sans border-0 outline-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            className="btn"
            onClick={() => {
              onSaveNote(editingNote);
              setEditingNote(null);
            }}
          >
            Save Note
          </button>
          <button className="btn o" onClick={() => setEditingNote(null)}>
            Cancel
          </button>
          <button
            className="btn o ml-auto text-red-600"
            onClick={() => {
              onDeleteNote(editingNote.id);
              setEditingNote(null);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WavyHero
        title="Notes & Bookmarks"
        subtitle="Organize NCERT formulas, revision points, and saved questions."
        quote="Short notes today, long-term memory tomorrow."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="tabs mb-0">
          {(['All', 'Physics', 'Chemistry', 'Botany', 'Zoology'] as const).map((s) => (
            <button
              key={s}
              className={`tb ${activeTab === s ? 'on' : ''}`}
              onClick={() => setActiveTab(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <button className="btn sm" onClick={handleCreateNew}>
          + New Note
        </button>
      </div>

      <div className="w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search notes by title or content…"
          className="w-full h-12 px-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none shadow-sm text-sm"
        />
      </div>

      <div className="space-y-3">
        {filteredNotes.map((n) => (
          <div
            key={n.id}
            className="row cursor-pointer flex justify-between items-center"
            onClick={() => setEditingNote(n)}
          >
            <div className="flex items-center gap-3">
              <span className="n">📄</span>
              <div>
                <b className="text-base">{n.title}</b>
                <small className="block text-slate-500">{n.subject} • {n.chapter}</small>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">Edit ›</span>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="card text-center p-8 text-slate-500">
            No notes found. Click "+ New Note" to create one.
          </div>
        )}
      </div>
    </div>
  );
};
