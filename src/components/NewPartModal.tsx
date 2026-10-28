import React, { useState } from 'react';
import { SparePart } from '../types';
import { EQUIPMENT_LIST, SUPPLIER_LIST } from '../data/mockData';
import { X, Plus, Upload, Database, Check } from 'lucide-react';

interface NewPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPart: (part: SparePart) => void;
}

export const NewPartModal: React.FC<NewPartModalProps> = ({
  isOpen,
  onClose,
  onAddPart,
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState<string>(`PP-EXT-0${Math.floor(50 + Math.random() * 40)}`);
  const [name, setName] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [category, setCategory] = useState<string>('加熱元件');
  const [equipmentCode, setEquipmentCode] = useState<string>(EQUIPMENT_LIST[3].code);
  const [specs, setSpecs] = useState<string>('');
  const [currentStock, setCurrentStock] = useState<number>(2);
  const [minSafeStock, setMinSafeStock] = useState<number>(2);
  const [unit, setUnit] = useState<string>('個');
  const [binLocation, setBinLocation] = useState<string>('A02-04-C');
  const [primarySupplier, setPrimarySupplier] = useState<string>(SUPPLIER_LIST[0].name);
  const [lastPurchasePrice, setLastPurchasePrice] = useState<number>(1800);
  const [isKeyPart, setIsKeyPart] = useState<boolean>(true);

  const [imageUrl, setImageUrl] = useState<string>(
    'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="#f8fafc" rx="12" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="#10b981" stroke-width="12"/>
      <text x="100" y="105" fill="#0f172a" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">NEW PART</text>
    </svg>
  `)
  );

  const selectedEquipment = EQUIPMENT_LIST.find((e) => e.code === equipmentCode) || EQUIPMENT_LIST[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      alert('請填寫必填欄位 (零件編號與正式名稱)');
      return;
    }

    const newPart: SparePart = {
      id: `part-${Date.now()}`,
      code,
      name,
      alias: alias || undefined,
      category,
      imageUrl,
      equipment: selectedEquipment.name,
      equipmentCode: selectedEquipment.code,
      specs,
      currentStock,
      minSafeStock,
      unit,
      binLocation,
      primarySupplier,
      lastPurchasePrice,
      currency: 'NTD',
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      purchaseHistory: [],
      isKeyPart,
    };

    onAddPart(newPart);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            <span>建立新零件主檔 (F01 零件資料庫)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            符合規格書第三節「A. 零件主檔」欄位規範
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">零件編號 (唯一識別碼) *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">類別</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="加熱元件">加熱元件</option>
                <option value="切粒工具">切粒工具</option>
                <option value="過濾耗材">過濾耗材</option>
                <option value="破碎刀刃">破碎刀刃</option>
                <option value="脫水乾燥">脫水乾燥</option>
                <option value="儀表感測">儀表感測</option>
                <option value="傳動機構">傳動機構</option>
                <option value="油壓氣動">油壓氣動</option>
                <option value="儲運系統">儲運系統</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">零件正式名稱 *</label>
              <input
                type="text"
                required
                placeholder="例如: 雙階擠出機 陶瓷加熱瓦圈"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">現場俗稱 (選填)</label>
              <input
                type="text"
                placeholder="例如: 螺桿電熱圈、加熱瓦"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">適用設備／設備型號 *</label>
            <select
              value={equipmentCode}
              onChange={(e) => setEquipmentCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {EQUIPMENT_LIST.map((eq) => (
                <option key={eq.code} value={eq.code}>
                  [{eq.code}] {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">零件型號／規格 (尺寸、材質、功率等)</label>
            <textarea
              rows={2}
              placeholder="例如: 外徑φ180mm x 寬100mm, 220V 2.5kW, 304不鏽鋼束帶"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">初始庫存量 *</label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">安全庫存量 *</label>
              <input
                type="number"
                min="0"
                value={minSafeStock}
                onChange={(e) => setMinSafeStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">計量單位 *</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">儲位座標 (Bin Location) *</label>
              <input
                type="text"
                value={binLocation}
                onChange={(e) => setBinLocation(e.target.value)}
                placeholder="例如: A02-04-B"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">主要供應商</label>
              <select
                value={primarySupplier}
                onChange={(e) => setPrimarySupplier(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                {SUPPLIER_LIST.map((sup, idx) => (
                  <option key={idx} value={sup.name}>{sup.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">最近採購價格 (NT$)</label>
              <input
                type="number"
                min="0"
                value={lastPurchasePrice}
                onChange={(e) => setLastPurchasePrice(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center space-x-2 pt-5">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={isKeyPart}
                  onChange={(e) => setIsKeyPart(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4 border-slate-300"
                />
                <span className="font-bold text-rose-700">標記為產線關鍵停機零組件</span>
              </label>
            </div>
          </div>

          <div className="pt-3 flex space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            >
              儲存並加入主檔庫
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
