import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { ActiveTab } from './Navigation';
import { 
  Factory, 
  ShieldCheck, 
  Wrench, 
  Package, 
  ShoppingCart, 
  UserCheck, 
  Settings, 
  AlertTriangle, 
  Flame, 
  Smartphone, 
  Monitor,
  ChevronDown,
  Check,
  User
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeLineStopCount: number;
  activeUrgentCount: number;
  isMobileSimulated: boolean;
  onToggleMobileSim: () => void;
  onOpenQuickRequisition: () => void;
}

export interface RoleDetail {
  label: string;
  userName: string;
  title: string;
  icon: any;
  color: string;
  desc: string;
  defaultTab: ActiveTab;
}

export const ROLE_CONFIG: Record<UserRole, RoleDetail> = {
  OPERATOR: {
    label: '現場作業員',
    userName: '陳志明',
    title: '現場操作員',
    icon: Factory,
    color: 'bg-emerald-600 text-white',
    desc: '提出零件需求、上傳現場拍照、查看個人案件進度',
    defaultTab: 'REQUEST',
  },
  TECHNICIAN: {
    label: '維修／技術人員',
    userName: '李建宏',
    title: '維修技術組長',
    icon: Wrench,
    color: 'bg-amber-600 text-white',
    desc: '審查AI比對、確認零件規格尺寸、相容性及核定型號',
    defaultTab: 'PIPELINE',
  },
  WAREHOUSE: {
    label: '倉庫管理人員',
    userName: '吳大雄',
    title: '倉庫管理員',
    icon: Package,
    color: 'bg-blue-600 text-white',
    desc: '查詢庫存儲位、在庫直接領料出庫、驗收入庫與盤點',
    defaultTab: 'INVENTORY',
  },
  PROCUREMENT: {
    label: '採購／行政人員',
    userName: '張雅惠',
    title: '採購專員',
    icon: ShoppingCart,
    color: 'bg-indigo-600 text-white',
    desc: '無庫存轉詢價、登錄供應商報價、交期及下單採購',
    defaultTab: 'PROCUREMENT',
  },
  SUPERVISOR: {
    label: '廠長／主管',
    userName: '王大偉',
    title: '廠長／主管',
    icon: UserCheck,
    color: 'bg-purple-600 text-white',
    desc: '採購金額審核核准、產線停機管控與 KPI 成效監控',
    defaultTab: 'KPI',
  },
  ADMIN: {
    label: '系統管理者',
    userName: '林系統',
    title: '系統管理員',
    icon: Settings,
    color: 'bg-slate-700 text-white',
    desc: '零件主檔建立、系統權限管理與展示資料重設',
    defaultTab: 'CATALOG',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeLineStopCount,
  activeUrgentCount,
  isMobileSimulated,
  onToggleMobileSim,
  onOpenQuickRequisition,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRoleInfo = ROLE_CONFIG[currentRole];
  const CurrentIcon = currentRoleInfo.icon;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (roleKey: UserRole) => {
    onRoleChange(roleKey);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & System Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  回收 PP 造粒產業
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                零件辨識與採購管理系統 (現場拍照輔助 · 庫存核實 · 採購追蹤)
              </p>
            </div>
          </div>

          {/* Center alerts */}
          <div className="hidden md:flex items-center space-x-3">
            {activeLineStopCount > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>停機急件: {activeLineStopCount} 件</span>
              </div>
            )}
            {activeUrgentCount > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>一般急件: {activeUrgentCount} 件</span>
              </div>
            )}
          </div>

          {/* Right Action & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Quick Requisition Button */}
            <button
              onClick={onOpenQuickRequisition}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              title="手機現場拍照提報需求"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">現場拍照提報</span>
              <span className="sm:hidden">拍照提報</span>
            </button>

            {/* Mobile View Toggle */}
            <button
              onClick={onToggleMobileSim}
              className={`p-2 rounded-lg border text-xs transition hidden lg:flex items-center space-x-1 ${
                isMobileSimulated
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="切換現場手機寬度模擬"
            >
              {isMobileSimulated ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              <span className="text-[11px]">{isMobileSimulated ? '手機模式' : '寬螢幕'}</span>
            </button>

            {/* User Role Switcher Dropdown with Click & Touch Support */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition text-left shadow-2xs ${
                  isDropdownOpen
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
                title="點擊切換系統操作身分與權限"
                aria-expanded={isDropdownOpen}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${currentRoleInfo.color}`}>
                  <CurrentIcon className="w-3 h-3" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 leading-none">身分切換</div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentRoleInfo.label} · <span className="text-emerald-700 font-medium">{currentRoleInfo.userName}</span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">切換角色權限模擬</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold">
                        自動切換對應工作區
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      切換後系統將同步帶入該人員身分、表單預設人名及主工作視圖
                    </p>
                  </div>

                  <div className="py-1">
                    {(Object.keys(ROLE_CONFIG) as UserRole[]).map((roleKey) => {
                      const item = ROLE_CONFIG[roleKey];
                      const Icon = item.icon;
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => handleSelectRole(roleKey)}
                          className={`w-full text-left px-4 py-2.5 flex items-start space-x-3 transition ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs ${item.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">
                                {item.label} · <span className="font-medium text-slate-600">{item.userName}</span>
                              </span>
                              {isSelected ? (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.defaultTab}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5 font-normal">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role permission info banner */}
        <div className="py-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              目前模擬身分：<strong className="text-slate-900 font-bold">{currentRoleInfo.label} ({currentRoleInfo.userName})</strong> — {currentRoleInfo.desc}
            </span>
          </div>
          <div className="hidden md:block text-slate-400 font-mono text-[10px]">
            原則：現場提報 → AI輔助外觀比對 → 人工核定規格與庫存 → 審核採購
          </div>
        </div>
      </div>
    </header>
  );
};
