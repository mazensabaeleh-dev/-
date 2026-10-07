import React, { useState } from 'react';
import { HollandAssessmentResult, HollandDimensionCode } from '../types';
import { RiasecChart } from './RiasecChart';
import { CounselorView } from './CounselorView';
import {
  Compass,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Printer,
  ChevronDown,
  Sparkles,
  User,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ResultsViewProps {
  result: HollandAssessmentResult;
  onRetake: () => void;
  onNewStudent: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRetake,
  onNewStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'counselor'>('student');
  const [expandedDimension, setExpandedDimension] = useState<HollandDimensionCode | null>(
    result.dominantDimension.code
  );

  const handlePrint = () => {
    window.print();
  };

  const studentNameDisplay = result.studentInfo.name?.trim() || 'عزيزي الطالب / عزيزتي الطالبة';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Top action / navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>عرض الطالب (مبسط ومباشر)</span>
          </button>
          <button
            onClick={() => setActiveTab('counselor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'counselor'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>تقرير المرشد التربوي والمهني</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ PDF</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>إعادة الاختبار</span>
          </button>
        </div>
      </div>

      {/* Counselor View */}
      {activeTab === 'counselor' ? (
        <CounselorView result={result} />
      ) : (
        /* Student Friendly View */
        <div className="space-y-8">
          {/* Dominant Pattern Spotlight Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
            {/* Background geometric accents */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-700/60 pb-4">
                <div className="flex items-center gap-2 text-teal-200 text-xs sm:text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>تهانينا! اكتمل احتساب تفضيلاتك المهنية بدقة</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-teal-950/60 border border-teal-700/50 px-3 py-1.5 rounded-lg text-teal-200">
                  <User className="w-3.5 h-3.5" />
                  <span>{studentNameDisplay}</span>
                  {result.studentInfo.grade && <span>· {result.studentInfo.grade}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    النمط المهني الغالب لشخصيتك:
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    {result.dominantDimension.info.arabicName}
                  </h2>
                  <p className="text-sm sm:text-base text-teal-100 font-medium leading-relaxed">
                    "{result.dominantDimension.info.tagline}"
                  </p>
                  <p className="text-xs sm:text-sm text-teal-200/90 leading-relaxed pt-1">
                    {result.dominantDimension.info.description}
                  </p>
                </div>

                {/* Holland Code Badge */}
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs text-teal-200 font-medium">
                    كود هولاند الثلاثي الخاص بك
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono">
                    {result.hollandCode}
                  </div>
                  <div className="text-[11px] text-teal-200 flex items-center justify-center gap-2">
                    <span>{result.dominantDimension.code} الأول</span>
                    <span>·</span>
                    <span>{result.secondaryDimension?.code} الثاني</span>
                    <span>·</span>
                    <span>{result.tertiaryDimension?.code} الثالث</span>
                  </div>
                  <span className="text-[10px] text-teal-300/80 pt-1">
                    الدرجة: {result.dominantDimension.score} من 14 ({result.dominantDimension.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Explanation of Result */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <span>ماذا تعني هذه النتيجة بالنسبة لك؟ (تفسير مبسط)</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.summaryText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>أبرز سماتك وقدراتك الطبيعية:</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed list-disc list-inside">
                  {result.dominantDimension.info.characteristics.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>بيئة العمل المثالية التي تبدع فيها:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.dominantDimension.info.workEnvironment}
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <h5 className="text-[11px] font-bold text-slate-700 mb-1">
                    نصائح لتطوير مسارك المهني:
                  </h5>
                  <ul className="text-[11px] text-slate-500 space-y-1">
                    {result.dominantDimension.info.tipsForGrowth.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Hexagon Chart & All 6 Patterns ranked from highest to lowest */}
          <div className="space-y-6">
            <RiasecChart scores={result.scores} />

            {/* Ranked Dimensions from Highest to Lowest */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ترتيب الأنماط المهنية الستة (من الأعلى إلى الأقل)
                  </h3>
                  <p className="text-xs text-slate-500">
                    اضغط على أي نمط لاستكشاف تفاصيله والمهن والتخصصات المرتبطة به
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.scores.map((dim) => {
                  const isExpanded = expandedDimension === dim.code;
                  const isDominant = dim.rank === 1;

                  return (
                    <div
                      key={dim.code}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isDominant
                          ? 'border-teal-500/70 bg-teal-50/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Summary Row Clickable */}
                      <button
                        onClick={() =>
                          setExpandedDimension(isExpanded ? null : dim.code)
                        }
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                          {/* Rank Circle */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${
                              isDominant
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{dim.rank}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm sm:text-base text-slate-900">
                                {dim.info.arabicName}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {dim.code} · {dim.info.englishName}
                              </span>
                              {isDominant && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                  النمط الغالب
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {dim.info.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Score and Bar */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-left">
                            <span className="text-sm sm:text-base font-black text-slate-900 block">
                              {dim.score} <span className="text-xs text-slate-400 font-normal">/ 14</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {dim.percentage}%
                            </span>
                          </div>

                          <div
                            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-4 pb-5 sm:px-6 pt-2 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
                          <p className="text-slate-700 leading-relaxed">
                            {dim.info.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Recommended Majors */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                              <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                                <GraduationCap className="w-4 h-4 text-teal-600" />
                                <span>التخصصات الجامعية والكلية المقترحة:</span>
                              </h5>
                              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                {dim.info.recommendedMajors.map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Career Paths */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                              <h5 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                                <Briefcase className="w-4 h-4 text-teal-600" />
                                <span>المسارات والمهن المستقبلية المناسبة:</span>
                              </h5>
                              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                                {dim.info.careerPaths.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Liked professions from this scale */}
                          {dim.likedItems.length > 0 && (
                            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                              <span className="font-semibold text-emerald-900 block mb-1 text-xs">
                                المهن التي فضلتها في هذا النمط أثناء الاختبار ({dim.likedItems.length} من 14):
                              </span>
                              <p className="text-xs text-emerald-800 leading-relaxed">
                                {dim.likedItems.map((item) => item.profession).join(' ، ')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Majors & Careers Direct Recommendations Showcase */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <span>دليل التخصصات والمهن المقترحة لك بناءً على نتيجتك</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                تجميع شامل ومباشر للتخصصات الأكاديمية والمهن التي تجمع بين نمطك الأول ({result.dominantDimension.info.arabicName}) والنمط الثاني ({result.secondaryDimension?.info.arabicName})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College & University Majors */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-800 pb-1 border-b border-teal-100">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <span>التخصصات الجامعية الموصى بها</span>
                </div>
                <div className="space-y-2">
                  {Array.from(
                    new Set([
                      ...result.dominantDimension.info.recommendedMajors,
                      ...(result.secondaryDimension?.info.recommendedMajors || []),
                    ])
                  )
                    .slice(0, 8)
                    .map((major, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{major}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Career Paths */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-teal-800 pb-1 border-b border-teal-100">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  <span>الوظائف والمهن المستقبلية المناسبة</span>
                </div>
                <div className="space-y-2">
                  {Array.from(
                    new Set([
                      ...result.dominantDimension.info.careerPaths,
                      ...(result.secondaryDimension?.info.careerPaths || []),
                    ])
                  )
                    .slice(0, 8)
                    .map((career, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{career}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Footer Actions */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>الخصوصية التامة:</strong> لم تُرسل هذه النتائج لأي خادم ولا تظهر لأي طالب آخر. تم حفظها محلياً فقط.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRetake}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
              >
                إعادة الاختبار بنفس البيانات
              </button>
              <button
                onClick={onNewStudent}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors"
              >
                بدء لطالب جديد ومسح النتائج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
