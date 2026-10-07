/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AnswerValue,
  HollandAssessmentResult,
  StudentInfo,
} from './types';
import { HOLLAND_QUESTIONS } from './data/hollandData';
import { calculateHollandResult } from './utils/scoring';
import { Header } from './components/Header';
import { StudentInfoModal } from './components/StudentInfoModal';
import { QuestionNavigatorModal } from './components/QuestionNavigatorModal';
import { ResultsView } from './components/ResultsView';
import {
  Compass,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

const STORAGE_KEY_ANSWERS = 'holland_vpi_answers_v1';
const STORAGE_KEY_STUDENT = 'holland_vpi_student_v1';
const STORAGE_KEY_RESULT = 'holland_vpi_result_v1';

export default function App() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: '',
      grade: '',
      school: '',
      counselorName: '',
      date: new Date().toISOString().split('T')[0],
    };
  });

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  const [result, setResult] = useState<HollandAssessmentResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  // UI state
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    // If there are existing answers or result, consider started
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
      const savedResult = localStorage.getItem(STORAGE_KEY_RESULT);
      return !!(savedAnswers || savedResult);
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 14; // 84 / 14 = exactly 6 pages
  const totalPages = Math.ceil(HOLLAND_QUESTIONS.length / itemsPerPage);

  const [viewMode, setViewMode] = useState<'pages' | 'continuous'>('pages');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isNavigatorModalOpen, setIsNavigatorModalOpen] = useState(false);
  const [unansweredAlert, setUnansweredAlert] = useState<number[] | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(studentInfo));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [studentInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [answers]);

  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
      } else {
        localStorage.removeItem(STORAGE_KEY_RESULT);
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [result]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const isAllAnswered = answeredCount === HOLLAND_QUESTIONS.length;

  const handleAnswer = (questionId: number, value: AnswerValue) => {
    const updated = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(updated);

    // If this just completed all 84 questions, check whether we should trigger results
    if (Object.keys(updated).length === HOLLAND_QUESTIONS.length && !result) {
      const calculated = calculateHollandResult(updated, studentInfo);
      setResult(calculated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishAndShowResult = () => {
    // Check if any questions are unanswered
    const missing: number[] = [];
    HOLLAND_QUESTIONS.forEach((q) => {
      if (!answers[q.id]) {
        missing.push(q.id);
      }
    });

    if (missing.length > 0) {
      setUnansweredAlert(missing);
      // Automatically jump to the page containing the first missing question
      const firstMissingIndex = missing[0] - 1;
      const targetPage = Math.floor(firstMissingIndex / itemsPerPage) + 1;
      setCurrentPage(targetPage);
      return;
    }

    // All answered! Calculate score
    const calculated = calculateHollandResult(answers, studentInfo);
    setResult(calculated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة الاختبار؟ سيتم مسح الإجابات الحالية والبدء من جديد.')) {
      setAnswers({});
      setResult(null);
      setCurrentPage(1);
      setUnansweredAlert(null);
      try {
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        localStorage.removeItem(STORAGE_KEY_RESULT);
      } catch (e) {
        console.warn(e);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNewStudent = () => {
    if (
      window.confirm(
        'هل تود مسح بيانات الطالب والبدء لطالب جديد تماماً؟ هذا يضمن الخصوصية عند استخدام أكثر من طالب للجهاز.'
      )
    ) {
      setStudentInfo({
        name: '',
        grade: '',
        school: '',
        counselorName: '',
        date: new Date().toISOString().split('T')[0],
      });
      setAnswers({});
      setResult(null);
      setCurrentPage(1);
      setHasStarted(false);
      setUnansweredAlert(null);
      try {
        localStorage.clear();
      } catch (e) {
        console.warn(e);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Questions to display based on current page or continuous mode
  const currentQuestions = useMemo(() => {
    if (viewMode === 'continuous') {
      return HOLLAND_QUESTIONS;
    }
    const start = (currentPage - 1) * itemsPerPage;
    return HOLLAND_QUESTIONS.slice(start, start + itemsPerPage);
  }, [viewMode, currentPage]);

  const jumpToQuestion = (index: number) => {
    const qPage = Math.floor(index / itemsPerPage) + 1;
    setCurrentPage(qPage);
    setTimeout(() => {
      const el = document.getElementById(`q-${index + 1}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        studentInfo={studentInfo}
        onEditStudentInfo={() => setIsStudentModalOpen(true)}
        onResetTest={hasStarted ? handleRetake : undefined}
        answeredCount={answeredCount}
        totalQuestions={HOLLAND_QUESTIONS.length}
        isResultView={!!result}
        onPrint={() => window.print()}
      />

      <main className="flex-1">
        {/* If results already calculated, show results dashboard */}
        {result ? (
          <ResultsView
            result={result}
            onRetake={handleRetake}
            onNewStudent={handleNewStudent}
          />
        ) : !hasStarted ? (
          /* Landing / Instructions Welcome Screen */
          <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 text-center space-y-8 animate-in fade-in duration-300">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>مقياس التفضيلات المهنية لجون هولاند (RIASEC)</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                اكتشف نمطك المهني ومستقبلك الأكاديمي
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                مقياس علمي عالمي معتمد يساعدك على تحديد ميولك المهنية الحقيقية من بين 6 أنماط رئيسية
                (الواقعي، العقلي، الفني، الاجتماعي، المغامر، التقليدي)، ومعرفة التخصصات والمهن الأكثر مواءمة لشخصيتك.
              </p>
            </div>

            {/* Instruction Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-right space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Info className="w-5 h-5 text-teal-600" />
                <span>تعليمات وإرشادات مهمة قبل البدء:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">84 مهنة متنوعة:</strong>
                    ستُعرض أمامك قائمة تتضمن 84 مهنة محددة كما وردت في المقياس الأصلي.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">خياران واضحان:</strong>
                    اختر <strong>"أميل"</strong> إذا كنت تحب هذه المهنة وتفضلها، أو <strong>"لا أميل"</strong> إذا كانت لا تستهويك.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">عفوية الإجابة:</strong>
                    أجب بسرعة وعفوية دون التفكير في مؤهلاتك الحالية أو العائد المالي للمهنة.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-0.5">نتيجة فورية وخاصة:</strong>
                    ستظهر نتيجتك وتحليلك المهني فور استكمال الإجابة عن كافة الأسئلة (84/84).
                  </div>
                </div>
              </div>

              {/* Student basic inputs preview */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="block text-xs font-bold text-slate-800">
                  بيانات الطالب (اختياري - يمكنك البدء فوراً دون تعبئة):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                    placeholder="اسم الطالب / الطالبة (اختياري)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                  />
                  <input
                    type="text"
                    value={studentInfo.grade}
                    onChange={(e) => setStudentInfo({ ...studentInfo, grade: e.target.value })}
                    placeholder="الصف أو المرحلة الدراسية (اختياري)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setHasStarted(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>ابدأ المقياس الآن</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>خصوصية تامة: إجاباتك وبياناتك لا تُشارك أبداً وتُحفظ على جهازك فقط.</span>
            </div>
          </div>
        ) : (
          /* Active Test Taking View */
          <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 space-y-6">
            {/* Top Toolbar during test */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                    {viewMode === 'pages'
                      ? `الصفحة ${currentPage} من ${totalPages}`
                      : 'عرض كامل الأسئلة'}
                  </span>
                  <span className="text-xs text-slate-500">
                    (أُجيب عن {answeredCount} من أصل 84)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  اختر لكل مهنة: هل <span className="text-teal-700 font-bold">تميل</span> إليها أم <span className="text-slate-700 font-bold">لا تميل</span>؟
                </p>
              </div>

              {/* View options & Navigator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNavigatorModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                  title="عرض جدول الأسئلة والانتقال السريع"
                >
                  <ListOrdered className="w-4 h-4 text-teal-600" />
                  <span>فهرس الأسئلة ({answeredCount}/84)</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setViewMode('pages')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      viewMode === 'pages'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    صفحات (14 سؤال)
                  </button>
                  <button
                    onClick={() => setViewMode('continuous')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      viewMode === 'continuous'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    قائمة كاملة
                  </button>
                </div>
              </div>
            </div>

            {/* Unanswered Missing Alert Banner if user tried to submit early */}
            {unansweredAlert && unansweredAlert.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    تبقى لديك {unansweredAlert.length} مهنة لم تُجب عنها. المقياس يتطلب الإجابة عن جميع المهن (84/84) لاحتساب النتيجة بدقة.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-amber-800">اضغط للانتقال للمهنة المتبقية:</span>
                  {unansweredAlert.slice(0, 14).map((qId) => (
                    <button
                      key={qId}
                      onClick={() => jumpToQuestion(qId - 1)}
                      className="px-2 py-0.5 rounded-md bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold text-xs transition-colors"
                    >
                      رقم {qId}
                    </button>
                  ))}
                  {unansweredAlert.length > 14 && (
                    <span className="text-xs text-amber-700">و {unansweredAlert.length - 14} أخرى...</span>
                  )}
                </div>
              </div>
            )}

            {/* List of Questions Table/Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
              {/* Table header */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-10 text-center text-slate-400">الرقم</span>
                  <span>المــــــهــــــنــــــة</span>
                </div>
                <div className="flex items-center gap-3 pl-2 sm:pl-4">
                  <span>خيار التفضيل</span>
                </div>
              </div>

              {/* Items */}
              {currentQuestions.map((question) => {
                const currentAnswer = answers[question.id];
                const isAnswered = currentAnswer !== undefined;

                return (
                  <div
                    key={question.id}
                    id={`q-${question.id}`}
                    className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isAnswered ? 'bg-white hover:bg-slate-50/50' : 'bg-amber-50/20 hover:bg-amber-50/30'
                    }`}
                  >
                    {/* Number and Profession Name (Verbatim from the PDF) */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isAnswered
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {question.id}
                      </div>

                      <div className="flex-1">
                        <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {question.profession}
                        </span>
                      </div>
                    </div>

                    {/* Choice buttons: "أميل" / "لا أميل" */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAnswer(question.id, 'like')}
                        className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                          currentAnswer === 'like'
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs scale-102'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>أميل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAnswer(question.id, 'dislike')}
                        className={`flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                          currentAnswer === 'dislike'
                            ? 'bg-slate-700 text-white border-slate-700 shadow-xs scale-102'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>لا أميل</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls and Submit Action */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {viewMode === 'pages' ? (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <div className="flex items-center gap-1 px-2 text-xs font-bold text-slate-600">
                    <span>{currentPage}</span>
                    <span className="text-slate-400">/</span>
                    <span>{totalPages}</span>
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  تم عرض كافة الأسئلة (84 مهنة)
                </div>
              )}

              {/* Complete / Calculate Result Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFinishAndShowResult}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all ${
                    isAllAnswered
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isAllAnswered ? 'عرض النتيجة والتقرير فوراً' : `التحقق والإنهاء (${answeredCount}/84)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-500 no-print">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            مقياس التفضيلات المهنية لجون هولاند (Vocational Preference Inventory) · أداة استرشادية للطلاب والإرشاد المدرسي
          </p>
          <p className="text-slate-400 text-[11px]">
            جميع البيانات محلية وخاصة 100%
          </p>
        </div>
      </footer>

      {/* Student Metadata Modal */}
      <StudentInfoModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentInfo={studentInfo}
        onSave={(info) => {
          setStudentInfo(info);
          if (result) {
            setResult(calculateHollandResult(answers, info));
          }
        }}
      />

      {/* 84 Questions Navigator Modal */}
      <QuestionNavigatorModal
        isOpen={isNavigatorModalOpen}
        onClose={() => setIsNavigatorModalOpen(false)}
        totalQuestions={HOLLAND_QUESTIONS.length}
        answers={answers}
        currentIndex={(currentPage - 1) * itemsPerPage}
        onSelectQuestion={(idx) => jumpToQuestion(idx)}
      />
    </div>
  );
}
