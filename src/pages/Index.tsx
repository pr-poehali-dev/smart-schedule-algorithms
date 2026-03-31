import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт"];
const PERIODS = [
  { num: 1, time: "08:00–08:45" },
  { num: 2, time: "08:55–09:40" },
  { num: 3, time: "09:55–10:40" },
  { num: 4, time: "10:55–11:40" },
  { num: 5, time: "11:50–12:35" },
  { num: 6, time: "12:45–13:30" },
  { num: 7, time: "13:40–14:25" },
];

type Lesson = { subject: string; teacher: string; room: string; conflict?: boolean };
type WeekSchedule = Record<string, Record<number, Lesson>>;

// ── Расписания по группам параллелей ──────────────────────────────────────────

const SCHEDULE_JUNIOR: WeekSchedule = {
  "Пн": {
    1: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    3: { subject: "Окружающий мир", teacher: "Лебедев К.И.", room: "109" },
    4: { subject: "Чтение",       teacher: "Петрова О.С.",  room: "118" },
    5: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
  },
  "Вт": {
    1: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    3: { subject: "Рисование",    teacher: "Орлова В.С.",   room: "220" },
    4: { subject: "Музыка",       teacher: "Тихонов П.А.",  room: "Актовый зал" },
    5: { subject: "Чтение",       teacher: "Петрова О.С.",  room: "118" },
  },
  "Ср": {
    1: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Окружающий мир", teacher: "Лебедев К.И.", room: "109" },
    3: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    4: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
    5: { subject: "Технология",   teacher: "Орлова В.С.",   room: "220" },
  },
  "Чт": {
    1: { subject: "Чтение",       teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    3: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    4: { subject: "Музыка",       teacher: "Тихонов П.А.",  room: "Актовый зал" },
    5: { subject: "Рисование",    teacher: "Орлова В.С.",   room: "220" },
  },
  "Пт": {
    1: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    3: { subject: "Окружающий мир", teacher: "Лебедев К.И.", room: "109" },
    4: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
    5: { subject: "Технология",   teacher: "Орлова В.С.",   room: "220" },
  },
};

const SCHEDULE_MIDDLE: WeekSchedule = {
  "Пн": {
    1: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    3: { subject: "История",      teacher: "Смирнова Н.А.", room: "205" },
    4: { subject: "Биология",     teacher: "Лебедев К.И.",  room: "109" },
    5: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
    6: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
  },
  "Вт": {
    1: { subject: "Литература",   teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214", conflict: true },
    3: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
    4: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310" },
    5: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
    6: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
  },
  "Ср": {
    1: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Биология",     teacher: "Лебедев К.И.",  room: "109" },
    3: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    4: { subject: "История",      teacher: "Смирнова Н.А.", room: "205" },
    5: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
    6: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
  },
  "Чт": {
    1: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310", conflict: true },
    3: { subject: "Литература",   teacher: "Петрова О.С.",  room: "118" },
    4: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
    5: { subject: "Биология",     teacher: "Лебедев К.И.",  room: "109" },
    6: { subject: "История",      teacher: "Смирнова Н.А.", room: "205" },
  },
  "Пт": {
    1: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214" },
    3: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
    4: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310" },
    5: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
    6: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
  },
};

const SCHEDULE_SENIOR: WeekSchedule = {
  "Пн": {
    1: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Физика",       teacher: "Козлов Д.В.",   room: "307" },
    3: { subject: "История",      teacher: "Смирнова Н.А.", room: "205", conflict: true },
    4: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310" },
    5: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
    6: { subject: "Литература",   teacher: "Петрова О.С.",  room: "118" },
    7: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
  },
  "Вт": {
    1: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214", conflict: true },
    2: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    3: { subject: "Физика",       teacher: "Козлов Д.В.",   room: "307" },
    4: { subject: "Обществознание", teacher: "Смирнова Н.А.", room: "205" },
    5: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
    6: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310" },
    7: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
  },
  "Ср": {
    1: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214" },
    2: { subject: "Литература",   teacher: "Петрова О.С.",  room: "118" },
    3: { subject: "Биология",     teacher: "Лебедев К.И.",  room: "109" },
    4: { subject: "История",      teacher: "Смирнова Н.А.", room: "205" },
    5: { subject: "Физика",       teacher: "Козлов Д.В.",   room: "307" },
    6: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
    7: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
  },
  "Чт": {
    1: { subject: "Русский язык", teacher: "Петрова О.С.",  room: "118" },
    2: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    3: { subject: "Химия",        teacher: "Фёдорова Т.В.", room: "310" },
    4: { subject: "Обществознание", teacher: "Смирнова Н.А.", room: "205" },
    5: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
    6: { subject: "Биология",     teacher: "Лебедев К.И.",  room: "109" },
    7: { subject: "Алгебра",      teacher: "Иванов А.П.",   room: "214" },
  },
  "Пт": {
    1: { subject: "Физика",       teacher: "Козлов Д.В.",   room: "307" },
    2: { subject: "История",      teacher: "Смирнова Н.А.", room: "205" },
    3: { subject: "Литература",   teacher: "Петрова О.С.",  room: "118" },
    4: { subject: "Информатика",  teacher: "Новикова А.Р.", room: "401" },
    5: { subject: "Физкультура",  teacher: "Морозов Е.А.",  room: "Спортзал" },
    6: { subject: "Математика",   teacher: "Иванов А.П.",   room: "214" },
    7: { subject: "Английский",   teacher: "Власова Е.И.",  room: "115" },
  },
};

function getScheduleByGrade(grade: number): WeekSchedule {
  if (grade <= 4) return SCHEDULE_JUNIOR;
  if (grade <= 8) return SCHEDULE_MIDDLE;
  return SCHEDULE_SENIOR;
}

const HEAT_DATA = [
  [92, 85, 78, 90, 45],
  [88, 95, 82, 75, 50],
  [70, 80, 95, 88, 35],
  [60, 72, 88, 92, 40],
  [50, 65, 75, 80, 30],
  [40, 55, 62, 70, 25],
  [25, 35, 45, 50, 15],
];

const TEACHERS = [
  { id: 1, name: "Иванов А.П.", subject: "Математика, Алгебра", load: 34, maxLoad: 40, role: "Учитель", classes: ["9А", "10Б", "11В"], status: "active" },
  { id: 2, name: "Петрова О.С.", subject: "Русский язык, Лит-ра", load: 28, maxLoad: 36, role: "Учитель", classes: ["8А", "9Б", "10А"], status: "active" },
  { id: 3, name: "Козлов Д.В.", subject: "Физика", load: 22, maxLoad: 36, role: "Учитель", classes: ["9А", "10А", "11А"], status: "active" },
  { id: 4, name: "Смирнова Н.А.", subject: "История", load: 18, maxLoad: 36, role: "Учитель", classes: ["8Б", "9Б", "10Б"], status: "leave" },
  { id: 5, name: "Лебедев К.И.", subject: "Биология", load: 20, maxLoad: 36, role: "Учитель", classes: ["8А", "9А", "10Б"], status: "active" },
  { id: 6, name: "Фёдорова Т.В.", subject: "Химия", load: 24, maxLoad: 36, role: "Учитель", classes: ["9А", "10А", "11Б"], status: "active" },
  { id: 7, name: "Морозов Е.А.", subject: "Физкультура", load: 30, maxLoad: 40, role: "Учитель", classes: ["8А", "8Б", "9А", "9Б"], status: "active" },
  { id: 8, name: "Новикова А.Р.", subject: "Информатика", load: 16, maxLoad: 36, role: "Учитель", classes: ["10А", "10Б", "11А"], status: "active" },
];

const CONFLICTS = [
  { id: 1, type: "double", severity: "high", title: "Двойная запись учителя", desc: "Иванов А.П. — Понедельник, 4 урок", detail: "Назначен одновременно в 9А и 10Б", time: "Пн, 10:55–11:40", status: "open" },
  { id: 2, type: "room", severity: "high", title: "Конфликт кабинета", desc: "Кабинет 214 — Вторник, 2 урок", detail: "Записаны два класса в один кабинет", time: "Вт, 08:55–09:40", status: "open" },
  { id: 3, type: "double", severity: "medium", title: "Двойная запись класса", desc: "10А — Четверг, 4 урок", detail: "Классу назначено два урока одновременно", time: "Чт, 10:55–11:40", status: "open" },
  { id: 4, type: "load", severity: "low", title: "Перегрузка учителя", desc: "Иванов А.П. — 34/40 часов", detail: "Нагрузка превышает рекомендуемую", time: "Текущая неделя", status: "warning" },
];

const SUBSTITUTES = [
  { name: "Орлов В.С.", subject: "Математика, Физика", score: 97, free: ["Пн 3", "Вт 2", "Ср 5"], load: 18, qualified: true },
  { name: "Соколов А.Г.", subject: "Математика", score: 84, free: ["Пн 4", "Чт 1"], load: 26, qualified: true },
  { name: "Кузнецов П.В.", subject: "Физика, Математика", score: 72, free: ["Пт 3", "Пт 5"], load: 30, qualified: false },
];

const ANALYTICS_STATS = [
  { label: "Уроков в неделю", value: "187", delta: "+3", color: "neon-blue", icon: "BookOpen" },
  { label: "Активных учителей", value: "24", delta: "+1", color: "neon-green", icon: "Users" },
  { label: "Конфликтов", value: "4", delta: "-2", color: "neon-orange", icon: "AlertTriangle" },
  { label: "Загруженность", value: "78%", delta: "+5%", color: "neon-purple", icon: "Activity" },
];

const NAV_ITEMS = [
  { id: "schedule", label: "Расписание", icon: "CalendarDays" },
  { id: "heatmap", label: "Тепловая карта", icon: "Flame" },
  { id: "analytics", label: "Аналитика", icon: "BarChart3" },
  { id: "conflicts", label: "Конфликты", icon: "AlertTriangle" },
  { id: "substitutions", label: "Замены", icon: "RefreshCcw" },
  { id: "reports", label: "Отчёты", icon: "FileBarChart" },
  { id: "teachers", label: "Учителя", icon: "GraduationCap" },
];

const SUBJECT_COLORS: Record<string, string> = {
  "Математика":      "border-l-cyan-400 bg-cyan-400/8",
  "Алгебра":         "border-l-cyan-400 bg-cyan-400/8",
  "Русский язык":    "border-l-violet-400 bg-violet-400/8",
  "Литература":      "border-l-violet-400 bg-violet-400/8",
  "Физика":          "border-l-blue-400 bg-blue-400/8",
  "История":         "border-l-amber-400 bg-amber-400/8",
  "Биология":        "border-l-green-400 bg-green-400/8",
  "Химия":           "border-l-rose-400 bg-rose-400/8",
  "Физкультура":     "border-l-orange-400 bg-orange-400/8",
  "Информатика":     "border-l-purple-400 bg-purple-400/8",
  "Английский":      "border-l-sky-400 bg-sky-400/8",
  "Обществознание":  "border-l-teal-400 bg-teal-400/8",
  "Окружающий мир":  "border-l-lime-400 bg-lime-400/8",
  "Чтение":          "border-l-pink-400 bg-pink-400/8",
  "Рисование":       "border-l-fuchsia-400 bg-fuchsia-400/8",
  "Музыка":          "border-l-yellow-400 bg-yellow-400/8",
  "Технология":      "border-l-stone-400 bg-stone-400/8",
};

function heatColor(val: number) {
  if (val >= 90) return "bg-red-500/80";
  if (val >= 75) return "bg-orange-500/70";
  if (val >= 60) return "bg-yellow-500/60";
  if (val >= 40) return "bg-emerald-500/50";
  return "bg-slate-600/40";
}

function StatCard({ label, value, delta, color, icon, delay = 0 }: { label: string; value: string; delta: string; color: string; icon: string; delay?: number }) {
  const isPositive = !delta.startsWith("-");
  const colorMap: Record<string, string> = {
    "neon-blue": "text-cyan-400",
    "neon-green": "text-emerald-400",
    "neon-orange": "text-orange-400",
    "neon-purple": "text-violet-400",
  };
  const glowMap: Record<string, string> = {
    "neon-blue": "glow-blue",
    "neon-green": "glow-green",
    "neon-orange": "glow-orange",
    "neon-purple": "glow-purple",
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 ${glowMap[color]} border border-white/5 animate-fade-in opacity-0`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${colorMap[color]}`}>
          <Icon name={icon} size={20} />
        </div>
        <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
          {delta}
        </span>
      </div>
      <div className={`text-3xl font-bold ${colorMap[color]} mb-1`}>{value}</div>
      <div className="text-xs text-white/40 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-white/90">{title}</h2>
        {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {badge && (
        <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}

const ALL_CLASSES_BY_GRADE: Record<number, string[]> = {
  1:  ["1А","1Б","1В","1Г","1Д"],
  2:  ["2А","2Б","2В","2Г","2Д"],
  3:  ["3А","3Б","3В","3Г","3Д"],
  4:  ["4А","4Б","4В","4Г","4Д"],
  5:  ["5А","5Б","5В","5Г","5Д"],
  6:  ["6А","6Б","6В","6Г","6Д"],
  7:  ["7А","7Б","7В","7Г","7Д"],
  8:  ["8А","8Б","8В","8Г","8Д"],
  9:  ["9А","9Б","9В","9Г","9Д"],
  10: ["10А","10Б","10В","10Г","10Д"],
  11: ["11А","11Б","11В","11Г","11Д"],
};

const GRADE_LABELS: Record<string, string> = {
  junior: "1–4 кл. · Начальная школа",
  middle: "5–8 кл. · Средняя школа",
  senior: "9–11 кл. · Старшая школа",
};

function getGradeGroup(grade: number): string {
  if (grade <= 4) return "junior";
  if (grade <= 8) return "middle";
  return "senior";
}

function ScheduleSection() {
  const [selectedGrade, setSelectedGrade] = useState(9);
  const [selectedClass, setSelectedClass] = useState("9А");
  const grades = Object.keys(ALL_CLASSES_BY_GRADE).map(Number);

  const handleGradeClick = (g: number) => {
    setSelectedGrade(g);
    setSelectedClass(`${g}А`);
  };

  const scheduleData = getScheduleByGrade(selectedGrade);
  const gradeGroup = getGradeGroup(selectedGrade);
  const maxPeriods = selectedGrade <= 4 ? 5 : selectedGrade <= 8 ? 6 : 7;
  const visiblePeriods = PERIODS.slice(0, maxPeriods);

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white/90">Расписание уроков</h2>
          <p className="text-sm text-white/40 mt-0.5">{GRADE_LABELS[gradeGroup]}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono font-medium">
          Класс {selectedClass} · {maxPeriods} уроков
        </span>
      </div>

      {/* Выбор параллели */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {grades.map(g => (
          <button
            key={g}
            onClick={() => handleGradeClick(g)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-200 ${
              selectedGrade === g
                ? "bg-violet-500/20 text-violet-300 border border-violet-400/35"
                : "bg-white/4 text-white/35 border border-white/6 hover:border-white/15 hover:text-white/55"
            }`}
          >
            {g} кл.
          </button>
        ))}
      </div>

      {/* Выбор класса в параллели */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {ALL_CLASSES_BY_GRADE[selectedGrade].map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedClass === cls
                ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                : "bg-white/4 text-white/50 border border-white/8 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/6">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left p-3 text-white/30 text-xs font-mono uppercase tracking-wider w-28">Урок</th>
              {DAYS.map(d => (
                <th key={d} className="text-center p-3 text-white/50 text-sm font-semibold">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiblePeriods.map((period, i) => (
              <tr key={period.num} className={`border-b border-white/4 ${i % 2 === 0 ? "bg-white/1" : ""}`}>
                <td className="p-3">
                  <div className="text-white/70 text-sm font-mono font-medium">{period.num}</div>
                  <div className="text-white/25 text-xs">{period.time}</div>
                </td>
                {DAYS.map(day => {
                  const lesson = scheduleData[day]?.[period.num];
                  const colorClass = lesson ? (SUBJECT_COLORS[lesson.subject] || "border-l-slate-400 bg-slate-400/8") : "";
                  return (
                    <td key={day} className="p-1.5">
                      {lesson ? (
                        <div className={`schedule-cell border-l-2 rounded-lg px-2.5 py-2 ${colorClass} ${lesson.conflict ? "ring-1 ring-red-500/50" : ""} cursor-pointer`}>
                          {lesson.conflict && (
                            <div className="flex items-center gap-1 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse block" />
                              <span className="text-red-400 text-[10px] font-mono">конфликт</span>
                            </div>
                          )}
                          <div className="text-white/85 text-xs font-semibold leading-tight">{lesson.subject}</div>
                          <div className="text-white/35 text-[11px] mt-0.5 leading-tight">{lesson.teacher}</div>
                          <div className="text-white/25 text-[10px] font-mono mt-0.5">каб. {lesson.room}</div>
                        </div>
                      ) : (
                        <div className="h-14 rounded-lg bg-white/1 border border-white/4 border-dashed flex items-center justify-center">
                          <span className="text-white/12 text-xs">—</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeatmapSection() {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Тепловая карта загруженности" subtitle="Кабинеты и помещения по дням и урокам" badge="Прогноз" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Пиковые часы", value: "2–4 урок", icon: "Zap", color: "text-orange-400" },
          { label: "Перегруженность", value: "14 кабинетов", icon: "AlertCircle", color: "text-red-400" },
          { label: "Рекомендация уборки", value: "Вт, Чт после 5-го", icon: "Sparkles", color: "text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-4 border border-white/6 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${s.color}`}>
              <Icon name={s.icon} size={18} />
            </div>
            <div>
              <div className="text-white/35 text-xs uppercase tracking-wider mb-0.5">{s.label}</div>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-xl p-6 border border-white/6">
        <div className="flex gap-2 mb-4">
          <span className="text-white/30 text-xs uppercase tracking-wider font-mono self-center w-24">Урок →</span>
          {DAYS.map(d => (
            <div key={d} className="flex-1 text-center text-white/50 text-sm font-semibold">{d}</div>
          ))}
        </div>
        {HEAT_DATA.map((row, ri) => (
          <div key={ri} className="flex gap-2 mb-2">
            <span className="text-white/30 text-xs font-mono self-center w-24">{PERIODS[ri]?.num} · {PERIODS[ri]?.time?.split("–")[0]}</span>
            {row.map((val, ci) => (
              <div
                key={ci}
                className={`flex-1 heat-cell h-12 flex items-center justify-center cursor-pointer ${heatColor(val)}`}
                onMouseEnter={() => setHoveredCell({ r: ri, c: ci })}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <span className="text-white/80 text-xs font-mono font-bold">
                  {hoveredCell?.r === ri && hoveredCell?.c === ci ? `${val}%` : ""}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/6 flex-wrap">
          <span className="text-white/30 text-xs">Загруженность:</span>
          {[["< 40%", "bg-slate-600/40"], ["40–60%", "bg-emerald-500/50"], ["60–75%", "bg-yellow-500/60"], ["75–90%", "bg-orange-500/70"], ["> 90%", "bg-red-500/80"]].map(([label, cls]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded ${cls}`} />
              <span className="text-white/35 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const subjects = [
    { name: "Математика", hours: 34, color: "bg-cyan-400" },
    { name: "Русский язык", hours: 28, color: "bg-violet-400" },
    { name: "Физика", hours: 22, color: "bg-blue-400" },
    { name: "История", hours: 18, color: "bg-amber-400" },
    { name: "Химия", hours: 20, color: "bg-rose-400" },
    { name: "Биология", hours: 16, color: "bg-green-400" },
    { name: "Информатика", hours: 14, color: "bg-purple-400" },
    { name: "Физкультура", hours: 30, color: "bg-orange-400" },
  ];
  const maxHours = Math.max(...subjects.map(s => s.hours));

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Аналитика расписания" subtitle="Распределение нагрузки и статистика" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ANALYTICS_STATS.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 80} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-white/6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">Часы по предметам</h3>
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-white/50 text-xs w-28 truncate">{s.name}</span>
                <div className="flex-1 bg-white/6 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${s.color} transition-all duration-700`} style={{ width: `${(s.hours / maxHours) * 100}%` }} />
                </div>
                <span className="text-white/40 text-xs font-mono w-8 text-right">{s.hours}ч</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-white/6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">Свободные слоты по дням</h3>
          <div className="space-y-2">
            {DAYS.map((day, di) => {
              const busy = Object.keys(SCHEDULE_DATA[day] || {}).length;
              const free = 7 - busy;
              return (
                <div key={di} className="flex items-center gap-3">
                  <span className="text-white/50 text-xs font-mono w-6">{day}</span>
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: 7 }).map((_, pi) => {
                      const hasLesson = !!SCHEDULE_DATA[day]?.[pi + 1];
                      return (
                        <div key={pi} className={`flex-1 h-7 rounded ${hasLesson ? "bg-cyan-400/25 border border-cyan-400/20" : "bg-white/5 border border-white/6"}`} />
                      );
                    })}
                  </div>
                  <span className="text-emerald-400/70 text-xs font-mono w-10 text-right">{free} св.</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-cyan-400/25 border border-cyan-400/20" />
              <span className="text-white/35 text-xs">Занято</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/6" />
              <span className="text-white/35 text-xs">Свободно</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictsSection() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const filtered = filter === "all" ? CONFLICTS : CONFLICTS.filter(c => c.severity === filter);

  const severityConfig = {
    high: { label: "Критичный", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
    medium: { label: "Средний", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
    low: { label: "Низкий", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  };

  const typeIcon: Record<string, string> = { double: "Users", room: "DoorOpen", load: "TrendingUp" };

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Конфликты расписания" subtitle="Автоматическое выявление и подсветка коллизий" badge={`${CONFLICTS.length} конфликтов`} />
      <div className="flex gap-2 mb-6">
        {(["all", "high", "medium", "low"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-white/10 text-white border border-white/20" : "text-white/40 hover:text-white/60"}`}
          >
            {f === "all" ? "Все" : f === "high" ? "Критичные" : f === "medium" ? "Средние" : "Низкие"}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((conflict, i) => {
          const cfg = severityConfig[conflict.severity as keyof typeof severityConfig];
          return (
            <div
              key={conflict.id}
              className={`glass-card rounded-xl p-5 border border-white/6 animate-fade-in opacity-0 ${conflict.severity === "high" ? "glow-red" : ""}`}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                  <Icon name={typeIcon[conflict.type] || "AlertTriangle"} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/85 text-sm font-semibold">{conflict.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-white/50 text-sm">{conflict.desc}</p>
                  <p className="text-white/30 text-xs mt-1">{conflict.detail}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-white/25 text-xs font-mono">{conflict.time}</div>
                  <button className={`mt-2 text-xs ${cfg.color} hover:opacity-80 transition-opacity flex items-center gap-1 ml-auto`}>
                    <Icon name="Wrench" size={12} />
                    Устранить
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubstitutionsSection() {
  const [selectedSubstitute, setSelectedSubstitute] = useState<string | null>(null);

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Подбор замены" subtitle="ИИ-ранжирование кандидатов при отсутствии учителя" />
      <div className="glass-card rounded-xl p-5 border border-orange-400/20 bg-orange-400/4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-400/15 flex items-center justify-center text-orange-400 flex-shrink-0">
          <Icon name="UserX" size={18} />
        </div>
        <div className="flex-1">
          <div className="text-white/80 font-semibold text-sm">Смирнова Н.А.</div>
          <div className="text-white/40 text-xs mt-0.5">Отсутствует · История · Классы: 8Б, 9Б, 10Б</div>
        </div>
        <div className="px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-mono">
          Требует замены
        </div>
      </div>
      <h3 className="text-white/50 text-xs uppercase tracking-wider font-mono mb-4">Рекомендованные кандидаты</h3>
      <div className="space-y-3">
        {SUBSTITUTES.map((sub, i) => (
          <div
            key={i}
            onClick={() => setSelectedSubstitute(sub.name)}
            className={`glass-card rounded-xl p-5 border cursor-pointer transition-all duration-200 animate-fade-in opacity-0 ${
              selectedSubstitute === sub.name ? "border-cyan-400/40 bg-cyan-400/5 glow-blue" : "border-white/6 hover:border-white/15"
            }`}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-white/60 font-bold text-sm border border-white/10">
                {sub.name.split(" ")[0][0]}{sub.name.split(" ")[1][0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white/85 font-semibold text-sm">{sub.name}</span>
                  {sub.qualified && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-mono">
                      Квалифицирован
                    </span>
                  )}
                </div>
                <div className="text-white/35 text-xs mt-0.5">{sub.subject}</div>
                <div className="text-white/25 text-xs mt-1 font-mono">Свободен: {sub.free.join(", ")}</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold font-mono ${sub.score >= 90 ? "text-cyan-400" : sub.score >= 75 ? "text-emerald-400" : "text-orange-400"}`}>
                  {sub.score}
                </div>
                <div className="text-white/25 text-[10px]">score</div>
                <div className="text-white/30 text-xs mt-1">{sub.load}ч / нед.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedSubstitute && (
        <div className="mt-5 p-4 rounded-xl bg-cyan-400/8 border border-cyan-400/20 flex items-center justify-between animate-scale-in">
          <div className="flex items-center gap-2 text-cyan-400 text-sm">
            <Icon name="CheckCircle" size={16} />
            <span>Выбран: <strong>{selectedSubstitute}</strong></span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-cyan-400 text-cyan-950 text-sm font-bold hover:bg-cyan-300 transition-colors">
            Назначить замену
          </button>
        </div>
      )}
    </div>
  );
}

function ReportsSection() {
  const reports = [
    { title: "Нагрузка учителей", desc: "Отчёт по часам преподавания за неделю", icon: "FileText", color: "text-cyan-400", badge: "Готов" },
    { title: "Загруженность кабинетов", desc: "Статистика использования помещений", icon: "Building2", color: "text-violet-400", badge: "Готов" },
    { title: "Конфликты за месяц", desc: "Сводный отчёт по выявленным коллизиям", icon: "AlertCircle", color: "text-orange-400", badge: "Готов" },
    { title: "Оптимизация расписания", desc: "ИИ-предложения по улучшению сетки", icon: "Sparkles", color: "text-emerald-400", badge: "Новый" },
    { title: "Замены за семестр", desc: "История всех замен учителей", icon: "RefreshCcw", color: "text-rose-400", badge: "Готов" },
    { title: "Свободные слоты", desc: "Доступное время для мероприятий и консультаций", icon: "Clock", color: "text-amber-400", badge: "Готов" },
  ];

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Отчёты и экспорт" subtitle="Аналитические документы для администрации" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-5 border border-white/6 hover:border-white/15 transition-all duration-200 cursor-pointer group animate-fade-in opacity-0"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${r.color} group-hover:scale-110 transition-transform`}>
                <Icon name={r.icon} size={18} />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${r.badge === "Новый" ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400" : "bg-white/6 border border-white/10 text-white/40"}`}>
                {r.badge}
              </span>
            </div>
            <h3 className="text-white/85 font-semibold text-sm mb-1">{r.title}</h3>
            <p className="text-white/35 text-xs leading-relaxed">{r.desc}</p>
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/6">
              <button className={`flex items-center gap-1.5 text-xs ${r.color} hover:opacity-80 transition-opacity`}>
                <Icon name="Eye" size={12} />
                Просмотр
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                <Icon name="Download" size={12} />
                Экспорт PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeachersSection() {
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
      <SectionHeader title="Управление учителями" subtitle="Нагрузка, компетенции и ролевые права" badge={`${TEACHERS.length} педагогов`} />
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {["all", "active", "leave"].map(f => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === f ? "bg-white/10 text-white border border-white/20" : "text-white/40 hover:text-white/60"}`}
            >
              {f === "all" ? "Все" : f === "active" ? "На работе" : "В отпуске"}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium hover:bg-cyan-400/15 transition-colors">
          <Icon name="UserPlus" size={13} />
          Добавить
        </button>
      </div>
      <div className="space-y-3">
        {TEACHERS.filter(t => roleFilter === "all" || t.status === roleFilter).map((t, i) => (
          <div
            key={t.id}
            className="glass-card rounded-xl p-4 border border-white/6 hover:border-white/12 transition-all animate-fade-in opacity-0"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/25 to-cyan-500/20 flex items-center justify-center text-white/70 font-bold text-sm border border-white/10">
                  {t.name.split(" ")[0][0]}{t.name.split(" ")[1]?.[0]}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${t.status === "active" ? "bg-emerald-400" : "bg-orange-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white/85 font-semibold text-sm">{t.name}</span>
                  <span className="text-white/25 text-xs px-1.5 py-0.5 rounded bg-white/5 font-mono">{t.role}</span>
                </div>
                <div className="text-white/40 text-xs mt-0.5 truncate">{t.subject}</div>
              </div>
              <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                {t.classes.slice(0, 3).map(cls => (
                  <span key={cls} className="px-1.5 py-0.5 rounded bg-white/6 border border-white/10 text-white/40 text-[10px] font-mono">{cls}</span>
                ))}
                {t.classes.length > 3 && <span className="text-white/25 text-[10px]">+{t.classes.length - 3}</span>}
              </div>
              <div className="flex-shrink-0 w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/30 font-mono">{t.load}ч</span>
                  <span className="text-white/20 font-mono">{t.maxLoad}ч</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${t.load / t.maxLoad > 0.85 ? "bg-orange-400" : t.load / t.maxLoad > 0.7 ? "bg-cyan-400" : "bg-emerald-400"}`}
                    style={{ width: `${(t.load / t.maxLoad) * 100}%` }}
                  />
                </div>
              </div>
              <button className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
                <Icon name="MoreHorizontal" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type AppScreen = "landing" | "register" | "dashboard";
type UserRole = "student" | "teacher" | "admin";

const ROLES: { id: UserRole; label: string; icon: string; desc: string; color: string }[] = [
  { id: "student", label: "Ученик", icon: "BookOpen", desc: "Просмотр расписания и уведомления", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/8" },
  { id: "teacher", label: "Учитель", icon: "GraduationCap", desc: "Расписание, замены и нагрузка", color: "text-violet-400 border-violet-400/30 bg-violet-400/8" },
  { id: "admin", label: "Администратор", icon: "Shield", desc: "Полный доступ ко всей системе", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8" },
];

function LandingPage({ onRegister, onLogin }: { onRegister: () => void; onLogin: () => void }) {
  const features = [
    { icon: "Search", label: "Поиск слотов", desc: "Свободное время для мероприятий и консультаций" },
    { icon: "Flame", label: "Тепловая карта", desc: "Прогноз загруженности кабинетов" },
    { icon: "AlertTriangle", label: "Конфликты", desc: "Автовыявление двойных записей" },
    { icon: "RefreshCcw", label: "Замены", desc: "ИИ-подбор кандидатов при болезни" },
  ];

  return (
    <div className="mesh-bg min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center glow-blue">
            <Icon name="BrainCircuit" size={18} />
          </div>
          <span className="text-white font-bold text-base">Умное расписание</span>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/12 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
        >
          <Icon name="LogIn" size={15} />
          Личный кабинет
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse block" />
            Интеллектуальная система управления расписанием
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-4 tracking-tight">
            Умное
            <br />
            <span className="text-gradient-multi">расписание</span>
          </h1>

          <p className="text-white/45 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Не просто таблица — активный помощник, который анализирует, предупреждает о конфликтах и предлагает решения
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onRegister}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-base hover:opacity-90 transition-all glow-blue shadow-lg"
            >
              <Icon name="UserPlus" size={18} />
              Зарегистрироваться
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white/80 font-semibold text-base hover:bg-white/10 hover:text-white transition-all"
            >
              <Icon name="LogIn" size={18} />
              Войти в кабинет
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl w-full">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-4 border border-white/6 text-center animate-fade-in opacity-0"
              style={{ animationDelay: `${200 + i * 80}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                <Icon name={f.icon} size={18} />
              </div>
              <div className="text-white/80 text-sm font-semibold mb-1">{f.label}</div>
              <div className="text-white/35 text-xs leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function RegisterPage({ onBack, onComplete }: { onBack: () => void; onComplete: (role: UserRole) => void }) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<"role" | "form">("role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNext = () => {
    if (selectedRole) setStep("form");
  };

  const handleSubmit = () => {
    if (selectedRole) onComplete(selectedRole);
  };

  return (
    <div className="mesh-bg min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-scale-in opacity-0" style={{ animationFillMode: "forwards" }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-white/35 text-sm hover:text-white/60 transition-colors mb-8">
          <Icon name="ArrowLeft" size={14} />
          Назад
        </button>

        {step === "role" ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Кто вы?</h2>
              <p className="text-white/40 text-sm">Выберите роль для настройки доступа</p>
            </div>

            <div className="space-y-3 mb-8">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === role.id ? role.color : "border-white/8 bg-white/3 hover:border-white/15"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedRole === role.id ? role.color.split(" ")[2] : "bg-white/5"}`}>
                    <Icon name={role.icon} size={20} className={selectedRole === role.id ? role.color.split(" ")[0] : "text-white/40"} />
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-bold text-sm ${selectedRole === role.id ? role.color.split(" ")[0] : "text-white/70"}`}>{role.label}</div>
                    <div className="text-white/35 text-xs mt-0.5">{role.desc}</div>
                  </div>
                  {selectedRole === role.id && (
                    <Icon name="CheckCircle" size={18} className={role.color.split(" ")[0]} />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedRole}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Продолжить
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${ROLES.find(r => r.id === selectedRole)?.color.split(" ").slice(1).join(" ")}`}>
                <Icon name={ROLES.find(r => r.id === selectedRole)?.icon || "User"} size={22} className={ROLES.find(r => r.id === selectedRole)?.color.split(" ")[0]} />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Создать аккаунт</h2>
              <p className="text-white/40 text-sm">{ROLES.find(r => r.id === selectedRole)?.label}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-1.5">Имя и фамилия</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иванов Иван"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/85 placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-1.5">Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@school.ru"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/85 placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-mono uppercase tracking-wider mb-1.5">Пароль</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/85 placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-all"
            >
              Зарегистрироваться
            </button>
            <button
              onClick={() => setStep("role")}
              className="w-full mt-2 py-2 text-white/30 text-xs hover:text-white/50 transition-colors"
            >
              Изменить роль
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Доступ по ролям ───────────────────────────────────────────────────────────
const ROLE_NAV: Record<UserRole, string[]> = {
  student: ["schedule", "teachers"],
  teacher: ["schedule", "heatmap", "substitutions", "reports", "teachers"],
  admin:   ["schedule", "heatmap", "analytics", "conflicts", "substitutions", "reports", "teachers"],
};

const ROLE_CONFIG: Record<UserRole, { label: string; sublabel: string; icon: string; iconColor: string; iconBg: string }> = {
  student: { label: "Ученик",          sublabel: "Просмотр расписания", icon: "BookOpen", iconColor: "text-cyan-400",   iconBg: "from-cyan-500/30 to-cyan-500/10" },
  teacher: { label: "Учитель",         sublabel: "Управление занятиями", icon: "GraduationCap", iconColor: "text-violet-400", iconBg: "from-violet-500/30 to-violet-500/10" },
  admin:   { label: "Администратор",   sublabel: "Полный доступ",        icon: "Shield",    iconColor: "text-emerald-400", iconBg: "from-emerald-500/30 to-emerald-500/10" },
};

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [activeSection, setActiveSection] = useState("schedule");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const conflictCount = CONFLICTS.length;

  const allowedNav = NAV_ITEMS.filter(item => ROLE_NAV[currentRole].includes(item.id));
  const currentNav = allowedNav.find(n => n.id === activeSection) ?? allowedNav[0];

  if (screen === "landing") {
    return (
      <LandingPage
        onRegister={() => setScreen("register")}
        onLogin={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterPage
        onBack={() => setScreen("landing")}
        onComplete={(role) => { setCurrentRole(role); setActiveSection("schedule"); setScreen("dashboard"); }}
      />
    );
  }

  const renderSection = () => {
    const section = ROLE_NAV[currentRole].includes(activeSection) ? activeSection : "schedule";
    switch (section) {
      case "schedule":      return <ScheduleSection />;
      case "heatmap":       return <HeatmapSection />;
      case "analytics":     return <AnalyticsSection />;
      case "conflicts":     return <ConflictsSection />;
      case "substitutions": return <SubstitutionsSection />;
      case "reports":       return <ReportsSection />;
      case "teachers":      return <TeachersSection />;
      default:              return <ScheduleSection />;
    }
  };

  const roleCfg = ROLE_CONFIG[currentRole];

  return (
    <div className="mesh-bg min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-white/6 bg-black/30 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>
        <div className={`p-4 border-b border-white/6 flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0 glow-blue">
            <Icon name="BrainCircuit" size={16} />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in-left">
              <div className="text-white font-bold text-sm leading-tight">Умное расписание</div>
              <div className="text-white/30 text-[10px] font-mono">2025–2026</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {allowedNav.map(item => {
            const isActive = (currentNav?.id ?? "schedule") === item.id;
            const hasConflict = item.id === "conflicts" && conflictCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "active bg-cyan-400/10 text-cyan-400" : "text-white/40 hover:bg-white/5 hover:text-white/70"
                } ${sidebarOpen ? "" : "justify-center"}`}
              >
                <div className="relative flex-shrink-0">
                  <Icon name={item.icon} size={18} />
                  {hasConflict && !sidebarOpen && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
                      {conflictCount}
                    </span>
                  )}
                </div>
                {sidebarOpen && <span className="flex-1 text-left truncate">{item.label}</span>}
                {sidebarOpen && hasConflict && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-mono animate-pulse">
                    {conflictCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role switcher (dev) + user info */}
        <div className={`p-3 border-t border-white/6 space-y-2 ${sidebarOpen ? "" : "flex flex-col items-center"}`}>
          {sidebarOpen && (
            <div className="flex gap-1">
              {(["student","teacher","admin"] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => { setCurrentRole(r); setActiveSection("schedule"); }}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono transition-all ${currentRole === r ? "bg-white/12 text-white/70" : "text-white/25 hover:text-white/45"}`}
                >
                  {r === "student" ? "Уч-к" : r === "teacher" ? "Учит." : "Адм."}
                </button>
              ))}
            </div>
          )}
          {sidebarOpen ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleCfg.iconBg} flex items-center justify-center border border-white/10`}>
                <Icon name={roleCfg.icon} size={13} className={roleCfg.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/60 text-xs font-medium truncate">{roleCfg.label}</div>
                <div className="text-white/25 text-[10px] font-mono">{roleCfg.sublabel}</div>
              </div>
              <button onClick={() => setScreen("landing")} className="text-white/20 hover:text-white/50 transition-colors">
                <Icon name="LogOut" size={13} />
              </button>
            </div>
          ) : (
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleCfg.iconBg} flex items-center justify-center border border-white/10`}>
              <Icon name={roleCfg.icon} size={13} className={roleCfg.iconColor} />
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-background border border-white/15 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors shadow-lg"
        >
          <Icon name={sidebarOpen ? "ChevronLeft" : "ChevronRight"} size={12} />
        </button>
      </aside>

      {/* Main */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
        <header className="sticky top-0 z-30 border-b border-white/6 bg-black/20 backdrop-blur-xl px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name={currentNav?.icon || "CalendarDays"} size={16} className="text-white/40" />
            <h1 className="text-white/80 text-sm font-semibold">{currentNav?.label}</h1>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {/* Роль текущего пользователя */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
              currentRole === "student" ? "bg-cyan-400/8 border-cyan-400/20 text-cyan-400" :
              currentRole === "teacher" ? "bg-violet-400/8 border-violet-400/20 text-violet-400" :
              "bg-emerald-400/8 border-emerald-400/20 text-emerald-400"
            }`}>
              <Icon name={roleCfg.icon} size={11} />
              {roleCfg.label}
            </div>
            {currentRole === "admin" && (
              <button className="relative w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                <Icon name="Bell" size={15} />
                {conflictCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
                    {conflictCount}
                  </span>
                )}
              </button>
            )}
            <button className="w-8 h-8 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
              <Icon name="Settings" size={15} />
            </button>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}