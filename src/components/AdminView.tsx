import React, { useState, useEffect } from 'react';
import { Question, SubjectName, AuditLog } from '../types/neetbuddy';
import {
  fetchAdminStats,
  fetchAuditLogs,
  createQuestion,
  deleteQuestionApi,
  parsePdfUpload,
  fetchSupabaseStatus,
  saveSupabaseConfigApi,
  seedSupabaseQuestionsApi,
  fetchSupabaseSchemaSql
} from '../lib/api';
import { WavyHero } from './WavyHero';

interface AdminViewProps {
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'importPdf' | 'mockTests' | 'auditLogs' | 'supabase'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Supabase State
  const [sbStatus, setSbStatus] = useState<any>(null);
  const [sbUrl, setSbUrl] = useState(localStorage.getItem('neetbuddy_supabase_url') || '');
  const [sbKey, setSbKey] = useState(localStorage.getItem('neetbuddy_supabase_key') || '');
  const [sbConnecting, setSbConnecting] = useState(false);
  const [sbSeeding, setSbSeeding] = useState(false);
  const [sbMessage, setSbMessage] = useState('');

  // Question Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState<SubjectName>('Physics');
  const [chapter, setChapter] = useState('Kinematics');
  const [topic, setTopic] = useState('Projectile Motion');
  const [statement, setStatement] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // PDF Import State
  const [pdfSubject, setPdfSubject] = useState<SubjectName>('Physics');
  const [pdfChapter, setPdfChapter] = useState('General Chapter');
  const [pdfText, setPdfText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState('');

  const loadData = async () => {
    try {
      const statsData = await fetchAdminStats();
      setStats(statsData);
      const logsData = await fetchAuditLogs();
      setAuditLogs(logsData.auditLogs || []);
      const sbData = await fetchSupabaseStatus();
      setSbStatus(sbData);
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement || !optA || !optB || !optC || !optD) {
      alert('Please fill out question statement and all 4 options.');
      return;
    }

    try {
      await createQuestion({
        subject,
        chapter,
        topic,
        statement,
        options: [optA, optB, optC, optD],
        correctOptionIndex: correctIdx,
        explanation,
        difficulty
      });
      setShowAddModal(false);
      setStatement('');
      setOptA(''); setOptB(''); setOptC(''); setOptD('');
      loadData();
      alert('Question created and published to Canonical Question Bank!');
    } catch (err: any) {
      alert(`Error creating question: ${err.message}`);
    }
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImportStatus('Processing and parsing PDF document...');

    try {
      const formData = new FormData();
      if (selectedFile) formData.append('file', selectedFile);
      formData.append('subject', pdfSubject);
      formData.append('chapter', pdfChapter);
      formData.append('rawText', pdfText);

      const res = await parsePdfUpload(formData);
      setImportStatus(`Success! Approved & published ${res.importedCount} questions. (${res.duplicateCount} duplicates skipped).`);
      loadData();
    } catch (err: any) {
      setImportStatus(`Error: ${err.message || 'Failed to ingest PDF'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbUrl || !sbKey) {
      alert('Please enter both Supabase URL and Key');
      return;
    }
    setSbConnecting(true);
    setSbMessage('Testing and connecting to Supabase...');
    try {
      const res = await saveSupabaseConfigApi(sbUrl, sbKey);
      localStorage.setItem('neetbuddy_supabase_url', sbUrl);
      localStorage.setItem('neetbuddy_supabase_key', sbKey);
      if (res.connected) {
        setSbMessage(`Successfully connected to Supabase (${res.latencyMs}ms)! 🚀`);
      } else {
        setSbMessage(`Saved! Note: ${res.error || 'Ready for tables'}`);
      }
      loadData();
    } catch (err: any) {
      setSbMessage(`Connection failed: ${err.message}`);
    } finally {
      setSbConnecting(false);
    }
  };

  const handleSeedQuestions = async () => {
    setSbSeeding(true);
    try {
      const res = await seedSupabaseQuestionsApi();
      alert(res.message || 'Successfully seeded questions into Supabase!');
      loadData();
    } catch (err: any) {
      alert(`Seeding error: ${err.message}`);
    } finally {
      setSbSeeding(false);
    }
  };

  const handleCopySchema = async () => {
    try {
      const res = await fetchSupabaseSchemaSql();
      if (res.sql) {
        await navigator.clipboard.writeText(res.sql);
        alert('Master Supabase SQL schema copied to clipboard! Paste into your Supabase SQL Editor.');
      }
    } catch (e: any) {
      alert('Failed to copy schema: ' + e?.message);
    }
  };

  return (
    <div className="space-y-6">
      <WavyHero
        title="Admin Content Management System"
        subtitle="Manage the 50,000+ Question Bank, PDF Ingestion Pipeline, Supabase Cloud, Mock Tests, and System Audit Logs."
      />

      {/* Admin Tabs */}
      <div className="tabs">
        {[
          { id: 'overview', label: '📊 Platform Overview' },
          { id: 'supabase', label: '⚡ Supabase Cloud' },
          { id: 'questions', label: '📖 Question Bank CMS' },
          { id: 'importPdf', label: '📄 PDF Automated Ingestion' },
          { id: 'auditLogs', label: '🛡️ Audit Logs' }
        ].map((t) => (
          <button
            key={t.id}
            className={`tb ${activeTab === t.id ? 'on' : ''}`}
            onClick={() => setActiveTab(t.id as any)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="hg">
            <div className="st s3 bg-emerald-50 dark:bg-emerald-950/40">
              <span className="ic bg-emerald-100 text-emerald-800">📖</span>
              <span>
                <small>Total Questions</small>
                <b>{stats?.totalQuestions || 50}</b>
              </span>
            </div>
            <div className="st s3 bg-blue-50 dark:bg-blue-950/40">
              <span className="ic bg-blue-100 text-blue-800">👥</span>
              <span>
                <small>Registered Users</small>
                <b>{stats?.totalUsers || 2}</b>
              </span>
            </div>
            <div className="st s3 bg-purple-50 dark:bg-purple-950/40">
              <span className="ic bg-purple-100 text-purple-800">📝</span>
              <span>
                <small>Test Attempts</small>
                <b>{stats?.totalTestAttempts || 0}</b>
              </span>
            </div>
            <div className="st s3 bg-amber-50 dark:bg-amber-950/40">
              <span className="ic bg-amber-100 text-amber-800">📄</span>
              <span>
                <small>PDF Batches</small>
                <b>{stats?.totalPdfBatches || 0}</b>
              </span>
            </div>
          </div>

          <div className="card">
            <h3 className="font-extrabold text-base mb-3">Questions by Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200">
                <small className="text-blue-700 font-bold block">Physics</small>
                <b className="text-2xl">{stats?.subjectCounts?.Physics || 10} Qs</b>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200">
                <small className="text-orange-700 font-bold block">Chemistry</small>
                <b className="text-2xl">{stats?.subjectCounts?.Chemistry || 10} Qs</b>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <small className="text-emerald-700 font-bold block">Botany</small>
                <b className="text-2xl">{stats?.subjectCounts?.Botany || 10} Qs</b>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200">
                <small className="text-purple-700 font-bold block">Zoology</small>
                <b className="text-2xl">{stats?.subjectCounts?.Zoology || 10} Qs</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Cloud Backend Tab */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-r from-emerald-50/50 via-teal-50/40 to-blue-50/40 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      sbStatus?.connected
                        ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                        : sbStatus?.configured
                        ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                        : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'
                    }`}
                  />
                  <h3 className="font-extrabold text-xl">Supabase Cloud Database</h3>
                  <span
                    className={`chip ${
                      sbStatus?.connected
                        ? 'c3'
                        : sbStatus?.configured
                        ? 'c4'
                        : 'c2'
                    }`}
                  >
                    {sbStatus?.connected
                      ? `Connected (${sbStatus?.latencyMs || 0}ms)`
                      : sbStatus?.configured
                      ? 'Connection Error'
                      : 'Local Cache Mode'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sbStatus?.connected
                    ? `Live connection established to ${sbStatus?.url || 'Supabase'}. All operations read/write directly to PostgreSQL.`
                    : sbStatus?.error || 'Running in local persistence mode. Enter your Supabase Project URL & Key below to activate cloud syncing.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn sm o" onClick={loadData}>
                  🔄 Ping &amp; Refresh
                </button>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn sm"
                >
                  Supabase Dashboard ↗
                </a>
              </div>
            </div>

            {/* Supabase Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold block">Questions</span>
                <b className="text-xl text-emerald-600">{sbStatus?.tableStats?.questions ?? '--'}</b>
                <span className="text-[10px] text-slate-400 block">in questions table</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold block">Profiles</span>
                <b className="text-xl text-blue-600">{sbStatus?.tableStats?.users ?? '--'}</b>
                <span className="text-[10px] text-slate-400 block">in profiles table</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold block">Test Attempts</span>
                <b className="text-xl text-purple-600">{sbStatus?.tableStats?.testAttempts ?? '--'}</b>
                <span className="text-[10px] text-slate-400 block">in test_attempts table</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-bold block">Audit Logs</span>
                <b className="text-xl text-orange-600">{sbStatus?.tableStats?.auditLogs ?? '--'}</b>
                <span className="text-[10px] text-slate-400 block">in audit_logs table</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Credentials Configuration Form */}
            <div className="card space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <span>🔑</span> Connect Supabase Project Credentials
              </h3>
              <p className="text-xs text-slate-500">
                Copy from your{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold underline"
                >
                  Supabase Project Settings &rarr; API
                </a>
                .
              </p>

              <form onSubmit={handleSaveSupabase} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Project URL</label>
                  <input
                    type="text"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">API Key (Anon or Service Role)</label>
                  <input
                    type="password"
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                  />
                </div>

                {sbMessage && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {sbMessage}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={sbConnecting} className="btn flex-1">
                    {sbConnecting ? 'Connecting...' : '💾 Save & Connect'}
                  </button>
                  <button type="button" onClick={loadData} className="btn o flex-1">
                    ⚡ Test Connection
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Database Actions & SQL Migration */}
            <div className="card space-y-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <span>🚀</span> Database Schema &amp; Seeding
              </h3>
              <p className="text-xs text-slate-500">
                Quick actions to bootstrap your Supabase database with the complete NEET master schema and canonical questions.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm block">Seed 50+ Canonical NEET Qs</b>
                    <small className="text-xs text-slate-500">Inserts initial question bank directly into Supabase</small>
                  </div>
                  <button
                    onClick={handleSeedQuestions}
                    disabled={sbSeeding}
                    className="btn sm"
                  >
                    {sbSeeding ? 'Seeding...' : '🌱 Seed Qs'}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm block">Copy Master SQL Schema</b>
                    <small className="text-xs text-slate-500">266-line schema with tables, RLS policies, indexes</small>
                  </div>
                  <button onClick={handleCopySchema} className="btn sm o">
                    📋 Copy SQL
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm block">PDF Automated Ingestion</b>
                    <small className="text-xs text-slate-500">Parse question papers directly into Supabase</small>
                  </div>
                  <button onClick={() => setActiveTab('importPdf')} className="btn sm o">
                    Open Ingestion &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg">Canonical Question Bank</h3>
            <button className="btn sm" onClick={() => setShowAddModal(true)}>
              + Add Question
            </button>
          </div>

          <div className="card p-4 space-y-2">
            <p className="text-xs text-slate-500">
              The canonical question bank scales up to 100,000+ questions across all NEET subjects with NCERT references and full explanation meta.
            </p>
          </div>
        </div>
      )}

      {/* PDF Automated Ingestion Tab */}
      {activeTab === 'importPdf' && (
        <div className="card max-w-2xl mx-auto space-y-4">
          <h3 className="font-extrabold text-lg">Automated PDF Question Import Pipeline</h3>
          <p className="text-xs text-slate-500">
            Upload an authorised educational PDF or paste question text. The server pipeline extracts statements, options A-D, answer keys, explanations, checks for duplicates, and auto-publishes to the question bank.
          </p>

          <form onSubmit={handlePdfUpload} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Target Subject</label>
                <select
                  value={pdfSubject}
                  onChange={(e) => setPdfSubject(e.target.value as SubjectName)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                >
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Botany</option>
                  <option>Zoology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Target Chapter</label>
                <input
                  type="text"
                  value={pdfChapter}
                  onChange={(e) => setPdfChapter(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Upload PDF File</label>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Or Paste Raw Question Text</label>
              <textarea
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
                placeholder={`Q1. What is the SI unit of force?
(A) Joule
(B) Newton
(C) Pascal
(D) Watt
Answer: B
Explanation: Newton is the SI unit of force.`}
                rows={6}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono border-0 outline-none"
              />
            </div>

            {importStatus && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                {importStatus}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn w-full h-12">
              {loading ? 'Processing Document…' : 'Run Ingestion Pipeline →'}
            </button>
          </form>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'auditLogs' && (
        <div className="card space-y-3">
          <h3 className="font-extrabold text-base mb-2">System Audit Logs</h3>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                <div>
                  <b className="text-emerald-600 dark:text-emerald-400">{log.action}</b>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{log.details}</p>
                </div>
                <small className="text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="md" onClick={() => setShowAddModal(false)}>
          <div className="mdc max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-xl mb-4">Add Question to Canonical Bank</h2>
            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectName)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                  >
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Botany</option>
                    <option>Zoology</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Chapter</label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold">Question Statement</label>
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A" className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none" />
                <input value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B" className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none" />
                <input value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C" className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none" />
                <input value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D" className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Correct Option</label>
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold">Explanation</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn flex-1">
                  Save &amp; Publish
                </button>
                <button type="button" className="btn o flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
