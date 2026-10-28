import React from 'react';
import { ProductionLineCode, PurchaseRequisition } from '../types';
import { PRODUCTION_LINES, EQUIPMENT_LIST } from '../data/mockData';
import { 
  Factory, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Waves, 
  Scissors, 
  Cpu, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface ProductionLinesBarProps {
  requisitions: PurchaseRequisition[];
  selectedLine: ProductionLineCode | 'ALL';
  onSelectLine: (line: ProductionLineCode | 'ALL') => void;
  onQuickReportForLine?: (lineCode: ProductionLineCode) => void;
}

export const ProductionLinesBar: React.FC<ProductionLinesBarProps> = ({
  requisitions,
  selectedLine,
  onSelectLine,
  onQuickReportForLine,
}) => {
  // Compute line status based on actual live requisitions
  const getLineStatus = (lineCode: ProductionLineCode) => {
    const lineReqs = requisitions.filter(
      (r) =>
        r.equipmentCode?.includes(`L${lineCode}`) ||
        r.equipmentName?.includes(`${lineCode}產線`) ||
        r.equipmentName?.includes(`${lineCode} 產線`)
    );

    const activeLineStop = lineReqs.some(
      (r) => r.urgency === 'LINE_STOP' && !['IN_STOCK_ISSUED', 'CLOSED_COMPLETED'].includes(r.status)
    );
    if (activeLineStop) return { text: '停機急件', badge: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse', icon: Flame, isStop: true };

    const activeUrgent = lineReqs.some(
      (r) => r.urgency === 'URGENT' && !['IN_STOCK_ISSUED', 'CLOSED_COMPLETED'].includes(r.status)
    );
    if (activeUrgent) return { text: '急件待料', badge: 'bg-amber-50 text-amber-700 border-amber-300', icon: AlertTriangle, isStop: false };

    if (lineCode === 'D') return { text: '排程保養', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2, isStop: false };

    return { text: '正常運轉', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, isStop: false };
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Label & Legend */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <Factory className="w-4 h-4 text-emerald-600" />
              <span>全廠 5 條造粒產線 (A~E) 運轉監控</span>
            </div>
            <span className="text-slate-300 text-xs hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-emerald-600" />
                <span>子母式擠出機</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <Waves className="w-3 h-3 text-sky-600" />
                <span>冷卻水道</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <Scissors className="w-3 h-3 text-indigo-600" />
                <span>切粒機</span>
              </span>
            </div>
          </div>

          {/* 5 Production Lines (A, B, C, D, E) Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto">
            {PRODUCTION_LINES.map((line) => {
              const status = getLineStatus(line.code);
              const isSelected = selectedLine === line.code;
              const StatusIcon = status.icon;

              return (
                <button
                  key={line.code}
                  type="button"
                  onClick={() => onSelectLine(isSelected ? 'ALL' : line.code)}
                  className={`p-2 rounded-lg border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : status.isStop
                      ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center space-x-1 font-mono">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {line.code}
                      </span>
                      <span>產線</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border flex items-center space-x-0.5 ${status.badge}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      <span>{status.text}</span>
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate mt-1 font-medium">
                    {line.code === 'A' && '編織袋/膜料'}
                    {line.code === 'B' && '太空包粉碎料'}
                    {line.code === 'C' && '重載棧板硬料'}
                    {line.code === 'D' && '無紡布邊角料'}
                    {line.code === 'E' && '瓶蓋改性料'}
                  </div>

                  <div className="text-[9px] text-slate-400 truncate mt-0.5 font-mono">
                    母機+子機·水道·切粒
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
