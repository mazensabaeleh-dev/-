import React from 'react';
import { AnswerValue } from '../types';
import { X, CheckCircle2, Circle } from 'lucide-react';

interface QuestionNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  answers: Record<number, AnswerValue>;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavigatorModal: React.FC<QuestionNavigatorModalProps> = ({
  isOpen,
  onClose,
  totalQuestions,
  answers,
  currentIndex,
  onSelectQuestion,
}) => {
  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              فهرس الأسئلة (84 مهنة)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تمت الإجابة عن {answeredCount} من أصل {totalQuestions} مهنة
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-600 inline-block" />
            <span>تمت الإجابة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border border-slate-300 bg-white inline-block" />
            <span>لم تتم الإجابة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded ring-2 ring-teal-600 bg-teal-50 inline-block" />
            <span>السؤال الحالي</span>
          </div>
        </div>

        {/* Grid of 84 numbers */}
        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-7 sm:grid-cols-12 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const qId = i + 1;
            const hasAnswer = answers[qId] !== undefined;
            const isCurrent = i === currentIndex;

            let btnClasses = 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100';
            if (hasAnswer) {
              btnClasses = 'bg-teal-600 text-white font-medium border-teal-600 hover:bg-teal-700';
            }
            if (isCurrent) {
              btnClasses += ' ring-2 ring-teal-500 ring-offset-2';
            }

            return (
              <button
                key={qId}
                onClick={() => {
                  onSelectQuestion(i);
                  onClose();
                }}
                className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${btnClasses}`}
                title={`المهنة رقم ${qId}`}
              >
                {qId}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500">
            {totalQuestions - answeredCount > 0
              ? `متبقي ${totalQuestions - answeredCount} للإكمال`
              : 'اكتملت جميع الإجابات بنجاح!'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            إغلاق الفهرس
          </button>
        </div>
      </div>
    </div>
  );
};
