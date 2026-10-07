import React from 'react';
import { DimensionScore } from '../types';

interface RiasecChartProps {
  scores: DimensionScore[]; // can be sorted or RIASEC order
}

export const RiasecChart: React.FC<RiasecChartProps> = ({ scores }) => {
  // Holland canonical order for the hexagon: R, I, A, S, E, C
  const canonicalOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
  const orderedScores = canonicalOrder.map(
    (code) => scores.find((s) => s.code === code) || scores[0]
  );

  // SVG Radar calculation
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const maxScore = 14;

  // Angles for 6 vertices: starting at top (-PI/2) and moving clockwise
  // Hexagon angles in radians: 0, 60, 120, 180, 240, 300 deg
  const angles = [
    -Math.PI / 2, // top: R
    -Math.PI / 6, // top right: I
    Math.PI / 6,  // bottom right: A
    Math.PI / 2,  // bottom: S
    (5 * Math.PI) / 6, // bottom left: E
    (-5 * Math.PI) / 6, // top left: C
  ];

  // Helper to get point coordinates
  const getPoint = (scoreVal: number, index: number) => {
    const r = (scoreVal / maxScore) * radius;
    const x = center + r * Math.cos(angles[index]);
    const y = center + r * Math.sin(angles[index]);
    return { x, y };
  };

  // Polygon points for student score
  const studentPoints = orderedScores
    .map((s, i) => {
      const { x, y } = getPoint(s.score, i);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [3.5, 7, 10.5, 14];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            المخطط السداسي لهولاند (RIASEC)
          </h3>
          <p className="text-xs text-slate-500">
            توزيع الميول على الأبعاد الستة (الدرجة القصوى لكل نمط: 14)
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Radar SVG */}
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] shrink-0">
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full overflow-visible"
          >
            {/* Background grid concentric hexagons */}
            {gridLevels.map((lvl) => {
              const pts = angles
                .map((ang) => {
                  const r = (lvl / maxScore) * radius;
                  const x = center + r * Math.cos(ang);
                  const y = center + r * Math.sin(ang);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={pts}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={lvl === 14 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Axes from center */}
            {angles.map((ang, i) => {
              const x = center + radius * Math.cos(ang);
              const y = center + radius * Math.sin(ang);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}

            {/* Student's shape */}
            <polygon
              points={studentPoints}
              fill="rgba(13, 148, 136, 0.25)"
              stroke="#0d9488"
              strokeWidth="2.5"
            />

            {/* Vertices & labels */}
            {orderedScores.map((s, i) => {
              const { x, y } = getPoint(s.score, i);
              const labelRadius = radius + 26;
              const lx = center + labelRadius * Math.cos(angles[i]);
              const ly = center + labelRadius * Math.sin(angles[i]);

              return (
                <g key={s.code}>
                  {/* Point circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#0d9488"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Label text */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[11px] font-bold fill-slate-800"
                  >
                    {s.code} - {s.score}
                  </text>
                  <text
                    x={lx}
                    y={ly + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] fill-slate-500"
                  >
                    {s.info.arabicName.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Breakdown bar list */}
        <div className="w-full space-y-3">
          {orderedScores.map((s) => (
            <div key={s.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.info.color }}
                  />
                  <span className="font-bold text-slate-800">
                    {s.code} · {s.info.arabicName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-semibold text-slate-900">{s.score} / 14</span>
                  <span className="text-slate-400">({s.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${s.percentage}%`,
                    backgroundColor: s.info.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
