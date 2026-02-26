import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import SchedulePage from './pages/SchedulePage';
import KnowledgeTreePage from './pages/KnowledgeTreePage';
import AddLogPage from './pages/AddLogPage';
import WeekendPage from './pages/WeekendPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import FlashcardPage from './pages/FlashcardPage';

// ─── Real Organic Knowledge Tree ─────────────────────────────────────────────
const leaves = [
  { id: 'algo', x: 95, y: 108, label: 'Algorithms', emoji: '💡', c1: '#0ea5e9', c2: '#38bdf8', delay: 0 },
  { id: 'db', x: 178, y: 74, label: 'Databases', emoji: '🗄️', c1: '#10b981', c2: '#34d399', delay: 0.15 },
  { id: 'nets', x: 258, y: 54, label: 'Networks', emoji: '🌐', c1: '#f59e0b', c2: '#fbbf24', delay: 0.3 },
  { id: 'ml', x: 320, y: 36, label: 'Machine Learning', emoji: '🤖', c1: '#ec4899', c2: '#f472b6', delay: 0.45 },
  { id: 'math', x: 382, y: 54, label: 'Mathematics', emoji: '📐', c1: '#8b5cf6', c2: '#a78bfa', delay: 0.6 },
  { id: 'phys', x: 462, y: 74, label: 'Physics', emoji: '⚛️', c1: '#0284c7', c2: '#38bdf8', delay: 0.75 },
  { id: 'hist', x: 545, y: 108, label: 'History', emoji: '📜', c1: '#d97706', c2: '#fbbf24', delay: 0.9 },
];

const branches = [
  // Trunk
  { d: 'M 320 390 L 320 300', stroke: '#713f12', w: 22, delay: 0 },
  // Main split
  { d: 'M 320 320 Q 235 295 175 255', stroke: '#92400e', w: 15, delay: 0.12 },
  { d: 'M 320 320 Q 405 295 465 255', stroke: '#92400e', w: 15, delay: 0.12 },
  // Center trunk continues
  { d: 'M 320 300 Q 320 230 320 175', stroke: '#a16207', w: 12, delay: 0.2 },
  // Left large branch
  { d: 'M 175 255 Q 132 208 110 162', stroke: '#a16207', w: 10, delay: 0.25 },
  // Right large branch
  { d: 'M 465 255 Q 508 208 530 162', stroke: '#a16207', w: 10, delay: 0.25 },
  // Left sub-branches
  { d: 'M 110 162 Q 100 138 95 118', stroke: '#b45309', w: 6, delay: 0.4 },
  { d: 'M 110 162 Q 142 128 178 88', stroke: '#b45309', w: 6, delay: 0.4 },
  // Center sub-branches
  { d: 'M 320 175 Q 284 118 258 68', stroke: '#b45309', w: 6, delay: 0.4 },
  { d: 'M 320 175 Q 320 115 320 50', stroke: '#b45309', w: 7, delay: 0.4 },
  { d: 'M 320 175 Q 356 118 382 68', stroke: '#b45309', w: 6, delay: 0.4 },
  // Right sub-branches
  { d: 'M 530 162 Q 498 128 462 88', stroke: '#b45309', w: 6, delay: 0.4 },
  { d: 'M 530 162 Q 540 138 545 118', stroke: '#b45309', w: 6, delay: 0.4 },
  // Tiny twigs
  { d: 'M 95  118 Q 82 102 75 90', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 178 88  Q 170 70 170 58', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 258 68  Q 252 52 253 40', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 320 50  Q 314 34 315 22', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 382 68  Q 388 52 387 40', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 462 88  Q 472 70 472 58', stroke: '#ca8a04', w: 3, delay: 0.55 },
  { d: 'M 545 118 Q 558 102 565 90', stroke: '#ca8a04', w: 3, delay: 0.55 },
];

const KnowledgeTreePreview: React.FC = () => {
  const [drawn, setDrawn] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full select-none" style={{ height: 430 }}>
      <style>{`
        @keyframes growBranch {
          from { stroke-dashoffset: 500; opacity: 0; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes popLeaf {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.12) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes sway {
          0%,100% { transform: rotate(-3deg) translateY(0); }
          50%     { transform: rotate(3deg)  translateY(-5px); }
        }
        @keyframes fallLeaf {
          0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
          10%  { opacity: 0.6; }
          100% { opacity: 0;   transform: translateY(280px) rotate(360deg) translateX(40px); }
        }
        .tree-branch {
          stroke-dasharray: 500;
          animation: growBranch ease forwards;
        }
        .tree-leaf {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation:
            popLeaf 0.5s cubic-bezier(.34,1.56,.64,1) forwards,
            sway 4s ease-in-out infinite;
          opacity: 0;
        }
      `}</style>

      <svg viewBox="0 0 640 430" className="w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#92400e50" />
          </filter>
          <filter id="leafShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00000030" />
          </filter>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Leaf gradient for each subject */}
          {leaves.map(l => (
            <radialGradient key={l.id} id={`lg-${l.id}`} cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor={l.c2} />
              <stop offset="100%" stopColor={l.c1} stopOpacity="0.88" />
            </radialGradient>
          ))}
          {/* Grass gradient */}
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.2" />
          </linearGradient>
          {/* Trunk gradient */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Soft background sky radial */}
        <radialGradient id="skyGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
        </radialGradient>
        <ellipse cx="320" cy="200" rx="290" ry="200" fill="url(#skyGrad)" />

        {/* Grass / ground */}
        <ellipse cx="320" cy="420" rx="190" ry="18" fill="url(#grassGrad)" />
        <path d="M 140 418 Q 230 405 320 410 Q 410 405 500 418" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.3" />

        {/* ── BRANCHES ── */}
        {drawn && branches.map((b, i) => (
          <path
            key={i}
            className="tree-branch"
            d={b.d}
            stroke={b.stroke}
            strokeWidth={b.w}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={b.w > 10 ? 'url(#shadow)' : undefined}
            style={{
              animationDelay: `${b.delay}s`,
              animationDuration: `${0.45 + b.w * 0.05}s`,
            }}
          />
        ))}

        {/* Trunk bark texture (oval rings) */}
        {drawn && [375, 355, 335, 318].map((y, i) => (
          <ellipse
            key={i}
            cx="320" cy={y}
            rx={11 - i * 2} ry="3.5"
            fill="none"
            stroke="#78350f"
            strokeWidth="1.5"
            opacity="0.3"
            style={{
              strokeDasharray: 80,
              strokeDashoffset: 80,
              animation: `growBranch 0.4s ${0.05 + i * 0.06}s forwards`,
            }}
          />
        ))}

        {/* ── LEAF CLUSTERS ── */}
        {drawn && leaves.map((leaf) => {
          const isH = hovered === leaf.id;
          const R = isH ? 46 : 40;

          return (
            <g
              key={leaf.id}
              className="tree-leaf"
              style={{
                animationDelay: `${leaf.delay + 0.5}s, ${leaf.delay + 1.1}s`,
                animationDuration: '0.5s, 4s',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(leaf.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Glow halo on hover */}
              {isH && (
                <circle cx={leaf.x} cy={leaf.y} r={R + 14}
                  fill={leaf.c1} opacity="0.2" filter="url(#glow)" />
              )}

              {/* Three overlapping circles = organic leaf blob */}
              <circle cx={leaf.x - R * 0.28} cy={leaf.y + R * 0.12}
                r={R * 0.74} fill={`url(#lg-${leaf.id})`} opacity={isH ? 1 : 0.92}
                filter="url(#leafShadow)"
                style={{ transition: 'r 0.3s' }} />
              <circle cx={leaf.x + R * 0.28} cy={leaf.y + R * 0.12}
                r={R * 0.70} fill={`url(#lg-${leaf.id})`} opacity={isH ? 1 : 0.88} />
              <circle cx={leaf.x} cy={leaf.y - R * 0.22}
                r={R * 0.74} fill={`url(#lg-${leaf.id})`} opacity={isH ? 1 : 0.94} />

              {/* Leaf vein lines */}
              <line x1={leaf.x} y1={leaf.y + 14} x2={leaf.x} y2={leaf.y - 24}
                stroke={leaf.c1} strokeWidth="1.3" opacity="0.3" strokeLinecap="round" />
              <line x1={leaf.x - 16} y1={leaf.y - 5} x2={leaf.x} y2={leaf.y + 2}
                stroke={leaf.c1} strokeWidth="0.9" opacity="0.25" strokeLinecap="round" />
              <line x1={leaf.x + 16} y1={leaf.y - 5} x2={leaf.x} y2={leaf.y + 2}
                stroke={leaf.c1} strokeWidth="0.9" opacity="0.25" strokeLinecap="round" />

              {/* Emoji fruit / icon */}
              <text x={leaf.x} y={leaf.y + 8}
                textAnchor="middle"
                fontSize={isH ? 22 : 18}
                style={{ transition: 'font-size 0.2s', userSelect: 'none' }}>
                {leaf.emoji}
              </text>

              {/* Hover label pill */}
              {isH && (
                <>
                  <rect x={leaf.x - 54} y={leaf.y + R + 7} width={108} height={23} rx={12}
                    fill={leaf.c1} />
                  <text x={leaf.x} y={leaf.y + R + 23}
                    textAnchor="middle" fontSize={10} fontWeight="700"
                    fill="white" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {leaf.label}
                  </text>
                </>
              )}

              {/* Static small label (non-hover) */}
              {!isH && (
                <text x={leaf.x} y={leaf.y + R + 19}
                  textAnchor="middle" fontSize={9.5} fontWeight="600"
                  fill="#475569" opacity="0.8"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {leaf.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── FALLING LEAVES PARTICLES ── */}
        {drawn && [
          { x: 155, delay: 2, dur: 7 },
          { x: 395, delay: 3.5, dur: 8.5 },
          { x: 470, delay: 1.2, dur: 6 },
          { x: 240, delay: 5, dur: 9 },
        ].map((p, i) => (
          <text key={i} x={p.x} y="90" fontSize="12" opacity="0"
            style={{ animation: `fallLeaf ${p.dur}s ease-in ${p.delay}s infinite` }}>
            {['🍃', '🍂', '🌿', '🍁'][i]}
          </text>
        ))}
      </svg>

      {/* XP pill */}
      <div
        className="absolute top-2 right-2 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
        style={{ animation: 'sway 3s ease-in-out infinite' }}
      >
        ⚡ +120 XP earned today
      </div>

      {/* AI pill */}
      <div
        className="absolute bottom-4 left-2 px-3 py-1.5 text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
        style={{ background: '#0284c7', color: 'white', animation: 'sway 3.5s ease-in-out 0.5s infinite' }}
      >
        ✨ AI summary ready
      </div>
    </div>
  );
};

// ─── Feature cards ────────────────────────────────────────────────────────────
const features = [
  { icon: '📅', title: 'Smart Schedule', desc: 'Organize your weekly classes by day, time, and room in a clean visual grid.', color: 'from-sky-500 to-blue-600' },
  { icon: '🌳', title: 'Knowledge Tree', desc: 'See your subjects bloom as a living tree. Click a leaf to access all lesson logs.', color: 'from-violet-500 to-purple-700' },
  { icon: '🤖', title: 'AI Flashcards', desc: 'Get auto-generated 3D study cards from your lessons to master any topic faster.', color: 'from-pink-500 to-rose-600' },
  { icon: '☕', title: 'Weekend Mode', desc: 'Earn XP completing career-boosting challenges every weekend. Stay sharp and motivated.', color: 'from-amber-500 to-orange-600' },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────
const Landing: React.FC = () => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [treeVisible, setTreeVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTreeVisible(true); },
      { threshold: 0.15 }
    );
    if (treeRef.current) observer.observe(treeRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl text-primary-600">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center text-sm font-black">SA</div>
            StudentAssist
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary px-5 h-9 text-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary  px-5 h-9 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-primary-700 text-sm font-bold">
            🎓 Built for university students
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Your Academic{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              Success Hub
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Organize your week, capture every lesson, and let AI turn your notes into smart summaries, key points, and review questions — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn btn-primary  px-8 h-12 text-base shadow-lg shadow-primary-200">
              Start for free →
            </Link>
            <Link to="/login" className="btn btn-secondary px-8 h-12 text-base">
              I have an account
            </Link>
          </div>
          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {['#0284c7', '#7c3aed', '#10b981', '#ec4899'].map((c, i) => (
                <div key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: c }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">200+ students</span> already using StudentAssist
            </p>
          </div>
        </div>

        {/* Right — Real Organic Knowledge Tree */}
        <div ref={treeRef} className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/60 to-secondary-100/40 rounded-3xl blur-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden">
            {/* Window chrome bar */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">🌳 Knowledge Tree</h3>
                <p className="text-xs text-slate-400">Hover a leaf to see the subject</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
            {treeVisible && <KnowledgeTreePreview />}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything you need to excel</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            From smart scheduling to AI-powered lesson logs — StudentAssist is your all-in-one academic co-pilot.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title}
              className="relative p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} rounded-t-2xl`} />
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden p-12 rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-700 text-white text-center shadow-2xl shadow-primary-200">
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🌳</div>
            <h2 className="text-4xl font-extrabold mb-4">Ready to grow your Knowledge Tree?</h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Sign up for free today and start turning every lecture into a structured learning node.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-600 font-extrabold rounded-2xl hover:bg-primary-50 transition-colors shadow-lg text-lg">
              Start Building Your Tree →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © 2026 StudentAssist · Built with ❤️ for curious minds
      </footer>
    </div>
  );
};

// ─── App Router ───────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/tree" element={<KnowledgeTreePage />} />
          <Route path="/add-log/:subjectId" element={<AddLogPage />} />
          <Route path="/weekend" element={<WeekendPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/flashcards/:subjectId" element={<FlashcardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
