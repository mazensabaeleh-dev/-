import React from 'react';
import { StudentInfo } from '../types';
import { Compass, User, RefreshCw, Printer, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  studentInfo: StudentInfo;
  onEditStudentInfo?: () => void;
  onResetTest?: () => void;
  answeredCount?: number;
  totalQuestions?: number;
  isResultView?: boolean;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  studentInfo,
  onEditStudentInfo,
  onResetTest,
  answeredCount = 0,
  totalQuestions = 84,
  isResultView = false,
  onPrint,
}) => {
  const percent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5 text-teal-50" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              مقياس هولاند للتفضيلات المهنية
            </h1>
            <p className="text-xs text-slate-500">
              قائمة التفضيلات المهنية (RIASEC) للاستكشاف الأكاديمي والمهني
            </p>
          </div>
        </div>

        {/* Student info & action buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {studentInfo.name ? (
            <button
              onClick={onEditStudentInfo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors"
              title="تعديل بيانات الطالب"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>{studentInfo.name}</span>
              {studentInfo.grade && (
                <span className="text-slate-400 font-normal">({studentInfo.grade})</span>
              )}
            </button>
          ) : (
            <button
              onClick={onEditStudentInfo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-medium transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>إدخال بيانات الطالب (اختياري)</span>
            </button>
          )}

          {isResultView && onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير</span>
            </button>
          )}

          {onResetTest && (
            <button
              onClick={onResetTest}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm transition-colors"
              title="إعادة تعيين وبدء جديد"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة الاختبار</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar in test mode */}
      {!isResultView && (
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-teal-600 h-1.5 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
};
