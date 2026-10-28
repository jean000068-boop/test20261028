import React from 'react';
import { 
  Camera, 
  GitPullRequest, 
  Database, 
  Boxes, 
  ShoppingCart, 
  History, 
  BarChart3,
  BadgeAlert
} from 'lucide-react';

export type ActiveTab = 
  | 'REQUEST'       // F02 現場需求申請
  | 'PIPELINE'      // F06 採購追蹤
  | 'CATALOG'       // F01 零件資料庫
  | 'INVENTORY'     // F04 庫存查詢
  | 'PROCUREMENT'   // F05 採購與詢價
  | 'HISTORY'       // F07 歷史紀錄
  | 'KPI';          // F09 效益與統計報表

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingConfirmationCount: number;
  pendingApprovalCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingConfirmationCount,
  pendingApprovalCount,
}) => {
  const tabs = [
    {
      id: 'REQUEST' as ActiveTab,
      label: '現場需求申請',
      code: 'F02',
      icon: Camera,
      badge: null,
    },
    {
      id: 'PIPELINE' as ActiveTab,
      label: '需求案件追蹤',
      code: 'F06',
      icon: GitPullRequest,
      badge: pendingConfirmationCount > 0 ? pendingConfirmationCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'CATALOG' as ActiveTab,
      label: '零件主檔庫',
      code: 'F01',
      icon: Database,
      badge: null,
    },
    {
      id: 'INVENTORY' as ActiveTab,
      label: '庫存與儲位',
      code: 'F04',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'PROCUREMENT' as ActiveTab,
      label: '採購與詢價',
      code: 'F05',
      icon: ShoppingCart,
      badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'HISTORY' as ActiveTab,
      label: '歷史採購價格',
      code: 'F07',
      icon: History,
      badge: null,
    },
    {
      id: 'KPI' as ActiveTab,
      label: '效益與驗收 KPI',
      code: 'F09',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.code}
                </span>
                {tab.badge !== null && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${tab.badgeColor || 'bg-rose-500'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
