import React, { useState } from 'react';
import { 
  PurchaseRequisition, 
  UserRole, 
  SparePart 
} from '../types';
import { STATUS_MAP } from './RequisitionsPipelineView';
import { SUPPLIER_LIST } from '../data/mockData';
import { 
  X, 
  Flame, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Boxes, 
  Wrench, 
  ShoppingCart, 
  UserCheck, 
  Truck, 
  CheckCheck, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Info,
  DollarSign
} from 'lucide-react';

interface RequestDetailModalProps {
  requisition: PurchaseRequisition | null;
  catalogParts: SparePart[];
  currentRole: UserRole;
  onClose: () => void;
  onConfirmSpec: (reqId: string, partId: string, technicianName: string, notes?: string) => void;
  onDirectIssueStock: (reqId: string, warehouseOfficer: string) => void;
  onUpdateQuotation: (reqId: string, supplier: string, unitPrice: number, leadDays: number) => void;
  onApproveRequisition: (reqId: string, approvedBy: string, remarks: string) => void;
  onPlaceOrder: (reqId: string, poNumber: string) => void;
  onCompleteInspection: (reqId: string, inspectedBy: string, actualPrice: number, remarks: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  requisition,
  catalogParts,
  currentRole,
  onClose,
  onConfirmSpec,
  onDirectIssueStock,
  onUpdateQuotation,
  onApproveRequisition,
  onPlaceOrder,
  onCompleteInspection,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(
    requisition?.confirmedPartId || catalogParts[0]?.id || ''
  );
  const [specConfirmNotes, setSpecConfirmNotes] = useState<string>('現場實體量測外徑與電阻正常，確認規格型號。');
  const [supplierInput, setSupplierInput] = useState<string>(requisition?.supplierName || SUPPLIER_LIST[0].name);
  const [quotedPriceInput, setQuotedPriceInput] = useState<number>(requisition?.quotedUnitPrice || 1850);
  const [leadDaysInput, setLeadDaysInput] = useState<number>(requisition?.estimatedLeadDays || 4);
  const [approvalRemarksInput, setApprovalRemarksInput] = useState<string>('核准採購，請採購儘速向配合廠商下單發貨。');
  const [poNumberInput, setPoNumberInput] = useState<string>(requisition?.poNumber || `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`);
  const [actualPriceInput, setActualPriceInput] = useState<number>(requisition?.quotedUnitPrice || 1850);
  const [inspectionNotes, setInspectionNotes] = useState<string>('零件外觀無碰傷、尺寸與安裝孔位精確，驗收合格。');

  if (!requisition) return null;

  const statusInfo = STATUS_MAP[requisition.status];
  const isLineStop = requisition.urgency === 'LINE_STOP';
  const isUrgent = requisition.urgency === 'URGENT';

  const currentPart = catalogParts.find((p) => p.id === selectedPartId);
  const stockAvailable = currentPart?.currentStock ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl relative text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4 pr-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {requisition.reqNumber}
            </span>
            {isLineStop && (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>停機急件</span>
              </span>
            )}
            {isUrgent && (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>急件</span>
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {requisition.equipmentName} ({requisition.equipmentCode}) 零件需求案件
          </h3>
          <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>申請人：<strong className="text-slate-800 font-semibold">{requisition.requesterName}</strong></span>
            <span>提報時間：{requisition.requestDate}</span>
            <span>需求數量：<strong className="text-slate-900 font-bold">{requisition.requestedQuantity} {requisition.unit}</strong></span>
          </div>
        </div>

        {/* Photo & Fault Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">現場拍攝照片</label>
            <div className="aspect-video w-full rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-2xs">
              <img
                src={requisition.photoUrls[0]}
                alt="現場照片"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">故障現象與提報說明</label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed min-h-[120px]">
              {requisition.faultDescription}
            </div>

            {requisition.knownPartCode && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                現場作業員已知型號：<strong className="text-emerald-700 font-mono font-bold">{requisition.knownPartCode}</strong>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations breakdown (if available) */}
        {requisition.aiResult && (
          <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  AI 視覺輔助辨識記錄 (試行)
                </h4>
              </div>
              <span className="text-[10px] text-sky-700 font-mono font-bold">
                {requisition.aiResult.overallConfidence} 信心度
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {requisition.aiResult.analysisSummary}
            </p>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700">AI 推薦相似零件：</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requisition.aiResult.recommendations.map((rec) => (
                  <div key={rec.partCode} className="p-2.5 rounded-lg bg-white border border-sky-100 text-xs space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-700">{rec.partCode}</span>
                      <span className="text-emerald-700 font-bold">{rec.confidenceScore}% 相似</span>
                    </div>
                    <div className="font-bold text-slate-900">{rec.partName}</div>
                    <div className="text-[11px] text-slate-500">{rec.visualSimilarityReason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE WORKFLOW STEP ACTIONS */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>流程處理作業區 (目前階段：{statusInfo.label})</span>
          </h4>

          {/* STEP 1: PENDING_CONFIRMATION -> Technician confirms spec & checks stock */}
          {requisition.status === 'PENDING_CONFIRMATION' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-700">
                <strong>維修／技術人員核定作業：</strong>請對照現場照片量測尺寸，核實正式零件主檔與庫存量。
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">選擇核定零件主檔</label>
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    {catalogParts.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.name} (庫存: {p.currentStock} {p.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                  <div className="text-slate-500 font-medium">目前庫存現狀：</div>
                  <div className="font-bold text-sm">
                    {stockAvailable > 0 ? (
                      <span className="text-emerald-700 font-bold">有庫存 {stockAvailable} {currentPart?.unit} (儲位：{currentPart?.binLocation})</span>
                    ) : (
                      <span className="text-rose-600 font-bold">零庫存 (缺料，需轉採購詢價)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">維修量測與相容性核對備註</label>
                <input
                  type="text"
                  value={specConfirmNotes}
                  onChange={(e) => setSpecConfirmNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {stockAvailable >= requisition.requestedQuantity ? (
                  <button
                    onClick={() => {
                      onConfirmSpec(requisition.id, selectedPartId, '王建國 (維修組長)', specConfirmNotes);
                      onDirectIssueStock(requisition.id, '吳大雄 (倉管員)');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <Boxes className="w-4 h-4" />
                    <span>庫存充足：核定並直接領料出庫 (結案)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onConfirmSpec(requisition.id, selectedPartId, '王建國 (維修組長)', specConfirmNotes);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>確認規格 (庫存不足，轉交採購詢價)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PENDING_RFQ -> Procurement enters quotation */}
          {requisition.status === 'PENDING_RFQ' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-700">
                <strong>採購／行政人員詢價作業：</strong>零件型號已由維修人員核實為 <strong className="text-emerald-700 font-bold">{requisition.confirmedPartCode}</strong>，請向配合廠商詢價並登錄。
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">報價供應商</label>
                  <select
                    value={supplierInput}
                    onChange={(e) => setSupplierInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  >
                    {SUPPLIER_LIST.map((sup, idx) => (
                      <option key={idx} value={sup.name}>{sup.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">含稅單價 (NT$)</label>
                  <input
                    type="number"
                    min="1"
                    value={quotedPriceInput}
                    onChange={(e) => setQuotedPriceInput(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">交期 (天)</label>
                  <input
                    type="number"
                    min="1"
                    value={leadDaysInput}
                    onChange={(e) => setLeadDaysInput(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onUpdateQuotation(requisition.id, supplierInput, quotedPriceInput, leadDaysInput)}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  登錄報價並送主管核准
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PENDING_APPROVAL -> Supervisor approves */}
          {requisition.status === 'PENDING_APPROVAL' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-700">
                <strong>廠長／主管核准作業：</strong>廠商 <strong className="text-slate-900 font-bold">{requisition.supplierName}</strong> 報價總計 <strong className="text-emerald-700 font-mono font-bold">NT$ {requisition.quotedTotalPrice?.toLocaleString()}</strong>，交期 {requisition.estimatedLeadDays} 天。
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">主管核准意見／批示</label>
                <input
                  type="text"
                  value={approvalRemarksInput}
                  onChange={(e) => setApprovalRemarksInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onApproveRequisition(requisition.id, '李廠長 (主管)', approvalRemarksInput)}
                  className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>主管核准此筆採購 (轉入採購下單)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PO_PLACED -> Procurement marks order placed */}
          {requisition.status === 'PO_PLACED' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-700">
                <strong>採購下單追蹤：</strong>採購單號 <strong className="text-blue-700 font-mono font-bold">{requisition.poNumber}</strong>，廠商預計 {requisition.expectedDeliveryDate} 到貨。
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onCompleteInspection(requisition.id, '王建國 (維修技師)', requisition.quotedUnitPrice || 1850, '到貨點收上機測試完成')}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs"
                >
                  <Truck className="w-4 h-4" />
                  <span>零件已送達現場：執行到貨驗收與結案</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CLOSED_COMPLETED or IN_STOCK_ISSUED */}
          {(requisition.status === 'CLOSED_COMPLETED' || requisition.status === 'IN_STOCK_ISSUED') && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>本案已結案完畢！</strong>
                {requisition.status === 'IN_STOCK_ISSUED' ? '已直接自庫存儲位領料出庫。' : '實體驗收合格，已更新零件主檔之庫存量與歷史採購價格。'}
              </span>
            </div>
          )}
        </div>

        {/* Audit Timeline */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>案件全流程時間軸與異動履歷</span>
          </h4>

          <div className="border-l-2 border-slate-200 ml-2 pl-4 space-y-3">
            {requisition.timeline.map((item) => (
              <div key={item.id} className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <span className="font-mono text-slate-400">{item.timestamp}</span>
                  <span>·</span>
                  <strong className="text-slate-800 font-semibold">{item.actor}</strong>
                </div>
                <div className="text-xs font-bold text-slate-900">{item.actionTitle}</div>
                {item.comment && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                    {item.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
