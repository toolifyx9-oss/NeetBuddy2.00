import React, { useState } from 'react';
import { StudyTask, SubjectName } from '../types/neetbuddy';
import { WavyHero } from './WavyHero';

interface StudyPlanViewProps {
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: StudyTask) => void;
  onDeleteTask: (id: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) => {
  const [selectedDay, setSelectedDay] = useState<number>((new Date().getDay() + 6) % 7);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectName>('Physics');
  const [newMinutes, setNewMinutes] = useState(45);
  const [examDate, setExamDate] = useState('2027-05-03');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: 'task-' + Date.now(),
      dayOfWeek: selectedDay,
      title: newTitle.trim(),
      subject: newSubject,
      estimatedMinutes: Number(newMinutes) || 45,
      isCompleted: false
    });

    setNewTitle('');
  };

  const daysLeft = Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const dayTasks = tasks.filter((t) => t.dayOfWeek === selectedDay);
  const completedCount = dayTasks.filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-6">
      <WavyHero
        title="Study Plan & Routine"
        subtitle="Organize your weekly NEET preparation schedule and countdown to exam day."
        quote="A goal without a plan is just a wish."
      />

      <div className="grid md:grid-cols-12 gap-4">
        {/* Weekly Task Board */}
        <div className="card md:col-span-8 space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => {
              const count = tasks.filter((t) => t.dayOfWeek === idx).length;
              return (
                <button
                  key={idx}
                  className={`py-2 rounded-xl text-center border font-bold text-xs transition ${
                    selectedDay === idx
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                  onClick={() => setSelectedDay(idx)}
                >
                  <div>{day}</div>
                  <small className="opacity-80 text-[10px] block">{count} tasks</small>
                </button>
              );
            })}
          </div>

          <h3 className="font-extrabold text-base pt-2 border-t border-slate-200 dark:border-slate-800">
            {daysOfWeek[selectedDay]}'s Tasks ({completedCount} / {dayTasks.length} Done)
          </h3>

          <div className="space-y-2">
            {dayTasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition ${
                  t.isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <button
                  onClick={() => onToggleTask(t.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border ${
                    t.isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {t.isCompleted && '✓'}
                </button>
                <span className={`flex-1 text-xs font-semibold ${t.isCompleted ? 'line-through text-slate-400' : ''}`}>
                  {t.title} <small className="text-slate-500 font-normal">({t.estimatedMinutes} mins)</small>
                </span>
                <span className="chip c1">{t.subject}</span>
                <button
                  onClick={() => onDeleteTask(t.id)}
                  className="text-slate-400 hover:text-red-500 text-sm p-1"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </div>
            ))}

            {dayTasks.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">No tasks added for this day yet.</p>
            )}
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleCreateTask} className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a study task (e.g. Kinematics 20 Numericals)…"
              className="flex-1 min-w-[200px] h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-0 outline-none"
            />
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as SubjectName)}
              className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-0 outline-none font-bold"
            >
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Botany</option>
              <option>Zoology</option>
            </select>
            <input
              type="number"
              value={newMinutes}
              onChange={(e) => setNewMinutes(Number(e.target.value))}
              placeholder="Mins"
              className="w-16 h-10 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-0 outline-none text-center font-bold"
            />
            <button type="submit" className="btn sm">
              + Add
            </button>
          </form>
        </div>

        {/* Exam Countdown Card */}
        <div className="card md:col-span-4 flex flex-col justify-between items-center text-center p-6 space-y-4">
          <div>
            <span className="chip c5 mb-2">NEET UG 2027</span>
            <h3 className="font-extrabold text-lg">Exam Countdown</h3>
            <p className="text-xs text-slate-500 mt-1">Keep going, every single day counts towards your rank!</p>
          </div>

          <div className="ring w-32 h-32 my-2" style={{ background: 'conic-gradient(var(--g2) 240deg, var(--ln) 0)' }}>
            <span>
              <div>
                <b className="text-2xl text-emerald-600 dark:text-emerald-400">{daysLeft}</b>
                <small className="text-[10px] uppercase font-bold text-slate-500">Days Left</small>
              </div>
            </span>
          </div>

          <div className="w-full text-left">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border-0 outline-none font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
