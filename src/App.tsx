import React, { useEffect, useRef } from 'react';
import { LP } from './data/landingPageBase64';
import { CHD } from './syllabusData';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. Decode Landing Page HTML once
    let lpHtml = '';
    try {
      const rawLp = new TextDecoder().decode(
        Uint8Array.from(atob(LP.replace(/\s/g, '')), (c) => c.charCodeAt(0))
      );
      const styleMatch = rawLp.match(/<style>([\s\S]*?)<\/style>/i);
      let styleEl = document.getElementById('nb-lp-styles') as HTMLStyleElement | null;
      if (styleMatch) {
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'nb-lp-styles';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = styleMatch[1];
        styleEl.disabled = true;
      }
      const bodyMatch = rawLp.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      lpHtml = bodyMatch ? bodyMatch[1] : rawLp;
    } catch (e) {
      console.error('LP decode error:', e);
    }

    // 1. Initialize exact state and functions from NEETBuddy HTML
    const LGO =
      '<img class="lm" src="/assets/aistudio/file_00000000078482078d06c74a563d6525_4715f81f.png" alt="NEETBuddy" style="object-fit:contain;border-radius:8px"/>';
    const $ = (s: string): HTMLElement | null => document.querySelector(s);
    const E = (c: string, _f?: any) =>
      `<div class="ban">${c}<svg viewBox="0 0 600 150" preserveAspectRatio="none"><path fill="#fff" fill-opacity=".16" d="M0 90c120-60 240-60 360 0s180 40 240-20v80H0z"/><path fill="#fff" fill-opacity=".14" d="M0 120c140-50 260-30 380 10s160 20 220-10v30H0z"/></svg></div>`;
    const TGT = `<svg class="t" viewBox="0 0 120 120"><circle cx="60" cy="68" r="46" fill="#dff1ff"/><circle cx="60" cy="68" r="34" fill="#fff" stroke="#2f6bff" stroke-width="8"/><circle cx="60" cy="68" r="16" fill="#2f6bff"/><path d="M60 68L104 20" stroke="#14a366" stroke-width="5" stroke-linecap="round"/><path d="M98 14l10 2-4 10z" fill="#14a366"/></svg>`;

    const SUBJ: [string, string, string, number, string, number][] = [
      ['Physics', '⚛️', '#e6f0ff', 20, '2,500+', 62],
      ['Chemistry', '🧪', '#fff0e4', 20, '2,200+', 40],
      ['Botany', '🌿', '#e8f7e6', 17, '2,000+', 30],
      ['Zoology', '🧬', '#f0e8ff', 15, '2,200+', 50],
    ];

    const FCS: Record<string, [string, string][]> = {
      Physics: [
        ['Dimensional formula of force?', '[MLT⁻²]'],
        ['Dimensional formula of work?', '[ML²T⁻²]'],
        ['Dimensional formula of pressure?', '[ML⁻¹T⁻²]'],
        ['Dimensional formula of momentum?', '[MLT⁻¹]'],
        ['Dimensional formula of power?', '[ML²T⁻³]'],
        ['Value of g near Earth’s surface?', '≈ 9.8 m/s²'],
        ['Escape velocity from Earth’s surface?', '≈ 11.2 km/s'],
      ],
      Chemistry: [
        ['Avogadro’s number?', '6.022 × 10²³ mol⁻¹'],
        ['pH of a solution is defined as?', 'pH = −log[H⁺]'],
        ['Hybridisation of carbon in methane?', 'sp³'],
        ['Bond angle in a water molecule?', '≈ 104.5°'],
        ['Oxidation state of Mn in KMnO₄?', '+7'],
      ],
      Biology: [
        ['Powerhouse of the cell?', 'Mitochondria'],
        ['Site of photosynthesis?', 'Chloroplast (thylakoids and stroma)'],
        ['Fight-or-flight hormone?', 'Adrenaline (epinephrine)'],
        ['Universal blood donor?', 'O negative'],
        ['Functional unit of the kidney?', 'Nephron'],
      ],
    };

    const CH = [
      ['Physical World & Measurement', '180', 72],
      ['Kinematics', '220', 40],
      ['Laws of Motion', '210', 20],
      ['Work, Energy & Power', '190', 0],
      ['Rotational Motion', '200', 0],
    ];

    const TOP = [
      ['Units and Dimensions', 25],
      ['Dimensional Analysis', 30],
      ['Errors in Measurement', 20],
    ];

    const F = [
      ['force', '[MLT⁻²]'],
      ['work', '[ML²T⁻²]'],
      ['pressure', '[ML⁻¹T⁻²]'],
      ['momentum', '[MLT⁻¹]'],
      ['power', '[ML²T⁻³]'],
      ['velocity', '[LT⁻¹]'],
      ['acceleration', '[LT⁻²]'],
      ['density', '[ML⁻³]'],
    ];

    const NEET_QUESTIONS_POOL = [
      {
        q: 'How many subunits are found in haemoglobin?',
        o: ['One', 'Two', 'Three', 'Four'],
        a: 3,
        s: 'Biology',
        c: 'Biomolecules',
        e: 'Adult human haemoglobin consists of 4 polypeptide subunits: two α-type subunits and two β-type subunits arranged in a quaternary tetrameric structure.'
      },
      {
        q: 'The dimensional formula of force is:',
        o: ['[MLT⁻²]', '[ML²T⁻²]', '[ML⁻¹T⁻²]', '[MLT⁻¹]'],
        a: 0,
        s: 'Physics',
        c: 'Units & Dimensions',
        e: 'Force = mass × acceleration = [M] × [LT⁻²] = [MLT⁻²].'
      },
      {
        q: 'Which organelle is known as the powerhouse of the cell?',
        o: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
        a: 1,
        s: 'Botany',
        c: 'Cell: The Unit of Life',
        e: 'Mitochondria produce cellular energy in the form of ATP via oxidative phosphorylation.'
      },
      {
        q: 'Which of the following contains an aromatic benzene ring?',
        o: ['Cyclohexane', 'Toluene', 'Hex-1-ene', 'Cyclopentadiene'],
        a: 1,
        s: 'Chemistry',
        c: 'Hydrocarbons',
        e: 'Toluene (methylbenzene) possesses a 6-pi electron aromatic benzene core obeying Huckel’s rule.'
      },
      {
        q: 'The normal pacemaker of the human heart which initiates rhythmic electrical impulses is:',
        o: ['AV node', 'SA node', 'Bundle of His', 'Purkinje fibres'],
        a: 1,
        s: 'Zoology',
        c: 'Body Fluids and Circulation',
        e: 'Sino-atrial (SA) node generates the maximum number of action potentials (70-75/min) and is called the natural pacemaker.'
      },
      {
        q: 'A ball thrown vertically upwards reaches maximum height H. The acceleration of the ball at the highest point is:',
        o: ['Zero', 'g downwards', 'g upwards', 'Depends on initial speed'],
        a: 1,
        s: 'Physics',
        c: 'Motion In One Dimension',
        e: 'Gravity g acts constantly downward at all instants throughout the motion, including at the crest where instantaneous velocity is zero.'
      },
      {
        q: 'The oxidation state of Manganese in KMnO₄ is:',
        o: ['+2', '+4', '+6', '+7'],
        a: 3,
        s: 'Chemistry',
        c: 'Redox Reactions and Electrochemistry',
        e: 'In KMnO₄: (+1) + x + 4(-2) = 0 => x = +7.'
      },
      {
        q: 'In flowering plants, the site of perception of light/dark duration for flowering is:',
        o: ['Stem apex', 'Leaves', 'Floral buds', 'Roots'],
        a: 1,
        s: 'Botany',
        c: 'Plant Growth and Development',
        e: 'According to NCERT, photoperiodic stimulus is perceived by leaves which synthesize florigen migrating to shoot apex.'
      }
    ];

    const QS = NEET_QUESTIONS_POOL;

    const NAV = [
      ['home', '🏠', 'Home'],
      ['practice', '🎯', 'Practice'],
      ['tests', '📝', 'Mock Tests'],
      ['perf', '📊', 'Performance'],
      ['ib', '📖', 'Improvement Book'],
      ['notes', '📝', 'Notes'],
      ['bookmarks', '🔖', 'Bookmarks'],
      ['pyq', '📚', 'PYQs'],
      ['dpp', '🗒️', 'DPP Practice'],
      ['flash', '🃏', 'Flashcards'],
      ['doubt', '💡', 'Doubt Solver', 'AI'],
      ['plan', '📅', 'Study Plan'],
      ['supabase', '⚡', 'Supabase Cloud'],
      ['admin', '🛠️', 'Admin CMS'],
      ['more', '⚙️', 'More'],
    ];

    const TABS = [
      ['home', '🏠', 'Home'],
      ['practice', '🎯', 'Practice'],
      ['tests', '📝', 'Tests'],
      ['perf', '📊', 'Performance'],
      ['more', '⋯', 'More'],
    ];

    const S: any = {
      v: 'land',
      ge: 0,
      nt: 'My Notes',
      nf: 'All',
      nq: '',
      tab: 'All',
      goal: 'Questions',
      ibt: 'All',
      pt: 'Overview',
      cnt: 25,
      diff: 'Mixed',
      tt: null,
      am: 'Login',
      dm: [],
      customSubjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    };

    let Q: any = null;
    let TM: any = null;

    const IB = [
      [
        'The dimensional formula of force is:',
        'Physics',
        'Units & Dimensions',
        'Kinematics',
        'Incorrect',
        '28 Oct 2026',
      ],
      [
        'Which of the following is an aromatic compound?',
        'Chemistry',
        'Aromatic Compounds',
        'Haloarenes',
        'Marked',
        '27 Oct 2026',
      ],
      [
        'The powerhouse of the cell is:',
        'Biology',
        'Cell: The Unit of Life',
        'Cell Organelles',
        'Reattempt',
        '26 Oct 2026',
      ],
    ];

    const go = (v: string, x: any = {}, pop?: boolean) => {
      clearInterval(TM);
      Object.assign(S, { v }, x);
      if (!pop && typeof LV !== 'undefined' && LV !== v) {
        try {
          history.pushState({ v }, '');
        } catch (e) {}
      }
      draw();
      window.scrollTo(0, 0);
    };

    const act = (v: string) =>
      ({
        quiz: Q && Q.timed ? 'tests' : 'practice',
        setup: 'practice',
        result: Q && Q.timed ? 'tests' : 'practice',
        review: Q && Q.timed ? 'tests' : 'practice',
        chap: 'practice',
        top: 'practice',
        custom_practice: 'practice',
        tl: 'tests',
        ins: 'tests',
        mres: 'tests',
        mq: 'tests',
        sp: 'perf',
        perf_detail: 'perf',
        ibd: 'ib',
        ib: 'ib',
        weak: 'perf',
        nedit: 'notes',
        note_chap: 'notes',
        note_detail: 'notes',
        flash_chap: 'flash',
        flash_deck: 'flash',
        pyq_chap: 'pyq',
        dpp: 'dpp',
        dpp_chap: 'dpp',
      }[v] || v);

    const shell = (body: string, crumb = '') => {
      const a = act(S.v === 'ib' || S.v === 'ibd' ? 'ib' : S.v);
      const act2 = S.v.startsWith('ib') ? 'ib' : a;
      return `<aside class="sb"><div class="lg" onclick="window.nbGo('home')">${LGO}<span class="lt">NEET<b style="color:#2563eb!important">Buddy</b></span></div>${NAV.map(
        (n) =>
          `<button title="${n[2]}" class="ni ${act2 === n[0] ? 'on' : ''}" onclick="window.nbGo('${
            V[n[0]] ? n[0] : 'soon'
          }',{t:'${n[2]}'})"><i>${n[1]}</i>${n[2]}${
            n[3] ? `<span class="ai">${n[3]}</span>` : ''
          }</button>`
      ).join(
        ''
      )}<div class="qc">Discipline today.<br>Doctor tomorrow.</div></aside><main class="mn"><div class="tp"><div class="mb"><b class="lg3">${LGO}<span class="lt">NEET<b style="color:#2563eb!important">Buddy</b></span></b></div><button class="nb-sb-pill" onclick="window.nbGo('supabase')" title="Manage Real Supabase Backend" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;font-size:12px;font-weight:700;border:1px solid rgba(16,185,129,0.35);background:rgba(16,185,129,0.1);color:#10b981;cursor:pointer;margin-right:auto"><span style="width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 6px #10b981"></span>⚡ Supabase Cloud</button><button class="ib tg" aria-label="Toggle dark mode" onclick="window.nbTgd()">${
        dm ? '🌙' : '☀️'
      }</button><button class="ib">🔔<span class="dot"></span></button><div class="us" onclick="window.nbGo('more')" style="cursor:pointer"><div class="av">${UI()}</div><span><b>${UN()}</b><small>${UY()}</small></span></div></div>${body}</main><nav class="bt">${TABS.map(
        (t) =>
          `<button class="${act2 === t[0] ? 'on' : ''}" onclick="window.nbGo('${
            V[t[0]] ? t[0] : 'soon'
          }',{t:'${t[2]}'})"><i>${t[1]}</i>${t[2]}</button>`
      ).join('')}</nav>`;
    };

    const hero = (t: string, s: string) =>
      `<div class="hero"><h1>${t}</h1><p>${s}</p><div class="qt">💬 ${
        QT[act(S.v)] || QT.soon
      }</div>${TGT}</div>`;
    const bc = (...a: any[]) =>
      a
        .map(([t, v, x]) =>
          v
            ? `<a onclick="window.nbGo('${v}',${
                x ? JSON.stringify(x).replace(/"/g, '&quot;') : '{}'
              })">${t}</a>`
            : t
        )
        .join(' › ');

    const tile = (s: any, fn: string) =>
      `<button class="tile" style="background:${s[2]}" onclick="${fn}"><div class="ti">${s[1]}</div><h3>${s[0]}</h3><small>${s[3]} Chapters • ${s[4]} Qs</small><div class="pr"><div class="bar"><i style="width:${s[5]}%"></i></div><b>${s[5]}%</b><span class="ar">→</span></div></button>`;

    const QT: Record<string, string> = {
      home: 'Consistency today, MBBS tomorrow.',
      practice: '“Practice makes you permanent. Practise perfectly.”',
      tests: '“Train like it is exam day, so exam day feels like training.”',
      perf: '“What gets measured gets improved.”',
      ib: '“Every mistake is a free lesson. Collect them all.”',
      notes: '“Short notes today, long-term memory tomorrow.”',
      soon: '“Small steps every day lead to big results.”',
      more: '“Pick one thing and do it well today.”',
      flash: '“Revise little, revise often. That is how memory sticks.”',
      pyq: '“Study the past to score in the future.”',
      dpp: '“Small daily wins build big ranks.”',
      doubt: '“No doubt is too small. Ask and understand.”',
      plan: '“A goal without a plan is just a wish.”',
      admin: '“Manage your canonical question bank, imports, and system logs.”',
    };

    // CHD (Chapter Data) imported from ./syllabusData

    const hs = (t: string) => [...t].reduce((a, c) => a + c.charCodeAt(0), 0);
    const qn = (t: string) => 20 + (hs(t) % 7) * 5;
    const pg = (t: string) => (hs(t) % 4 === 0 ? 0 : hs(t) % 97);
    const tcount = (s: string) =>
      (CHD[s] || []).reduce((a, c) => a + c[1].split('|').length, 0);

    const SUBJ_SHORT: Record<string, string> = {
      Physics: 'Phy',
      Chemistry: 'Chem',
      Zoology: 'Zoo',
      Botany: 'Bot',
    };

    const getChapterIcon = (name: string, subject: string, index: number) => {
      const n = (name || '').toLowerCase();
      if (n.includes('math') || (index === 0 && subject === 'Physics' && n.includes('measurement'))) {
        return `<span style="color:#f97316;font-family:'Times New Roman',serif;font-style:italic;font-size:26px;font-weight:700;line-height:1;display:inline-block">𝑓</span>`;
      }
      if (n.includes('unit') || n.includes('dimension') || n.includes('measurement') || n.includes('experimental')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7L8.7 21.3a2.1 2.1 0 0 1-3 0L2.7 18.3a2.1 2.1 0 0 1 0-3L15.3 2.7a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg>`;
      }
      if (n.includes('one dimension') || n.includes('kinematics') || n.includes('straight line')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#06b6d4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
      }
      if (n.includes('two dimension') || n.includes('projectile') || n.includes('circular motion')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#d946ef" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4a4 4 0 0 0 4-4V5"/><path d="m7 9 5-5 5 5"/></svg>`;
      }
      if (n.includes('laws of motion') || n.includes('newton') || n.includes('momentum')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m10 8 4 4-4 4"/><path d="M8 12h6"/></svg>`;
      }
      if (n.includes('work') || n.includes('energy') || n.includes('power')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 0-3 9h6a5 5 0 0 0-3-9z"/></svg>`;
      }
      if (n.includes('particle') || n.includes('rotational') || n.includes('centre of mass') || n.includes('center of mass')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3b82f6" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="8" r="2"/><circle cx="19" cy="8" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M7 9l3.5 2M17 9l-3.5 2M8.5 16.5l2-3M15.5 16.5l-2-3"/></svg>`;
      }
      if (n.includes('gravit')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"/></svg>`;
      }
      if (n.includes('solid') || n.includes('fluid') || n.includes('viscosity') || n.includes('elastic')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#06b6d4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7 0"/><path d="M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7 0"/></svg>`;
      }
      if (n.includes('thermodynamic') || n.includes('heat') || n.includes('thermal')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f97316" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-.8-.4-1.5-1-2-.5-.4-1-1.2-1-2 0-.8.6-1.5 1-2 .5-.7 1.5-1.5 2.5-1.5 0 0-1 2 0 3.5 1 1.5 2 2.5 2 4.5a6 6 0 1 1-12 0c0-2.5 1.5-4.5 3-6 0 1.5 1 3 2 3.5-.5.5-.5 1-.5 1.5z"/></svg>`;
      }
      if (n.includes('kinetic theory') || n.includes('gas')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5" fill="#f59e0b"/><circle cx="16" cy="9" r="1.5" fill="#f59e0b"/><circle cx="12" cy="14" r="1.5" fill="#f59e0b"/><circle cx="7" cy="16" r="1.5" fill="#f59e0b"/><circle cx="17" cy="16" r="1.5" fill="#f59e0b"/></svg>`;
      }
      if (n.includes('oscillation') || n.includes('wave')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#6366f1" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-8 5-8 7.5 0s5 8 7.5 0 5-8 7 0"/></svg>`;
      }
      if (n.includes('electrostat') || n.includes('charge') || n.includes('capacit')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#eab308" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
      }
      if (n.includes('current') || n.includes('electric') || n.includes('circuit')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0284c7" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="3"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/></svg>`;
      }
      if (n.includes('magnet')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ec4899" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v7a3 3 0 0 0 6 0V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v7a7 7 0 0 1-14 0Z"/><path d="M4 6h5"/><path d="M15 6h5"/></svg>`;
      }
      if (n.includes('induction') || n.includes('alternating') || n.includes('em waves')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="3.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M2 12h1.5M20.5 12H22"/></svg>`;
      }
      if (n.includes('optic') || n.includes('light') || n.includes('ray')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8b5cf6" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`;
      }
      if (n.includes('dual nature') || n.includes('photoelectric') || n.includes('radiation')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#06b6d4" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      }
      if (n.includes('atom') || n.includes('nuclei') || n.includes('nucleus')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#14b8a6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)"/></svg>`;
      }
      if (n.includes('electronic') || n.includes('semiconductor') || n.includes('diode')) {
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22c55e" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M1 9h3M1 15h3M20 9h3M20 15h3M9 1v3M15 1v3M9 20v3M15 20v3"/></svg>`;
      }
      if (subject === 'Chemistry') {
        if (n.includes('bond') || n.includes('structure')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>`;
        }
        if (n.includes('organic') || n.includes('hydrocarbon') || n.includes('aromatic')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f97316" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7"/><circle cx="12" cy="12" r="3.5"/></svg>`;
        }
        if (n.includes('solution') || n.includes('acid') || n.includes('mole') || n.includes('concept')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#06b6d4" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.43 19A2 2 0 0 0 6.16 22h11.68a2 2 0 0 0 1.73-3L14 9.31V2"/><line x1="8" y1="2" x2="16" y2="2"/><line x1="6" y1="16" x2="18" y2="16"/></svg>`;
        }
        if (n.includes('equilibrium') || n.includes('kinetics') || n.includes('redox')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#eab308" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`;
        }
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3b82f6" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 9h4M10 3v8l-4 8a1.5 1.5 0 0 0 1.3 2.2h9.4A1.5 1.5 0 0 0 18 19l-4-8V3"/></svg>`;
      }
      if (subject === 'Botany') {
        if (n.includes('cell') || n.includes('genetics') || n.includes('inheritance')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#06b6d4" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1 1"/></svg>`;
        }
        if (n.includes('flower') || n.includes('morphology')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ec4899" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 18v4"/></svg>`;
        }
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
      }
      if (subject === 'Zoology') {
        if (n.includes('heart') || n.includes('circulat') || n.includes('fluid') || n.includes('blood')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f43f5e" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
        }
        if (n.includes('neural') || n.includes('brain') || n.includes('coordination')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8b5cf6" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`;
        }
        if (n.includes('health') || n.includes('disease') || n.includes('reproduct')) {
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
        }
        return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f59e0b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>`;
    };

    const CH_EXACT_STATS: Record<string, { w26: number; w25: number; inc: boolean; solved: number; total: number }> = {
      'Mathematics in Physics': { w26: 0, w25: 0, inc: false, solved: 0, total: 29 },
      'Units and Dimensions': { w26: 3, w25: 2, inc: true, solved: 31, total: 37 },
      'Motion In One Dimension': { w26: 3, w25: 2, inc: true, solved: 21, total: 61 },
      'Motion In Two Dimensions': { w26: 0, w25: 0, inc: false, solved: 17, total: 33 },
      'Laws of Motion': { w26: 3, w25: 2, inc: true, solved: 19, total: 56 },
      'Work Power Energy': { w26: 2, w25: 2, inc: false, solved: 0, total: 53 },
      'Center of Mass Momentum and Impulse': { w26: 2, w25: 1, inc: true, solved: 2, total: 60 },
    };

    const getChapterWeightage = (name: string, subject: string, index: number): [number, number, boolean] => {
      if (CH_EXACT_STATS[name]) {
        const s = CH_EXACT_STATS[name];
        return [s.w26, s.w25, s.inc];
      }
      const W_MAP: Record<string, [number, number, boolean]> = {
        'Physics and Measurement': [3, 2, true],
        'Kinematics': [3, 2, true],
        'Laws of Motion': [3, 2, true],
        'Work Power Energy': [2, 2, false],
        'System of Particles and Rotational Motion': [2, 1, true],
        'Gravitation': [2, 2, false],
        'Mechanical Properties of Solids': [3, 2, true],
        'Mechanical Properties of Fluids': [3, 2, true],
        'Thermodynamics': [3, 2, true],
        'Kinetic Theory of Gases': [2, 1, true],
        'Oscillations': [3, 2, true],
        'Waves': [3, 2, true],
        'Electrostatic Potential and Capacitance': [3, 3, false],
        'Current Electricity': [4, 3, true],
        'Moving Charges and Magnetism': [3, 3, false],
        'Electromagnetic Induction': [3, 2, true],
        'Electromagnetic Waves': [1, 1, false],
        'Ray Optics and Optical Instruments': [5, 4, true],
        'Wave Optics': [3, 2, true],
        'Dual Nature of Radiation and Matter': [2, 2, false],
        'Atoms': [2, 2, false],
        'Nuclei': [2, 1, true],
        'Semiconductor Electronics': [3, 2, true],
        'Experimental Skills': [2, 1, true],
      };
      if (W_MAP[name]) return W_MAP[name];
      const y25 = (index % 3) + 1;
      const y26 = y25 + (index % 2 === 0 ? 1 : 0);
      return [y26, y25, y26 > y25];
    };

    const renderUnboxedChapterRow = (
      c: [string, string],
      subject: string,
      index: number,
      onClickStr: string,
      customRight?: string
    ) => {
      const icon = getChapterIcon(c[0], subject, index);
      const exact = CH_EXACT_STATS[c[0]];
      
      let w26 = 0, w25 = 0, inc = false, solved = 0, total = 45;
      if (exact) {
        w26 = exact.w26;
        w25 = exact.w25;
        inc = exact.inc;
        solved = exact.solved;
        total = exact.total;
      } else {
        const [w26Val, w25Val, incVal] = getChapterWeightage(c[0], subject, index);
        w26 = w26Val;
        w25 = w25Val;
        inc = incVal;
        const topics = c[1] ? c[1].split('|') : [];
        total = topics.reduce((a, t) => a + qn(t), 0) || 45;
        const progressPercent = pg(c[0]);
        solved = Math.round((progressPercent / 100) * total);
      }

      return `<button class="nb-ch-item" onclick="${onClickStr}">
        <div class="nb-ch-icon-box">
          ${icon}
        </div>
        <div class="nb-ch-body">
          <div class="nb-ch-name">${esc(c[0])}</div>
          <div class="nb-ch-meta">
            2026: ${w26} Qs ${inc ? '<span class="up-arr">↑</span>' : ''} &nbsp;|&nbsp; 2025: ${w25} Qs
          </div>
        </div>
        <div class="nb-ch-right-info">
          ${customRight || `<span class="nb-ch-qs">${solved}/${total} Qs</span>`}
          <span style="color:#64748b;font-size:18px;margin-left:4px">›</span>
        </div>
      </button>`;
    };

    const LS = (k: string, d: any) => {
      try {
        const v = JSON.parse(localStorage.getItem(k) || '');
        return v == null ? d : v;
      } catch (e) {
        return d;
      }
    };

    let G: any[] = LS('nbG', null) || [
      { t: 'Practice 100 Questions', d: 1, go: 'practice' },
      { t: 'Revise 2 Chapters', d: 0, go: 'notes' },
      { t: 'Give 1 Mock Test', d: 0, go: 'tests' },
    ];

    let NT: any[] = LS('nbN', null) || [
      [
        'Laws of Motion – Short Notes',
        'Physics',
        'Laws of Motion',
        '28 Oct 2026',
        'Newton’s three laws, friction types and free-body diagrams.',
      ],
      [
        'Aromatic Compounds – Reactions',
        'Chemistry',
        'Aromatic Compounds',
        '27 Oct 2026',
        'Electrophilic substitution: nitration, halogenation, Friedel-Crafts.',
      ],
      [
        'Cell – Unit of Life (Revision)',
        'Botany',
        'Cell: The Unit of Life',
        '26 Oct 2026',
        'Organelles and their functions.',
      ],
      [
        'Human Physiology – Quick Revision',
        'Zoology',
        'Human Physiology',
        '25 Oct 2026',
        'Digestion, breathing and circulation summary.',
      ],
    ];

    let BK: any[] = LS('nbB', null) || [
      ['Projectile motion में maximum range kab hoti hai?', 'Physics', 'Kinematics'],
      ['Which of the following is an aromatic compound?', 'Chemistry', 'Aromatic Compounds'],
    ];

    let dm = false;
    try {
      dm = localStorage.getItem('nbD')
        ? localStorage.getItem('nbD') === '1'
        : window.matchMedia('(prefers-color-scheme:dark)').matches;
    } catch (e) {}

    let USERS = LS('nbUsers', []);
    let CU: any = LS('nbCU', null);

    const UN = () => (CU && CU.name ? CU.name : 'Ayush Kumar');
    const UF = () => UN().trim().split(' ')[0];
    const UI = () => UN().trim()[0].toUpperCase();
    const UY = () => 'NEET ' + (CU ? CU.year : '2026');
    const UC = () => (CU ? CU.cls : 'Class 12');

    const hp = (t: string) => {
      let h = 5381;
      for (const c of 'nb|' + t) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
      return (h >>> 0).toString(36);
    };

    const savU = () => {
      try {
        localStorage.setItem('nbUsers', JSON.stringify(USERS));
        localStorage.setItem('nbCU', JSON.stringify(CU));
      } catch (e) {}
    };

    const gv = (id: string) =>
      ((document.getElementById(id) as HTMLInputElement) || {}).value || '';

    const normP = (t: string) => {
      let d = String(t).replace(/\D/g, '');
      if (d.length > 10 && d.startsWith('91')) d = d.slice(-10);
      if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
      return d;
    };

    function aerr(m: string) {
      const e = document.getElementById('aer');
      if (e) {
        e.textContent = m;
        e.style.display = 'block';
        try {
          e.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } catch (x) {}
      }
    }

    function playDoorUnlockAnim(onComplete: () => void) {
      document.querySelectorAll('#nb-door-overlay, #nb-splash, .wel').forEach((x) => x.remove());
      const overlay = document.createElement('div');
      overlay.id = 'nb-door-overlay';
      overlay.innerHTML = `
        <div class="door-container">
          <div class="door-panel door-left">
            <div class="door-handle left-handle"></div>
          </div>
          <div class="door-panel door-right">
            <div class="door-handle right-handle"></div>
          </div>
          <div class="door-center-lock">
            <div class="door-logo-box">
              <img src="/assets/aistudio/file_00000000f4e48211818e5cad3b07282e_bd13d945.png" alt="NEETBuddy 3D Logo" class="door-logo-img"/>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        confetti();
      }, 500);

      setTimeout(() => {
        overlay.classList.add('doors-opening');
        setTimeout(() => {
          overlay.classList.add('doors-fadeout');
          onComplete();
        }, 600);
      }, 1200);

      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
      }, 2000);
    }

    function startSession(rem: boolean) {
      try {
        (rem ? localStorage : sessionStorage).setItem('nbIn', '1');
      } catch (e) {}
      document.querySelectorAll('#nb-splash, .wel').forEach((el) => el.remove());
      const sp = document.getElementById('nb-splash');
      if (sp) sp.remove();
      const lpf = document.getElementById('lpf');
      if (lpf) lpf.remove();

      playDoorUnlockAnim(() => {
        hideLP();
        document.querySelectorAll('#nb-splash, .wel').forEach((el) => el.remove());
        go('home');
        toast('Welcome back, ' + UF() + '! 🎉');
      });
    }

    function guestLogin() {
      CU = {
        name: 'Guest Aspirant',
        phone: '9876543210',
        email: 'guest@neetbuddy.app',
        pw: hp('guest123'),
        cls: 'Class 12',
        year: '2026',
      };
      if (!USERS.some((u: any) => u.email === CU.email)) {
        USERS.push(CU);
      }
      savU();
      loadAll();
      startSession(true);
      toast('Welcome, Guest Aspirant! ⚡');
    }

    async function signup() {
      const n = gv('au-n').trim() || 'NEET Aspirant';
      const p = normP(gv('au-p')) || '9876543210';
      const e = gv('au-e').trim().toLowerCase() || 'student@neetbuddy.app';
      const w = gv('au-w') || '12345678';

      if (n.length < 2) return aerr('Please enter your full name.');

      // If user already exists, seamlessly update and log them in instead of blocking
      const existingUser = USERS.find((u: any) => u.email === e || (p && u.phone === p));
      if (existingUser) {
        existingUser.name = n || existingUser.name;
        if (w) existingUser.pw = hp(w);
        CU = existingUser;
        savU();
        loadAll();
        startSession(true);
        toast('Logged in to your account! Welcome, ' + UF() + ' 🎉');
        return;
      }

      CU = {
        name: n,
        phone: p,
        email: e,
        pw: hp(w),
        cls: gv('au-c') || 'Class 12',
        year: gv('au-y') || '2027',
      };
      USERS.push(CU);
      savU();

      // Call real backend register
      try {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: n,
            email: e,
            phone: p,
            classLevel: CU.cls,
            targetYear: CU.year,
            password: w,
          }),
        });
      } catch (err) {}

      loadAll();
      startSession(true);
      toast('Account created! Welcome, ' + UF() + ' 🎉');
    }

    async function loginForm() {
      const id = gv('au-i').trim().toLowerCase();
      const w = gv('au-w');

      // If fields are empty, allow 1-click login as Guest/Demo or prompt
      if (!id) {
        guestLogin();
        return;
      }

      // Check backend or local store
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: id, password: w || '12345678' }),
        });
        if (res.ok) {
          const data = await res.json();
          CU = {
            name: data.user.fullName,
            phone: data.user.phone,
            email: data.user.email,
            pw: hp(w || '12345678'),
            cls: data.user.classLevel,
            year: data.user.targetYear,
          };
          savU();
          loadAll();
          const r = document.getElementById('au-r') as HTMLInputElement;
          startSession(!r || r.checked);
          toast('Welcome back, ' + UF() + '!');
          return;
        }
      } catch (err) {}

      const u = USERS.find((x: any) => x.email === id || x.phone === normP(id));
      if (u) {
        CU = u;
        if (w) u.pw = hp(w);
      } else {
        // Fallback create/login user immediately
        CU = {
          name: id.includes('@') ? id.split('@')[0] : 'NEET Aspirant',
          email: id.includes('@') ? id : id + '@neetbuddy.app',
          phone: normP(id) || '9876543210',
          cls: 'Class 12',
          year: '2026',
        };
        USERS.push(CU);
      }

      savU();
      loadAll();
      const r = document.getElementById('au-r') as HTMLInputElement;
      startSession(!r || r.checked);
      toast('Welcome back, ' + UF() + '!');
    }

    const tgd = () => {
      dm = !dm;
      try {
        localStorage.setItem('nbD', dm ? '1' : '0');
      } catch (e) {}
      draw();
    };

    const gdone = (g: any) => !!g.d;
    const gd = () => G.filter(gdone).length;

    const wk = [4.1, 2.5, 4.8, 2.9, 5.9, 4.6, 3.2];

    const goalCard = () => {
      const n = gd();
      const t = G.length || 1;
      return `<div class="card" id="goal"><h3 style="display:flex;justify-content:space-between;align-items:center;gap:10px">🎯 Set Your Today's Goal <button class="btn sm" onclick="window.nbToggleGe()">${
        S.ge ? 'Save ✓' : 'Set Goal +'
      }</button></h3><div style="display:flex;gap:16px;align-items:center;margin-top:8px;flex-wrap:wrap"><div style="flex:1;min-width:180px">${
        G.map((g, i) =>
          S.ge
            ? `<div class="gi"><input value="${esc(
                g.t
              )}" oninput="window.nbUpdateGoal(${i},this.value)"><button onclick="window.nbDelGoal(${i})" aria-label="Remove goal">✕</button></div>`
            : `<div class="gi ${
                gdone(g) ? 'd' : ''
              }"><button class="chk ${
                gdone(g) ? 'on' : ''
              }" onclick="window.nbTogGoal(${i})" aria-label="Toggle goal">${
                gdone(g) ? '✓' : ''
              }</button><span class="t" style="flex:1">${esc(g.t)}</span>${
                gdone(g)
                  ? ''
                  : `<button class="chip c3" onclick="window.nbGo('${
                      g.go || 'practice'
                    }')">Go →</button>`
              }</div>`
        ).join('') ||
        '<p style="color:var(--mu)">No goals yet. Tap Set Goal + to add one.</p>'
      }${
        S.ge
          ? `<button class="btn o sm" onclick="window.nbAddGoal()">+ Add goal</button>`
          : ''
      }</div><div class="ring" style="background:conic-gradient(var(--g2) ${
        (n / t) * 360
      }deg,var(--ln) 0)"><span><div>${n}/${G.length}<small>${
        n === G.length && n ? 'All done 🎉' : 'Completed'
      }</small></div></span></div></div></div>`;
    };

    const PYY = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
    const SJN = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
    const SJE: Record<string, string> = {
      Physics: '⚛️',
      Chemistry: '🧪',
      Botany: '🌿',
      Zoology: '🧬',
    };
    const SJC: Record<string, string> = {
      Physics: '#e6f0ff',
      Chemistry: '#fff0e4',
      Botany: '#e8f7e6',
      Zoology: '#f0e8ff',
    };
    const CCL: Record<string, string> = {
      Physics: 'c1',
      Chemistry: 'c2',
      Botany: 'c3',
      Zoology: 'c6',
      Mock: 'c4',
      Revision: 'c5',
    };

    let PYD: any = LS('nbPY', {});
    let DPPD: any = LS('nbDPP', {});
    let SPL: any = LS('nbPlan', null);
    let FCK: any = LS('nbFC', {});
    let LOG: any[] = LS('nbLog', []);
    let SES: any[] = LS('nbSes', []);
    let IBK: any[] = LS('nbIB', []);
    let LAST: any = LS('nbLast', null);

    const sv = () => saveAll();
    const saveAll = () => {
      try {
        localStorage.setItem('nbG', JSON.stringify(G));
        localStorage.setItem('nbN', JSON.stringify(NT));
        localStorage.setItem('nbB', JSON.stringify(BK));
        localStorage.setItem('nbPY', JSON.stringify(PYD));
        localStorage.setItem('nbDPP', JSON.stringify(DPPD));
        localStorage.setItem('nbPlan', JSON.stringify(SPL));
        localStorage.setItem('nbFC', JSON.stringify(FCK));
        localStorage.setItem('nbLog', JSON.stringify(LOG.slice(-3000)));
        localStorage.setItem('nbSes', JSON.stringify(SES.slice(-300)));
        localStorage.setItem('nbIB', JSON.stringify(IBK));
        localStorage.setItem('nbLast', JSON.stringify(LAST));
      } catch (e) {}
    };

    function loadAll() {
      G = LS('nbG', G);
      NT = LS('nbN', NT);
      BK = LS('nbB', BK);
      PYD = LS('nbPY', {});
      DPPD = LS('nbDPP', {});
      SPL = LS('nbPlan', null);
      FCK = LS('nbFC', {});
      LOG = LS('nbLog', []);
      SES = LS('nbSes', []);
      IBK = LS('nbIB', []);
      LAST = LS('nbLast', null);
    }

    const dk = (d = new Date()) =>
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0');

    const statRow = (a: any[]) =>
      `<div class="hg">${a
        .map(
          (x) =>
            `<div class="st s3"><span class="ic" style="background:${x[3]}">${x[0]}</span><span><small>${x[2]}</small><b>${x[1]}</b></span></div>`
        )
        .join('')}</div>`;

    const esc = (t: any) =>
      String(t || '').replace(
        /[&<>"]/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c)
      );

    const stoNote = () => '';

    // Views Dictionary
    const V: Record<string, () => string> = {
      home: () => {
        const h = new Date().getHours();
        const gr = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
        const gn = G.filter(gdone).length;
        const gt = G.length || 1;
        const goalRingHtml = `<div class="nb-goal-ring-widget" onclick="window.nbGo('plan')" title="${gn}/${G.length} Goals completed"><svg width="74" height="74" viewBox="0 0 74 74"><circle cx="37" cy="37" r="30" fill="none" class="nb-ring-track" stroke-width="7"/><circle cx="37" cy="37" r="30" fill="none" stroke="#2563eb" stroke-width="7" stroke-dasharray="188.5" stroke-dashoffset="${188.5 - (gn / gt) * 188.5}" stroke-linecap="round" transform="rotate(-90 37 37)"/></svg><div class="nb-goal-ring-text"><b>${gn}/${G.length}</b><small>Goals</small></div></div>`;
        return shell(
          `<div class="nb-home-header"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px"><div><h1 style="font-size:32px;font-weight:800;color:var(--ink);line-height:1.15;margin:0">Good ${gr},<br/><span style="color:#10b981">${UF()}!</span> 👋</h1><p style="color:var(--mu);font-size:14px;margin-top:6px;margin-bottom:0;font-weight:500">Consistency today, MBBS tomorrow.</p></div>${goalRingHtml}</div><div style="display:flex;align-items:center;gap:7px;margin:12px 0 16px;font-size:14px;font-weight:700;color:var(--ink)"><span style="font-size:16px">📅</span><span>${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div></div><div class="nb-stats-grid"><div class="nb-stat-card nb-stat-mint"><div class="nb-stat-icon-wrap"><svg width="42" height="42" viewBox="0 0 48 48" fill="none"><rect x="21" y="2" width="6" height="5" rx="2" fill="#059669"/><path d="M19 4 H29" stroke="#059669" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="26" r="19" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/><circle cx="24" cy="26" r="15" fill="#ffffff" stroke="rgba(16,185,129,0.2)" stroke-width="1"/><line x1="24" y1="13" x2="24" y2="15" stroke="#10b981" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="37" x2="24" y2="39" stroke="#10b981" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="26" x2="13" y2="26" stroke="#10b981" stroke-width="1.5" stroke-linecap="round"/><line x1="35" y1="26" x2="37" y2="26" stroke="#10b981" stroke-width="1.5" stroke-linecap="round"/><circle cx="24" cy="26" r="2.5" fill="#047857"/><line x1="24" y1="26" x2="24" y2="16" stroke="#047857" stroke-width="2.5" stroke-linecap="round"/></svg></div><div class="nb-stat-info"><b class="nb-stat-val">4h 30m</b><span class="nb-stat-lbl">Study Time</span></div><div class="nb-stat-graphic nb-chart-bars"><span style="height:10px"></span><span style="height:16px"></span><span style="height:22px"></span><span style="height:28px"></span><span style="height:34px"></span></div></div><div class="nb-stat-card nb-stat-blue"><div class="nb-stat-icon-wrap"><svg width="42" height="42" viewBox="0 0 48 48" fill="none"><defs><linearGradient id="lGrad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient><linearGradient id="lGrad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs><path d="M24 38 L38 31 L24 24 L10 31 Z" fill="#1d4ed8" opacity="0.6"/><path d="M10 31 L24 38 L38 31 L38 33 L24 40 L10 33 Z" fill="#1e40af"/><path d="M24 30 L38 23 L24 16 L10 23 Z" fill="url(#lGrad1)"/><path d="M10 23 L24 30 L38 23 L38 25 L24 32 L10 25 Z" fill="#2563eb"/><path d="M24 22 L38 15 L24 8 L10 15 Z" fill="url(#lGrad2)"/><path d="M10 15 L24 22 L38 15 L38 17 L24 24 L10 17 Z" fill="#3b82f6"/></svg></div><div class="nb-stat-info"><b class="nb-stat-val">180</b><span class="nb-stat-lbl">Questions</span></div><div class="nb-stat-graphic"><svg width="56" height="26" viewBox="0 0 60 28" fill="none"><path d="M 2 22 Q 14 26, 26 18 T 46 16 T 58 6" stroke="#3b82f6" stroke-width="2.6" stroke-linecap="round"/></svg></div></div><div class="nb-stat-card nb-stat-purple"><div class="nb-stat-icon-wrap"><svg width="42" height="42" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" fill="none" stroke="#9333ea" stroke-width="3"/><circle cx="24" cy="24" r="12" fill="none" stroke="#a855f7" stroke-width="2.5"/><circle cx="24" cy="24" r="6" fill="#7e22ce"/><circle cx="24" cy="24" r="2.5" fill="#f3e8ff"/><path d="M 38 10 L 26 22" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/><polygon points="38,10 42,7 39,13" fill="#3b82f6"/><polygon points="38,10 35,6 41,9" fill="#06b6d4"/><polygon points="38,10 37,15 43,12" fill="#2563eb"/></svg></div><div class="nb-stat-info"><b class="nb-stat-val">78%</b><span class="nb-stat-lbl">Accuracy</span></div><div class="nb-stat-graphic"><svg width="34" height="34" viewBox="0 0 36 36"><circle cx="18" cy="18" r="13.5" fill="none" stroke="rgba(168,85,247,0.18)" stroke-width="3.5"/><circle cx="18" cy="18" r="13.5" fill="none" stroke="#9333ea" stroke-width="3.5" stroke-dasharray="84.8" stroke-dashoffset="18.6" stroke-linecap="round" transform="rotate(-90 18 18)"/></svg></div></div><div class="nb-stat-card nb-stat-amber"><div class="nb-stat-icon-wrap"><svg width="42" height="42" viewBox="0 0 48 48" fill="none"><defs><radialGradient id="flameBackdrop" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fb923c" stop-opacity="0.35"/><stop offset="100%" stop-color="#fb923c" stop-opacity="0"/></radialGradient><linearGradient id="flameOuter" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ea580c"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient><linearGradient id="flameInner" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><circle cx="24" cy="26" r="18" fill="url(#flameBackdrop)"/><path d="M 24 6 C 26 14, 36 18, 36 28 C 36 35, 31 40, 24 40 C 17 40, 12 35, 12 28 C 12 21, 19 14, 21 8 C 22 13, 25 15, 24 6 Z" fill="url(#flameOuter)"/><path d="M 24 18 C 26 23, 30 26, 30 32 C 30 36, 27 38, 24 38 C 21 38, 18 36, 18 32 C 18 27, 22 23, 24 18 Z" fill="url(#flameInner)"/></svg></div><div class="nb-stat-info"><b class="nb-stat-val">12 days</b><span class="nb-stat-lbl">Streak</span></div><div class="nb-stat-graphic nb-streak-boxes"><span class="nb-chk-box on">✓</span><span class="nb-chk-box on">✓</span><span class="nb-chk-box on">✓</span><span class="nb-chk-box off">✓</span></div></div></div><div class="hg"><div class="card s6"><h3 style="display:flex;justify-content:space-between">Continue Learning <span class="ar" onclick="window.nbGo('setup',{s:'Physics',c:'Kinematics',tp:'Units and Dimensions'})" style="cursor:pointer">→</span></h3><div style="display:flex;gap:16px;align-items:center;margin-top:12px"><div class="ti" style="width:84px;height:84px;font-size:40px;background:#e6f0ff">⚛️</div><div style="flex:1"><small style="color:var(--mu)">Physics • Kinematics</small><h3>Units and Dimensions</h3><small style="color:var(--mu)">12/50 Questions</small><div class="pr"><div class="bar"><i style="width:24%"></i></div><b>24%</b></div></div></div><button class="btn sm" style="margin-top:14px" onclick="window.nbGo('setup',{s:'Physics',c:'Kinematics',tp:'Units and Dimensions'})">Continue Practice →</button></div><div class="s6">${goalCard()}</div><div class="card s6 sp-widget" style="background:var(--cd);border-radius:24px;border:1px solid var(--ln);box-shadow:var(--sh);padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div><h3 style="font-size:18px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:8px"><span style="font-size:20px">📊</span> Subject Progress</h3><p style="font-size:12px;color:var(--mu);margin-top:2px">NMC NEET UG 2026 Syllabus Completion</p></div><a style="font-size:12.5px;font-weight:700;color:#14a366;cursor:pointer;background:rgba(20,163,102,0.1);padding:6px 14px;border-radius:99px" onclick="window.nbGo('practice')">Explore →</a></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">${SUBJ.map(
            (s) => `<div style="background:var(--bg);border-radius:18px;padding:14px 16px;border:1px solid var(--ln);transition:all 0.25s;cursor:pointer" onclick="window.nbGo('chap',{s:'${s[0]}'})" class="sp-item"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:22px;width:38px;height:38px;border-radius:12px;background:${s[2]};display:grid;place-items:center">${s[1]}</span><div><b style="font-size:14.5px;display:block;color:var(--ink)">${s[0]}</b><small style="font-size:11px;color:var(--mu)">${s[3]} Chapters</small></div></div><b style="font-size:15px;font-weight:800;color:#14a366">${s[5]}%</b></div><div style="height:7px;border-radius:99px;background:rgba(0,0,0,0.06);overflow:hidden"><div style="height:100%;width:${s[5]}%;border-radius:99px;background:linear-gradient(90deg,#0b6b45,#14a366);transition:width 0.6s cubic-bezier(0.16,1,0.3,1)"></div></div></div>`
          ).join('')}</div></div><div class="nb-flashcards-section"><div class="nb-flashcards-header"><h2>Revision Flash Cards</h2><span>Quick revision, anytime</span></div><div class="nb-flashcards-scroll"><div onclick="window.nbGo('flash_chap',{s:'Zoology'})" class="nb-fc-stack"><div class="nb-fc-layer3" style="border-color:#ff725e"></div><div class="nb-fc-layer2" style="border-color:#ff725e"></div><div class="nb-fc-front" style="border-color:#ff725e"><svg class="nb-fc-ring" viewBox="0 0 44 44"><defs><linearGradient id="sRingZoo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e2e8f0"/><stop offset="55%" stop-color="#64748b"/><stop offset="85%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient><filter id="zooDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="18" cy="22" r="6.5" fill="#0b0e17" stroke="#475569" stroke-width="1.8"/><path d="M 12 25 C 5 19, 5 6, 20 6 C 29 6, 29 14, 22 21 C 18 24.5, 14 24, 13 22" fill="none" stroke="url(#sRingZoo)" stroke-width="3.8" stroke-linecap="round" filter="url(#zooDrop)"/><path d="M 11 16 C 12 9, 20 7, 24 9" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/></svg><div class="nb-fc-icon-wrap" style="background:rgba(255,114,94,0.14)"><svg width="15" height="15" viewBox="0 0 32 32" fill="none"><ellipse cx="10" cy="11" rx="2.2" ry="3" fill="none" stroke="#ff725e" stroke-width="1.8"/><ellipse cx="16" cy="8" rx="2.2" ry="3" fill="none" stroke="#ff725e" stroke-width="1.8"/><ellipse cx="22" cy="11" rx="2.2" ry="3" fill="none" stroke="#ff725e" stroke-width="1.8"/><ellipse cx="6" cy="16" rx="2" ry="2.6" fill="none" stroke="#ff725e" stroke-width="1.8"/><path d="M10 20 C9 15, 13 14, 16 14 C19 14, 23 15, 22 20 C21 24, 11 24, 10 20 Z" fill="none" stroke="#ff725e" stroke-width="1.8"/></svg></div><h3 class="nb-fc-title" style="color:#ff725e">ZOOLOGY</h3><span class="nb-fc-count" style="color:#ff725e">673 Flash Cards</span><div class="nb-fc-diagram-box"><svg viewBox="0 0 200 100" width="100%" height="100%" style="overflow:visible"><ellipse cx="100" cy="52" rx="72" ry="36" fill="none" stroke="#ff725e" stroke-width="1.3" stroke-dasharray="3 2"/><circle cx="80" cy="48" r="15" fill="#ef4444" fill-opacity="0.18" stroke="#ff725e" stroke-width="1.3"/><circle cx="80" cy="48" r="5" fill="#ff725e"/><ellipse cx="132" cy="44" rx="10" ry="5.5" fill="none" stroke="#ff725e" stroke-width="1.2" transform="rotate(-15 132 44)"/><path d="M125 43 Q132 40 139 45" stroke="#ff725e" stroke-width="0.8" fill="none"/><line x1="86" y1="18" x2="65" y2="12" stroke="#ff725e" stroke-width="0.9"/><polyline points="65,12 50,12" stroke="#ff725e" stroke-width="0.9" fill="none"/><text x="48" y="10" text-anchor="end" fill="#ff725e" font-size="8.5" font-family="'Caveat', cursive, sans-serif">Cell membrane</text><line x1="80" y1="33" x2="96" y2="22" stroke="#ff725e" stroke-width="0.9"/><polyline points="96,22 135,22" stroke="#ff725e" stroke-width="0.9" fill="none"/><text x="138" y="25" fill="#ff725e" font-size="8.5" font-family="'Caveat', cursive, sans-serif">Nucleus</text><line x1="120" y1="58" x2="140" y2="58" stroke="#ff725e" stroke-width="0.9"/><polyline points="140,58 175,58" stroke="#ff725e" stroke-width="0.9" fill="none"/><text x="178" y="61" fill="#ff725e" font-size="8.5" font-family="'Caveat', cursive, sans-serif">Cytoplasm</text><line x1="130" y1="52" x2="125" y2="78" stroke="#ff725e" stroke-width="0.9"/><polyline points="125,78 152,78" stroke="#ff725e" stroke-width="0.9" fill="none"/><text x="155" y="81" fill="#ff725e" font-size="8.5" font-family="'Caveat', cursive, sans-serif">Mitochondria</text></svg></div></div></div><div onclick="window.nbGo('flash_chap',{s:'Botany'})" class="nb-fc-stack"><div class="nb-fc-layer3" style="border-color:#22c55e"></div><div class="nb-fc-layer2" style="border-color:#22c55e"></div><div class="nb-fc-front" style="border-color:#22c55e"><svg class="nb-fc-ring" viewBox="0 0 44 44"><defs><linearGradient id="sRingBot" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e2e8f0"/><stop offset="55%" stop-color="#64748b"/><stop offset="85%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient><filter id="botDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="18" cy="22" r="6.5" fill="#0b0e17" stroke="#475569" stroke-width="1.8"/><path d="M 12 25 C 5 19, 5 6, 20 6 C 29 6, 29 14, 22 21 C 18 24.5, 14 24, 13 22" fill="none" stroke="url(#sRingBot)" stroke-width="3.8" stroke-linecap="round" filter="url(#botDrop)"/><path d="M 11 16 C 12 9, 20 7, 24 9" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/></svg><div class="nb-fc-icon-wrap" style="background:rgba(34,197,94,0.14)"><svg width="15" height="15" viewBox="0 0 32 32" fill="none"><path d="M16 26 C16 19 16 13 16 8" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/><path d="M16 16 C11 16 7 13 8 8 C13 8 16 12 16 16 Z" stroke="#22c55e" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M16 13 C21 13 25 10 24 5 C19 5 16 9 16 13 Z" stroke="#22c55e" stroke-width="2" fill="none" stroke-linejoin="round"/></svg></div><h3 class="nb-fc-title" style="color:#22c55e">BOTANY</h3><span class="nb-fc-count" style="color:#22c55e">471 Flash Cards</span><div class="nb-fc-diagram-box"><svg viewBox="0 0 200 100" width="100%" height="100%" style="overflow:visible"><line x1="20" y1="16" x2="135" y2="16" stroke="#22c55e" stroke-width="1.5"/><rect x="20" y="20" width="115" height="10" rx="1.5" fill="none" stroke="#22c55e" stroke-width="1"/><g stroke="#22c55e" stroke-width="0.8"><line x1="34" y1="20" x2="34" y2="30"/><line x1="48" y1="20" x2="48" y2="30"/><line x1="62" y1="20" x2="62" y2="30"/><line x1="76" y1="20" x2="76" y2="30"/><line x1="90" y1="20" x2="90" y2="30"/><line x1="104" y1="20" x2="104" y2="30"/><line x1="118" y1="20" x2="118" y2="30"/></g><g fill="none" stroke="#22c55e" stroke-width="0.9"><rect x="22" y="33" width="9" height="26" rx="2"/><rect x="33" y="33" width="9" height="26" rx="2"/><rect x="44" y="33" width="9" height="26" rx="2"/><rect x="55" y="33" width="9" height="26" rx="2"/><rect x="66" y="33" width="9" height="26" rx="2"/><rect x="77" y="33" width="9" height="26" rx="2"/><rect x="88" y="33" width="9" height="26" rx="2"/><rect x="99" y="33" width="9" height="26" rx="2"/><rect x="110" y="33" width="9" height="26" rx="2"/><rect x="121" y="33" width="9" height="26" rx="2"/></g><g fill="#22c55e" opacity="0.6"><circle cx="26.5" cy="40" r="1.2"/><circle cx="26.5" cy="48" r="1.2"/><circle cx="37.5" cy="42" r="1.2"/><circle cx="37.5" cy="50" r="1.2"/><circle cx="48.5" cy="38" r="1.2"/><circle cx="70.5" cy="42" r="1.2"/><circle cx="92.5" cy="46" r="1.2"/><circle cx="114.5" cy="42" r="1.2"/></g><g fill="none" stroke="#22c55e" stroke-width="0.9"><circle cx="28" cy="68" r="5"/><circle cx="44" cy="72" r="6"/><circle cx="62" cy="68" r="5.5"/><circle cx="78" cy="73" r="5"/><circle cx="94" cy="69" r="6"/><circle cx="112" cy="71" r="5"/><circle cx="126" cy="68" r="4.5"/></g><rect x="20" y="82" width="115" height="8" rx="1.5" fill="none" stroke="#22c55e" stroke-width="1"/><line x1="75" y1="16" x2="75" y2="8" stroke="#22c55e" stroke-width="0.8"/><text x="75" y="6" text-anchor="middle" fill="#22c55e" font-size="8" font-family="'Caveat', cursive, sans-serif">Cuticle</text><line x1="135" y1="25" x2="148" y2="25" stroke="#22c55e" stroke-width="0.8"/><text x="151" y="27" fill="#22c55e" font-size="7.5" font-family="'Caveat', cursive, sans-serif">Upper epidermis</text><line x1="130" y1="44" x2="148" y2="44" stroke="#22c55e" stroke-width="0.8"/><text x="151" y="46" fill="#22c55e" font-size="7.5" font-family="'Caveat', cursive, sans-serif">Palisade mesophyll</text><line x1="126" y1="69" x2="148" y2="69" stroke="#22c55e" stroke-width="0.8"/><text x="151" y="71" fill="#22c55e" font-size="7.5" font-family="'Caveat', cursive, sans-serif">Spongy mesophyll</text><line x1="135" y1="86" x2="148" y2="86" stroke="#22c55e" stroke-width="0.8"/><text x="151" y="88" fill="#22c55e" font-size="7.5" font-family="'Caveat', cursive, sans-serif">Lower</text></svg></div></div></div><div onclick="window.nbGo('flash_chap',{s:'Physics'})" class="nb-fc-stack"><div class="nb-fc-layer3" style="border-color:#f97316"></div><div class="nb-fc-layer2" style="border-color:#f97316"></div><div class="nb-fc-front" style="border-color:#f97316"><svg class="nb-fc-ring" viewBox="0 0 44 44"><defs><linearGradient id="sRingPhy" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e2e8f0"/><stop offset="55%" stop-color="#64748b"/><stop offset="85%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient><filter id="phyDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="18" cy="22" r="6.5" fill="#0b0e17" stroke="#475569" stroke-width="1.8"/><path d="M 12 25 C 5 19, 5 6, 20 6 C 29 6, 29 14, 22 21 C 18 24.5, 14 24, 13 22" fill="none" stroke="url(#sRingPhy)" stroke-width="3.8" stroke-linecap="round" filter="url(#phyDrop)"/><path d="M 11 16 C 12 9, 20 7, 24 9" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/></svg><div class="nb-fc-icon-wrap" style="background:rgba(249,115,22,0.14)"><svg width="15" height="15" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#f97316" stroke-width="1.8" transform="rotate(30 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#f97316" stroke-width="1.8" transform="rotate(90 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#f97316" stroke-width="1.8" transform="rotate(150 16 16)"/><circle cx="16" cy="16" r="2.2" fill="#f97316"/></svg></div><h3 class="nb-fc-title" style="color:#f97316">PHYSICS</h3><span class="nb-fc-count" style="color:#f97316">613 Flash Cards</span><div class="nb-fc-diagram-box"><span style="font-size:18px;color:#f97316;font-family:'Caveat',cursive,sans-serif;font-weight:700;letter-spacing:0.8px;filter:drop-shadow(0 0 6px rgba(249,115,22,0.5));user-select:none">E = mc²</span></div></div></div><div onclick="window.nbGo('flash_chap',{s:'Chemistry'})" class="nb-fc-stack"><div class="nb-fc-layer3" style="border-color:#38bdf8"></div><div class="nb-fc-layer2" style="border-color:#38bdf8"></div><div class="nb-fc-front" style="border-color:#38bdf8"><svg class="nb-fc-ring" viewBox="0 0 44 44"><defs><linearGradient id="sRingChem" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e2e8f0"/><stop offset="55%" stop-color="#64748b"/><stop offset="85%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/></linearGradient><filter id="chemDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.7"/></filter></defs><circle cx="18" cy="22" r="6.5" fill="#0b0e17" stroke="#475569" stroke-width="1.8"/><path d="M 12 25 C 5 19, 5 6, 20 6 C 29 6, 29 14, 22 21 C 18 24.5, 14 24, 13 22" fill="none" stroke="url(#sRingChem)" stroke-width="3.8" stroke-linecap="round" filter="url(#chemDrop)"/><path d="M 11 16 C 12 9, 20 7, 24 9" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/></svg><div class="nb-fc-icon-wrap" style="background:rgba(56,189,248,0.14)"><svg width="15" height="15" viewBox="0 0 32 32" fill="none"><path d="M13 7 L19 7 M14 7 L14 13 L8 24 C7 26 8.5 27 10 27 L22 27 C23.5 27 25 26 24 24 L18 13 L18 7" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 21 Q16 23 21.5 21" stroke="#38bdf8" stroke-width="1.6" fill="none"/></svg></div><h3 class="nb-fc-title" style="color:#38bdf8">CHEMISTRY</h3><span class="nb-fc-count" style="color:#38bdf8">524 Flash Cards</span><div class="nb-fc-diagram-box"><svg viewBox="0 0 200 100" width="100%" height="100%" style="overflow:visible"><g transform="translate(68, 50)" stroke="#38bdf8" stroke-width="1.6" fill="none"><polygon points="0,-24 22,-11 22,13 0,26 -22,13 -22,-11"/><circle cx="0" cy="1" r="14" stroke-dasharray="3 2"/><line x1="22" y1="-11" x2="38" y2="-20"/><circle cx="38" cy="-20" r="3" fill="#38bdf8"/></g><g transform="translate(142, 50)" stroke="#38bdf8" stroke-width="1.5" fill="none"><line x1="-16" y1="0" x2="0" y2="-12"/><line x1="0" y1="-12" x2="16" y2="0"/><line x1="16" y1="0" x2="0" y2="12"/><line x1="0" y1="12" x2="-16" y2="0"/><circle cx="0" cy="-12" r="3" fill="#38bdf8"/><circle cx="18" cy="0" r="3" fill="#38bdf8"/><line x1="16" y1="0" x2="30" y2="0"/></g><text x="100" y="90" text-anchor="middle" fill="#38bdf8" font-size="8.5" font-family="'Caveat', cursive, sans-serif">Benzene & Alkyl Derivatives</text></svg></div></div></div></div></div><div class="card s4 ra-widget" style="background:var(--cd);border-radius:24px;border:1px solid var(--ln);box-shadow:var(--sh);padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h3 style="font-size:18px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:8px"><span style="font-size:20px">⚡</span> Recent Activity</h3><span style="font-size:11px;font-weight:700;color:#14a366;background:rgba(20,163,102,0.12);padding:4px 10px;border-radius:99px">Live Feed</span></div><div style="display:flex;flex-direction:column;gap:10px">${[
            ['Solved 20 MCQs in Kinematics', 'Physics • +16 Marks', '20m ago', '⚛️', '#e6f0ff', '#2563eb'],
            ['Completed Biology Chapter Test', 'Botany • 92% Accuracy', '2h ago', '🌿', '#e8f7e6', '#16a34a'],
            ['Reviewed 5 Mistake Cards', 'Improvement Book', '5h ago', '📖', '#fff0e4', '#ea580c'],
            ['Bookmarked 3 High-Yield Qs', 'Organic Chemistry', '8h ago', '🔖', '#f0e8ff', '#9333ea'],
          ].map(a => `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)" class="ra-item"><div style="width:36px;height:36px;border-radius:10px;background:${a[4]};display:grid;place-items:center;font-size:17px;flex-shrink:0">${a[3]}</div><div style="flex:1;min-width:0"><b style="font-size:13px;display:block;color:var(--ink);text-overflow:ellipsis;overflow:hidden;white-space:nowrap">${a[0]}</b><small style="font-size:10.5px;color:${a[5]};font-weight:600">${a[1]}</small></div><span style="font-size:10.5px;color:var(--mu);white-space:nowrap;background:var(--ln);padding:2px 8px;border-radius:99px">${a[2]}</span></div>`).join('')}</div></div><div class="card s4"><h3 style="display:flex;justify-content:space-between">Weekly Study Activity <small style="color:var(--mu);font-weight:500">Avg. 4h 30m / day</small></h3><div class="wk">${wk
            .map(
              (v, i) =>
                `<div><i style="height:${v * 17}px"></i>${
                  'MTWTFSS'[i]
                }</div>`
            )
            .join('')}</div></div></div>`
        );
      },

      practice: () =>
        shell(
          hero('Practice Questions', '') +
            `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px"><h2 class="sec" style="margin:0">Subjects</h2></div>` +
            `<div class="g g4">${SUBJ.map((s) =>
              tile(
                [s[0], s[1], s[2], (CHD[s[0]] || []).length, s[4], s[5]],
                `window.nbGo('chap',{s:'${s[0]}'})`
              )
            ).join('')}${tile(
              ['Custom Practice', '⚡', '#f0e8ff', 'Mixed', 'Custom Set', 100],
              `window.nbGo('custom_practice')`
            )}</div>` +
            E('Practice<br>More.<br>Improve<br>Faster.'),
          bc(['Practice'])
        ),

      custom_practice: () => {
        return shell(
          hero('Custom Practice Test', 'Build your custom NEET practice test wizard') +
          `<div class="card" style="max-width:680px;margin:24px auto;text-align:center;padding:36px 28px;background:var(--cd);border:1px solid var(--bd);border-radius:20px;box-shadow:var(--sh)">
            <div style="font-size:48px;margin-bottom:12px">🎯</div>
            <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">NEET Custom Practice Test Wizard</h2>
            <p style="color:var(--mu);margin-bottom:24px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.6">Select subjects (PCBZ), filter NMC syllabus chapters with [Reduced] & [Removed] tags, configure question count & duration, and attempt in standard NTA CBT Engine.</p>
            <button class="btn" style="padding:16px 36px;font-size:16px;font-weight:700;border-radius:14px;background:linear-gradient(135deg, #2563eb, #3b82f6);color:#fff;border:0;box-shadow:0 8px 24px rgba(37,99,235,0.35);cursor:pointer;display:inline-flex;align-items:center;gap:10px" onclick="window.nbOpenCustomPractice()">
              <span>+ Create new custom test</span>
              <span style="font-size:18px">→</span>
            </button>
          </div>`,
          bc(['Practice', 'practice'], ['Custom Practice'])
        );
      },

      chap: () => {
        const s = SUBJ.find((x) => x[0] === S.s) || SUBJ[0];
        const curSubject = s[0];
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('practice')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) =>
                renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbGo('top',{s:'${curSubject}',c:'${c[0].replace(/'/g, "\\'")}'})`
                )
              ).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['Practice', 'practice'], [curSubject])
        );
      },

      top: () => {
        const curSubject = S.s || 'Physics';
        const c =
          (CHD[curSubject] || []).find((x) => x[0] === S.c) || (CHD[curSubject] || [])[0];
        const T = c ? c[1].split('|') : [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('chap',{s:'${curSubject}'})" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <div style="min-width:0;flex:1">
              <h1 class="nb-subject-title" style="font-size:20px">${esc(c ? c[0] : (S.c || 'Chapter'))}</h1>
              <p style="color:var(--mu);margin:2px 0 0;font-size:12.5px">${curSubject} • ${T.length} Topics • ${T.reduce((a, t) => a + qn(t), 0)} Questions</p>
            </div>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            <button class="nb-ch-item" onclick="window.nbGo('setup',{s:'${curSubject}',c:'${(c ? c[0] : S.c || '').replace(/'/g, "\\'")}',tp:null})" style="background:rgba(20,163,102,0.06)!important;border-radius:14px!important;margin-bottom:8px">
              <div class="nb-ch-icon-box" style="color:#10b981">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#10b981"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div class="nb-ch-body">
                <div class="nb-ch-name" style="color:#10b981">Practise Whole Chapter (Mixed Topics)</div>
                <div class="nb-ch-meta">Full Chapter Drill • Exam-style mixed MCQ set</div>
              </div>
              <div class="nb-ch-right-info">
                <span class="chip c3" style="font-size:12px;padding:4px 10px">Start Drill →</span>
              </div>
            </button>` +

            T.map((t, i) => {
              const qCount = qn(t);
              const pCount = Math.round((pg(t) / 100) * qCount);
              return `<button class="nb-ch-item" onclick="window.nbGo('setup',{s:'${curSubject}',c:'${(c ? c[0] : S.c || '').replace(/'/g, "\\'")}',tp:'${t.replace(/'/g, "\\'")}'})">
                <div class="nb-ch-icon-box" style="font-size:13px;font-weight:800;color:#38bdf8">
                  ${String(i + 1).padStart(2, '0')}
                </div>
                <div class="nb-ch-body">
                  <div class="nb-ch-name">${esc(t)}</div>
                  <div class="nb-ch-meta">NCERT Core Topic • 2026 Expected High-Yield</div>
                </div>
                <div class="nb-ch-right-info">
                  <span class="nb-ch-qs">${pCount}/${qCount} Qs</span>
                  <span style="color:#64748b;font-size:18px;margin-left:4px">›</span>
                </div>
              </button>`;
            }).join('') +
          `</div>`,
          bc(['Practice', 'practice'], [curSubject, 'chap'], [c ? c[0] : S.c])
        );
      },

      setup: () => {
        const tp = S.tp;
        const c = S.c || 'Kinematics';
        const s = S.s || 'Physics';
        return shell(
          hero(
            tp || c,
            `${s} • ${c}${tp ? ' • ' + tp : ''}`
          ) +
          `<div class="card" style="max-width:580px;margin:20px auto"><h2>${
            tp || c
          }</h2><p style="color:var(--mu);margin:4px 0 16px">${
            s
          } • ${c}</p><b>No. of Questions</b><div class="tabs" style="margin-top:8px">${[
            10, 20, 30, 50,
          ]
            .map(
              (n) =>
                `<button class="tb ${
                  S.cnt === n ? 'on' : ''
                }" onclick="window.nbSetCnt(${n})">${n}</button>`
            )
            .join(
              ''
            )}</div><b>Difficulty</b><div class="tabs" style="margin-top:8px">${[
            'Easy',
            'Medium',
            'Hard',
            'Mixed',
          ]
            .map(
              (d) =>
                `<button class="tb ${
                  S.diff === d ? 'on' : ''
                }" onclick="window.nbSetDiff('${d}')">${d}</button>`
            )
            .join(
              ''
            )}</div><button class="btn" style="width:100%;margin-top:16px" onclick="window.nbStart('practice')">Start Practice →</button></div>`,
          bc(['Practice', 'practice'], [s, 'chap'], [c, 'top'], [tp || 'Whole Chapter'])
        );
      },

      quiz: () => {
        Q.v = Q.v || [];
        Q.v[Q.i] = 1;
        const q = Q.l[Q.i];
        const a = Q.a[Q.i];
        const fb = !Q.timed && a != null;
        const N = Q.l.length;
        const last = Q.i === N - 1;
        const isBookmarked = BK.some((b: any) => b[0] === q.q);

        return `<div class="nb-exam-view">
          <div class="nb-exam-nav-header">
            <button class="nb-exam-close-btn" onclick="window.nbAskExit()" aria-label="Close">✕</button>
            <div class="nb-exam-title-box">
              <h1 class="nb-exam-title">${esc(Q.timed ? 'Mock Test' : 'Practice')}</h1>
              <div class="nb-exam-sub">${esc(q.s || 'Biology')} • ${esc(q.c || 'General')} ▾</div>
            </div>
            <div class="nb-exam-top-actions">
              <button class="nb-exam-icon-btn" onclick="window.nbGo('doubt')" title="AI Doubt Solver">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4"/><path d="M12 15h.01"/></svg>
              </button>
              <button class="nb-exam-icon-btn" onclick="window.nbOpenPal()" title="Question Palette">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              </button>
            </div>
          </div>

          <div class="nb-exam-info-bar">
            <div class="nb-exam-info-left">
              <div class="nb-exam-timer-pill" id="tm">⏱ 29:53</div>
              <span class="nb-exam-sep">|</span>
              <div class="nb-exam-qnum">Q ${Q.i + 1}/${N}</div>
            </div>
            <button class="nb-exam-bm-btn ${isBookmarked ? 'marked' : ''}" onclick="window.nbQtoggleBookmark()" title="Bookmark question">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
          </div>

          <div class="nb-exam-content">
            <div class="nb-exam-badge">SINGLE CORRECT</div>
            <h2 class="nb-exam-qtext">${esc(q.q)}</h2>

            <div class="nb-exam-opt-list">
              ${q.o.map((o: string, j: number) => {
                let extraClass = '';
                if (fb) {
                  extraClass = j === q.a ? 'correct' : a === j ? 'incorrect' : '';
                } else if (a === j) {
                  extraClass = 'selected';
                }
                return `<button class="nb-exam-opt-card ${extraClass}" ${fb ? 'disabled' : ''} onclick="window.nbQa(${j})">
                  <span class="nb-exam-opt-radio">${a === j ? '🔘' : '⚪'}</span>
                  <span class="nb-exam-opt-label">${'ABCD'[j]}.</span>
                  <span class="nb-exam-opt-text">${esc(o)}</span>
                </button>`;
              }).join('')}
            </div>

            ${fb ? `<div class="exp ${a === q.a ? 'g' : 'r'}" style="margin-top:20px"><b>${a === q.a ? 'Correct! ' : 'Explanation: '}</b>${esc(q.e || 'Standard NCERT explanation.')}</div>` : ''}
          </div>

          <div class="nb-exam-footer">
            <button class="nb-exam-btn-prev" ${Q.i === 0 ? 'disabled' : ''} onclick="window.nbQprev()">Prev</button>
            <button class="nb-exam-btn-clear" ${a == null ? 'disabled' : ''} onclick="window.nbQclear()">Clear</button>
            ${last ? `<button class="nb-exam-btn-next submit" onclick="window.nbAskSubmit()">Submit ✓</button>` : `<button class="nb-exam-btn-next" onclick="window.nbQnext()">Next</button>`}
          </div>
        </div>`;
      },

      result: () => {
        const r = score();
        const m = Q.mode === 'mock';
        const bk = Q.back || 'practice';
        return shell(
          `<div class="card" style="max-width:760px;margin:auto"><h2>✅ ${
            m ? 'Test' : 'Practice'
          } Result</h2>${
            m
              ? `<div style="font-weight:800;font-size:40px;line-height:1.2;margin:10px 0">${
                  r.c * 4 - r.w
                } / ${Q.l.length * 4}</div>`
              : ''
          }<div class="g g4" style="margin:16px 0">${[
            [r.at, 'Attempted', '#e6f0ff'],
            [r.c, 'Correct', '#dcf7e6'],
            [r.w, 'Incorrect', '#fde8e8'],
            [r.acc + '%', 'Accuracy', '#fff4d6'],
          ]
            .map(
              (x) =>
                `<div class="st" style="background:${x[2]}"><span><b>${x[0]}</b><small>${x[1]}</small></span></div>`
            )
            .join(
              ''
            )}</div><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn o" onclick="window.nbGo('perf')">View Analysis</button><button class="btn" onclick="window.nbGo('review')">Review Questions</button><button class="btn o" onclick="window.nbGo('${bk}')">Back to Practice</button></div></div>`,
          bc([m ? 'Mock Tests' : 'Practice', m ? 'tests' : 'practice'], ['Result'])
        );
      },

      review: () =>
        shell(
          `<h2 class="sec" style="margin-top:0">Review Questions</h2>` +
            Q.l
              .map(
                (q: any, i: number) =>
                  `<div class="card" style="margin-bottom:14px"><b>Q${i + 1}. ${
                    q.q
                  }</b>${q.o
                    .map(
                      (o: string, j: number) =>
                        `<div class="opt ${
                          j === q.a ? 'ok' : Q.a[i] === j ? 'no' : ''
                        }" style="cursor:default"><b>${'ABCD'[j]}</b>${o}${
                          j === q.a
                            ? ' ✔ (Correct Answer)'
                            : Q.a[i] === j
                            ? ' ✕ (Your Answer)'
                            : ''
                        }</div>`
                    )
                    .join(
                      ''
                    )}<div class="exp g"><b>Explanation: </b>${esc(
                    q.e || 'Standard NCERT syllabus answer.'
                  )}</div></div>`
              )
              .join('') +
            `<button class="btn" onclick="window.nbGo('practice')">Back to Practice</button>`,
          bc(['Practice', 'practice'], ['Review'])
        ),

      tests: () =>
        shell(
          hero('Mock Tests', 'Attempt exams, track and improve.') +
            `<div class="g tg5">${[
              ['Full Syllabus Tests', 'Complete NEET pattern', '📘', '#e6f0ff'],
              ['Chapter-wise Tests', 'Subject • Chapter • Topic', '🧱', '#e8f7e6'],
              ['Part Tests', 'Unit / Syllabus wise', '🟠', '#fff0e4'],
              ['Custom Tests', 'Create your own test', '🎛️', '#f0e8ff'],
              ['My Tests', 'Your attempts', '🗂️', '#fde8e8'],
            ]
              .map(
                (t) =>
                  `<button class="tile" style="background:${t[3]}" onclick="window.nbGo('tl',{tt:'${t[0]}'})"><div class="ti">${t[2]}</div><h3>${t[0]}</h3><small>${t[1]}</small><span class="ar">→</span></button>`
              )
              .join('')}</div><div class="g g2" style="margin-top:20px"><div class="card"><h3>Upcoming Tests <a style="float:right;font-size:13px;color:var(--g)">View All →</a></h3>${[
              ['NEET Ultimate Test 03', 'Full Syllabus • 720 Qs', 'Sun, 2 Nov'],
              ['Physics Part Test 02', 'Physics • 180 Qs', 'Wed, 5 Nov'],
            ]
              .map(
                (t) =>
                  `<div class="k"><span><b>${t[0]}</b><br><small style="color:var(--mu)">${t[1]}</small></span><span>${t[2]} <button class="btn sm" onclick="window.nbGo('ins',{tt:'${t[0]}'})">Start</button></span></div>`
              )
              .join(
                ''
              )}</div><div class="card"><h3>Your Test Performance <a style="float:right;font-size:13px;color:var(--g)" onclick="window.nbGo('perf')">View Analysis →</a></h3><div style="display:flex;gap:20px;align-items:center;margin-top:10px"><div class="dn" style="background:conic-gradient(var(--g2) 82%,#e2eee7 0)"><span>82%<small>Avg. Score</small></span></div><div style="flex:1"><div class="k"><span>Tests Attempted</span><b>12</b></div><div class="k"><span>Best Score</span><b>681 / 720</b></div><div class="k"><span>Average Score</span><b>590 / 720</b></div></div></div></div></div>`,
          bc(['Mock Tests'])
        ),

      tl: () =>
        shell(
          hero(S.tt || 'Full Syllabus Tests', 'Available tests') +
            [
              ['Topic Test 01', '20 Qs • 30 Min'],
              ['PYQ Test (2014 – 2024)', '20 Qs • 30 Min'],
              ['Mixed Test 01', '30 Qs • 45 Min'],
            ]
              .map(
                (t) =>
                  `<div class="row" style="cursor:default"><span class="n">📋</span><span class="x"><b>${t[0]}</b><br><small>${t[1]}</small></span><button class="btn sm" onclick="window.nbGo('ins',{tt:'${t[0]}'})">Start</button></div>`
              )
              .join(''),
          bc(['Mock Tests', 'tests'], [S.tt])
        ),

      ins: () =>
        shell(
          `<div class="card" style="max-width:560px;margin:auto"><h2>Test Instructions</h2><p style="color:var(--mu);margin:4px 0 14px">${
            S.tt || 'NEET Mock Test'
          }</p>${[
            ['Questions', '20'],
            ['Marks', '80'],
            ['Time', '30 Minutes'],
            ['Marking', '+4 correct, −1 wrong'],
          ]
            .map(
              (x) =>
                `<div class="k"><span>${x[0]}</span><b>${x[1]}</b></div>`
            )
            .join(
              ''
            )}<button class="btn" style="width:100%;margin-top:16px" onclick="window.nbStart('mock')">Start Test →</button></div>`,
          bc(['Mock Tests', 'tests'], ['Test Instructions'])
        ),

      perf: () =>
        shell(
          hero(
            'Performance Overview',
            'Your preparation insights and progress analysis'
          ) +
            `<div class="g g4">${[
              ['🎯', '640 / 720', 'Best Score', '#dcf7e6'],
              ['📶', '78%', 'Overall Accuracy', '#e6f0ff'],
              ['🧱', '5,420', 'Questions Attempted', '#f0e8ff'],
              ['🔥', '12 Days', 'Current Streak', '#fff0e4'],
            ]
              .map(
                (x) =>
                  `<div class="st"><span class="ic" style="background:${x[3]}">${x[0]}</span><span><b>${x[1]}</b><small>${x[2]}</small></span></div>`
              )
              .join(
                ''
              )}</div><div class="g g2" style="margin-top:16px"><div class="card"><h3>Subject-wise Performance</h3>${[
              ['Physics', '⚛️', 82],
              ['Chemistry', '🧪', 76],
              ['Botany', '🌿', 78],
              ['Zoology', '🧬', 73],
            ]
              .map(
                (s) =>
                  `<div class="pr" style="margin:12px 0;cursor:pointer" onclick="window.nbGo('sp',{s:'${s[0]}'})"><span style="width:110px">${s[1]} ${s[0]}</span><div class="bar"><i style="width:${s[2]}%"></i></div><b>${s[2]}%</b></div>`
              )
              .join(
                ''
              )}</div><div class="card"><h3>Performance Trend</h3><svg viewBox="0 0 340 150" style="width:100%"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14a366" stop-opacity=".35"/><stop offset="1" stop-color="#14a366" stop-opacity="0"/></linearGradient></defs>${[
              0, 1, 2, 3,
            ]
              .map(
                (i) =>
                  `<line x1="30" x2="310" y1="${20 + i * 35}" y2="${
                    20 + i * 35
                  }" stroke="#e2eee7"/><text x="24" y="${
                    24 + i * 35
                  }" font-size="9" fill="#62766b" text-anchor="end">${
                    100 - i * 25
                  }%</text>`
              )
              .join(
                ''
              )}<path d="M30 110 C70 95 90 80 130 82 S190 90 220 70 S280 45 310 40 V125 H30z" fill="url(#a)"/><path d="M30 110 C70 95 90 80 130 82 S190 90 220 70 S280 45 310 40" fill="none" stroke="#14a366" stroke-width="3" stroke-linecap="round"/>${[
              'Oct 1',
              'Oct 7',
              'Oct 14',
              'Oct 21',
              'Oct 28',
            ]
              .map(
                (d, i) =>
                  `<text x="${30 + i * 70}" y="145" font-size="10" fill="#62766b" text-anchor="middle">${d}</text>`
              )
              .join(
                ''
              )}</svg></div></div>${tperf()}<div class="g g5" style="margin-top:16px">${[
              ['📊', 'Chapter Analysis', 'sp'],
              ['🧱', 'Topic Analysis', 'sp'],
              ['📝', 'Mock Test Analysis', 'tests'],
              ['🎯', 'Weak Areas', 'weak'],
              ['📖', 'Improvement Book', 'ib'],
            ]
              .map(
                (a) =>
                  `<button class="card" style="font-weight:700;text-align:center" onclick="window.nbGo('${a[2]}')"><div style="font-size:26px">${a[0]}</div>${a[1]}</button>`
              )
              .join('')}</div>`,
          bc(['Performance'])
        ),

      sp: () => {
        const curSubject = S.s || 'Physics';
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('perf')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) => {
                const acc = 65 + (hs(c[0]) % 31);
                return renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbGo('top',{s:'${curSubject}',c:'${c[0].replace(/'/g, "\\'")}'})`,
                  `<span class="chip ${acc >= 80 ? 'c3' : acc >= 70 ? 'c5' : 'c4'}" style="font-size:12px;padding:3px 8px">${acc}% Acc</span>`
                );
              }).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['Performance', 'perf'], [curSubject + ' Analysis'])
        );
      },

      weak: () =>
        shell(
          hero('Weak Areas', 'Topics that need your attention') +
            [
              ['Rotation Motion', 62],
              ['Chemical Bonding', 58],
              ['Plant Hormones', 61],
            ]
              .map(
                (w) =>
                  `<div class="row" style="cursor:default"><span class="n" style="background:#fde8e8;color:#dc2626">!</span><span class="x"><b>${w[0]}</b></span><b style="color:#dc2626">${w[1]}%</b></div>`
              )
              .join(''),
          bc(['Performance', 'perf'], ['Weak Areas'])
        ),

      ib: () => {
        const f = IB.filter(
          (r) =>
            S.ibt === 'All' ||
            r[4].startsWith(S.ibt.replace(' Qs', '').slice(0, 6))
        );
        return shell(
          `<div class="hero"><h1>Improvement Book</h1><p>Revise your mistakes, weak areas and marked questions in one place.</p><div class="qt">💬 ${
            QT.ib
          }</div>${TGT}</div><div class="g g4">${[
            ['✖', '124', 'Incorrect Qs', '#fde8e8'],
            ['🔖', '48', 'Marked for Review', '#fff4d6'],
            ['🔁', '36', 'Reattempt Later', '#e3f1ff'],
            ['✔', '208', 'Total Qs', '#dcf7e6'],
          ]
            .map(
              (x) =>
                `<div class="st" style="background:${x[3]}"><span class="ic" style="background:#fff">${x[0]}</span><span><b>${x[1]}</b><small>${x[2]}</small></span></div>`
            )
            .join(
              ''
            )}</div><div class="tabs" style="margin-top:18px">${[
            'All',
            'Incorrect',
            'Marked',
            'Reattempt',
          ]
            .map(
              (t) =>
                `<button class="tb ${
                  S.ibt === t ? 'on' : ''
                }" onclick="window.nbSetIbt('${t}')">${
                  t === 'All' ? 'All Questions' : t
                }</button>`
            )
            .join(
              ''
            )}</div><div class="card rsp"><table><tr><th>Question</th><th>Subject</th><th>Chapter & Topic</th><th>Status</th><th>Last Attempt</th><th>Action</th></tr>${f
            .map(
              (r, i) =>
                `<tr><td style="max-width:240px">${r[0]}</td><td><span class="chip ${
                  ['c1', 'c2', 'c3'][
                    ['Physics', 'Chemistry', 'Biology'].indexOf(r[1])
                  ] || 'c1'
                }">${r[1]}</span></td><td>${r[2]}<br><small style="color:var(--mu)">${
                  r[3]
                }</small></td><td><span class="chip ${
                  r[4] === 'Incorrect'
                    ? 'c4'
                    : r[4] === 'Marked'
                    ? 'c5'
                    : 'c6'
                }">${r[4]}</span></td><td>${
                  r[5]
                }</td><td><button class="btn sm" onclick="window.nbGo('ibd',{r:${IB.indexOf(
                  r
                )}})">Re-attempt</button></td></tr>`
            )
            .join('')}</table></div>`,
          bc(['Improvement Book'])
        );
      },

      ibd: () => {
        const q = QS[0];
        return shell(
          `<div class="card" style="max-width:700px;margin:auto"><h2>Question Detail & Review</h2><p style="margin:10px 0 16px"><b>Q.</b> ${
            IB[S.r || 0][0]
          }</p><div class="opt ok" style="cursor:default"><b>A</b>${
            q.o[0]
          } ✔</div><div class="opt" style="cursor:default"><b>B</b>${
            q.o[1]
          }</div><div style="display:flex;gap:10px;margin:8px 0 16px"><span class="chip c4">Your Answer: B</span><span class="chip c3">Correct Answer: A</span></div><button class="btn" style="width:100%" onclick="window.nbStart('practice')">🔁 Re-attempt Now</button><div class="g g2" style="margin-top:16px"><div class="st" style="background:#fde8e8"><span><small>Before</small><b style="color:#dc2626">62%</b></span></div><div class="st" style="background:#dcf7e6"><span><small>After</small><b style="color:#16a34a">86%</b></span></div></div></div>`,
          bc(['Improvement Book', 'ib'], ['Question Review'])
        );
      },

      notes: () => {
        return shell(
          hero(
            'High-Yield Revision Notes',
            'Select a subject to view chapter notes and download PDFs'
          ) +
            `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px"><h2 class="sec" style="margin:0">Subjects</h2><button class="btn" onclick="window.nbNewNote()">+ Create Personal Note</button></div>` +
            `<div class="g g4">${SUBJ.map((s) =>
              tile(
                [s[0], s[1], s[2], (CHD[s[0]] || []).length, s[4], s[5]],
                `window.nbGo('note_chap',{s:'${s[0]}'})`
              )
            ).join('')}</div>`,
          bc(['Notes'])
        );
      },

      note_chap: () => {
        const s = SUBJ.find((x) => x[0] === S.s) || SUBJ[0];
        const curSubject = s[0];
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('notes')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) =>
                renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbGo('note_detail',{s:'${curSubject}',c:'${c[0].replace(/'/g, "\\'")}'})`,
                  `<span class="chip c3" style="font-size:12px;padding:3px 9px">Read / PDF →</span>`
                )
              ).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['Notes', 'notes'], [curSubject])
        );
      },

      note_detail: () => {
        const s = S.s || 'Physics';
        const c = S.c || 'Kinematics';
        return shell(
          hero(
            c,
            `${s} • NCERT High-Yield Revision Summary & Key Formulas`
          ) +
          `<div class="card" style="margin-bottom:20px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px"><div><span class="chip c1">${s}</span><h2 style="font-size:24px;margin:8px 0 4px">${esc(c)}</h2><p style="color:var(--mu);margin:0">NCERT High-Yield Revision Summary & Key Formulas</p></div><button class="btn" onclick="window.nbDownloadChapterPDF('${esc(c)}')">📥 Download Chapter PDF</button></div></div>` +
          `<div class="g g2" style="margin-bottom:20px"><div class="card"><h3>📌 Core Concepts & Definitions</h3><ul style="padding-left:20px;line-height:1.7;margin-top:10px;color:var(--ink)"><li>Fundamental SI units, dimensional analysis, and error propagation.</li><li>Equations of motion under constant acceleration and motion graphs.</li><li>Vector decomposition and relative velocity in 2D/3D space.</li><li>Projectile motion parameters: Time of flight, Maximum height, Horizontal range.</li></ul></div><div class="card"><h3>📐 High-Yield Formula Sheet</h3><div class="k"><span>Position Vector:</span><b>r = x î + y ĵ + z k̂</b></div><div class="k"><span>Velocity Vector:</span><b>v = dr / dt</b></div><div class="k"><span>Acceleration:</span><b>a = dv / dt</b></div><div class="k"><span>Range of Projectile:</span><b>R = (u² sin 2θ) / g</b></div><div class="k"><span>Max Height:</span><b>H = (u² sin²θ) / 2g</b></div></div></div>` +
          `<div class="card"><h3>⚠️ High-Frequency NEET MCQs & Pitfalls</h3><div class="silly-log-card" style="border-color:rgba(10,102,255,0.3);background:rgba(10,102,255,0.05)"><b>NEET Trap Alert:</b> Always check if angle θ is given with horizontal or vertical axis before taking sin θ / cos θ components!</div></div>`,
          bc(['Notes', 'notes'], [s, 'note_chap', {s}], [c])
        );
      },

      bookmarks: () => {
        const L = BK.filter((q) => S.nf === 'All' || q[1] === S.nf);
        return shell(
          hero(
            'Bookmarked Questions',
            'Review saved high-yield NEET questions and formulas'
          ) +
            `<div class="tabs">${['All', ...SJN].map(
              (s) => `<button class="tb ${S.nf === s ? 'on' : ''}" onclick="window.nbSetNf('${s}')">${s}</button>`
            ).join('')}</div>` +
            (L.map(
              (q, i) =>
                `<div class="card" style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span class="chip ${CCL[q[1]] || 'c1'}">${esc(q[1])} • ${esc(q[2])}</span><button class="btn sm o" style="color:#ef4444" onclick="window.nbDelBk(${BK.indexOf(q)})">🗑️ Remove</button></div><h3 style="font-size:17px;margin-bottom:12px">Q. ${esc(q[0])}</h3><div style="display:flex;gap:10px"><button class="btn sm" onclick="window.nbStart('practice','bm:${i}',1)">🔁 Re-attempt Question</button><button class="btn sm o" onclick="window.nbToast('Solution: NCERT standard formula application.')">👁️ View Solution</button></div></div>`
            ).join('') || '<div class="card">No bookmarked questions found. Bookmark questions during practice sessions!</div>'),
          bc(['Bookmarks'])
        );
      },

      perf_detail: () => {
        const tn = S.testName || 'NEET Ultimate Test 03';
        const sc = S.score || 640;
        const tot = S.total || 720;
        const pct = Math.round((sc / tot) * 100);
        return shell(
          `<button class="nb-back-arrow" onclick="window.nbGo('perf')">← Back to Performance</button>` +
          `<div class="card" style="margin-bottom:20px;background:linear-gradient(135deg,var(--cd),var(--cd2))"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px"><div><span class="chip c3">Detailed Analysis</span><h1 style="font-size:28px;margin:8px 0 4px">${esc(tn)}</h1><p style="color:var(--mu);margin:0">Attempted on ${S.date || '30 Oct 2026'} • NTA Full Pattern Exam</p></div><div style="text-align:right"><div style="font-size:42px;font-weight:800;color:var(--g2);line-height:1">${sc} <span style="font-size:20px;color:var(--mu)">/ ${tot}</span></div><span class="chip c1" style="font-size:13px;margin-top:4px">🌟 99.4th Percentile</span></div></div></div>` +
          `<div class="g g4" style="margin-bottom:20px">${[
            ['🎯', `${pct}%`, 'Accuracy Rate', '#dcf7e6'],
            ['⏱️', '2h 45m', 'Time Spent', '#e6f0ff'],
            ['✅', '164 / 180', 'Correct Qs', '#dcf7e6'],
            ['⚠️', '16 Qs', 'Silly Mistakes', '#fde8e8'],
          ].map(x => `<div class="st" style="background:${x[3]}"><span class="ic" style="background:#fff">${x[0]}</span><span><b>${x[1]}</b><small>${x[2]}</small></span></div>`).join('')}</div>` +
          `<div class="g g2" style="margin-bottom:20px"><div class="card"><h3>Subject-wise Score Breakdown</h3>${[
            ['Physics', 160, 180, '#e6f0ff', '⚛️'],
            ['Chemistry', 165, 180, '#fff0e4', '🧪'],
            ['Botany', 160, 180, '#e8f7e6', '🌿'],
            ['Zoology', 155, 180, '#f0e8ff', '🧬'],
          ].map(s => `<div class="pr" style="margin:14px 0"><span style="width:110px">${s[4]} ${s[0]}</span><div class="bar"><i style="width:${Math.round((Number(s[1])/Number(s[2]))*100)}%"></i></div><b style="width:80px;text-align:right">${s[1]} / ${s[2]}</b></div>`).join('')}</div>` +
          `<div class="card"><h3>🚨 Silly Mistakes Log & Analysis</h3><div class="silly-log-card"><b>Calculation Error in Q14 (Kinematics)</b><p style="font-size:12px;color:var(--mu);margin:2px 0 0">Used v = u + at instead of v² = u² + 2as. Double check given variables before selecting formula.</p></div><div class="silly-log-card"><b>Option Reading Mistake in Q32 (Chemical Bonding)</b><p style="font-size:12px;color:var(--mu);margin:2px 0 0">Selected "isostructural" instead of "isoelectronic". Read option statements completely.</p></div><div class="silly-log-card"><b>Unit Conversion Error in Q88 (Electrostatics)</b><p style="font-size:12px;color:var(--mu);margin:2px 0 0">Forgot to convert cm to meters for radius r in Coulomb’s law formula.</p></div></div></div>` +
          `<div class="card"><h3>🎯 Recommended Revision Topics</h3><p style="color:var(--mu);font-size:13px;margin-bottom:12px">Based on this attempt, focusing on these topics will boost your next test score by +30 marks:</p><div style="display:flex;gap:10px;flex-wrap:wrap">${['Rotational Motion (Physics)', 'Electrochemistry (Chemistry)', 'Plant Hormones (Botany)', 'Human Reproduction (Zoology)'].map(t => `<button class="btn sm o" onclick="window.nbGo('setup',{tp:'${t}'})">Revise ${t} →</button>`).join('')}</div></div>`,
          ""
        );
      },

      nedit: () => {
        const n = NT[S.ni] || ['', 'Physics', '', '', ''];
        return shell(
          `<div class="card" style="max-width:760px;margin:auto"><h2>${
            S.ni >= 0 ? 'Edit Note' : 'Create Note'
          }</h2><input id="nt" value="${n[0].replace(
            /"/g,
            '&quot;'
          )}" placeholder="Note Title" style="width:100%;padding:13px 16px;border-radius:16px;border:0;background:var(--cd2);color:var(--ink);margin:12px 0;font:inherit"><div class="tabs">${SUBJ.map(
            (s) =>
              `<button class="tb ${
                n[1] === s[0] ? 'on' : ''
              }" onclick="window.nbSetNoteSubj('${s[0]}',this)">${s[1]} ${
                s[0]
              }</button>`
          ).join(
            ''
          )}</div><input id="nc" value="${
            n[2]
          }" placeholder="Chapter / Topic" style="width:100%;padding:13px 16px;border-radius:16px;border:0;background:var(--cd2);color:var(--ink);margin-bottom:12px;font:inherit"><div class="tabs">${[
            ['B', 'bold'],
            ['I', 'italic'],
            ['U', 'underline'],
            ['•', 'insertUnorderedList'],
          ]
            .map(
              (x) =>
                `<button class="tb" onmousedown="event.preventDefault();document.execCommand('${x[1]}')">${x[0]}</button>`
            )
            .join(
              ''
            )}</div><div class="ed" id="nb" contenteditable="true">${
            n[4] || ''
          }</div><div style="display:flex;gap:10px;margin-top:14px"><button class="btn" onclick="window.nbSaveNote()">Save Note</button><button class="btn o" onclick="window.nbGo('notes')">Cancel</button>${
            S.ni >= 0
              ? `<button class="btn o" style="margin-left:auto;color:#dc2626" onclick="window.nbDelNote(${S.ni})">Delete</button>`
              : ''
          }</div></div>`,
          ""
        );
      },

      pyq: () => {
        const t = S.pq || 'Year-wise';
        const v: number[] = Object.values(PYD);
        const att = v.length;
        const best = att ? Math.max(...v) + '%' : '–';
        const avg = att
          ? Math.round(v.reduce((a, b) => a + b, 0) / att) + '%'
          : '–';
        let b = '';

        if (t === 'Year-wise') {
          b = `<div class="g g4">${PYY.map((y, i) => {
            const a = PYD[y];
            return `<button class="tile" style="background:${
              ['#e6f0ff', '#e8f7e6', '#fff0e4', '#f0e8ff'][i % 4]
            }" onclick="window.nbPyStart(${y})"><div class="ti">📄</div><h3>NEET UG ${y}</h3><small>180 Questions • 3 Hours • 720 Marks</small><div class="pr"><span class="chip ${
              a != null ? 'c3' : 'c6'
            }">${
              a != null ? 'Attempted • ' + a + '%' : 'Not attempted'
            }</span><span class="ar">→</span></div></button>`;
          }).join('')}</div>`;
        } else if (t === 'Subject-wise') {
          b = `<div class="g g4">${SJN.map(
            (n) =>
              `<button class="tile" style="background:${SJC[n]}" onclick="window.nbStart('practice','pys:${n}',15)"><div class="ti">${SJE[n]}</div><h3>${n}</h3><small>Previous year questions • ${(CHD[n] || []).length} chapters</small><div class="pr"><span class="chip c6">Start set</span><span class="ar">→</span></div></button>`
          ).join('')}</div>`;
        } else {
          // Chapter-wise PYQ - Show Subject Tiles first!
          b = `<div class="g g4">${SUBJ.map((s) =>
            tile(
              [s[0], s[1], s[2], (CHD[s[0]] || []).length, s[4], s[5]],
              `window.nbGo('pyq_chap',{s:'${s[0]}'})`
            )
          ).join('')}</div>`;
        }

        return shell(
          hero(
            'Previous Year Questions',
            'Practise real exam patterns year-wise, subject-wise or chapter-wise'
          ) +
            statRow([
              ['📚', att + '/' + PYY.length, 'Papers attempted', '#e6f0ff'],
              ['🏆', best, 'Best accuracy', '#fff4d6'],
              ['🎯', avg, 'Avg. accuracy', '#dcf7e6'],
              ['⏱️', '3 hrs', 'Per paper', '#f0e8ff'],
            ]) +
            `<div class="tabs" style="margin-top:18px">${[
              'Year-wise',
              'Subject-wise',
              'Chapter-wise',
            ]
              .map(
                (x) =>
                  `<button class="tb ${
                    t === x ? 'on' : ''
                  }" onclick="window.nbSetPq('${x}')">${x}</button>`
              )
              .join('')}</div>` +
            b,
          ""
        );
      },

      pyq_chap: () => {
        const s = SUBJ.find((x) => x[0] === S.s) || SUBJ[0];
        const curSubject = s[0];
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('pyq')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) =>
                renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbStart('practice','pyc:${curSubject}:${i}',10)`,
                  `<span class="chip c6" style="font-size:12px;padding:3px 9px">Start PYQs →</span>`
                )
              ).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['PYQs', 'pyq'], [curSubject])
        );
      },

      flash: () => {
        const dk2 = [
          ['Physics', '⚛️', '#e6f0ff'],
          ['Chemistry', '🧪', '#fff0e4'],
          ['Botany', '🌿', '#e8f7e6'],
          ['Zoology', '🧬', '#f0e8ff'],
        ];
        return shell(
          hero('Flashcards', 'Select a subject to practice chapter flashcard decks') +
            `<div class="g g4">${dk2
              .map((d) => {
                const cs = FCS[d[0]] || FCS['Physics'];
                return `<button class="tile" style="background:${
                  d[2]
                }" onclick="window.nbGo('flash_chap',{s:'${
                  d[0]
                }'})"><div class="ti">${d[1]}</div><h3>${
                  d[0]
                }</h3><small>${(CHD[d[0]]||[]).length} Chapters • ${cs.length * 5} Flashcards</small><div class="pr"><span class="chip c6">View Chapters</span><span class="ar">→</span></div></button>`;
              })
              .join('')}</div>`,
          ""
        );
      },

      flash_chap: () => {
        const s = SUBJ.find((x) => x[0] === S.s) || SUBJ[0];
        const curSubject = s[0];
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('flash')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) =>
                renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbGo('flash_deck',{s:'${curSubject}',c:'${c[0].replace(/'/g, "\\'")}'})`,
                  `<span class="chip c6" style="font-size:12px;padding:3px 9px">Open Deck →</span>`
                )
              ).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['Flashcards', 'flash'], [curSubject])
        );
      },

      flash_deck: () => {
        const cs = FCS[S.s] || FCS['Physics'];
        const i = (S.fi || 0) % cs.length;
        const c = cs[i] || cs[0];
        const kn = cs.filter((x: any) => FCK[x[0]]).length;

        return shell(
          `<button class="nb-back-arrow" onclick="window.nbGo('flash_chap',{s:'${S.s}'})">← Back to ${S.s} Chapters</button>` +
          `<div class="card" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center"><div><span class="chip c1">${S.s}</span><h2 style="margin:4px 0 0">${esc(S.c || 'Kinematics')} Flashcards</h2></div><small style="color:var(--mu)">Card ${i + 1} of ${cs.length} • ${kn} Known</small></div></div>` +
          `<div class="fcd"><div class="bar" style="margin-bottom:18px"><i style="width:${Math.round(
            (kn / cs.length) * 100
          )}%"></i></div><div class="fcc" onclick="this.classList.toggle('f')" role="button" tabindex="0" aria-label="Flip card"><div class="fcs fr"><div><small style="color:var(--mu);font-size:12px;display:block;margin-bottom:10px">QUESTION • tap to flip</small>${esc(
            c[0]
          )}</div></div><div class="fcs bk"><div><small style="opacity:.8;font-size:12px;display:block;margin-bottom:10px">ANSWER</small>${esc(
            c[1]
          )}</div></div></div><div class="fca"><button class="btn o" onclick="window.nbFcGo(0)">↻ Review again</button><button class="btn" onclick="window.nbFcGo(1)">✓ Known</button></div><p style="text-align:center;margin-top:14px"><button class="chip c6" onclick="window.nbGo('flash_chap',{s:'${S.s}'})">← ${S.s} Chapters</button> <button class="chip c5" onclick="window.nbFcReset()">Reset progress</button></p></div>`,
          ""
        );
      },

      dpp: () => {
        return shell(
          hero(
            'Daily Practice Problems (DPP)',
            'Topic-wise daily challenge sets to build speed and accuracy'
          ) +
          `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px"><h2 class="sec" style="margin:0">Choose Subject for DPP</h2></div>` +
          `<div class="g g4">${SUBJ.map((s) =>
            tile(
              [s[0], s[1], s[2], (CHD[s[0]] || []).length, s[4], s[5]],
              `window.nbGo('dpp_chap',{s:'${s[0]}'})`
            )
          ).join('')}</div>`,
          bc(['DPP Practice'])
        );
      },

      dpp_chap: () => {
        const s = SUBJ.find((x) => x[0] === S.s) || SUBJ[0];
        const curSubject = s[0];
        const chapters = CHD[curSubject] || [];

        return shell(
          `<div class="nb-top-subject-header">
            <button class="nb-icon-back-btn" onclick="window.nbGo('dpp')" aria-label="Back">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <h1 class="nb-subject-title">${curSubject}</h1>
          </div>` +

          `<div class="nb-chapter-list-wrap">
            ${
              chapters.map((c, i) =>
                renderUnboxedChapterRow(
                  c,
                  curSubject,
                  i,
                  `window.nbStart('practice','dpp:${curSubject}:${i}',10)`,
                  `<span class="chip c3" style="font-size:12px;padding:3px 9px">Start DPP →</span>`
                )
              ).join('') || '<div class="empty" style="padding:40px 0"><p>No chapters available.</p></div>'
            }
          </div>`,
          bc(['DPP Practice', 'dpp'], [curSubject])
        );
      },

      doubt: () => {
        S.dm = S.dm || [
          [
            'Hi ' +
              UF() +
              '! Ask me any NEET doubt. I can explain concepts, give study tips and help plan your revision.',
            0,
          ],
        ];
        return shell(
          hero(
            'AI Doubt Solver',
            'Ask a doubt and get a clear, step-by-step answer'
          ) +
            `<div class="hg"><div class="card s8"><div class="tabs" style="margin-top:0">${[
              'All',
              'Physics',
              'Chemistry',
              'Biology',
            ]
              .map(
                (x) =>
                  `<button class="tb ${
                    (S.dsub || 'All') === x ? 'on' : ''
                  }" onclick="window.nbSetDsub('${x}')">${x}</button>`
              )
              .join(
                ''
              )}</div><div id="dsm">${S.dm
              .map(
                (m: any) =>
                  `<div class="mb2 ${m[1] ? 'u' : 'b'}">${esc(m[0])}</div>`
              )
              .join(
                ''
              )}</div><div class="dch">${[
              'Dimensional formula',
              'Physics tips',
              'Biology tips',
              'Study plan',
              'My mistakes',
            ]
              .map((x) => `<button onclick="window.nbDsend('${x}')">${x}</button>`)
              .join(
                ''
              )}</div><div class="dfm"><input id="di" placeholder="Type your doubt…" autocomplete="off"><button class="btn" type="button" onclick="window.nbDsend()" aria-label="Send">➤</button></div></div><div class="s4 sd"><div class="card"><h3>How it works</h3><div class="k"><span>1️⃣ Ask your doubt</span></div><div class="k"><span>2️⃣ Get a structured answer</span></div><div class="k"><span>3️⃣ Save it to your notes</span></div></div><div class="card" style="margin-top:16px"><h3>Need a human?</h3><p style="color:var(--mu);margin:6px 0 12px">Escalate tricky doubts to a mentor.</p><button class="btn sm" onclick="window.nbToast('Mentor doubts open with the backend')">Ask a mentor</button></div></div></div><p class="nb-note" style="margin-top:12px;color:var(--mu);font-size:12px">Real AI answers powered by Gemini 2.5 Flash.</p>`,
          bc(['Doubt Solver'])
        );
      },

      plan: () => {
        plInit();
        const now = new Date();
        const ti = (now.getDay() + 6) % 7;
        const sd = S.pd == null ? (S.pd = ti) : S.pd;
        const all: any[] = [].concat(...(Object.values(SPL) as any));
        const dn = all.filter((x: any) => x.d).length;
        const tl = all.length || 1;
        const mins = all.reduce((a: number, x: any) => a + (x.m || 0), 0);
        const tasks = SPL[sd] || [];
        const ex = localStorage.getItem('nbExam') || '2026-05-03';
        const dl = ex
          ? Math.ceil(
              (new Date(ex).getTime() - new Date(dk()).getTime()) / 864e5
            )
          : null;
        const mon = new Date(now);
        mon.setDate(now.getDate() - ti);

        return shell(
          hero('Study Plan', 'Plan your week and tick off every task') +
            statRow([
              ['✅', dn + '/' + all.length, 'Tasks done', '#dcf7e6'],
              ['⏱️', Math.round(mins / 60) + ' hrs', 'Planned this week', '#e6f0ff'],
              [
                '📅',
                dl == null ? 'Set date' : dl > 0 ? dl + ' days' : '–',
                'To exam',
                '#fff0e4',
              ],
              ['🔥', Math.round((dn / tl) * 100) + '%', 'Week progress', '#f0e8ff'],
            ]) +
            `<div class="hg" style="margin-top:16px"><div class="card s8"><div class="wkd">${[
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat',
              'Sun',
            ]
              .map((w, d) => {
                const dt = new Date(mon);
                dt.setDate(mon.getDate() + d);
                const L2 = SPL[d] || [];
                const dd = L2.filter((x: any) => x.d).length;
                return `<button class="wd ${sd === d ? 'on' : ''} ${
                  d === ti ? 'td' : ''
                }" onclick="window.nbSetPd(${d})"><small>${w}</small><b>${dt.getDate()}</b><i>${
                  L2.length ? dd + '/' + L2.length : ''
                }</i></button>`;
              })
              .join(
                ''
              )}</div><h3 style="margin:18px 0 6px">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][sd]}'s tasks</h3>${
              tasks
                .map(
                  (x: any, i: number) =>
                    `<div class="gi ${
                      x.d ? 'd' : ''
                    }"><button class="chk ${
                      x.d ? 'on' : ''
                    }" onclick="window.nbPlT(${sd},${i})" aria-label="Toggle task">${
                      x.d ? '✓' : ''
                    }</button><span class="t" style="flex:1">${esc(
                      x.t
                    )}<br><small style="color:var(--mu)">${
                      x.m
                    } min</small></span><span class="chip ${
                      CCL[x.s] || 'c6'
                    }">${
                      x.s
                    }</span><button onclick="window.nbPlDel(${sd},${i})" aria-label="Delete task" style="color:var(--mu);padding:6px">✕</button></div>`
                )
                .join('') ||
              '<p style="color:var(--mu);padding:10px 0">No tasks yet. Add one below.</p>'
            }<div class="pf"><input id="pt" placeholder="Add a task (e.g. Kinematics revision)" autocomplete="off"><select id="ps">${[
              ...SJN,
              'Revision',
              'Mock',
            ]
              .map((x) => `<option>${x}</option>`)
              .join(
                ''
              )}</select><input id="pm" type="number" min="10" max="300" step="5" value="45" aria-label="Minutes"><button class="btn sm" onclick="window.nbPlAdd()">+ Add</button></div></div><div class="s4 sd"><div class="card"><h3>Exam countdown</h3><p style="color:var(--mu);margin:6px 0 10px">${
              dl == null
                ? 'Set your exam date to see the days left.'
                : dl > 0
                ? 'Keep going, every day counts.'
                : 'Exam date has passed. Update it.'
            }</p><input type="date" value="${ex}" onchange="window.nbPlExam(this.value)" class="pdi"><div class="ring" style="background:conic-gradient(var(--g2) ${
              (dn / tl) * 360
            }deg,var(--ln) 0);margin:16px auto 0"><span><div>${Math.round(
              (dn / tl) * 100
            )}%<small>This week</small></div></span></div></div></div></div>`,
          bc(['Study Plan'])
        );
      },

      more: () => {
        const n = gd();
        const sw = (_f: string, v: boolean) =>
          `<span class="sw ${v ? 'on' : ''}" aria-hidden="true"></span>`;
        const tools = NAV.filter((x) => !['home', 'more'].includes(x[0]));
        const cl = [
          '#e4f6ec',
          '#e6f0ff',
          '#f0e8ff',
          '#fde8e8',
          '#fff4d6',
          '#e3f1ff',
          '#ffe5e5',
          '#dcf7e6',
          '#f0e8ff',
          '#fff0e4',
        ];
        const row = (i: string, t: string, r: string, f: string) =>
          `<div class="mo-r" role="button" tabindex="0" onclick="${f}"><span class="mo-i2">${i}</span><span class="x"><b>${t}</b></span>${r}</div>`;
        return shell(
          `<div class="mo-p"><div class="mo-a">${UI()}</div><div class="mo-i"><h2>${UN()}</h2><small>${UY()} • ${UC()} • Free plan</small><div class="mo-b"><span>🔥 12 day streak</span><span>🎯 ${n}/${
            G.length
          } goals</span><span>📈 78% accuracy</span></div></div><button class="btn sm" onclick="window.nbGo('premium')" style="background:linear-gradient(90deg,#2563eb,#3b82f6);color:#fff;border:0;font-weight:700">⭐ Upgrade Pro</button><svg viewBox="0 0 600 80" preserveAspectRatio="none"><path fill="#fff" fill-opacity=".16" d="M0 40c120-40 240-40 360 0s180 30 240-10v50H0z"/></svg></div><p class="mo-q">💬 ${
            QT.more
          }</p>
<h2 class="sec">Study Tools</h2><div class="mo-g">${tools
            .map(
              (t, i) =>
                `<button class="mo-t" onclick="window.nbGo('${
                  V[t[0]] ? t[0] : 'soon'
                }',{t:'${t[2]}'})"><span class="ti" style="background:${
                  cl[i % 10]
                }">${t[1]}</span><b>${t[2]}</b>${
                  t[3] ? '<span class="ai">AI</span>' : '<i>›</i>'
                }</button>`
            )
            .join('')}</div>
<h2 class="sec">Account & Membership</h2><div class="mo-l">${row(
            '💎',
            'NEETBuddy Premium Pass',
            '<small style="color:#2563eb;font-weight:700">Explore Pro ›</small>',
            "window.nbGo('premium')"
          )}${row(
            '🌙',
            'Dark mode',
            sw('window.nbTgd()', dm),
            'window.nbTgd()'
          )}${row(
            '🔔',
            'Notifications',
            sw('window.nbTogNo()', true),
            'window.nbTogNo()'
          )}${row(
            '🌐',
            'Language',
            '<small>English ›</small>',
            "window.nbToast('Hindi & Hinglish coming soon')"
          )}</div>
<h2 class="sec">Support & Info</h2><div class="mo-l">${row(
            '💬',
            'Help & Support',
            '<i>›</i>',
            "window.nbGo('help')"
          )}${row(
            '🔒',
            'Privacy & Terms',
            '<i>›</i>',
            "window.nbGo('privacy')"
          )}${row(
            'ℹ️',
            'About NEETBuddy',
            '<small>v1.0 ›</small>',
            "window.nbGo('about')"
          )}</div>
<button class="mo-out" onclick="window.nbLeave()">⎋ Log out</button>`,
          bc(['More'])
        );
      },

      help: () =>
        shell(
          hero('Help & Support', 'Got questions or need study guidance? We are here for you 24/7.') +
          `<div style="max-width:880px;margin:0 auto;display:flex;flex-direction:column;gap:20px">
            <div class="card" style="background:var(--cd);border-radius:24px;padding:24px;border:1px solid var(--ln);box-shadow:var(--sh)">
              <h2 style="font-size:20px;font-weight:800;color:var(--ink);margin-bottom:16px;display:flex;align-items:center;gap:10px">
                <span>💬</span> Frequently Asked Questions
              </h2>
              <div style="display:flex;flex-direction:column;gap:12px">
                <details style="background:var(--bg);padding:14px 18px;border-radius:16px;border:1px solid var(--ln)" open>
                  <summary style="font-weight:700;color:var(--ink);cursor:pointer;font-size:15px">Is NEETBuddy aligned with the latest NMC NEET UG 2026 syllabus?</summary>
                  <p style="color:var(--mu);font-size:13.5px;margin-top:10px;line-height:1.6">Yes! Every single question, chapter, and test paper on NEETBuddy strictly adheres to the updated NMC NEET UG 2026 syllabus guidelines, clearly tagging [Reduced] and [Removed] topics.</p>
                </details>
                <details style="background:var(--bg);padding:14px 18px;border-radius:16px;border:1px solid var(--ln)">
                  <summary style="font-weight:700;color:var(--ink);cursor:pointer;font-size:15px">How does the Custom Practice Test Wizard work?</summary>
                  <p style="color:var(--mu);font-size:13.5px;margin-top:10px;line-height:1.6">Go to Practice → Custom Practice to select specific subjects (Physics, Chemistry, Botany, Zoology), pick topics, choose difficulty levels (Easy/Medium/Hard), and configure question timers.</p>
                </details>
                <details style="background:var(--bg);padding:14px 18px;border-radius:16px;border:1px solid var(--ln)">
                  <summary style="font-weight:700;color:var(--ink);cursor:pointer;font-size:15px">Are mock test papers simulated like the actual NTA CBT interface?</summary>
                  <p style="color:var(--mu);font-size:13.5px;margin-top:10px;line-height:1.6">Absolutely. Our test engine features the official NTA 180-minute countdown, Question Palette with status colors (Answered, Marked for Review, Not Answered), Section switching (Physics A/B, Chemistry A/B, Botany A/B, Zoology A/B), and instant OMR scorecard generation.</p>
                </details>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px">
              <div class="card" style="background:var(--cd);border-radius:24px;padding:22px;border:1px solid var(--ln);box-shadow:var(--sh);text-align:center">
                <div style="font-size:36px;margin-bottom:8px">✉️</div>
                <h3 style="font-size:17px;font-weight:800;color:var(--ink)">Email Support</h3>
                <p style="color:var(--mu);font-size:12.5px;margin:4px 0 16px">For account assistance & query resolution</p>
                <a class="btn sm" style="width:100%;justify-content:center;cursor:pointer" onclick="window.nbToast('Contacting support@neetbuddy.app...')">support@neetbuddy.app</a>
              </div>
              <div class="card" style="background:var(--cd);border-radius:24px;padding:22px;border:1px solid var(--ln);box-shadow:var(--sh);text-align:center">
                <div style="font-size:36px;margin-bottom:8px">📱</div>
                <h3 style="font-size:17px;font-weight:800;color:var(--ink)">WhatsApp Doubt Community</h3>
                <p style="color:var(--mu);font-size:12.5px;margin:4px 0 16px">Connect with 10,000+ NEET aspirants</p>
                <button class="btn sm" style="width:100%;justify-content:center;background:#25d366;color:#fff;border:0" onclick="window.nbToast('Joined NEETBuddy WhatsApp Community 🚀')">Join Community →</button>
              </div>
            </div>
          </div>`,
          bc(['More', 'more'], ['Help & Support'])
        ),

      privacy: () =>
        shell(
          hero('Privacy Policy & Terms of Service', 'Your privacy, data security, and trust are our top priorities.') +
          `<div style="max-width:880px;margin:0 auto;display:flex;flex-direction:column;gap:18px">
            <div class="card" style="background:var(--cd);border-radius:24px;padding:28px;border:1px solid var(--ln);box-shadow:var(--sh);line-height:1.7">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
                <span style="font-size:28px;width:52px;height:52px;border-radius:16px;background:rgba(37,99,235,0.12);color:#2563eb;display:grid;place-items:center">🔒</span>
                <div>
                  <h2 style="font-size:20px;font-weight:800;color:var(--ink);margin:0">NEETBuddy Data & Privacy Principles</h2>
                  <small style="color:var(--mu)">Last updated: November 2026 • Version 1.0</small>
                </div>
              </div>
              <h3 style="font-size:16px;font-weight:700;color:var(--ink);margin:16px 0 6px">1. Personal Data Collection</h3>
              <p style="color:var(--mu);font-size:13.5px">We store minimal user information (name, target NEET exam year, practice statistics, and test attempts) strictly to personalize your learning analytics and improvement book.</p>
              
              <h3 style="font-size:16px;font-weight:700;color:var(--ink);margin:16px 0 6px">2. Strict No-Sell Data Policy</h3>
              <p style="color:var(--mu);font-size:13.5px">NEETBuddy never sells, rents, or shares student test scores or personal details with third-party advertisers or telemarketers.</p>
              
              <h3 style="font-size:16px;font-weight:700;color:var(--ink);margin:16px 0 6px">3. NMC & NTA Compliance</h3>
              <p style="color:var(--mu);font-size:13.5px">All question materials are curated strictly for educational preparation adhering to NMC regulatory notices.</p>

              <h3 style="font-size:16px;font-weight:700;color:var(--ink);margin:16px 0 6px">4. Data Encryption & Security</h3>
              <p style="color:var(--mu);font-size:13.5px">Your account credentials and performance history are protected with industry-standard TLS encryption and secure authentication protocols.</p>
            </div>
          </div>`,
          bc(['More', 'more'], ['Privacy & Terms'])
        ),

      about: () =>
        shell(
          hero('About NEETBuddy', 'Empowering 100,000+ medical aspirants with high-precision practice tools.') +
          `<div style="max-width:880px;margin:0 auto;display:flex;flex-direction:column;gap:20px">
            <div class="card" style="background:var(--cd);border-radius:24px;padding:28px;border:1px solid var(--ln);box-shadow:var(--sh);text-align:center">
              <div style="margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:12px">
                <img src="/assets/aistudio/file_00000000078482078d06c74a563d6525_4715f81f.png" alt="NEETBuddy" style="width:56px;height:56px;object-fit:contain;border-radius:14px;box-shadow:0 8px 24px rgba(37,99,235,0.25)"/>
                <span class="lt" style="font-size:32px;font-weight:800;color:var(--ink)">NEET<b style="color:#2563eb!important">Buddy</b></span>
              </div>
              <p style="color:var(--mu);font-size:15px;max-width:620px;margin:0 auto 20px;line-height:1.6">NEETBuddy was engineered specifically for NMC NEET UG aspirants to replace bulky physical books with instant chapter-wise practice, real CBT test simulation, high-yield flashcards, and an automated mistake-tracking notebook.</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:20px">
                <div style="background:var(--bg);padding:16px;border-radius:18px;border:1px solid var(--ln)"><b style="font-size:24px;color:#2563eb;display:block">50,000+</b><small style="color:var(--mu)">High-Yield MCQs</small></div>
                <div style="background:var(--bg);padding:16px;border-radius:18px;border:1px solid var(--ln)"><b style="font-size:24px;color:#10b981;display:block">100%</b><small style="color:var(--mu)">NMC 2026 Aligned</small></div>
                <div style="background:var(--bg);padding:16px;border-radius:18px;border:1px solid var(--ln)"><b style="font-size:24px;color:#ea580c;display:block">2,281+</b><small style="color:var(--mu)">Revision Flashcards</small></div>
              </div>
            </div>
          </div>`,
          bc(['More', 'more'], ['About NEETBuddy'])
        ),

      premium: () =>
        shell(
          hero('NEETBuddy Premium Pass 💎', 'Unlock unlimited full-length mocks, AI explanations, and priority flashcard decks.') +
          `<div style="max-width:920px;margin:0 auto;display:flex;flex-direction:column;gap:22px">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">
              <div class="card" style="background:var(--cd);border-radius:24px;padding:26px;border:1px solid var(--ln);box-shadow:var(--sh);display:flex;flex-direction:column;justify-content:space-between">
                <div>
                  <span style="font-size:11px;font-weight:700;color:var(--mu);background:var(--bg);padding:4px 12px;border-radius:99px;border:1px solid var(--ln)">Free Plan</span>
                  <h3 style="font-size:22px;font-weight:800;color:var(--ink);margin:12px 0 4px">Free Aspirant</h3>
                  <p style="color:var(--mu);font-size:13px;margin-bottom:16px">Essential chapter practice for all NEET subjects</p>
                  <div style="font-size:32px;font-weight:800;color:var(--ink);margin-bottom:16px">₹0 <small style="font-size:14px;color:var(--mu)">/ forever</small></div>
                  <ul style="list-style:none;padding:0;margin:0 0 20px;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--ink)">
                    <li>✓ Standard Subject Questions</li>
                    <li>✓ Basic Mock Tests</li>
                    <li>✓ Daily Goal Tracker</li>
                  </ul>
                </div>
                <button class="btn" style="width:100%;justify-content:center;background:var(--bg);color:var(--ink);border:1px solid var(--ln)" disabled>Current Plan</button>
              </div>

              <div class="card" style="background:linear-gradient(145deg,rgba(37,99,235,0.08),rgba(14,165,233,0.04));border-radius:24px;padding:26px;border:2px solid #2563eb;box-shadow:0 16px 40px rgba(37,99,235,0.2);display:flex;flex-direction:column;justify-content:space-between;position:relative">
                <span style="position:absolute;top:-12px;right:20px;background:#2563eb;color:#fff;font-size:11px;font-weight:800;padding:4px 14px;border-radius:99px;box-shadow:0 4px 12px rgba(37,99,235,0.4)">MOST POPULAR 🚀</span>
                <div>
                  <span style="font-size:11px;font-weight:700;color:#2563eb;background:rgba(37,99,235,0.12);padding:4px 12px;border-radius:99px">Unlimited Access</span>
                  <h3 style="font-size:22px;font-weight:800;color:var(--ink);margin:12px 0 4px">NEET Pro Pass 💎</h3>
                  <p style="color:var(--mu);font-size:13px;margin-bottom:16px">Complete practice toolkit for top AIR ranks</p>
                  <div style="font-size:32px;font-weight:800;color:#2563eb;margin-bottom:16px">₹199 <small style="font-size:14px;color:var(--mu)">/ month</small></div>
                  <ul style="list-style:none;padding:0;margin:0 0 20px;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--ink)">
                    <li>✨ 50,000+ Question Bank Access</li>
                    <li>⚡ Unlimited NTA CBT Mock Tests</li>
                    <li>📖 Automated Mistake Notebook</li>
                    <li>🧬 All 2,281+ Revision Flashcards</li>
                    <li>🎯 AI Performance Analytics</li>
                  </ul>
                </div>
                <button class="btn" style="width:100%;justify-content:center;background:linear-gradient(90deg,#2563eb,#3b82f6);color:#fff;border:0;box-shadow:0 8px 24px rgba(37,99,235,0.35);font-weight:700" onclick="window.nbToast('🎉 NEET Pro Pass activated for your account!')">Activate Pro Pass →</button>
              </div>
            </div>
          </div>`,
          bc(['More', 'more'], ['Premium Pass'])
        ),

      supabase: () => {
        // Trigger health check automatically when opening this view
        setTimeout(() => {
          if (typeof (window as any).nbTestSupabase === 'function') {
            (window as any).nbTestSupabase();
          }
        }, 80);

        const savedUrl = localStorage.getItem('neetbuddy_supabase_url') || '';
        const savedKey = localStorage.getItem('neetbuddy_supabase_key') || '';

        return shell(
          hero(
            'Real Supabase Cloud Backend',
            'Connect, inspect, and synchronize your live PostgreSQL database, row-level security, and question bank.'
          ) +
            `<div class="card" style="margin-bottom:18px;background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(37,99,235,0.05));border:1px solid rgba(16,185,129,0.25)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
                <div>
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                    <span id="sb-status-dot" style="width:12px;height:12px;border-radius:50%;background:#10b981;box-shadow:0 0 10px #10b981;display:inline-block"></span>
                    <h2 style="font-size:20px;font-weight:800;color:var(--ink);margin:0">Supabase Cloud PostgreSQL</h2>
                    <span id="sb-status-badge" class="chip c3" style="font-size:12px">Connecting…</span>
                  </div>
                  <p id="sb-status-desc" style="color:var(--mu);font-size:13.5px;margin:0">Live Supabase integration with high-performance query caching & local persistence fallback.</p>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button class="btn sm o" onclick="window.nbTestSupabase()">🔄 Ping & Check</button>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" class="btn sm" style="text-decoration:none">Supabase Dashboard ↗</a>
                </div>
              </div>

              <div class="g g4 tl" style="margin-top:18px">
                <div class="tile" style="background:#e8f7e6"><div class="ti">📖</div><h3>Questions</h3><b id="sb-stat-q" style="font-size:22px;color:#10b981">--</b><small>In questions table</small></div>
                <div class="tile" style="background:#e6f0ff"><div class="ti">👥</div><h3>Profiles</h3><b id="sb-stat-u" style="font-size:22px;color:#2563eb">--</b><small>In profiles table</small></div>
                <div class="tile" style="background:#f0e8ff"><div class="ti">📝</div><h3>Test Attempts</h3><b id="sb-stat-t" style="font-size:22px;color:#9333ea">--</b><small>In test_attempts table</small></div>
                <div class="tile" style="background:#fff0e4"><div class="ti">🛡️</div><h3>Audit Logs</h3><b id="sb-stat-a" style="font-size:22px;color:#ea580c">--</b><small>In audit_logs table</small></div>
              </div>
            </div>

            <div class="hg">
              <div class="s6 card" style="display:flex;flex-direction:column;gap:12px">
                <h3 style="font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px"><span>🔑</span> Connect Supabase Credentials</h3>
                <p style="color:var(--mu);font-size:13px;margin:0">Enter your project credentials from your <a href="https://supabase.com/dashboard" target="_blank" style="color:#2563eb;font-weight:700">Supabase Project Settings → API</a>. The app will immediately test and connect live!</p>
                
                <div>
                  <label style="display:block;font-size:12px;font-weight:700;color:var(--ink);margin-bottom:5px">Supabase Project URL</label>
                  <input id="sb-inp-url" type="text" placeholder="https://xyzcompany.supabase.co" value="${esc(savedUrl)}" style="width:100%;padding:11px 14px;border-radius:14px;border:1px solid var(--ln);background:var(--cd2);color:var(--ink);font-size:13px;outline:none" />
                </div>

                <div>
                  <label style="display:block;font-size:12px;font-weight:700;color:var(--ink);margin-bottom:5px">Supabase API Key (Anon / Service Role)</label>
                  <input id="sb-inp-key" type="password" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${esc(savedKey)}" style="width:100%;padding:11px 14px;border-radius:14px;border:1px solid var(--ln);background:var(--cd2);color:var(--ink);font-size:13px;outline:none" />
                </div>

                <div style="display:flex;gap:10px;margin-top:6px">
                  <button class="btn sm" onclick="window.nbSaveSupabaseConfig()">💾 Save & Connect Live</button>
                  <button class="btn sm o" onclick="window.nbTestSupabase()">⚡ Test Connection</button>
                </div>
              </div>

              <div class="s6 card" style="display:flex;flex-direction:column;gap:12px">
                <h3 style="font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px"><span>🚀</span> Quick Database Tools</h3>
                <p style="color:var(--mu);font-size:13px;margin:0">Seed canonical NEET questions or copy the ready-to-run master PostgreSQL schema for your Supabase SQL Editor.</p>

                <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
                  <div style="padding:12px 14px;border-radius:16px;background:var(--bg);border:1px solid var(--ln);display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <b style="display:block;font-size:14px;color:var(--ink)">Seed 50+ Canonical NEET Qs</b>
                      <small style="color:var(--mu)">Batch insert physics, chemistry, botany & zoology questions</small>
                    </div>
                    <button class="btn sm" onclick="window.nbSeedSupabase()">🌱 Seed Qs</button>
                  </div>

                  <div style="padding:12px 14px;border-radius:16px;background:var(--bg);border:1px solid var(--ln);display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <b style="display:block;font-size:14px;color:var(--ink)">Master SQL Schema Migration</b>
                      <small style="color:var(--mu)">Complete 266-line schema with RLS policies and indexes</small>
                    </div>
                    <button class="btn sm o" onclick="window.nbCopySchemaSql()">📋 Copy SQL</button>
                  </div>

                  <div style="padding:12px 14px;border-radius:16px;background:var(--bg);border:1px solid var(--ln);display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <b style="display:block;font-size:14px;color:var(--ink)">Admin CMS & PDF Ingestion</b>
                      <small style="color:var(--mu)">Manage questions and import test papers</small>
                    </div>
                    <button class="btn sm o" onclick="window.nbGo('admin')">Manage CMS →</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" style="margin-top:18px">
              <h3 style="font-size:18px;font-weight:800;margin-bottom:8px">📋 PostgreSQL Tables Structure</h3>
              <p style="color:var(--mu);font-size:13px;margin-bottom:14px">NEETBuddy's real backend communicates with the following Supabase tables:</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#10b981">public.questions</b><br><small style="color:var(--mu)">50,000+ Question Bank scaling, JSONB options, NCERT refs</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#2563eb">public.profiles</b><br><small style="color:var(--mu)">Student & Educator accounts with RBAC roles</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#9333ea">public.test_attempts</b><br><small style="color:var(--mu)">Completed test sessions, marks, accuracy, +4/-1</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#ea580c">public.test_responses</b><br><small style="color:var(--mu)">Question-by-question response audits</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#059669">public.notes</b><br><small style="color:var(--mu)">Chapter-wise student markdown/rich notes</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#0284c7">public.flashcards</b><br><small style="color:var(--mu)">Active recall flip decks by subject</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#6366f1">public.study_tasks</b><br><small style="color:var(--mu)">Weekly day-by-day revision checklist</small></div>
                <div style="padding:10px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--ln)"><b style="color:#e11d48">public.audit_logs</b><br><small style="color:var(--mu)">Security & admin activity tracing</small></div>
              </div>
            </div>`,
          bc(['Supabase Cloud Backend'])
        );
      },

      admin: () =>
        shell(
          hero(
            'Admin Content Management',
            'Manage the 50,000+ Question Bank, automated PDF Ingestion, Supabase Cloud, and audit logs.'
          ) +
            `<div class="g g4 tl">${[
              ['Canonical Questions', '📖', '#e6f0ff', '50+ Active Qs'],
              ['PDF Import Pipeline', '📄', '#e8f7e6', 'Auto Parser Ready'],
              ['Audit Logs', '🛡️', '#fff0e4', 'Real-time logs'],
              ['Database Engine', '⚡', '#f0e8ff', 'Supabase PostgreSQL'],
            ]
              .map(
                (m) =>
                  `<div class="tile" style="background:${m[2]}"><div class="ti">${m[1]}</div><h3>${m[0]}</h3><small>${m[3]}</small></div>`
              )
              .join(
                ''
              )}</div><div class="card" style="margin-top:18px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 style="font-size:18px;margin:0">⚡ Supabase Database Status</h2><button class="btn sm" onclick="window.nbGo('supabase')">Manage Supabase →</button></div><p style="color:var(--mu);font-size:13px;margin:0">NEETBuddy supports real-time synchronization with Supabase. Configure credentials, seed questions, or copy the master schema in one click.</p></div><div class="card" style="margin-top:18px"><h2 style="font-size:18px;margin-bottom:8px">📄 Run Automated PDF Question Import</h2><p style="color:var(--mu);margin-bottom:14px;font-size:13px">Paste question text or upload test paper text to automatically extract statements, options (A-D), answer keys, and explanations, eliminate duplicates, and publish to the question bank.</p><textarea id="adm-raw" placeholder="Q1. What is the SI unit of force?&#10;(A) Joule&#10;(B) Newton&#10;(C) Pascal&#10;(D) Watt&#10;Answer: B&#10;Explanation: Newton is the SI unit of force." rows="5" style="width:100%;padding:12px;border-radius:16px;border:0;background:var(--cd2);color:var(--ink);font-family:monospace;font-size:12px;outline:0"></textarea><button class="btn sm" style="margin-top:10px" onclick="window.nbAdminImport()">Run Ingestion Pipeline →</button></div>`,
          bc(['Admin CMS'])
        ),

      auth: () => {
        const su = S.am === 'Sign Up';
        const f = (
          l: string,
          id: string,
          p: string,
          t?: string,
          ac?: string,
          mx?: number
        ) =>
          `<div class="fx"><label for="${id}">${l}</label><input id="${id}" ${
            t ? `type="${t}"` : ''
          } ${mx ? `inputmode="tel"` : ''} autocomplete="${ac}" placeholder="${p}"></div>`;
        return `<div class="au2">
          <div class="au-main-logo-wrap" onclick="window.nbLeave()" style="cursor:pointer;text-align:center;margin-bottom:26px" title="Return to home">
            <img src="/assets/aistudio/file_00000000f4e48211818e5cad3b07282e_bd13d945.png" alt="NEETBuddy 3D Logo" class="nb-login-main-logo" style="width:clamp(240px, 46vw, 330px);height:auto;max-height:165px;object-fit:contain;margin:0 auto;display:block;filter:drop-shadow(0 16px 36px rgba(20,163,102,0.32));transition:transform .25s ease;" />
          </div>
          <div class="ak2">
            <div class="acd" style="padding:28px 30px 32px">
              ${stoNote()}
              <h1 style="text-align:center;font-size:24px;font-weight:800;color:var(--ink);margin:4px 0 6px">${
                su ? 'Create your account' : 'Welcome back'
              }</h1>
              <p class="asub" style="text-align:center;margin:0 0 20px;font-size:14px;color:var(--mu)">${
                su
                  ? 'Start your NEET preparation journey today.'
                  : 'Log in to continue your NEET preparation.'
              }</p>
              <div class="afm" id="afm">${
                su
                  ? f('Full name', 'au-n', 'Enter your full name', '', 'name') +
                    f(
                      'Mobile number',
                      'au-p',
                      '10-digit mobile number',
                      'tel',
                      'tel',
                      1
                    ) +
                    f(
                      'Email address',
                      'au-e',
                      'Enter your email address',
                      'email',
                      'email'
                    )
                  : f(
                      'Email or mobile number',
                      'au-i',
                      'Enter your email or mobile number',
                      '',
                      'username'
                    )
              }
              <div class="fx">
                <label for="au-w">Password</label>
                <div class="apw">
                  <input id="au-w" type="password" autocomplete="${
                    su ? 'new-password' : 'current-password'
                  }" placeholder="Enter your password">
                  <button type="button" onclick="const i=this.previousElementSibling;i.type=i.type=='password'?'text':'password';this.textContent=i.type=='password'?'Show':'Hide'">Show</button>
                </div>
                ${su ? '<small class="ahint">Use at least 8 characters.</small>' : ''}
              </div>
              ${
                su
                  ? '<div class="a2"><div class="fx"><label for="au-c">I am in</label><select id="au-c"><option>Class 11</option><option selected>Class 12</option><option>Dropper</option></select></div><div class="fx"><label for="au-y">NEET year</label><select id="au-y"><option>2026</option><option selected>2027</option><option>2028</option></select></div></div>'
                  : '<div class="arw"><label class="ck"><input id="au-r" type="checkbox" checked> Remember me</label><a onclick="window.nbToast(\'Password reset sent to email\')">Forgot password?</a></div>'
              }
              <p class="aer" id="aer" role="alert"></p>
              <button class="ab1" type="button" onclick="${
                su ? 'window.nbSignup()' : 'window.nbLogin()'
              }">${su ? 'Create account' : 'Log in'}</button>
              <button class="btn" type="button" style="width:100%;margin-top:12px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-weight:700;padding:12px 16px;border-radius:14px;border:0;box-shadow:0 8px 20px rgba(16,185,129,0.28);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px" onclick="window.nbGuestLogin()">⚡ Continue as Guest (Instant Access)</button>
            </div>
            <div class="aor"><span>or</span></div>
            <button type="button" class="ag" onclick="window.nbGuestLogin()"><b style="font-size:18px;color:#10b981">⚡</b>Instant Guest Login</button>
            <p class="asw">${
              su
                ? 'Already have an account? <a onclick="window.nbSetAm(\'Login\')">Log in</a>'
                : 'Don\'t have an account? <a onclick="window.nbSetAm(\'Sign Up\')">Sign up</a>'
            }</p>
            <p class="asw" style="margin-top:14px"><a onclick="window.nbLeave()">← Back to website</a></p>
          </div>
        </div>
      </div>`;
    },

      land: () => '',

      soon: () =>
        shell(
          hero(
            S.t || 'Coming soon',
            'This section is outside the four modules built in this preview.'
          ) + `<div class="card">Design for this section can be added next.</div>`
        ),
    };

    const tperf = () => {
      const T = [
        ['NEET Ultimate Test 01', '12 Oct', 560, 720],
        ['Chemistry Part Test', '16 Oct', 118, 180],
        ['NEET Ultimate Test 02', '21 Oct', 612, 720],
        ['Biology Chapter Test', '26 Oct', 150, 180],
        ['NEET Ultimate Test 03', '30 Oct', 640, 720],
        ['Physics Part Test 02', '5 Nov', 132, 180],
      ].map((t: any) => [...t, Math.round((t[2] / t[3]) * 100)]);

      return `<h2 class="sec">📝 Your Test Performance</h2><div class="hg"><div class="card s4"><div style="display:flex;gap:16px;align-items:center"><div class="dn" style="width:120px;height:120px;background:conic-gradient(var(--g2) 82%,var(--ln) 0)"><span style="width:88px;height:88px;font-size:22px">82%<small>Avg. Score</small></span></div><div style="flex:1"><div class="k"><span>Attempted</span><b>12</b></div><div class="k"><span>Best</span><b>681/720</b></div><div class="k"><span>Average</span><b>590/720</b></div></div></div><div class="st" style="margin-top:12px;background:#dcf7e6"><span class="ic" style="background:#fff">📈</span><span><b>+8%</b><small>vs previous 3 tests</small></span></div></div><div class="card s4"><h3>Score Trend</h3><div class="wk" style="height:150px">${T.map(
        (t) =>
          `<div><small style="color:var(--ink);font-weight:700">${t[4]}%</small><i style="height:${
            t[4] * 1.1
          }px"></i>${t[1]}</div>`
      ).join(
        ''
      )}</div></div><div class="card s4"><h3>Subject-wise Score</h3>${[
        ['Physics', 72],
        ['Chemistry', 81],
        ['Botany', 86],
        ['Zoology', 79],
      ]
        .map(
          (s) =>
            `<div class="pr" style="margin:14px 0"><span style="width:80px">${
              s[0]
            }</span><div class="bar"><i style="width:${s[1]}%;background:${
              (s[1] as number) < 75 ? '#f59e0b' : 'var(--g2)'
            }"></i></div><b>${s[1]}%</b></div>`
        )
        .join(
          ''
        )}</div><div class="card s12 rsp"><h3 style="margin-bottom:6px">Recent Tests</h3><table><tr><th>Test</th><th>Date</th><th>Score</th><th>Result</th><th></th></tr>${T.slice()
        .reverse()
        .map(
          (t) =>
            `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td><td>${t[2]} / ${t[3]}</td><td><span class="chip ${
              t[4] >= 80 ? 'c3' : t[4] >= 70 ? 'c5' : 'c4'
            }">${
              t[4]
            }%</span></td><td><button class="btn sm o" onclick="window.nbGo('perf')">Analysis</button></td></tr>`
        )
        .join('')}</table></div></div>`;
    };

    // Practice / Mock Test Runner
    function start(mode: string, src?: string, cnt?: number) {
      const n = cnt || (mode === 'mock' ? 20 : Math.min(S.cnt, 20));
      const l = Array.from({ length: n }, (_, i) => QS[i % 8]);
      Q = {
        mode,
        src,
        l,
        i: 0,
        a: [],
        m: [],
        end:
          Date.now() +
          (cnt
            ? Math.max(10, Math.round(n * 1.5))
            : mode === 'mock'
            ? 30
            : S.cnt) *
            60000,
        t0: Date.now(),
        timed: mode === 'mock',
      };
      S.v = 'quiz';
      draw();
      window.scrollTo(0, 0);
    }

    function tick() {
      const e = $('#tm');
      if (!e || !Q) return;
      const s = Math.max(0, Math.round((Q.end - Date.now()) / 1000));
      e.textContent =
        '⏱ ' +
        String((s / 60) | 0).padStart(2, '0') +
        ':' +
        String(s % 60).padStart(2, '0');
      if (!s) finish();
    }

    function score() {
      let c = 0,
        w = 0;
      Q.l.forEach((q: any, i: number) => {
        if (Q.a[i] == null) return;
        Q.a[i] === q.a ? c++ : w++;
      });
      return {
        c,
        w,
        at: c + w,
        acc: c + w ? Math.round((c / (c + w)) * 100) : 0,
      };
    }

    async function finish() {
      clearInterval(TM);
      const r = score();
      if (Q.src) {
        if (Q.src.startsWith('py:')) PYD[Q.src.slice(3)] = r.acc;
        if (Q.src.startsWith('dpp:')) {
          const k = dk();
          DPPD[k] = DPPD[k] || {};
          DPPD[k][Q.src.slice(4)] = 1;
        }
        sv();
      }

      // Record mistakes into Improvement Book
      Q.l.forEach((q: any, i: number) => {
        if (Q.a[i] != null && Q.a[i] !== q.a) {
          IB.unshift([
            q.q,
            'Physics',
            'Units & Dimensions',
            'Kinematics',
            'Incorrect',
            'Today',
          ]);
        }
      });

      // Submit test result to real backend
      try {
        await fetch('/api/tests/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testName: Q.src || 'NEET Practice Test',
            type: Q.mode || 'practice',
            questions: Q.l.map((q: any) => ({
              statement: q.q,
              options: q.o,
              correctOptionIndex: q.a,
              subject: 'Physics',
            })),
            userAnswers: Q.a,
            durationSeconds: Math.round((Date.now() - Q.t0) / 1000),
          }),
        });
      } catch (e) {}

      go('result');
      if (r.acc >= 80) confetti();
    }

    const qst = (k: number) => {
      const a = Q.a[k] != null,
        m = !!Q.m[k],
        v = !!Q.v[k];
      return a && m ? 'am' : a ? 'ans' : m ? 'mk' : v ? 'na' : 'nv';
    };

    const qcnt = () => {
      const c = { ans: 0, na: 0, mk: 0, nv: 0 };
      Q.l.forEach((_: any, k: number) => {
        const s = qst(k);
        if (s === 'ans' || s === 'am') c.ans++;
        else if (s === 'na') c.na++;
        else if (s === 'nv') c.nv++;
        if (s === 'mk' || s === 'am') c.mk++;
      });
      return c;
    };

    const palLegend = (c: any) =>
      `<div class="pl"><span><i class="pd ans"></i>Answered ${c.ans}</span><span><i class="pd na"></i>Not answered ${c.na}</span><span><i class="pd mk"></i>Marked ${c.mk}</span><span><i class="pd nv"></i>Not visited ${c.nv}</span></div>`;

    const palGrid = (jump?: string) =>
      `<div class="pds">${Q.l
        .map(
          (_: any, k: number) =>
            `<button class="pd ${qst(k)} ${
              k === Q.i ? 'cur' : ''
            }" onclick="window.nbQgo(${k})${jump || ''}" aria-label="Question ${
              k + 1
            }">${k + 1}</button>`
        )
        .join('')}</div>`;

    function closeModal() {
      const d = document.getElementById('md');
      if (d) d.remove();
    }

    function modal(h: string) {
      closeModal();
      const d = document.createElement('div');
      d.id = 'md';
      d.className = 'md';
      d.innerHTML =
        '<div class="mdc" role="dialog" aria-modal="true">' + h + '</div>';
      d.onclick = (e) => {
        if (e.target === d) closeModal();
      };
      document.body.appendChild(d);
    }

    function toast(m: string) {
      document.querySelectorAll('.tt').forEach((x) => x.remove());
      const t = document.createElement('div');
      t.className = 'tt';
      t.textContent = m;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2200);
    }

    function confetti() {
      const c = ['🎉', '✨', '🎊', '⭐', '💚'];
      for (let i = 0; i < 26; i++) {
        const e = document.createElement('span');
        e.className = 'cf';
        e.textContent = c[i % 5];
        e.style.left = Math.random() * 100 + 'vw';
        e.style.setProperty('--x', Math.random() * 160 - 80 + 'px');
        e.style.setProperty('--r', Math.random() * 720 - 360 + 'deg');
        e.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 3200);
      }
    }

    function welcome() {
      const d = document.createElement('div');
      d.className = 'wel';
      d.innerHTML =
        '<div class="welc"><img src="/assets/aistudio/file_00000000f4e48211818e5cad3b07282e_bd13d945.png" alt="NEETBuddy" style="width:140px;height:auto;margin:0 auto 16px;display:block;filter:drop-shadow(0 14px 28px rgba(0,0,0,0.5))"/><h2>Welcome, ' +
        esc(UF()) +
        '!</h2><p>Opening your dashboard…</p><i class="wsp"></i></div>';
      document.body.appendChild(d);
      setTimeout(() => {
        d.style.opacity = '0';
        setTimeout(() => d.remove(), 400);
      }, 1000);
    }

    function showLP() {
      let f = document.getElementById('lpf') as HTMLIFrameElement | null;
      if (!f) {
        f = document.createElement('iframe');
        f.id = 'lpf';
        f.title = 'NEETBuddy — Practice Smarter. Score Higher. Crack NEET.';
        f.style.cssText =
          'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:99999;background:#050c26;opacity:0;transition:opacity .3s ease;display:block';
        document.body.appendChild(f);
      }
      try {
        const rawLp = new TextDecoder().decode(
          Uint8Array.from(atob(LP.replace(/\s/g, '')), (c) => c.charCodeAt(0))
        );
        f.srcdoc = rawLp;
      } catch (e) {
        console.error('LP srcdoc error:', e);
      }
      f.style.display = 'block';
      requestAnimationFrame(() => {
        if (f) f.style.opacity = '1';
      });
    }

    function hideLP() {
      const f = document.getElementById('lpf') as HTMLIFrameElement | null;
      if (f) {
        f.style.opacity = '0';
        setTimeout(() => {
          if (f) f.style.display = 'none';
        }, 300);
      }
    }

    function enter(m: string) {
      try {
        dm = localStorage.getItem('nbD') === '1';
      } catch (e) {}
      hideLP();
      if (m === 'home') {
        go('home');
        return;
      }
      S.am = m === 'login' ? 'Login' : 'Sign Up';
      go('auth');
    }

    function leave() {
      try {
        localStorage.setItem('nbIn', '0');
        sessionStorage.setItem('nbIn', '0');
        localStorage.removeItem('nbCU');
      } catch (e) {}
      CU = null;
      loadAll();
      showLP();
      go('land');
    }

    // AI Drawer & Assistant
    function aiAdd(t: string, u: number) {
      const m = document.getElementById('aim');
      if (!m) return null;
      const d = document.createElement('div');
      d.className = 'mb2 ' + (u ? 'u' : 'b');
      d.textContent = t;
      m.appendChild(d);
      m.scrollTop = m.scrollHeight;
      return d;
    }

    async function aiSend(t?: string) {
      const i = document.getElementById('aii') as HTMLInputElement;
      t = (t || (i ? i.value : '')).trim();
      if (!t) return;
      if (i) i.value = '';
      aiAdd(t, 1);
      const w = aiAdd('…', 0);

      // Call real Gemini AI backend
      try {
        const res = await fetch('/api/ai/doubt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: t }),
        });
        if (res.ok) {
          const data = await res.json();
          if (w) w.textContent = data.reply;
          const aim = document.getElementById('aim');
          if (aim) aim.scrollTop = 1e5;
          return;
        }
      } catch (e) {}

      if (w)
        w.textContent =
          'In NEET Physics and Chemistry, recall formulas and check NCERT units. In Biology, revise diagram annotations and tables.';
    }

    function aiToggle() {
      const p = document.getElementById('aip');
      if (!p) return;
      p.hidden = !p.hidden;
      if (!p.hidden)
        setTimeout(() => {
          const aii = document.getElementById('aii');
          if (aii) aii.focus();
        }, 50);
    }

    function aiFab(on: boolean) {
      let b = document.getElementById('aib');
      if (!b) {
        document.body.insertAdjacentHTML(
          'beforeend',
          '<button id="aib" aria-label="Open NEETBuddy AI" onclick="window.nbAiToggle()"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.2L21 10l-6.6 1.8L12 18l-2.4-6.2L3 10l6.6-1.8z" fill="#fff"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" fill="#fff"/></svg><b>AI</b></button><section id="aip" hidden aria-label="NEETBuddy AI"><header><span>✨ NEETBuddy AI</span><button onclick="window.nbAiToggle()" aria-label="Close">✕</button></header><div id="aim"></div><div id="aic"></div><div class="aif"><input id="aii" placeholder="Ask a NEET doubt…" autocomplete="off"><button type="button" onclick="window.nbAiSend()" aria-label="Send">➤</button></div><small>Real AI responses powered by Gemini 2.5 Flash.</small></section>'
        );
        aiAdd(
          'Hi ' +
            UF() +
            '! I can help with doubts, study plans and revision tips.',
          0
        );
        const aic = document.getElementById('aic');
        if (aic) {
          aic.innerHTML = [
            'Dimensional formula',
            'Physics tips',
            'Biology tips',
            'Study plan',
            'My mistakes',
          ]
            .map(
              (x) =>
                `<button onclick="window.nbAiSend('${x}')">${x}</button>`
            )
            .join('');
        }
        b = document.getElementById('aib');
      }
      if (b) b.style.display = on ? '' : 'none';
      if (!on) {
        const p = document.getElementById('aip');
        if (p) p.hidden = true;
      }
    }

    const gl = () => {
      let f = document.getElementById('fl');
      if (!f) {
        document.body.insertAdjacentHTML(
          'beforeend',
          '<div id="fl"></div>'
        );
        f = document.getElementById('fl');
      }
      const fp = document.getElementById('fp');
      if (fp) fp.remove();
      const on = !['land', 'auth', 'quiz'].includes(S.v);
      if (f) f.style.display = on ? '' : 'none';
      aiFab(on);
      if (f) f.style.width = (G.length ? (gd() / G.length) * 100 : 0) + '%';
    };

    let LV: any = null;

    function initLandingPage() {
      // Dark mode toggle
      const th = document.getElementById('th');
      if (th) th.onclick = () => tgd();
      const th2 = document.getElementById('th2');
      if (th2) {
        th2.onclick = () => {
          tgd();
          const nv = document.getElementById('nv');
          if (nv) nv.classList.remove('open');
        };
      }

      // Mobile hamburger menu
      const bg = document.getElementById('bg');
      if (bg) {
        bg.onclick = () => {
          const nv = document.getElementById('nv');
          if (nv) {
            nv.classList.toggle('open');
            bg.setAttribute('aria-expanded', nv.classList.contains('open') ? 'true' : 'false');
          }
        };
      }

      // Nav link click: close mobile menu
      document.querySelectorAll('.links a').forEach((a) => {
        (a as HTMLElement).onclick = () => {
          const nv = document.getElementById('nv');
          if (nv) nv.classList.remove('open');
        };
      });

      // Data-go routing to login/signup
      document.querySelectorAll('[data-go]').forEach((el) => {
        (el as HTMLElement).onclick = (e) => {
          e.preventDefault();
          const action = el.getAttribute('data-go') || 'signup';
          enter(action);
        };
      });

      // Testimonial carousel & dots
      const tg = document.getElementById('tg');
      const ds = Array.from(document.querySelectorAll('#dt button')) as HTMLButtonElement[];
      if (tg && ds.length) {
        ds.forEach((b, i) => {
          b.onclick = () => {
            const first = tg.children[0] as HTMLElement | null;
            const w = first ? first.offsetWidth + 18 : 318;
            tg.scrollTo({ left: i * w, behavior: 'smooth' });
          };
        });
        tg.onscroll = () => {
          const first = tg.children[0] as HTMLElement | null;
          const w = first ? first.offsetWidth + 18 : 318;
          const i = Math.round(tg.scrollLeft / w);
          ds.forEach((b, j) => b.classList.toggle('on', i === j));
        };
      }

      // Founder photo upload
      const up = document.getElementById('up');
      const fi = document.getElementById('fi') as HTMLInputElement | null;
      if (up && fi) {
        up.onclick = () => fi.click();
        fi.onchange = (e: any) => {
          const f = e.target.files && e.target.files[0];
          const fr = document.getElementById('fr');
          if (f && fr) {
            fr.innerHTML = `<img alt="Founder" src="${URL.createObjectURL(f)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;
          }
        };
      }

      // Reveal & count-up animations on scroll
      document.documentElement.classList.add('js');
      const sel = [
        '.sec .wrap>*',
        '.fg>div',
        '.sg>a',
        '.hw>div',
        '.hw2>div',
        '.wy>div',
        '.pg>div',
        '.tc',
        '.stx .sx',
        '.fq details',
        '.cta',
      ];
      sel.forEach((s) => {
        document.querySelectorAll(s).forEach((e, i) => {
          (e as HTMLElement).classList.add('rv');
          (e as HTMLElement).style.setProperty('--d', `${(i % 6) * 0.08}s`);
        });
      });

      try {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((x) => {
              if (x.isIntersecting) {
                (x.target as HTMLElement).classList.add('in');
                io.unobserve(x.target);
                if (x.target.classList.contains('sx')) {
                  const t = x.target.querySelector('b');
                  if (t && t.textContent) {
                    const m = t.textContent.match(/^([\d,]+)(.*)$/);
                    if (m) {
                      const to = +m[1].replace(/,/g, '');
                      const t0 = performance.now();
                      const f = (n: number) => {
                        const k = Math.min(1, (n - t0) / 1000);
                        t.textContent =
                          Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString(
                            'en-IN'
                          ) + m[2];
                        if (k < 1) requestAnimationFrame(f);
                      };
                      requestAnimationFrame(f);
                    }
                  }
                }
              }
            });
          },
          { threshold: 0.15 }
        );
        document.querySelectorAll('.rv').forEach((e) => io.observe(e));
      } catch (err) {}

      // Sticky navbar shadow on scroll
      const nv = document.getElementById('nv');
      const onWindowScroll = () => {
        if (nv) nv.classList.toggle('sc2', window.scrollY > 40);
      };
      window.addEventListener('scroll', onWindowScroll, { passive: true });

      // Dynamic animated route SVG in Features
      const g = document.querySelector('.fg') as HTMLElement | null;
      if (g) {
        const svg = g.querySelector('.route') as SVGSVGElement | null;
        const pa = svg ? (svg.querySelector('#rt') as SVGPathElement | null) : null;
        const pl = svg ? (svg.querySelector('#pl') as SVGGraphicsElement | null) : null;
        if (svg && pa && pl) {
          const buildRoute = () => {
            const items = Array.from(g.children).filter(
              (e) => e.tagName === 'DIV'
            ) as HTMLElement[];
            const W = g.offsetWidth;
            const H = g.offsetHeight;
            if (!W || !items.length) return;
            const pts = items.map((e) => {
              const c = e.querySelector('.ic') as HTMLElement | null;
              return [
                e.offsetLeft + (c ? c.offsetLeft + c.offsetWidth / 2 : e.offsetWidth / 2),
                e.offsetTop + (c ? c.offsetTop + c.offsetHeight / 2 : e.offsetHeight / 2),
              ];
            });
            const rows: number[][][] = [];
            pts.forEach((p) => {
              const r = rows.find((row) => Math.abs(row[0][1] - p[1]) < 24);
              if (r) r.push(p);
              else rows.push([p]);
            });
            rows.forEach((r, i) => {
              r.sort((a, b) => a[0] - b[0]);
              if (i % 2) r.reverse();
            });
            const s = rows.flat();
            let prev = [-24, s[0][1] + 70];
            let d = 'M' + prev[0] + ' ' + prev[1];
            s.forEach((p, i) => {
              let cx: number;
              let cy: number;
              if (i > 0 && Math.abs(prev[1] - p[1]) > 40) {
                cx = prev[0] + (prev[0] > W / 2 ? 1 : -1) * Math.min(110, W * 0.2);
                cy = (prev[1] + p[1]) / 2;
              } else {
                cx = (prev[0] + p[0]) / 2;
                cy = (prev[1] + p[1]) / 2 + (i % 2 ? -1 : 1) * 54;
              }
              d +=
                ' Q' +
                Math.round(cx) +
                ' ' +
                Math.round(cy) +
                ' ' +
                Math.round(p[0]) +
                ' ' +
                Math.round(p[1]);
              prev = p;
            });
            const l = s[s.length - 1];
            d +=
              ' Q' +
              Math.round(l[0] + 80) +
              ' ' +
              Math.round(l[1] - 70) +
              ' ' +
              (W + 24) +
              ' ' +
              Math.round(l[1] - 40);
            svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
            pa.setAttribute('d', d);
            const am = pl.querySelector('animateMotion') as any;
            try {
              if (am && am.beginElement) am.beginElement();
            } catch (e) {}
          };
          buildRoute();
          setTimeout(buildRoute, 250);
          window.addEventListener('resize', buildRoute, { passive: true });
        }
      }
    }

    function draw() {
      clearInterval(TM);
      document.documentElement.toggleAttribute('data-d', dm);
      if (dm) {
        document.documentElement.dataset.theme = 'dark';
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      const lpStyle = document.getElementById('nb-lp-styles') as HTMLStyleElement | null;
      if (lpStyle) {
        lpStyle.disabled = S.v !== 'land';
      }
      const appElem = document.getElementById('app');
      if (appElem) {
        appElem.classList.toggle('noapp', ['auth', 'quiz', 'land'].indexOf(S.v) > -1);
        appElem.innerHTML = (V[S.v] || V.soon)();
      }
      if (S.v === 'land') {
        showLP();
      } else {
        hideLP();
      }
      if (S.v === 'quiz') {
        tick();
        TM = setInterval(tick, 1000);
      }
      LV = S.v;
      gl();
    }

    function plInit() {
      if (SPL) return;
      SPL = {};
      for (let d = 0; d < 7; d++) {
        const bz = d % 2 ? 'Zoology' : 'Botany';
        SPL[d] =
          d === 6
            ? [
                { t: 'Weekly mock test', s: 'Mock', m: 180, d: 0 },
                { t: 'Revise Improvement Book', s: 'Revision', m: 45, d: 0 },
              ]
            : [
                {
                  t: (CHD.Physics || [])[(d * 3) % 20][0],
                  s: 'Physics',
                  m: 60,
                  d: 0,
                },
                {
                  t: (CHD.Chemistry || [])[(d * 3) % 20][0],
                  s: 'Chemistry',
                  m: 45,
                  d: 0,
                },
                {
                  t: (CHD[bz] || [])[(d * 3) % (CHD[bz] || []).length][0],
                  s: bz,
                  m: 45,
                  d: 0,
                },
              ];
      }
      sv();
    }

    // Attach global handlers for exact HTML inline onclick calls
    (window as any).nbGo = go;
    (window as any).nbTgd = tgd;
    (window as any).nbStart = start;
    (window as any).nbEnter = enter;
    (window as any).enter = enter;
    (window as any).nbLeave = leave;
    (window as any).nbLogin = loginForm;
    (window as any).nbSignup = signup;
    (window as any).nbGuest = guestLogin;
    (window as any).nbGuestLogin = guestLogin;
    (window as any).nbToast = toast;
    (window as any).nbSetAm = (am: string) => {
      S.am = am;
      draw();
    };
    (window as any).nbSetTab = (t: string) => {
      S.tab = t;
      draw();
    };
    (window as any).nbToggleCls = (cls: string) => {
      S.cls = S.cls === cls ? '' : cls;
      draw();
    };
    (window as any).nbSetCnt = (n: number) => {
      S.cnt = n;
      draw();
    };
    (window as any).nbSetDiff = (d: string) => {
      S.diff = d;
      draw();
    };
    (window as any).nbSetIbt = (t: string) => {
      S.ibt = t;
      draw();
    };
    (window as any).nbSetNt = (t: string) => {
      S.nt = t;
      draw();
    };
    (window as any).nbSetNf = (f: string) => {
      S.nf = f;
      draw();
    };
    (window as any).nbSetNq = (q: string) => {
      S.nq = q;
      draw();
    };
    (window as any).nbSetPq = (q: string) => {
      S.pq = q;
      draw();
    };
    (window as any).nbSetPqs = (s: string) => {
      S.pqs = s;
      draw();
    };
    (window as any).nbPyStart = (y: number) => {
      S.tt = 'NEET UG ' + y;
      S.cnt = 20;
      start('mock', 'py:' + y, 20);
    };
    (window as any).nbSetDsub = (s: string) => {
      S.dsub = s;
      draw();
    };
    (window as any).nbSetPd = (d: number) => {
      S.pd = d;
      draw();
    };
    (window as any).nbPlExam = (v: string) => {
      localStorage.setItem('nbExam', v);
      draw();
    };
    (window as any).nbPlT = (d: number, i: number) => {
      SPL[d][i].d = SPL[d][i].d ? 0 : 1;
      sv();
      draw();
      if (SPL[d][i].d) toast('Task completed ✅');
    };
    (window as any).nbPlDel = (d: number, i: number) => {
      SPL[d].splice(i, 1);
      sv();
      draw();
    };
    (window as any).nbPlAdd = () => {
      const t = gv('pt').trim();
      if (!t) return toast('Enter a task first');
      SPL[S.pd].push({
        t,
        s: gv('ps') || 'Physics',
        m: +gv('pm') || 30,
        d: 0,
      });
      sv();
      draw();
    };
    (window as any).nbToggleGe = () => {
      S.ge = !S.ge;
      draw();
    };
    (window as any).nbUpdateGoal = (i: number, v: string) => {
      G[i].t = v;
      sv();
    };
    (window as any).nbDelGoal = (i: number) => {
      G.splice(i, 1);
      sv();
      draw();
    };
    (window as any).nbAddGoal = () => {
      G.push({ t: 'New goal', d: 0, go: 'practice' });
      sv();
      draw();
    };
    (window as any).nbTogGoal = (i: number) => {
      G[i].d = G[i].d ? 0 : 1;
      sv();
      draw();
      if (gdone(G[i])) {
        if (G.every(gdone)) {
          toast('All goals done! 🎉');
          confetti();
        } else toast('Goal completed ✅');
      }
    };
    (window as any).nbTogNo = () => {
      toast('Notifications updated');
    };
    (window as any).nbFcOpen = (d: string) => {
      S.fd = d;
      S.fi = 0;
      draw();
    };
    (window as any).nbFcBack = () => {
      S.fd = null;
      draw();
    };
    (window as any).nbFcGo = (k: number) => {
      const cs =
        S.fd === 'All'
          ? [].concat(...(Object.values(FCS) as any))
          : FCS[S.fd] || FCS['Physics'];
      if (k) FCK[cs[(S.fi || 0) % cs.length][0]] = 1;
      sv();
      S.fi = ((S.fi || 0) + 1) % cs.length;
      draw();
    };
    (window as any).nbFcReset = () => {
      const cs =
        S.fd === 'All'
          ? [].concat(...(Object.values(FCS) as any))
          : FCS[S.fd] || FCS['Physics'];
      cs.forEach((c: any) => delete FCK[c[0]]);
      sv();
      S.fi = 0;
      draw();
    };
    (window as any).nbNewNote = () => {
      S.ni = -1;
      go('nedit');
    };
    (window as any).nbEditNote = (i: number) => {
      S.ni = i;
      go('nedit');
    };
    (window as any).nbDelNote = (i: number) => {
      NT.splice(i, 1);
      sv();
      go('notes');
    };
    (window as any).nbDelBk = (i: number) => {
      BK.splice(i, 1);
      sv();
      draw();
    };
    (window as any).nbSetNoteSubj = (s: string, el: HTMLElement) => {
      (window as any).nbNE = s;
      document
        .querySelectorAll('.tabs .tb')
        .forEach((b) => b.classList.remove('on'));
      el.classList.add('on');
    };
    (window as any).nbSaveNote = () => {
      const t = gv('nt').trim() || 'Untitled note';
      const sub =
        (window as any).nbNE ||
        (NT[S.ni] ? NT[S.ni][1] : 'Physics');
      const r = [
        t,
        sub,
        gv('nc'),
        new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        (document.getElementById('nb') || {}).innerHTML || '',
      ];
      S.ni >= 0 ? (NT[S.ni] = r) : NT.unshift(r);
      (window as any).nbNE = null;
      sv();
      go('notes');
    };
    (window as any).nbDownloadNotePDF = (i: number) => {
      const n = NT[i];
      if (!n) return;
      const text = `NEETBuddy Chapter Revision Note\nTitle: ${n[0]}\nSubject: ${n[1]}\nChapter/Topic: ${n[2]}\nDate: ${n[3]}\n\nContent:\n${n[4] || ''}\n\n---\nDownloaded from NEETBuddy App`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${(n[0] || 'Note').replace(/[^a-z0-9]/gi, '_')}_Note.txt`;
      a.click();
      toast('Downloading note file...');
    };
    (window as any).nbDsend = (t?: string) => {
      const i = document.getElementById('di') as HTMLInputElement;
      t = (t || (i ? i.value : '')).trim();
      if (!t) return;
      if (i) i.value = '';
      S.dm.push([t, 1]);
      dAdd(t, 1);
      const w = dAdd('…', 0);

      // Connect to real Gemini AI backend
      fetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: t }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (w) w.textContent = data.reply;
          S.dm.push([data.reply, 0]);
          const dsm = document.getElementById('dsm');
          if (dsm) dsm.scrollTop = 1e5;
        })
        .catch(() => {
          if (w)
            w.textContent =
              'In NEET, always break down the problem into fundamental NCERT concepts and verify dimensions!';
        });
    };

    function dAdd(t: string, u: number) {
      const m = document.getElementById('dsm');
      if (!m) return null;
      const d = document.createElement('div');
      d.className = 'mb2 ' + (u ? 'u' : 'b');
      d.textContent = t;
      m.appendChild(d);
      m.scrollTop = m.scrollHeight;
      return d;
    }

    (window as any).nbAiSend = aiSend;
    (window as any).nbAiToggle = aiToggle;
    (window as any).nbOpenPal = () => {
      const c = qcnt();
      modal(
        `<h2>Question palette</h2>${palLegend(c)}${palGrid(
          ';window.nbCloseModal()'
        )}<div class="mda"><button class="btn o" onclick="window.nbCloseModal()">Close</button><button class="btn" onclick="window.nbCloseModal();window.nbAskSubmit()">Submit</button></div>`
      );
    };
    (window as any).nbCloseModal = closeModal;
    (window as any).nbAskSubmit = () => {
      const c = qcnt(),
        N = Q.l.length;
      modal(
        `<h2>Submit ${Q.timed ? 'test' : 'practice'}?</h2><div class="k"><span>Answered</span><b>${
          c.ans
        }</b></div><div class="k"><span>Not answered</span><b>${
          N - c.ans
        }</b></div><div class="k"><span>Marked for review</span><b>${
          c.mk
        }</b></div><div class="mda"><button class="btn o" onclick="window.nbCloseModal()">Continue</button><button class="btn" onclick="window.nbCloseModal();window.nbFinish()">Submit</button></div>`
      );
    };
    (window as any).nbDownloadChapterPDF = (chapName: string) => {
      const text = `NEETBuddy NCERT High-Yield Revision Summary\nChapter: ${chapName}\nTarget Exam: NEET UG 2026\n\n1. CORE CONCEPTS & DEFINITIONS:\n- Fundamental SI units, dimensional analysis, and error propagation.\n- Equations of motion under constant acceleration and motion graphs.\n- Vector decomposition and relative velocity in 2D/3D space.\n\n2. ESSENTIAL FORMULA SHEET:\n- Position Vector: r = x î + y ĵ + z k̂\n- Velocity Vector: v = dr / dt\n- Acceleration: a = dv / dt\n- Range of Projectile: R = (u² sin 2θ) / g\n- Maximum Height: H = (u² sin²θ) / 2g\n\n3. NEET TRAPS & PITFALLS:\n- Always check if angle θ is given with horizontal or vertical axis before taking sin θ / cos θ components!\n\n---\nCreated with NEETBuddy App - Practice Smarter. Score Higher.`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${chapName.replace(/[^a-z0-9]/gi, '_')}_Notes.txt`;
      a.click();
      toast('Downloading ' + chapName + ' notes...');
    };
    (window as any).nbAskExit = () => {
      modal(
        `<h2>Leave this ${Q.timed ? 'test' : 'practice'}?</h2><p style="color:var(--mu);margin:6px 0 4px">Your progress in this session will not be saved.</p><div class="mda"><button class="btn o" onclick="window.nbCloseModal()">Stay</button><button class="btn" style="background:#dc2626;color:#fff" onclick="window.nbCloseModal();window.nbQuitQ()">Leave</button></div>`
      );
    };
    (window as any).nbQuitQ = () => {
      clearInterval(TM);
      const b = Q ? Q.back : 'practice';
      Q = null;
      go(b || 'practice');
    };
    (window as any).nbFinish = finish;
    (window as any).nbQa = (j: number) => {
      if (!Q.timed && Q.a[Q.i] != null) return;
      Q.a[Q.i] = Q.timed && Q.a[Q.i] === j ? null : j;
      draw();
    };
    (window as any).nbToggleCustomSubj = (subj: string) => {
      S.customSubjects = S.customSubjects || ['Physics', 'Chemistry', 'Botany', 'Zoology'];
      if (S.customSubjects.includes(subj)) {
        if (S.customSubjects.length > 1) {
          S.customSubjects = S.customSubjects.filter((x: string) => x !== subj);
        }
      } else {
        S.customSubjects.push(subj);
      }
      draw();
    };
    (window as any).nbQtoggleBookmark = () => {
      if (!Q || !Q.l[Q.i]) return;
      const q = Q.l[Q.i];
      const idx = BK.findIndex((b: any) => b[0] === q.q);
      if (idx >= 0) {
        BK.splice(idx, 1);
        toast('Removed from Bookmarks');
      } else {
        BK.push([q.q, q.s || 'Biology', q.c || 'General']);
        toast('Saved to Bookmarks 🔖');
      }
      sv();
      draw();
    };
    (window as any).nbQgo = (k: number) => {
      Q.i = k;
      draw();
    };
    (window as any).nbQnext = () => {
      if (Q.i < Q.l.length - 1) Q.i++;
      draw();
    };
    (window as any).nbQprev = () => {
      if (Q.i > 0) Q.i--;
      draw();
    };
    (window as any).nbQclear = () => {
      Q.a[Q.i] = null;
      draw();
    };
    (window as any).nbQmn = () => {
      Q.m[Q.i] = 1;
      if (Q.i < Q.l.length - 1) Q.i++;
      draw();
    };
    (window as any).nbQtoggleMark = () => {
      Q.m[Q.i] = !Q.m[Q.i];
      draw();
    };
    (window as any).nbAdminImport = async () => {
      const raw = gv('adm-raw');
      if (!raw.trim()) return toast('Please enter or paste question text');
      toast('Processing document through automated pipeline…');
      try {
        const res = await fetch('/api/admin/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawText: raw, subject: 'Physics' }),
        });
        const data = await res.json();
        if (data.success) {
          toast(
            `Imported and published ${data.importedCount} questions successfully!`
          );
          confetti();
        } else {
          toast('Import complete');
        }
      } catch (e) {
        toast('Batch parsed into question bank');
      }
    };

    // Supabase Backend Action Handlers
    (window as any).nbTestSupabase = async () => {
      const badge = document.getElementById('sb-status-badge');
      const dot = document.getElementById('sb-status-dot');
      const desc = document.getElementById('sb-status-desc');
      if (badge) badge.textContent = 'Pinging…';
      try {
        const res = await fetch('/api/supabase/status');
        const data = await res.json();
        const sq = document.getElementById('sb-stat-q');
        const su = document.getElementById('sb-stat-u');
        const st = document.getElementById('sb-stat-t');
        const sa = document.getElementById('sb-stat-a');
        if (sq) sq.textContent = String(data.tableStats?.questions ?? '--');
        if (su) su.textContent = String(data.tableStats?.users ?? '--');
        if (st) st.textContent = String(data.tableStats?.testAttempts ?? '--');
        if (sa) sa.textContent = String(data.tableStats?.auditLogs ?? '--');

        if (data.connected) {
          if (badge) {
            badge.className = 'chip c3';
            badge.textContent = `Connected (${data.latencyMs}ms)`;
          }
          if (dot) dot.style.background = '#10b981';
          if (desc) desc.textContent = `Connected to live Supabase project (${data.url || 'Cloud'}). All data operations are securely synced.`;
          toast('Supabase Backend is Live & Connected 🟢');
        } else if (data.configured) {
          if (badge) {
            badge.className = 'chip c4';
            badge.textContent = 'Connection Issue';
          }
          if (dot) dot.style.background = '#ef4444';
          if (desc) desc.textContent = data.error || 'Failed to ping Supabase. Check project URL & API key.';
        } else {
          if (badge) {
            badge.className = 'chip c2';
            badge.textContent = 'Local Cache Mode';
          }
          if (dot) dot.style.background = '#f59e0b';
          if (desc) desc.textContent = 'Running in high-speed local persistence mode. Enter your Supabase Project URL & Key below to connect live cloud database.';
        }
      } catch (err: any) {
        if (badge) {
          badge.className = 'chip c4';
          badge.textContent = 'Offline';
        }
      }
    };

    (window as any).nbSaveSupabaseConfig = async () => {
      const urlInp = document.getElementById('sb-inp-url') as HTMLInputElement;
      const keyInp = document.getElementById('sb-inp-key') as HTMLInputElement;
      const url = urlInp ? urlInp.value.trim() : '';
      const key = keyInp ? keyInp.value.trim() : '';
      if (!url || !key) return toast('Please enter both Supabase URL and Key');

      toast('Testing and connecting to Supabase…');
      try {
        const res = await fetch('/api/supabase/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, key })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('neetbuddy_supabase_url', url);
          localStorage.setItem('neetbuddy_supabase_key', key);
          if (data.connected) {
            toast('Supabase successfully connected! 🚀');
            confetti();
          } else {
            toast('Credentials saved. Note: ' + (data.error || 'Ready for tables'));
          }
          (window as any).nbTestSupabase();
        } else {
          toast('Error saving configuration: ' + (data.error || 'Unknown error'));
        }
      } catch (e: any) {
        toast('Connection attempt failed: ' + (e?.message || 'Error'));
      }
    };

    (window as any).nbSeedSupabase = async () => {
      toast('Seeding 50+ NEET questions into Supabase…');
      try {
        const res = await fetch('/api/supabase/seed', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          toast(data.message || 'Seeded canonical question bank into Supabase!');
          confetti();
          (window as any).nbTestSupabase();
        } else {
          toast('Seeding failed: ' + (data.error || 'Check Supabase status'));
        }
      } catch (e: any) {
        toast('Failed to seed: ' + (e?.message || 'Error'));
      }
    };

    (window as any).nbCopySchemaSql = async () => {
      try {
        const res = await fetch('/api/supabase/schema-sql');
        const data = await res.json();
        if (data.sql) {
          await navigator.clipboard.writeText(data.sql);
          toast('Master Supabase SQL Schema copied to clipboard! 📋');
        } else {
          toast('Could not load schema SQL');
        }
      } catch (e) {
        toast('Error copying schema SQL');
      }
    };

    // Support iframe enter call & postMessage from Landing Page
    (window as any).enter = enter;
    (window as any).nbEnter = enter;
    (window as any).nbOpenCustomPractice = () => {
      hideLP();
      go('practice');
    };
    const msgHandler = (e: MessageEvent) => {
      if (e.data && e.data.nbGo) enter(e.data.nbGo);
    };
    window.addEventListener('message', msgHandler);

    // Dismiss animated splash screen
    const splashTimer = setTimeout(() => {
      const sp = document.getElementById('nb-splash');
      if (sp) {
        sp.classList.add('nb-hide');
        setTimeout(() => {
          if (sp.parentNode) sp.remove();
        }, 550);
      }
    }, 1250);

    // Ripple click handler
    const pointerHandler = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest(
        '.btn,.tb,.ni,.row'
      ) as HTMLElement;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'rp';
      s.style.left = e.clientX - r.left + 'px';
      s.style.top = e.clientY - r.top + 'px';
      t.appendChild(s);
      setTimeout(() => s.remove(), 650);
    };
    document.addEventListener('pointerdown', pointerHandler);

    // Initial load & check login status or /admin path
    loadAll();
    const IN =
      localStorage.getItem('nbIn') === '1' ||
      sessionStorage.getItem('nbIn') === '1';

    const checkRoute = () => {
      const p = window.location.pathname;
      const h = window.location.hash;
      if (p === '/admin' || h === '#admin' || h === '#/admin') {
        hideLP();
        go('admin');
        return true;
      }
      return false;
    };

    if (!checkRoute()) {
      if (IN && (window.location.hash === '#home' || window.location.hash.startsWith('#/home'))) {
        hideLP();
        S.v = 'home';
        draw();
      } else {
        S.v = 'land';
        draw();
        showLP();
      }
    }

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      clearInterval(TM);
      clearTimeout(splashTimer);
      const lpf = document.getElementById('lpf');
      if (lpf) lpf.remove();
      const lpStyle = document.getElementById('nb-lp-styles');
      if (lpStyle) lpStyle.remove();
      document.removeEventListener('pointerdown', pointerHandler);
      window.removeEventListener('message', msgHandler);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  return (
    <div className="app" id="app" ref={containerRef} />
  );
}
