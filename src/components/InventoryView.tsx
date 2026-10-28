import React, { useState } from 'react';
import { SparePart, UserRole } from '../types';
import { 
  Boxes, 
  Search, 
  MapPin, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  CheckCircle2, 
  Clock, 
  Filter,
  Eye
} from 'lucide-react';

interface InventoryViewProps {
  catalogParts: SparePart[];
  currentRole: UserRole;
  onStockAdjustment: (partId: string, adjustmentQty: number, type: 'IN' | 'OUT', reason: string) => void;
  onOpenPartDetail: (part: SparePart) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  catalogParts,
  currentRole,
  onStockAdjustment,
  onOpenPartDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  const [adjustingPart, setAdjustingPart] = useState<SparePart | null>(null);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('OUT');
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('現場領料');

  const zones = [
    { code: 'ALL', name: '全廠倉儲區' },
    { code: 'A', name: 'A區 (擠出主機與加熱器專用庫)' },
    { code: 'B', name: 'B區 (模頭切刀與鎢鋼刀具保險櫃)' },
    { code: 'C', name: 'C區 (雙柱換網器與過濾耗材架)' },
    { code: 'D', name: 'D區 (重型粉碎機刀具與傳動皮帶庫)' },
    { code: 'E', name: 'E區 (離心脫水乾燥機與轉子配件區)' },
    { code: 'F', name: 'F區 (偏心圓震動篩與彈簧架)' },
    { code: 'G', name: 'G區 (氣力風送料倉閥體組件庫)' },
  ];

  const filteredParts = catalogParts.filter((part) => {
    const matchesZone =
      selectedZone === 'ALL' || part.binLocation.toUpperCase().startsWith(selectedZone);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      part.code.toLowerCase().includes(q) ||
      part.name.toLowerCase().includes(q) ||
      (part.alias && part.alias.toLowerCase().includes(q)) ||
      part.binLocation.toLowerCase().includes(q) ||
      part.equipment.toLowerCase().includes(q);

    return matchesZone && matchesSearch;
  });

  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingPart) return;

    if (adjustType === 'OUT' && adjustQty > adjustingPart.currentStock) {
      alert(`出庫數量 (${adjustQty}) 超過目前庫存 (${adjustingPart.currentStock})！`);
      return;
    }

    onStockAdjustment(adjustingPart.id, adjustQty, adjustType, adjustReason);
    setAdjustingPart(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              F04 庫存查詢與儲位管理
            </span>
            <span className="text-xs text-slate-500">即時庫存盤點與現場儲位導覽</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            零件庫存查詢、儲位座標與出入庫異動
          </h2>
          <p className="text-xs text-slate-500">
            現場有庫存可直接領料出庫；無庫存時及時轉交採購詢價，杜絕等料停機損失。
          </p>
        </div>
      </div>

      {/* Warehouse Visual Zone Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {zones.map((zone) => {
          const isSelected = selectedZone === zone.code;
          const count =
            zone.code === 'ALL'
              ? catalogParts.length
              : catalogParts.filter((p) => p.binLocation.toUpperCase().startsWith(zone.code)).length;

          return (
            <button
              key={zone.code}
              onClick={() => setSelectedZone(zone.code)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              <div className="text-xs font-bold font-mono text-blue-700">{zone.code}</div>
              <div className="text-[10px] text-slate-500 truncate mt-1">{zone.name}</div>
              <div className="text-xs font-bold text-emerald-700 mt-2">{count} 件零件</div>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center space-x-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="搜尋零件編號、名稱、現場俗稱或儲位代號 (如 A02-04-B)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">零件編號／正式名稱</th>
                <th className="py-3 px-4">適用設備</th>
                <th className="py-3 px-4">儲位位置 (Bin)</th>
                <th className="py-3 px-4 text-center">目前庫存</th>
                <th className="py-3 px-4 text-center">安全儲備</th>
                <th className="py-3 px-4">庫存狀態</th>
                <th className="py-3 px-4">最後更新</th>
                <th className="py-3 px-4 text-right">出入庫操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredParts.map((part) => {
                const isOutOfStock = part.currentStock === 0;
                const isLowStock = !isOutOfStock && part.currentStock <= part.minSafeStock;

                return (
                  <tr key={part.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                          <img src={part.imageUrl} alt={part.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900">{part.code}</div>
                          <div className="font-bold text-slate-800 truncate max-w-xs">{part.name}</div>
                          {part.alias && <div className="text-[10px] text-slate-400">俗稱: {part.alias}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 max-w-xs truncate">{part.equipment}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{part.equipmentCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{part.binLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm">
                      <span className={isOutOfStock ? 'text-rose-600 font-extrabold' : isLowStock ? 'text-amber-600 font-bold' : 'text-emerald-700 font-bold'}>
                        {part.currentStock} {part.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">
                      {part.minSafeStock} {part.unit}
                    </td>
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          完全缺料
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          低於安全量
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          在庫充足
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {part.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setAdjustingPart(part);
                            setAdjustType('OUT');
                            setAdjustQty(1);
                            setAdjustReason('現場維修領用出庫');
                          }}
                          disabled={part.currentStock === 0}
                          className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 flex items-center space-x-1 disabled:opacity-30 shadow-2xs"
                          title="領料出庫"
                        >
                          <ArrowDownLeft className="w-3 h-3 text-amber-600" />
                          <span>領料</span>
                        </button>
                        <button
                          onClick={() => {
                            setAdjustingPart(part);
                            setAdjustType('IN');
                            setAdjustQty(1);
                            setAdjustReason('採購入庫或盤點盤盈');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 flex items-center space-x-1 shadow-2xs"
                          title="採購入庫"
                        >
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                          <span>入庫</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingPart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Boxes className="w-5 h-5 text-blue-600" />
                <span>庫存異動作業 ({adjustType === 'IN' ? '採購入庫' : '領料出庫'})</span>
              </h3>
              <button onClick={() => setAdjustingPart(null)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="font-mono text-emerald-700 font-bold">{adjustingPart.code}</div>
              <div className="font-bold text-slate-900">{adjustingPart.name}</div>
              <div className="text-slate-600">目前庫存量：<strong className="text-slate-900">{adjustingPart.currentStock} {adjustingPart.unit}</strong> (儲位：{adjustingPart.binLocation})</div>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('OUT')}
                  className={`py-2 rounded-lg font-bold border ${
                    adjustType === 'OUT' ? 'bg-amber-600 border-amber-600 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  領料出庫 (減少庫存)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('IN')}
                  className={`py-2 rounded-lg font-bold border ${
                    adjustType === 'IN' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  進料入庫 (增加庫存)
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">異動數量 ({adjustingPart.unit})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">異動原因／領料人</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="例如: 雙階擠出機換線領用、採購入庫 PO-2026..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setAdjustingPart(null)}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  確認更新庫存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
