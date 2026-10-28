import React, { useState } from 'react';
import { SparePart, UserRole, ProductionLineCode, EquipmentStationType } from '../types';
import { 
  Database, 
  Search, 
  Plus, 
  Filter, 
  Boxes, 
  Eye, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  MapPin, 
  Building2, 
  Calendar,
  Layers,
  Sparkles,
  Factory,
  Cpu,
  Waves,
  Scissors
} from 'lucide-react';

interface PartsCatalogViewProps {
  catalogParts: SparePart[];
  currentRole: UserRole;
  onOpenPartDetail: (part: SparePart) => void;
  onOpenAddPart: () => void;
  onInitiateRequisitionForPart: (part: SparePart) => void;
}

export const PartsCatalogView: React.FC<PartsCatalogViewProps> = ({
  catalogParts,
  currentRole,
  onOpenPartDetail,
  onOpenAddPart,
  onInitiateRequisitionForPart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLine, setSelectedLine] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('ALL');

  const categories = [
    'ALL',
    '加熱元件',
    '切粒工具',
    '過濾耗材',
    '破碎刀刃',
    '脫水乾燥',
    '儀表感測',
    '傳動機構',
    '油壓氣動',
    '儲運系統',
  ];

  const filteredParts = catalogParts.filter((part) => {
    const matchesCategory = selectedCategory === 'ALL' || part.category === selectedCategory;
    
    // Line Match
    let matchesLine = true;
    if (selectedLine !== 'ALL') {
      if (selectedLine === 'COMMON') {
        matchesLine = !part.applicableLines || part.applicableLines.length >= 4;
      } else {
        matchesLine =
          !part.applicableLines ||
          part.applicableLines.includes(selectedLine as ProductionLineCode) ||
          part.equipmentCode?.includes(`L${selectedLine}`) ||
          part.equipment?.includes(`${selectedLine}產線`);
      }
    }

    // Station Match
    let matchesStation = true;
    if (selectedStation !== 'ALL') {
      matchesStation = part.stationType === selectedStation;
    }

    let matchesStock = true;
    if (stockStatusFilter === 'LOW') {
      matchesStock = part.currentStock <= part.minSafeStock && part.currentStock > 0;
    } else if (stockStatusFilter === 'OUT') {
      matchesStock = part.currentStock === 0;
    } else if (stockStatusFilter === 'HEALTHY') {
      matchesStock = part.currentStock > part.minSafeStock;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      part.code.toLowerCase().includes(q) ||
      part.name.toLowerCase().includes(q) ||
      (part.alias && part.alias.toLowerCase().includes(q)) ||
      part.equipment.toLowerCase().includes(q) ||
      part.equipmentCode.toLowerCase().includes(q) ||
      part.specs.toLowerCase().includes(q) ||
      part.binLocation.toLowerCase().includes(q);

    return matchesCategory && matchesLine && matchesStation && matchesStock && matchesSearch;
  });

  const totalPartsCount = catalogParts.length;
  const outOfStockCount = catalogParts.filter((p) => p.currentStock === 0).length;
  const lowStockCount = catalogParts.filter((p) => p.currentStock > 0 && p.currentStock <= p.minSafeStock).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              F01 零件資料庫
            </span>
            <span className="text-xs text-slate-500">廠內常用零件庫 (MVP 試行資料集)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            回收 PP 造粒設備零件主檔管理
          </h2>
          <p className="text-xs text-slate-500">
            完整建檔零件照片、正式名稱、現場俗稱、型號規格、適用機型、即時庫存與儲位。
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onOpenAddPart}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>新增零件主檔</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">零件主檔總數</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{totalPartsCount} 筆</div>
          </div>
          <Database className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">資料完整率</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">98.5% (達標)</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">安全庫存偏低</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">{lowStockCount} 種</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">完全缺料無庫存</div>
            <div className="text-lg font-bold text-rose-700 mt-0.5">{outOfStockCount} 種</div>
          </div>
          <Boxes className="w-5 h-5 text-rose-600" />
        </div>
      </div>

      {/* Search & Category Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
        {/* Category horizontal scrolling bar */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? '全部零件類別' : cat}
              </button>
            );
          })}
        </div>

        {/* Line & Equipment Station Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">適用產線：</span>
            <button
              onClick={() => setSelectedLine('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                selectedLine === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部產線
            </button>
            {(['A', 'B', 'C', 'D', 'E'] as ProductionLineCode[]).map((lCode) => (
              <button
                key={lCode}
                onClick={() => setSelectedLine(lCode)}
                className={`px-2.5 py-1 rounded-md font-mono font-bold transition flex items-center space-x-1 ${
                  selectedLine === lCode
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{lCode} 產線</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedLine('COMMON')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedLine === 'COMMON'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全廠通用
            </button>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">機台單元：</span>
            <button
              onClick={() => setSelectedStation('ALL')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedStation === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部單元
            </button>
            <button
              onClick={() => setSelectedStation('MOTHER_EXTRUDER')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStation === 'MOTHER_EXTRUDER'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>母機</span>
            </button>
            <button
              onClick={() => setSelectedStation('BABY_EXTRUDER')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStation === 'BABY_EXTRUDER'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>子機</span>
            </button>
            <button
              onClick={() => setSelectedStation('COOLING_TROUGH')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStation === 'COOLING_TROUGH'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>冷卻水道</span>
            </button>
            <button
              onClick={() => setSelectedStation('PELLETIZER')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center space-x-1 ${
                selectedStation === 'PELLETIZER'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>切粒機</span>
            </button>
          </div>
        </div>

        {/* Search input & Stock status filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜尋零件編號 (PP-EXT-042)、正式名稱、現場俗稱 (電熱圈/甩刀/飛刀)、儲位或規格..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <span className="text-xs text-slate-500">庫存篩選：</span>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">全部庫存狀態</option>
              <option value="HEALTHY">庫存充足</option>
              <option value="LOW">低於安全庫存 (需備料)</option>
              <option value="OUT">零庫存 (缺料)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParts.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 shadow-xs">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">查無符合搜尋條件的零件資料</p>
            <p className="text-xs text-slate-400 mt-1">請嘗試縮減關鍵字或調整篩選類別。</p>
          </div>
        ) : (
          filteredParts.map((part) => {
            const isOutOfStock = part.currentStock === 0;
            const isLowStock = !isOutOfStock && part.currentStock <= part.minSafeStock;

            return (
              <div
                key={part.id}
                onClick={() => onOpenPartDetail(part)}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Category Ribbon */}
                  <div className="relative aspect-video w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur text-[10px] font-bold text-slate-900 font-mono border border-slate-200 shadow-xs">
                        {part.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-white font-medium">
                        {part.category}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          缺料 0 {part.unit}
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          偏低 ({part.currentStock} {part.unit})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          庫存：{part.currentStock} {part.unit}
                        </span>
                      )}
                    </div>

                    {/* Key Part Flag */}
                    {part.isKeyPart && (
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[9px] font-bold text-rose-700">
                        ⚡ 產線關鍵零組件
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                        {part.name}
                      </h4>
                      {part.alias && (
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>現場俗稱：<strong className="text-slate-700">{part.alias}</strong></span>
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 font-medium">
                        <span>適用設備：</span>
                        {part.stationType && (
                          <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 text-[9px] font-bold border border-sky-200">
                            {part.stationType === 'MOTHER_EXTRUDER' && '子母機-母機'}
                            {part.stationType === 'BABY_EXTRUDER' && '子母機-子機'}
                            {part.stationType === 'COOLING_TROUGH' && '冷卻水道'}
                            {part.stationType === 'PELLETIZER' && '切粒機'}
                            {part.stationType === 'COMMON' && '通用配件'}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-800 font-bold truncate">{part.equipment}</div>
                      <div className="text-slate-500 pt-0.5 line-clamp-2">
                        規格：{part.specs}
                      </div>
                      {part.applicableLines && part.applicableLines.length > 0 && (
                        <div className="flex items-center space-x-1 pt-1">
                          <span className="text-[10px] text-slate-400">適用產線:</span>
                          <div className="flex space-x-1">
                            {part.applicableLines.map((l) => (
                              <span key={l} className="px-1 rounded bg-slate-200 text-slate-700 text-[9px] font-mono font-bold">
                                {l}線
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center space-x-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>儲位：<strong className="text-slate-800">{part.binLocation}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1 truncate justify-end">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{part.primarySupplier}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-600">
                    歷史單價：<strong className="text-slate-900 font-mono font-bold">NT$ {part.lastPurchasePrice.toLocaleString()}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInitiateRequisitionForPart(part);
                      }}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center space-x-1 transition shadow-2xs"
                      title="直接以此零件填寫現場拍照提報"
                    >
                      <Send className="w-3 h-3" />
                      <span>提報此零件</span>
                    </button>
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
