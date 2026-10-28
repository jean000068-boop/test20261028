import React from 'react';
import { SparePart, UserRole } from '../types';
import { 
  X, 
  MapPin, 
  Tag, 
  Building2, 
  Calendar, 
  Clock, 
  Boxes, 
  Send, 
  FileText, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface PartDetailModalProps {
  part: SparePart | null;
  onClose: () => void;
  onInitiateRequisition: (part: SparePart) => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  onClose,
  onInitiateRequisition,
}) => {
  if (!part) return null;

  const isOutOfStock = part.currentStock === 0;
  const isLowStock = !isOutOfStock && part.currentStock <= part.minSafeStock;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl relative text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 border-b border-slate-100 pb-4 pr-8">
          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
            <img src={part.imageUrl} alt={part.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                {part.code}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {part.category}
              </span>
              {part.isKeyPart && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  ⚡ 關鍵零組件
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{part.name}</h3>
            {part.alias && (
              <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>現場俗稱：<strong className="text-slate-700">{part.alias}</strong></span>
              </p>
            )}
          </div>
        </div>

        {/* Stock & Storage Status Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">目前在庫庫存</div>
            <div className={`text-base font-extrabold mt-0.5 ${
              isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {part.currentStock} {part.unit}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">安全庫存警示量</div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {part.minSafeStock} {part.unit}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">儲位座標 (Bin)</div>
            <div className="text-sm font-bold text-blue-700 font-mono mt-0.5">
              {part.binLocation}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">最近採購單價</div>
            <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              NT$ {part.lastPurchasePrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Equipment & Technical Specs */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>設備規格與技術參數</span>
          </h4>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-slate-700">
            <div>
              <span className="text-slate-500">適用設備：</span>
              <strong className="text-slate-900">{part.equipment}</strong> ({part.equipmentCode})
            </div>
            <div>
              <span className="text-slate-500">規格說明：</span>
              <span className="text-slate-800">{part.specs}</span>
            </div>
            {part.detailedSpecs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                {part.detailedSpecs.material && (
                  <div>材質：<span className="text-slate-900 font-mono">{part.detailedSpecs.material}</span></div>
                )}
                {part.detailedSpecs.dimensions && (
                  <div>尺寸：<span className="text-slate-900 font-mono">{part.detailedSpecs.dimensions}</span></div>
                )}
                {part.detailedSpecs.voltagePower && (
                  <div>電氣規格：<span className="text-slate-900 font-mono">{part.detailedSpecs.voltagePower}</span></div>
                )}
                {part.detailedSpecs.wearCycleMonths && (
                  <div>平均耗損週期：<span className="text-amber-700 font-mono font-bold">約 {part.detailedSpecs.wearCycleMonths} 個月</span></div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Supplier & Historical Purchases */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>常用供應商與過往採購紀錄</span>
          </h4>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span>主要供應商：<strong className="text-slate-900">{part.primarySupplier}</strong></span>
              <span className="text-slate-400 text-[11px]">最後更新：{part.lastUpdated}</span>
            </div>

            {part.purchaseHistory.length > 0 ? (
              <div className="divide-y divide-slate-200 pt-1">
                {part.purchaseHistory.map((ph) => (
                  <div key={ph.id} className="py-1.5 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-mono text-slate-800">{ph.poNumber} ({ph.purchaseDate})</span>
                    <span>{ph.quantity} {part.unit} x NT$ {ph.unitPrice.toLocaleString()} = <strong className="text-emerald-700 font-mono font-bold">NT$ {ph.totalPrice.toLocaleString()}</strong></span>
                    <span>交期: {ph.leadTimeDays}天</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-[11px]">尚無過往採購歷史紀錄</div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            關閉視窗
          </button>
          <button
            onClick={() => {
              onInitiateRequisition(part);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>以此零件提出需求申請</span>
          </button>
        </div>
      </div>
    </div>
  );
};
