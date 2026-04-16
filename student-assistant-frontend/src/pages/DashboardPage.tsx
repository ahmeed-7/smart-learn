import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import { useTaskStore } from '../store/useTaskStore';
import { useExamStore } from '../store/useExamStore';

const DashboardPage: React.FC = () => {
  const sessions = usePlannerStore((state) => state.sessions);
  const tasks = useTaskStore((state) => state.tasks);
  const exams = useExamStore((state) => state.exams);

  const pendingTasks = tasks.filter((task) => task.status === 'todo');
  const completedTasks = tasks.filter((task) => task.status === 'done');

  const today = new Date();

  const upcomingExams = [...exams]
    .filter((exam) => new Date(`${exam.date}T${exam.time}`) >= today)
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    );

  const nextExam = upcomingExams[0];

  const dayCounts: Record<string, number> = {};
  sessions.forEach((session) => {
    dayCounts[session.day] = (dayCounts[session.day] || 0) + 1;
  });

  const busiestDay =
    Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'No sessions yet';

  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  const examPreparedness = Math.min(
    100,
    sessions.length * 10 + completedTasks.length * 8 + Math.max(0, 30 - pendingTasks.length * 3)
  );

  const quickActions = [
    {
      title: 'Open Planner',
      description: 'Manage your weekly study sessions',
      icon: ClipboardList,
      path: '/planner',
    },
    {
      title: 'Manage Tasks',
      description: 'Track pending and completed work',
      icon: CheckCircle2,
      path: '/tasks',
    },
    {
      title: 'View Exams',
      description: 'Keep your exam timetable organized',
      icon: GraduationCap,
      path: '/exams',
    },
    {
      title: 'Class Schedule',
      description: 'Review your weekly class timetable',
      icon: CalendarDays,
      path: '/schedule',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="glass-card p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-56 h-56 bg-primary-100 rounded-full blur-3xl opacity-40 -translate-y-10 translate-x-10" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4">
              <Sparkles size={16} />
              Smart Learn
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Organize your academic life with planning, tasks, exams, and AI support
            </h1>

            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Smart Learn helps students manage class schedules, study sessions, tasks, exams,
              and revision workflows in one intelligent workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/planner" className="btn btn-primary gap-2">
                Go to Planner
                <ArrowRight size={16} />
              </Link>

              <Link to="/tasks" className="btn btn-secondary gap-2">
                View Tasks
              </Link>

              <Link to="/exams" className="btn btn-secondary gap-2">
                View Exams
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[280px]">
            <div className="bg-white/80 border border-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-slate-500 font-semibold">Study Sessions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{sessions.length}</h3>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-slate-500 font-semibold">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks.length}</h3>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-slate-500 font-semibold">Upcoming Exams</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{upcomingExams.length}</h3>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-slate-500 font-semibold">Busiest Day</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{busiestDay}</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Task Progress</h2>
            <span className="text-sm font-semibold text-primary-700">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {completedTasks.length} completed out of {tasks.length} total tasks
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Study Readiness</h2>
            <span className="text-sm font-semibold text-primary-700">
              {examPreparedness}%
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${examPreparedness}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Based on your planner activity, completed tasks, and remaining workload
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.path}
              className="glass-card p-5 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {item.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-card p-6 xl:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList size={18} className="text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">Planner Overview</h2>
          </div>

          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No study sessions planned yet</p>
          ) : (
            <div className="space-y-3">
              {sessions
                .slice()
                .sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime))
                .slice(0, 4)
                .map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {session.day}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{session.title}</h3>
                    <p className="text-sm text-primary-700 font-medium">{session.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {session.startTime} - {session.endTime}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 xl:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 size={18} className="text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">Tasks Summary</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-xs font-semibold text-amber-700">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks.length}</h3>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
              <p className="text-xs font-semibold text-emerald-700">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks.length}</h3>
            </div>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No pending tasks right now</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                  <p className="text-sm text-primary-700 font-medium">{task.subject}</p>
                  {task.dueDate && (
                    <p className="text-xs text-slate-500 mt-1">Due: {task.dueDate}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 xl:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap size={18} className="text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">Exam Focus</h2>
          </div>

          {nextExam ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                  Next Exam
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{nextExam.title}</h3>
                <p className="text-sm font-medium text-primary-700">{nextExam.subject}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <CalendarDays size={14} />
                  <span>
                    {nextExam.date} at {nextExam.time}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingExams.slice(1, 4).map((exam) => (
                  <div key={exam.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-bold text-slate-900">{exam.title}</h3>
                    <p className="text-sm text-primary-700 font-medium">{exam.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {exam.date} at {exam.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No upcoming exams saved yet</p>
          )}
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Smart Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Best Next Action</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {nextExam
                ? `Prepare for ${nextExam.subject} first because your next exam is ${nextExam.title}.`
                : pendingTasks.length > 0
                ? `Focus on your pending tasks, starting with ${pendingTasks[0].title}.`
                : 'Your workspace looks clean. Add a new study session or review your notes.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Planning Insight</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {sessions.length > 0
                ? `${busiestDay} is currently your busiest study day. Balance your workload across the week for better focus.`
                : 'You have no planner sessions yet. Add weekly study blocks to stay consistent.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Progress Snapshot</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              You completed {completedTasks.length} task(s) and still have {pendingTasks.length}{' '}
              pending. Keep your momentum going.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Today's Focus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Priority Task</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {pendingTasks.find((task) => task.priority === 'high')?.title ||
                pendingTasks[0]?.title ||
                'No urgent tasks for today'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Next Academic Event</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {nextExam
                ? `${nextExam.title} on ${nextExam.date} at ${nextExam.time}`
                : 'No exam scheduled yet'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Suggested Action</p>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              {sessions.length === 0
                ? 'Add at least one study session to structure your week.'
                : pendingTasks.length > 0
                ? 'Complete one pending task, then revise for your next exam.'
                : 'Use your planner to review your latest lessons.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;