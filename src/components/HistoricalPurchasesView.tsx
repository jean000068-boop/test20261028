import React, { useState } from 'react';
import { SparePart, HistoricalPurchaseRecord } from '../types';
import { 
  History, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Building2, 
  Clock, 
  Tag, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HistoricalPurchasesViewProps {
  catalogParts: SparePart[];
  onOpenPartDetail: (part: SparePart) => void;
}

export const HistoricalPurchasesView: React.FC<HistoricalPurchasesViewProps> = ({
  catalogParts,
  onOpenPartDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [supplierFilter, setSupplierFilter] = useState<string>('ALL');

  const allHistoricalRecords = catalogParts.flatMap((part) =>
    part.purchaseHistory.map((history) => ({
      ...history,
      partId: part.id,
      partCode: part.code,
      partName: part.name,
      partAlias: part.alias,
      partCategory: part.category,
      partImageUrl: part.imageUrl,
      partEquipment: part.equipment,
      partUnit: part.unit,
      currentPrice: part.lastPurchasePrice,
    }))
  ).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  const filteredRecords = allHistoricalRecords.filter((rec) => {
    const matchesSupplier = supplierFilter === 'ALL' || rec.supplier === supplierFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rec.poNumber.toLowerCase().includes(q) ||
      rec.partCode.toLowerCase().includes(q) ||
      rec.partName.toLowerCase().includes(q) ||
      (rec.partAlias && rec.partAlias.toLowerCase().includes(q)) ||
      rec.supplier.toLowerCase().includes(q) ||
      rec.partEquipment.toLowerCase().includes(q);

    return matchesSupplier && matchesSearch;
  });

  const suppliers = Array.from(new Set(allHistoricalRecords.map((r) => r.supplier)));
  const totalSpend = allHistoricalRecords.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              F07 歷史紀錄
            </span>
            <span className="text-xs text-slate-500">歷次採購單價、交期與供應商過往合約</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            零件過往採購價格與供應商交易履歷
          </h2>
          <p className="text-xs text-slate-500">
            精準查詢過去零件採購價格、歷史交期天數及供應商紀錄，作為新詢價之比價與議價基準。
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center space-x-3 shrink-0 shadow-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">累計歷史採購總金額</div>
            <div className="text-base font-extrabold text-emerald-700 font-mono">
              NT$ {totalSpend.toLocaleString()}
            </div>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜尋 PO 單號、零件編號 (PP-EXT-042)、零件名稱、俗稱或供應商..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
          <span className="text-xs text-slate-500">供應商：</span>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
          >
            <option value="ALL">全部供應商 ({suppliers.length} 家)</option>
            {suppliers.map((sup) => (
              <option key={sup} value={sup}>
                {sup}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">採購單號 (PO)</th>
                <th className="py-3 px-4">零件編號與名稱</th>
                <th className="py-3 px-4">供應商名稱</th>
                <th className="py-3 px-4 text-center">採購日期</th>
                <th className="py-3 px-4 text-right">採購單價 (NT$)</th>
                <th className="py-3 px-4 text-center">數量</th>
                <th className="py-3 px-4 text-right">採購總額 (NT$)</th>
                <th className="py-3 px-4 text-center">交期 (天)</th>
                <th className="py-3 px-4 text-center">採購承辦</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map((record) => {
                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {record.poNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                          <img src={record.partImageUrl} alt={record.partName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-emerald-700 font-bold">{record.partCode}</span>
                            <span className="text-slate-900 font-semibold">{record.partName}</span>
                          </div>
                          {record.partAlias && (
                            <div className="text-[10px] text-slate-400">俗稱：{record.partAlias}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {record.supplier}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {record.purchaseDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      NT$ {record.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {record.quantity} {record.partUnit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      NT$ {record.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {record.leadTimeDays} 天
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {record.buyerName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
