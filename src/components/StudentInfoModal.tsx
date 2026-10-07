import React, { useState } from 'react';
import { StudentInfo } from '../types';
import { X, User, GraduationCap, Building2, UserCheck, Shield } from 'lucide-react';

interface StudentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: StudentInfo;
  onSave: (info: StudentInfo) => void;
}

export const StudentInfoModal: React.FC<StudentInfoModalProps> = ({
  isOpen,
  onClose,
  studentInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentInfo>({ ...studentInfo });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              بيانات الطالب والتقرير (اختياري)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            يمكنك إدخال بياناتك لتظهر في تقرير التفضيلات المهنية المطبوع الخاص بك وللمرشد التربوي، أو تخطي ذلك إذا رغبت بالبدء مباشرة.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              اسم الطالب / الطالبة
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: أحمد عبد الله"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                الصف / المرحلة
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="مثال: الأول الثانوي / العاشر"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                المدرسة
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="اسم المدرسة أو المعهد"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              اسم المرشد الطلابي / الأكاديمي (اختياري)
            </label>
            <input
              type="text"
              value={formData.counselorName}
              onChange={(e) => setFormData({ ...formData, counselorName: e.target.value })}
              placeholder="اسم المرشد أو الموجه المهني"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-800">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>ضمان الخصوصية:</strong> جميع البيانات والنتائج تُحفظ محلياً فقط على متصفحك ولا تُشارك مع أي طرف أو طالب آخر.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              إلغاء / استمرار دون تعديل
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              حفظ ومتابعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
