import React, { useState } from 'react';
import { PurchaseRequisition, UserRole, SparePart } from '../types';
import { SUPPLIER_LIST } from '../data/mockData';
import { ROLE_CONFIG } from './Header';
import { 
  ShoppingCart, 
  Search, 
  Building2, 
  Phone, 
  UserCheck, 
  Clock, 
  DollarSign, 
  Calendar, 
  Send, 
  FileText, 
  AlertCircle,
  Truck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ProcurementManagementViewProps {
  requisitions: PurchaseRequisition[];
  catalogParts: SparePart[];
  currentRole: UserRole;
  onOpenDetail: (req: PurchaseRequisition) => void;
  onUpdateQuotation: (reqId: string, supplier: string, unitPrice: number, leadDays: number) => void;
  onApproveRequisition: (reqId: string, approvedBy: string, remarks: string) => void;
  onPlaceOrder: (reqId: string, poNumber: string) => void;
}

export const ProcurementManagementView: React.FC<ProcurementManagementViewProps> = ({
  requisitions,
  catalogParts,
  currentRole,
  onOpenDetail,
  onUpdateQuotation,
  onApproveRequisition,
  onPlaceOrder,
}) => {
  const [selectedReqForRfq, setSelectedReqForRfq] = useState<PurchaseRequisition | null>(null);
  const [supplierName, setSupplierName] = useState<string>(SUPPLIER_LIST[0].name);
  const [quotedPrice, setQuotedPrice] = useState<number>(1850);
  const [leadDays, setLeadDays] = useState<number>(4);

  const procurementRequisitions = requisitions.filter(
    (r) => ['PENDING_RFQ', 'PENDING_APPROVAL', 'PO_PLACED', 'ARRIVED_INSPECTING'].includes(r.status)
  );

  const handleSaveRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForRfq) return;
    onUpdateQuotation(selectedReqForRfq.id, supplierName, quotedPrice, leadDays);
    setSelectedReqForRfq(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              F05 採購與詢價
            </span>
            <span className="text-xs text-slate-500">記錄供應商、報價、交期及主管核准狀態</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            無庫存需求詢價、主管審核與訂單追蹤
          </h2>
          <p className="text-xs text-slate-500">
            維修技術員核定規格且倉庫確認無存量後，採購迅速向專用零件廠商詢價並呈報主管核准。
          </p>
        </div>

        {/* Current Role Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs shrink-0">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-500">目前採購操作人：</span>
          <span className="font-bold text-slate-900">
            {ROLE_CONFIG[currentRole]?.label} · {ROLE_CONFIG[currentRole]?.userName}
          </span>
        </div>
      </div>

      {/* Supplier Address Book Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>廠內配合回收 PP 造粒專業五金與刀具配合廠商名冊</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SUPPLIER_LIST.map((sup, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{sup.name}</div>
              <div className="text-[11px] text-slate-600 flex items-center justify-between">
                <span>窗口：{sup.contact}</span>
                <span className="font-mono text-indigo-700 font-bold">{sup.phone}</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">{sup.address}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Procurement Jobs */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
          <span>待辦採購進度清單 ({procurementRequisitions.length} 筆案件)</span>
        </h3>

        {procurementRequisitions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">目前無待詢價或審核之採購案件！</p>
            <p className="text-xs text-slate-400 mt-1">所有提出的現場需求皆已有庫存出庫，或已結案完畢。</p>
          </div>
        ) : (
          procurementRequisitions.map((req) => {
            return (
              <div
                key={req.id}
                onClick={() => onOpenDetail(req)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition shadow-xs hover:shadow-md cursor-pointer space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                      <img src={req.photoUrls[0]} alt={req.reqNumber} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {req.reqNumber}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {req.confirmedPartCode || req.knownPartCode || '零件待核實'}
                        </span>
                        <span className="text-xs text-slate-800 font-bold truncate">
                          {req.confirmedPartName || req.equipmentName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        設備：{req.equipmentName} ｜ 需求：{req.requestedQuantity} {req.unit}
                      </p>
                    </div>
                  </div>

                  {/* Status & Pricing */}
                  <div className="text-right shrink-0">
                    {req.quotedTotalPrice ? (
                      <div className="text-sm font-bold text-slate-900 font-mono">
                        報價總額：NT$ {req.quotedTotalPrice.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-amber-700">尚未登錄報價</div>
                    )}
                    <div className="text-[11px] text-slate-500">
                      供應商：{req.supplierName || '待詢價'}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-500 flex items-center space-x-3 text-[11px]">
                    <span>申請人：{req.requesterName}</span>
                    <span>預估交期：{req.estimatedLeadDays ? `${req.estimatedLeadDays} 天` : '未定'}</span>
                    {req.poNumber && <span className="font-mono text-blue-700 font-bold">PO: {req.poNumber}</span>}
                  </div>

                  <div className="flex items-center space-x-2">
                    {req.status === 'PENDING_RFQ' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReqForRfq(req);
                          setQuotedPrice(1850);
                          setLeadDays(4);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center space-x-1 shadow-xs"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>登錄廠商報價</span>
                      </button>
                    )}

                    {req.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApproveRequisition(req.id, '李廠長 (主管)', '審核合格，同意依報價採購');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1 shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>主管一鍵核准</span>
                      </button>
                    )}

                    {req.status === 'PO_PLACED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(req);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center space-x-1 shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>追蹤到貨</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(req);
                      }}
                      className="text-slate-600 hover:text-slate-900 flex items-center space-x-0.5 text-xs font-semibold"
                    >
                      <span>檢視完整表單</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RFQ Quotation Modal */}
      {selectedReqForRfq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <span>登錄供應商詢價報價 (F05)</span>
              </h3>
              <button onClick={() => setSelectedReqForRfq(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="font-mono text-emerald-700 font-bold">{selectedReqForRfq.reqNumber}</div>
              <div className="font-bold text-slate-900">{selectedReqForRfq.confirmedPartName || selectedReqForRfq.equipmentName}</div>
              <div className="text-slate-600">需求數量：<strong className="text-slate-900">{selectedReqForRfq.requestedQuantity} {selectedReqForRfq.unit}</strong></div>
            </div>

            <form onSubmit={handleSaveRfq} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">報價供應商</label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  {SUPPLIER_LIST.map((sup, idx) => (
                    <option key={idx} value={sup.name}>
                      {sup.name} ({sup.contact} {sup.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">含稅單價 (NT$)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">預估交期 (天數)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={leadDays}
                    onChange={(e) => setLeadDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900 flex items-center justify-between">
                <span>採購總價預算：</span>
                <span className="font-bold text-slate-900 text-sm font-mono">NT$ {(quotedPrice * selectedReqForRfq.requestedQuantity).toLocaleString()}</span>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqForRfq(null)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  完成詢價並送呈主管
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
