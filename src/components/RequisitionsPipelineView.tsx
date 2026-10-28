import React, { useState } from 'react';
import { 
  PurchaseRequisition, 
  RequestStatus, 
  UserRole, 
  UrgencyLevel, 
  SparePart,
  ProductionLineCode
} from '../types';
import { 
  GitPullRequest, 
  Search, 
  Filter, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Boxes, 
  FileEdit, 
  UserCheck, 
  Truck, 
  CheckCheck,
  Eye,
  Calendar,
  Layers,
  ArrowUpDown,
  Factory,
  Cpu,
  Waves,
  Scissors
} from 'lucide-react';

interface RequisitionsPipelineViewProps {
  requisitions: PurchaseRequisition[];
  currentRole: UserRole;
  onOpenDetail: (req: PurchaseRequisition) => void;
  onQuickAction: (req: PurchaseRequisition, actionType: string) => void;
}

export const STATUS_MAP: Record<RequestStatus, { label: string; color: string; step: number }> = {
  PENDING_CONFIRMATION: { label: '01 待確認規格', color: 'bg-amber-50 text-amber-800 border-amber-200', step: 1 },
  IN_STOCK_ISSUED: { label: '02 有庫存·直接出庫', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', step: 2 },
  PENDING_RFQ: { label: '03 無庫存·待詢價', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', step: 3 },
  PENDING_APPROVAL: { label: '04 已詢價·待主管核准', color: 'bg-purple-50 text-purple-800 border-purple-200', step: 4 },
  PO_PLACED: { label: '05 已下單採購', color: 'bg-blue-50 text-blue-800 border-blue-200', step: 5 },
  ARRIVED_INSPECTING: { label: '06 零件到貨·待驗收', color: 'bg-teal-50 text-teal-800 border-teal-200', step: 6 },
  CLOSED_COMPLETED: { label: '07 驗收完成·結案', color: 'bg-slate-100 text-slate-700 border-slate-200', step: 7 },
};

export const RequisitionsPipelineView: React.FC<RequisitionsPipelineViewProps> = ({
  requisitions,
  currentRole,
  onOpenDetail,
  onQuickAction,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [selectedStationFilter, setSelectedStationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  // Filter requisitions
  const filteredRequisitions = requisitions.filter((req) => {
    const matchesStatus = selectedStatusFilter === 'ALL' || req.status === selectedStatusFilter;
    const matchesUrgency = urgencyFilter === 'ALL' || req.urgency === urgencyFilter;
    
    // Line Match (A, B, C, D, E)
    let matchesLine = true;
    if (selectedLineFilter !== 'ALL') {
      matchesLine =
        req.equipmentCode?.includes(`L${selectedLineFilter}`) ||
        req.equipmentName?.includes(`${selectedLineFilter}產線`) ||
        req.equipmentName?.includes(`${selectedLineFilter} 產線`);
    }

    // Station Match
    let matchesStation = true;
    if (selectedStationFilter === 'EXTRUDER') {
      matchesStation = req.equipmentName?.includes('擠出機') || req.equipmentName?.includes('母機') || req.equipmentName?.includes('子機');
    } else if (selectedStationFilter === 'COOLING_TROUGH') {
      matchesStation = req.equipmentName?.includes('冷卻水道') || req.equipmentName?.includes('水槽');
    } else if (selectedStationFilter === 'PELLETIZER') {
      matchesStation = req.equipmentName?.includes('切粒機') || req.equipmentName?.includes('滾刀');
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      req.reqNumber.toLowerCase().includes(q) ||
      req.equipmentName.toLowerCase().includes(q) ||
      req.faultDescription.toLowerCase().includes(q) ||
      (req.confirmedPartName && req.confirmedPartName.toLowerCase().includes(q)) ||
      (req.confirmedPartCode && req.confirmedPartCode.toLowerCase().includes(q)) ||
      req.requesterName.toLowerCase().includes(q);

    return matchesStatus && matchesUrgency && matchesLine && matchesStation && matchesSearch;
  });

  // Calculate status counts
  const statusCounts = requisitions.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              F06 採購追蹤
            </span>
            <span className="text-xs text-slate-500">總計 {requisitions.length} 筆案件</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            零件需求申請與採購進度追蹤看板
          </h2>
          <p className="text-xs text-slate-500">
            透明化顯示待確認、待詢價、待核准、已下單、已到貨及已結案之全流程狀態。
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            待確認規格：{statusCounts['PENDING_CONFIRMATION'] || 0}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            待主管核准：{statusCounts['PENDING_APPROVAL'] || 0}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            已下單追蹤：{statusCounts['PO_PLACED'] || 0}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
        {/* Status Pills */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              selectedStatusFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            全部案件 ({requisitions.length})
          </button>
          {(Object.keys(STATUS_MAP) as RequestStatus[]).map((statusKey) => {
            const count = statusCounts[statusKey] || 0;
            const isSelected = selectedStatusFilter === statusKey;
            return (
              <button
                key={statusKey}
                onClick={() => setSelectedStatusFilter(statusKey)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center space-x-1.5 transition ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{STATUS_MAP[statusKey].label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Line & Equipment Station Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">產線：</span>
            <button
              onClick={() => setSelectedLineFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                selectedLineFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部 (A~E)
            </button>
            {(['A', 'B', 'C', 'D', 'E'] as ProductionLineCode[]).map((lCode) => (
              <button
                key={lCode}
                onClick={() => setSelectedLineFilter(lCode)}
                className={`px-2.5 py-1 rounded-md font-mono font-bold transition flex items-center space-x-1 ${
                  selectedLineFilter === lCode
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{lCode} 產線</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">站點：</span>
            <button
              onClick={() => setSelectedStationFilter('ALL')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedStationFilter === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSelectedStationFilter('EXTRUDER')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStationFilter === 'EXTRUDER'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>子母式擠出機</span>
            </button>
            <button
              onClick={() => setSelectedStationFilter('COOLING_TROUGH')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStationFilter === 'COOLING_TROUGH'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>冷卻水道</span>
            </button>
            <button
              onClick={() => setSelectedStationFilter('PELLETIZER')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStationFilter === 'PELLETIZER'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>切粒機</span>
            </button>
          </div>
        </div>

        {/* Search bar & Urgency filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜尋需求單號、設備名稱、零件名稱、申請人或故障關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <span className="text-xs text-slate-500">急件程度：</span>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">全部等級</option>
              <option value="LINE_STOP">停機急件 (最高)</option>
              <option value="URGENT">急件</option>
              <option value="NORMAL">一般</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requisitions List / Table */}
      <div className="space-y-3">
        {filteredRequisitions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
            <GitPullRequest className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">查無符合條件的零件需求案件</p>
            <p className="text-xs text-slate-400 mt-1">請嘗試變更搜尋關鍵字或清除狀態篩選條件。</p>
          </div>
        ) : (
          filteredRequisitions.map((req) => {
            const statusInfo = STATUS_MAP[req.status];
            const isLineStop = req.urgency === 'LINE_STOP';
            const isUrgent = req.urgency === 'URGENT';

            return (
              <div
                key={req.id}
                onClick={() => onOpenDetail(req)}
                className={`bg-white border rounded-xl p-4 transition-all hover:border-slate-300 hover:shadow-md cursor-pointer relative group ${
                  isLineStop
                    ? 'border-rose-300 bg-rose-50/20'
                    : isUrgent
                    ? 'border-amber-200 bg-amber-50/15'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start space-x-3.5">
                    {/* Photo thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 relative shadow-2xs">
                      <img
                        src={req.photoUrls[0]}
                        alt={req.reqNumber}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      {req.photoUrls.length > 1 && (
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] text-white font-mono">
                          +{req.photoUrls.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Metadata & Description */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                          {req.reqNumber}
                        </span>

                        {/* Urgency Badge */}
                        {isLineStop && (
                          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            <Flame className="w-3 h-3 text-rose-600" />
                            <span>停機急件</span>
                          </span>
                        )}
                        {isUrgent && (
                          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>急件</span>
                          </span>
                        )}

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="text-xs text-slate-800 font-bold truncate">
                        設備：<span className="text-emerald-700">{req.equipmentName}</span> ({req.equipmentCode})
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                        <strong className="text-slate-800">故障：</strong>{req.faultDescription}
                      </p>

                      {/* Part Match Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
                        <span>
                          需求數量：<strong className="text-slate-800 font-semibold">{req.requestedQuantity} {req.unit}</strong>
                        </span>
                        {req.confirmedPartCode ? (
                          <span className="text-sky-700 font-medium">
                            已核實零件：<strong className="font-bold">{req.confirmedPartCode}</strong> ({req.confirmedPartName})
                          </span>
                        ) : req.knownPartCode ? (
                          <span className="text-slate-600">
                            提報型號：<strong>{req.knownPartCode}</strong> (待維修核對)
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium">
                            型號待確認 (請技術員核對)
                          </span>
                        )}

                        {req.supplierName && (
                          <span className="text-slate-600">
                            廠商：{req.supplierName} ({req.quotedTotalPrice ? `NT$ ${req.quotedTotalPrice.toLocaleString()}` : ''})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Requester info & Quick Action */}
                  <div className="flex items-center justify-between lg:justify-end space-x-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right text-[11px] text-slate-500">
                      <div>提報人：<strong className="text-slate-800">{req.requesterName}</strong></div>
                      <div className="flex items-center space-x-1 lg:justify-end text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{req.requestDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(req);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center space-x-1 transition shadow-2xs"
                      >
                        <span>檢視詳情與處理</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Mini Step Indicator */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500">流程進度：</span>
                    <span className="font-bold text-slate-700">第 {statusInfo.step} 階段 / 共 7 階</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {req.clarificationCount > 0 && (
                      <span className="text-amber-700 font-medium">反覆確認: {req.clarificationCount}次</span>
                    )}
                    {req.clarificationCount === 0 && (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-0.5">
                        <CheckCheck className="w-3 h-3" />
                        <span>規格一次核對到位</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
