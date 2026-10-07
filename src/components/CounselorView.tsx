import React, { useState } from 'react';
import { HollandAssessmentResult } from '../types';
import { getConsistencyDescription } from '../data/hollandData';
import {
  FileCheck2,
  CheckCircle2,
  Lightbulb,
  Building,
  GraduationCap,
  Scale,
  Award,
} from 'lucide-react';

interface CounselorViewProps {
  result: HollandAssessmentResult;
}

export const CounselorView: React.FC<CounselorViewProps> = ({ result }) => {
  const [counselorNotes, setCounselorNotes] = useState(
    'بناءً على نتائج المقياس، يُوصى بتوجيه الطالب نحو المسارات الأكاديمية والمهنية المتوافقة مع كود هولاند الرئيسي، مع تشجيعه على استكشاف التخصصات ذات الصلة بالنمطين الأول والثاني.'
  );

  const consistencyInfo = getConsistencyDescription(
    result.dominantDimension.code,
    result.secondaryDimension?.code || result.dominantDimension.code
  );

  return (
    <div className="space-y-6">
      {/* Official Counselor Header (Visible on screen and on print) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-teal-700 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 font-bold text-lg sm:text-xl">
              <FileCheck2 className="w-6 h-6 text-teal-600 print:text-black" />
              <span>تقرير الإرشاد والتوجيه المهني والأكاديمي</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              مبني على قائمة التفضيلات المهنية لجون هولاند (Vocational Preference Inventory - RIASEC)
            </p>
          </div>
          <div className="text-left text-xs text-slate-600">
            <div><strong>تاريخ التقييم:</strong> {result.completedAt}</div>
            <div><strong>رمز المقياس:</strong> VPI-84-AR</div>
          </div>
        </div>

        {/* Student metadata info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 mb-6">
          <div>
            <span className="text-slate-500 block mb-0.5">اسم الطالب/ـة:</span>
            <span className="font-bold text-slate-900 text-sm">
              {result.studentInfo.name || 'لم يُحدد (مستعار)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">الصف / المرحلة:</span>
            <span className="font-semibold text-slate-900">
              {result.studentInfo.grade || 'غير محدد'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">المدرسة:</span>
            <span className="font-semibold text-slate-900">
              {result.studentInfo.school || 'غير محدد'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">المرشد الطلابي:</span>
            <span className="font-semibold text-slate-900">
              {result.studentInfo.counselorName || 'المرشد التربوي والمهني'}
            </span>
          </div>
        </div>

        {/* Psychometric Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Holland Code */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" />
                كود هولاند الثلاثي (Holland Code)
              </span>
              <div className="mt-2 text-2xl font-black text-teal-900 tracking-wider">
                {result.hollandCode}
              </div>
              <p className="text-xs text-teal-800 mt-1">
                الأنماط الثلاثة الأكثر تفضيلاً للطالب بالترتيب.
              </p>
            </div>
          </div>

          {/* Differentiation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-600" />
                مؤشر التمايز المهني (Differentiation)
              </span>
              <div className="mt-2 text-base font-bold text-slate-900">
                {result.differentiationLevel === 'high'
                  ? 'تمايز عالٍ (اهتمامات محددة بوضوح)'
                  : result.differentiationLevel === 'medium'
                  ? 'تمايز معتدل (تنوع متوازن)'
                  : 'تمايز منخفض (ميول متعددة متقاربة)'}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                الفرق بين أعلى درجة ({result.dominantDimension.score}) وأدنى درجة (
                {result.scores[result.scores.length - 1].score}) هو{' '}
                {result.dominantDimension.score - result.scores[result.scores.length - 1].score}{' '}
                درجات.
              </p>
            </div>
          </div>

          {/* Hexagonal Consistency */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                الاتساق والانسجام السداسي
              </span>
              <div className="mt-2 text-base font-bold text-slate-900">
                {consistencyInfo.title}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                العلاقة بين النمط {result.dominantDimension.code} والنمط{' '}
                {result.secondaryDimension?.code}.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Table of the 6 Holland Dimensions */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>جدول درجات الأنماط الستة (مفتاح التصحيح المعتمد):</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">الترتيب</th>
                  <th className="py-2.5 px-3">الرمز</th>
                  <th className="py-2.5 px-3">النمط المهني</th>
                  <th className="py-2.5 px-3 text-center">الدرجة الخام (من 14)</th>
                  <th className="py-2.5 px-3 text-center">النسبة المئوية</th>
                  <th className="py-2.5 px-3">مستوى الميل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.scores.map((dim) => {
                  let levelText = 'منخفض';
                  let levelBadge = 'text-slate-500';
                  if (dim.score >= 10) {
                    levelText = 'مرتفع جداً';
                    levelBadge = 'text-emerald-700 font-bold';
                  } else if (dim.score >= 7) {
                    levelText = 'متوسط';
                    levelBadge = 'text-teal-700 font-semibold';
                  }

                  return (
                    <tr
                      key={dim.code}
                      className={dim.rank === 1 ? 'bg-teal-50/50' : 'hover:bg-slate-50/50'}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        #{dim.rank}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-teal-800">
                        {dim.code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {dim.info.arabicName}
                        <span className="text-slate-400 mr-1 font-normal">
                          ({dim.info.englishName})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {dim.score} / 14
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {dim.percentage}%
                      </td>
                      <td className={`py-2.5 px-3 ${levelBadge}`}>
                        {levelText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown of Liked Items per category */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>تفصيل المهن التي فضلها الطالب في كل نمط (التي اختار فيها "أميل"):</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {result.scores.map((dim) => (
              <div
                key={dim.code}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: dim.info.color }}
                    />
                    {dim.info.arabicName} ({dim.code})
                  </span>
                  <span className="text-teal-700">{dim.likedItems.length} مهن</span>
                </div>
                {dim.likedItems.length > 0 ? (
                  <p className="text-slate-600 leading-relaxed">
                    {dim.likedItems.map((item) => item.profession).join(' ، ')}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">لم يختر الطالب أية مهنة في هذا النمط.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Academic & Vocational Guidance Recommendations */}
        <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-teal-700" />
            <span>توجيهات المسار الأكاديمي والمهني المقترحة من واقع النتيجة:</span>
          </div>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              • <strong>المسار الثانوي الأنسب:</strong>{' '}
              {['R', 'I'].includes(result.dominantDimension.code)
                ? 'المسار العلمي والتقني / مسار علوم الحاسب والهندسة / المسار الصناعي'
                : ['S', 'A'].includes(result.dominantDimension.code)
                ? 'المسار الإنساني / مسار إدارة الأعمال / المسار الفني والإعلامي'
                : 'مسار إدارة الأعمال / المسار العام / المسار التقني'}
            </p>
            <p>
              • <strong>التخصصات الجامعية الأكثر مواءمة:</strong>{' '}
              {result.dominantDimension.info.recommendedMajors.slice(0, 5).join(' ، ')}
            </p>
            <p>
              • <strong>بيئة العمل المثلى للإنتاجية والرضا المهني:</strong>{' '}
              {result.dominantDimension.info.workEnvironment}
            </p>
          </div>
        </div>

        {/* Counselor Notes / Recommendations Section */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            توصيات وملاحظات المرشد الطلابي / المهني:
          </label>
          <textarea
            value={counselorNotes}
            onChange={(e) => setCounselorNotes(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none print:border print:border-slate-300"
            placeholder="اكتب هنا الملاحظات والتوصيات الفردية للطالب..."
          />
        </div>

        {/* Counselor & School Official Signatures (Visible when printing or final review) */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div className="space-y-8">
            <div>
              <strong>اسم المرشد الطلابي:</strong>{' '}
              {result.studentInfo.counselorName || '________________________'}
            </div>
            <div>
              <strong>التوقيع:</strong> ________________________
            </div>
          </div>
          <div className="space-y-8 text-left">
            <div>
              <strong>ختم إدارة المدرسة / التوجيه والإرشاد:</strong>
            </div>
            <div className="h-10 border-b border-dashed border-slate-300 w-36 ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
