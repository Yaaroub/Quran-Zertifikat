"use client";

import { useEffect, useMemo, useState } from "react";

type CertificateMode = "winner" | "participant";
type WinnerRank = "الأول" | "الثاني" | "الثالث";
type StudentGroup = "boys" | "girls";
type Gender = "male" | "female";

type StudentEntry = {
  id: string;
  name: string;
  surah: string;
  gender: Gender;
};

const STORAGE_KEY = "ramadan-certificate-students-v3";

const DEFAULT_BOYS_STUDENTS: StudentEntry[] = [
  // سورة محمد
  { id: "b1", name: "يوسف أسامة الجبري", surah: "سورة محمد", gender: "male" },
  { id: "b2", name: "محمد أمين بونوادر", surah: "سورة محمد", gender: "male" },

  // سورة نوح
  { id: "b3", name: "إلياس الشاهدي", surah: "سورة نوح", gender: "male" },
  { id: "b4", name: "عبد الرحمن القرشي", surah: "سورة نوح", gender: "male" },
  { id: "b5", name: "ياسر بونوادر", surah: "سورة نوح", gender: "male" },
  { id: "b6", name: "أيوب وراسنة", surah: "سورة نوح", gender: "male" },
  { id: "b7", name: "سراج وراسنة", surah: "سورة نوح", gender: "male" },
  { id: "b8", name: "يمان الأحمد", surah: "سورة نوح", gender: "male" },
  { id: "b9", name: "آدم هاني", surah: "سورة نوح", gender: "male" },
  { id: "b10", name: "عبد الرحمن الأحمد", surah: "سورة نوح", gender: "male" },
  { id: "b11", name: "منير كوري", surah: "سورة نوح", gender: "male" },

  // سورة الغاشية [cite: 1]
  { id: "b12", name: "تيم الله الأحمد", surah: "سورة الغاشية", gender: "male" },
  { id: "b13", name: "إسحاق فاهم", surah: "سورة الغاشية", gender: "male" },
  { id: "b14", name: "وليد اليخلوفي", surah: "سورة الغاشية", gender: "male" },
  { id: "b15", name: "محمد نور المجيد", surah: "سورة الغاشية", gender: "male" },
  { id: "b16", name: "علاء المجيد", surah: "سورة الغاشية", gender: "male" },

  // سورة المطففين [cite: 1]
  { id: "b17", name: "ياسين وراسنة", surah: "سورة المطففين", gender: "male" },
  {
    id: "b18",
    name: "عبد الله القرشي",
    surah: "سورة المطففين",
    gender: "male",
  },
  {
    id: "b19",
    name: "إلياس أسامة الجبري",
    surah: "سورة المطففين",
    gender: "male",
  },
  {
    id: "b20",
    name: "يوسف ياسر الجبري",
    surah: "سورة المطففين",
    gender: "male",
  },

  // سورة الهمزة [cite: 1]
  { id: "b21", name: "محمد شكري الجبري", surah: "سورة الهمزة", gender: "male" },
  { id: "b22", name: "آدم راشد", surah: "سورة الهمزة", gender: "male" },
  { id: "b23", name: "محمد هاني", surah: "سورة الهمزة", gender: "male" },
  { id: "b24", name: "محمد عبد الله", surah: "سورة الهمزة", gender: "male" },
  { id: "b25", name: "يوسف شواطي", surah: "سورة الهمزة", gender: "male" },
];

const DEFAULT_GIRLS_STUDENTS: StudentEntry[] = [
  // سورة محمد
  { id: "g1", name: "ريماس الأحمد", surah: "سورة محمد", gender: "female" },
  { id: "g2", name: "بيلسان الأحمد", surah: "سورة محمد", gender: "female" },

  // سورة الفيل
  { id: "g3", name: "سدرة عقلان", surah: "سورة الفيل", gender: "female" },
  { id: "g4", name: "سلمى سمران", surah: "سورة الفيل", gender: "female" },
  { id: "g5", name: "ياسمين اليخلوفي", surah: "سورة الفيل", gender: "female" },
  { id: "g6", name: "ندى راشد", surah: "سورة الفيل", gender: "female" },
  { id: "g7", name: "علياء فليسات", surah: "سورة الفيل", gender: "female" },
  { id: "g8", name: "ليان عبد العزيز", surah: "سورة الفيل", gender: "female" },

  // سورة الإنشقاق
  { id: "g9", name: "يقين الأحمد", surah: "سورة الإنشقاق", gender: "female" },
  { id: "g10", name: "أمينة شواطي", surah: "سورة الإنشقاق", gender: "female" },
  { id: "g11", name: "سمية القرشي", surah: "سورة الإنشقاق", gender: "female" },
  { id: "g12", name: "آسية بونوادر", surah: "سورة الإنشقاق", gender: "female" },
  { id: "g13", name: "حليمة شواطي", surah: "سورة الإنشقاق", gender: "female" },
  { id: "g14", name: "سارة الجبري", surah: "سورة الإنشقاق", gender: "female" },

  // سورة المدثر
  { id: "g15", name: "نورة الشاهدي", surah: "سورة المدثر", gender: "female" },
  {
    id: "g16",
    name: "نوران عبد العزيز",
    surah: "سورة المدثر",
    gender: "female",
  },

  // سورة النور
  { id: "g17", name: "بلقيس الذبحاني", surah: "سورة النور", gender: "female" },
];

const DEFAULT_SURAHS = [
  "سورة الفاتحة",
  "سورة البقرة",
  "سورة آل عمران",
  "سورة النساء",
  "سورة المائدة",
  "سورة الأنعام",
  "سورة الأعراف",
  "سورة الأنفال",
  "سورة التوبة",
  "سورة يونس",
  "سورة هود",
  "سورة يوسف",
  "سورة الرعد",
  "سورة إبراهيم",
  "سورة الحجر",
  "سورة النحل",
  "سورة الإسراء",
  "سورة الكهف",
  "سورة مريم",
  "سورة طه",
  "سورة الأنبياء",
  "سورة الحج",
  "سورة المؤمنون",
  "سورة النور",
  "سورة الفرقان",
  "سورة الشعراء",
  "سورة النمل",
  "سورة القصص",
  "سورة العنكبوت",
  "سورة الروم",
  "سورة لقمان",
  "سورة السجدة",
  "سورة الأحزاب",
  "سورة سبإ",
  "سورة فاطر",
  "سورة يس",
  "سورة الصافات",
  "سورة ص",
  "سورة الزمر",
  "سورة غافر",
  "سورة فصلت",
  "سورة الشورى",
  "سورة الزخرف",
  "سورة الدخان",
  "سورة الجاثية",
  "سورة الأحقاف",
  "سورة محمد",
  "سورة الفتح",
  "سورة الحجرات",
  "سورة ق",
  "سورة الذاريات",
  "سورة الطور",
  "سورة النجم",
  "سورة القمر",
  "سورة الرحمن",
  "سورة الواقعة",
  "سورة الحديد",
  "سورة المجادلة",
  "سورة الحشر",
  "سورة الممتحنة",
  "سورة الصف",
  "سورة الجمعة",
  "سورة المنافقون",
  "سورة التغابن",
  "سورة الطلاق",
  "سورة التحريم",
  "سورة الملك",
  "سورة القلم",
  "سورة الحاقة",
  "سورة المعارج",
  "سورة نوح",
  "سورة الجن",
  "سورة المزمل",
  "سورة المدثر",
  "سورة القيامة",
  "سورة الإنسان",
  "سورة المرسلات",
  "سورة النبأ",
  "سورة النازعات",
  "سورة عبس",
  "سورة التكوير",
  "سورة الانفطار",
  "سورة المطففين",
  "سورة الانشقاق",
  "سورة البروج",
  "سورة الطارق",
  "سورة الأعلى",
  "سورة الغاشية",
  "سورة الفجر",
  "سورة البلد",
  "سورة الشمس",
  "سورة الليل",
  "سورة الضحى",
  "سورة الشرح",
  "سورة التين",
  "سورة العلق",
  "سورة القدر",
  "سورة البينة",
  "سورة الزلزلة",
  "سورة العاديات",
  "سورة القارعة",
  "سورة التكاثر",
  "سورة العصر",
  "سورة الهمزة",
  "سورة الفيل",
  "سورة قريش",
  "سورة الماعون",
  "سورة الكوثر",
  "سورة الكافرون",
  "سورة النصر",
  "سورة المسد",
  "سورة الإخلاص",
  "سورة الفلق",
  "سورة الناس",
];

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function Page() {
  const [group, setGroup] = useState<StudentGroup>("boys");
  const [mode, setMode] = useState<CertificateMode>("winner");
  const [rank, setRank] = useState<WinnerRank>("الأول");

  const [boysStudents, setBoysStudents] = useState<StudentEntry[]>(
    DEFAULT_BOYS_STUDENTS,
  );
  const [girlsStudents, setGirlsStudents] = useState<StudentEntry[]>(
    DEFAULT_GIRLS_STUDENTS,
  );

  const [studentId, setStudentId] = useState<string>(
    DEFAULT_BOYS_STUDENTS[0]?.id ?? "",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [templatePath, setTemplatePath] = useState(
    "/images/quran-certificate-template.png",
  );
  const [dateText, setDateText] = useState("رمضان 1447هـ / 2026م");
  const [signatureText, setSignatureText] = useState("إدارة الجمعية");

  const [introMale, setIntroMale] = useState("يسعدنا تقديم هذه الشهادة للطالب");
  const [introFemale, setIntroFemale] = useState(
    "يسعدنا تقديم هذه الشهادة للطالبة",
  );
  const [thanksMale, setThanksMale] = useState(
    "كما نتقدم بالشكر لولي أمره ولمن قام بتحفيظه.",
  );
  const [thanksFemale, setThanksFemale] = useState(
    "كما نتقدم بالشكر لولي أمرها ولمن قام بتحفيظها.",
  );

  const [draftName, setDraftName] = useState("");
  const [draftSurah, setDraftSurah] = useState("سورة محمد");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        boys?: StudentEntry[];
        girls?: StudentEntry[];
      };

      if (parsed.boys?.length) setBoysStudents(parsed.boys);
      if (parsed.girls?.length) setGirlsStudents(parsed.girls);
    } catch {
      // ignore invalid localStorage
    }
  }, []);

  const students = group === "boys" ? boysStudents : girlsStudents;
  const setStudents = group === "boys" ? setBoysStudents : setGirlsStudents;
  const fallbackGender: Gender = group === "boys" ? "male" : "female";

  useEffect(() => {
    if (!students.length) {
      setStudentId("");
      setDraftName("");
      setDraftSurah(DEFAULT_SURAHS[0]);
      return;
    }

    const currentExists = students.some((s) => s.id === studentId);
    const nextSelectedId = currentExists ? studentId : students[0].id;
    setStudentId(nextSelectedId);

    const selected = students.find((s) => s.id === nextSelectedId);
    if (selected) {
      setDraftName(selected.name);
      setDraftSurah(selected.surah);
    }
  }, [group, studentId, students]);

  useEffect(() => {
    if (!saveMessage) return;
    const t = window.setTimeout(() => setSaveMessage(""), 2200);
    return () => window.clearTimeout(t);
  }, [saveMessage]);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim();
    if (!q) return students;
    return students.filter((s) => s.name.includes(q) || s.surah.includes(q));
  }, [students, searchTerm]);

  const selectedEntry = students.find((s) => s.id === studentId) ?? null;

  const selectedGender = selectedEntry?.gender ?? fallbackGender;
  const selectedSurah = selectedEntry?.surah ?? "سورة محمد";
  const selectedName = selectedEntry?.name ?? "";

  const introText = selectedGender === "female" ? introFemale : introMale;
  const closingThanks = selectedGender === "female" ? thanksFemale : thanksMale;

const achievementText = useMemo(() => {
  if (mode === "winner") {
    return selectedGender === "female" ? (
      <>
        لحصولها على المركز <strong>{rank}</strong> في مسابقة رمضان لحفظ{" "}
        <strong>{selectedSurah}</strong>
      </>
    ) : (
      <>
        لحصوله على المركز <strong>{rank}</strong> في مسابقة رمضان لحفظ{" "}
        <strong>{selectedSurah}</strong>
      </>
    );
  }

  return selectedGender === "female" ? (
    <>
      لمشاركتها الطيبة في مسابقة رمضان لحفظ <strong>{selectedSurah}</strong>
    </>
  ) : (
    <>
      لمشاركته الطيبة في مسابقة رمضان لحفظ <strong>{selectedSurah}</strong>
    </>
  );
}, [mode, rank, selectedGender, selectedSurah]);
  const selectStudent = (id: string) => {
    setStudentId(id);
    const found = students.find((s) => s.id === id);
    if (!found) return;
    setDraftName(found.name);
    setDraftSurah(found.surah);
  };

  const handleAddNew = () => {
    const newEntry: StudentEntry = {
      id: generateId(),
      name: group === "girls" ? "طالبة جديدة" : "طالب جديد",
      surah: DEFAULT_SURAHS[0],
      gender: fallbackGender,
    };

    const updated = [...students, newEntry];
    setStudents(updated);
    setStudentId(newEntry.id);
    setDraftName(newEntry.name);
    setDraftSurah(newEntry.surah);
    setSaveMessage("تمت إضافة المتسابق");
  };

  const handleDelete = () => {
    if (!selectedEntry) return;

    const updated = students.filter((s) => s.id !== selectedEntry.id);
    setStudents(updated);

    if (updated.length) {
      setStudentId(updated[0].id);
      setDraftName(updated[0].name);
      setDraftSurah(updated[0].surah);
    } else {
      setStudentId("");
      setDraftName("");
      setDraftSurah(DEFAULT_SURAHS[0]);
    }

    setSaveMessage("تم حذف المتسابق");
  };

  const handleUpdateSave = () => {
    if (!selectedEntry) return;
    const cleanName = draftName.trim();
    if (!cleanName) {
      setSaveMessage("الاسم مطلوب");
      return;
    }

    const updated = students.map((s) =>
      s.id === selectedEntry.id
        ? { ...s, name: cleanName, surah: draftSurah, gender: fallbackGender }
        : s,
    );

    setStudents(updated);
    setStudentId(selectedEntry.id);
    setSaveMessage("تم حفظ التعديلات");
  };

  const handleSaveAll = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          boys: boysStudents,
          girls: girlsStudents,
        }),
      );
      setSaveMessage("تم حفظ جميع البيانات");
    } catch {
      setSaveMessage("تعذر الحفظ");
    }
  };

  const handleResetDefaults = () => {
    const ok = window.confirm("هل تريد إعادة القوائم الأصلية؟");
    if (!ok) return;

    setBoysStudents(DEFAULT_BOYS_STUDENTS);
    setGirlsStudents(DEFAULT_GIRLS_STUDENTS);

    if (group === "boys") {
      setStudentId(DEFAULT_BOYS_STUDENTS[0]?.id ?? "");
      setDraftName(DEFAULT_BOYS_STUDENTS[0]?.name ?? "");
      setDraftSurah(DEFAULT_BOYS_STUDENTS[0]?.surah ?? DEFAULT_SURAHS[0]);
    } else {
      setStudentId(DEFAULT_GIRLS_STUDENTS[0]?.id ?? "");
      setDraftName(DEFAULT_GIRLS_STUDENTS[0]?.name ?? "");
      setDraftSurah(DEFAULT_GIRLS_STUDENTS[0]?.surah ?? DEFAULT_SURAHS[0]);
    }

    localStorage.removeItem(STORAGE_KEY);
    setSaveMessage("تمت إعادة القوائم الأصلية");
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top,#164f4b_0%,#0e3935_45%,#082825_100%)] px-3 py-4 sm:px-4 sm:py-6 lg:px-6"
    >
      <style>{`
        @media print {
          @page {
            size: 297mm 210mm;
            margin: 0;
          }

          .no-print {
            display: none !important;
          }

          body, main {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-shell {
            width: 297mm !important;
            height: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
          }

          .certificate-root {
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px]">
        <div className="no-print mb-4 overflow-hidden rounded-[28px] border border-[#d8bd7a]/35 bg-white/8 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-[#f5e2ad]/10 via-white/5 to-[#f5e2ad]/10 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-lg font-bold text-[#f6ebcf] sm:text-xl">
                  لوحة تصميم الشهادات
                </h1>
                <p className="text-xs text-[#efe2bb]/80 sm:text-sm">
                  إدارة احترافية للمتسابقين مع تحديث وحفظ وتعديل مباشر
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full bg-gradient-to-b from-[#f4d794] to-[#b98d3e] px-5 py-2.5 text-sm font-bold text-[#2f220d] shadow-lg transition hover:scale-[1.02]"
                >
                  طباعة الشهادة
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:bg-white/15"
                >
                  حفظ الكل
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="rounded-full bg-[#7b2d2d] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                >
                  استعادة الأصل
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-4 py-4 sm:px-5">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as StudentGroup)}
              className="min-w-[170px] rounded-2xl border border-white/15 bg-[#fff9ee] px-4 py-3 text-sm font-bold text-[#241d15] shadow-sm outline-none"
            >
              <option value="boys">المتسابقون</option>
              <option value="girls">المتسابقات</option>
            </select>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as CertificateMode)}
              className="min-w-[170px] rounded-2xl border border-white/15 bg-[#fff9ee] px-4 py-3 text-sm font-bold text-[#241d15] shadow-sm outline-none"
            >
              <option value="winner">شهادة فائز</option>
              <option value="participant">شهادة مشاركة</option>
            </select>

            {mode === "winner" && (
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as WinnerRank)}
                className="min-w-[170px] rounded-2xl border border-white/15 bg-[#fff9ee] px-4 py-3 text-sm font-bold text-[#241d15] shadow-sm outline-none"
              >
                <option value="الأول">المركز الأول</option>
                <option value="الثاني">المركز الثاني</option>
                <option value="الثالث">المركز الثالث</option>
              </select>
            )}

            <select
              value={studentId}
              onChange={(e) => selectStudent(e.target.value)}
              className="min-w-[220px] flex-1 rounded-2xl border border-white/15 bg-[#fff9ee] px-4 py-3 text-sm font-bold text-[#241d15] shadow-sm outline-none"
            >
              {students.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(320px,1fr)_480px]">
          <section className="print-shell order-2 xl:order-1">
            <div className="sticky top-4 flex justify-center xl:top-6">
              <div className="certificate-root relative aspect-[1123/794] w-full max-w-[1400px] overflow-hidden rounded-[26px] border border-[#e5d2a0]/35 bg-[#f5edde] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                <img
                  src={templatePath}
                  alt="certificate template"
                  className="absolute inset-0 h-full w-full "
                />

                <div className="absolute inset-0 text-center text-[#2a2522]">
                  <div className="absolute left-[14%] right-[14%] top-[46.5%] text-[clamp(13px,1.85vw,27px)] font-medium leading-[1.8] text-[#2f2824]">
                    {introText}
                  </div>

                  <div className="absolute left-1/2 top-[52%] w-[56%] -translate-x-1/2 px-3 text-[clamp(20px,3vw,44px)] font-extrabold leading-none tracking-tight text-[#1d1815]">
                    {selectedName || "........................"}
                  </div>

                  <div className="absolute left-[13.5%] right-[13.5%] top-[58%] text-[clamp(15px,2vw,35px)] leading-[2] text-[#2f2824]">
                    {" "}
                    <div>{achievementText}</div>
                    <div>{closingThanks}</div>
                  </div>
                  <div className="absolute left-[12%] top-[35%] w-[20%] -rotate-[45deg] text-center text-[clamp(11px,1.2vw,18px)] font-semibold tracking-wide text-[#5e5146] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                    {" "}
                    {dateText}
                  </div>

                  <div className="absolute left-[10.4%] bottom-[20%] w-[24%] text-center text-[clamp(11px,1.2vw,19px)] font-bold text-[#2b2521]">
                    {signatureText}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="no-print order-1 xl:order-2 space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-white/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#1f1a17]">
                  إدارة المتسابقين
                </h2>
                {saveMessage ? (
                  <span className="rounded-full bg-[#eaf7ef] px-3 py-1 text-xs font-bold text-[#23613a]">
                    {saveMessage}
                  </span>
                ) : null}
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث بالاسم أو السورة"
                  className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none transition focus:border-[#b99652]"
                />

                <button
                  type="button"
                  onClick={handleAddNew}
                  className="rounded-2xl bg-gradient-to-b from-[#f2d38e] to-[#bc9347] px-4 py-3 text-sm font-bold text-[#2f220d] shadow"
                >
                  + إضافة
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!selectedEntry}
                  className="rounded-2xl bg-[#8d2d2d] px-4 py-3 text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  حذف
                </button>
              </div>

              <div className="mb-4 max-h-[280px] space-y-2 overflow-auto rounded-3xl border border-[#eadfca] bg-[#fbf8f2] p-3">
                {filteredStudents.map((entry) => {
                  const active = entry.id === studentId;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => selectStudent(entry.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-right transition ${
                        active
                          ? "border-[#b99652] bg-white shadow-md"
                          : "border-transparent bg-[#fffaf1] hover:border-[#e2cfaa]"
                      }`}
                    >
                      <div className="text-sm font-extrabold text-[#1f1a17]">
                        {entry.name}
                      </div>
                      <div className="mt-1 text-xs font-medium text-[#7a6f64]">
                        {entry.surah}
                      </div>
                    </button>
                  );
                })}

                {!filteredStudents.length ? (
                  <div className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-[#7a6f64]">
                    لا توجد نتائج
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-[#eadfca] bg-gradient-to-br from-[#fffaf0] to-[#f8f2e6] p-4">
                <h3 className="mb-4 text-sm font-extrabold text-[#2b2521]">
                  تحرير المتسابق المحدد
                </h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      الاسم
                    </label>
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none transition focus:border-[#b99652]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      السورة
                    </label>
                    <select
                      value={draftSurah}
                      onChange={(e) => setDraftSurah(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none transition focus:border-[#b99652]"
                    >
                      {DEFAULT_SURAHS.map((surah) => (
                        <option key={surah} value={surah}>
                          {surah}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateSave}
                    disabled={!selectedEntry}
                    className="rounded-2xl bg-[#123f3a] px-5 py-3 text-sm font-bold text-white shadow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Update speichern
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur sm:p-5">
              <h2 className="mb-4 text-lg font-bold text-[#1f1a17]">
                إعدادات النص
              </h2>

              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      مقدمة الذكور
                    </label>
                    <input
                      value={introMale}
                      onChange={(e) => setIntroMale(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      مقدمة الإناث
                    </label>
                    <input
                      value={introFemale}
                      onChange={(e) => setIntroFemale(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      شكر الذكور
                    </label>
                    <input
                      value={thanksMale}
                      onChange={(e) => setThanksMale(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      شكر الإناث
                    </label>
                    <input
                      value={thanksFemale}
                      onChange={(e) => setThanksFemale(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      التاريخ
                    </label>
                    <input
                      value={dateText}
                      onChange={(e) => setDateText(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#3c342d]">
                      التوقيع
                    </label>
                    <input
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#3c342d]">
                    مسار صورة الخلفية
                  </label>
                  <input
                    value={templatePath}
                    onChange={(e) => setTemplatePath(e.target.value)}
                    className="w-full rounded-2xl border border-[#d7d0c3] bg-white px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
