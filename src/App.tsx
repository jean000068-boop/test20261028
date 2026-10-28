/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  SparePart, 
  PurchaseRequisition, 
  RequestStatus,
  ProductionLineCode
} from './types';
import { INITIAL_PARTS, INITIAL_REQUISITIONS } from './data/mockData';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { ProductionLinesBar } from './components/ProductionLinesBar';
import { RequestApplicationView } from './components/RequestApplicationView';
import { RequisitionsPipelineView } from './components/RequisitionsPipelineView';
import { PartsCatalogView } from './components/PartsCatalogView';
import { InventoryView } from './components/InventoryView';
import { ProcurementManagementView } from './components/ProcurementManagementView';
import { HistoricalPurchasesView } from './components/HistoricalPurchasesView';
import { KpiDashboardView } from './components/KpiDashboardView';
import { PartDetailModal } from './components/PartDetailModal';
import { RequestDetailModal } from './components/RequestDetailModal';
import { NewPartModal } from './components/NewPartModal';
import { RotateCcw, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const PARTS_STORAGE_KEY = 'pp_pellet_parts_catalog_v2';
  const REQS_STORAGE_KEY = 'pp_pellet_requisitions_v2';

  const [currentRole, setCurrentRole] = useState<UserRole>('OPERATOR');
  const [activeTab, setActiveTab] = useState<ActiveTab>('REQUEST');
  const [selectedLine, setSelectedLine] = useState<ProductionLineCode | 'ALL'>('ALL');
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);

  const [catalogParts, setCatalogParts] = useState<SparePart[]>(() => {
    try {
      const saved = localStorage.getItem(PARTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PARTS;
    } catch {
      return INITIAL_PARTS;
    }
  });

  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(() => {
    try {
      const saved = localStorage.getItem(REQS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REQUISITIONS;
    } catch {
      return INITIAL_REQUISITIONS;
    }
  });

  const [selectedDetailReq, setSelectedDetailReq] = useState<PurchaseRequisition | null>(null);
  const [selectedDetailPart, setSelectedDetailPart] = useState<SparePart | null>(null);
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(PARTS_STORAGE_KEY, JSON.stringify(catalogParts));
  }, [catalogParts]);

  useEffect(() => {
    localStorage.setItem(REQS_STORAGE_KEY, JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    if (selectedDetailReq) {
      const updated = requisitions.find((r) => r.id === selectedDetailReq.id);
      if (updated) setSelectedDetailReq(updated);
    }
  }, [requisitions]);

  const activeLineStopCount = requisitions.filter(
    (r) => r.urgency === 'LINE_STOP' && !['IN_STOCK_ISSUED', 'CLOSED_COMPLETED'].includes(r.status)
  ).length;

  const activeUrgentCount = requisitions.filter(
    (r) => r.urgency === 'URGENT' && !['IN_STOCK_ISSUED', 'CLOSED_COMPLETED'].includes(r.status)
  ).length;

  const pendingConfirmationCount = requisitions.filter(
    (r) => r.status === 'PENDING_CONFIRMATION'
  ).length;

  const pendingApprovalCount = requisitions.filter(
    (r) => r.status === 'PENDING_APPROVAL'
  ).length;

  const handleAddNewRequisition = (newReq: Partial<PurchaseRequisition>) => {
    const pr: PurchaseRequisition = {
      id: `req-${Date.now()}`,
      reqNumber: newReq.reqNumber || `PR-${Date.now()}`,
      requesterName: newReq.requesterName || '現場操作員',
      requesterRole: newReq.requesterRole || '現場操作人員',
      requestDate: newReq.requestDate || new Date().toLocaleString('zh-TW', { hour12: false }),
      equipmentName: newReq.equipmentName || '造粒擠出機',
      equipmentCode: newReq.equipmentCode || 'EXT-01',
      photoUrls: newReq.photoUrls || [],
      faultDescription: newReq.faultDescription || '零件損壞待查',
      urgency: newReq.urgency || 'NORMAL',
      requestedQuantity: newReq.requestedQuantity || 1,
      unit: newReq.unit || '個',
      knownPartCode: newReq.knownPartCode,
      aiResult: newReq.aiResult,
      status: 'PENDING_CONFIRMATION',
      clarificationCount: 0,
      timeline: newReq.timeline || [],
    };

    setRequisitions((prev) => [pr, ...prev]);
  };

  const handleConfirmSpec = (reqId: string, partId: string, technicianName: string, notes?: string) => {
    const targetPart = catalogParts.find((p) => p.id === partId);
    if (!targetPart) return;

    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;

        const nextStatus: RequestStatus = 'PENDING_RFQ';
        return {
          ...r,
          confirmedPartId: targetPart.id,
          confirmedPartCode: targetPart.code,
          confirmedPartName: targetPart.name,
          confirmedSpecs: targetPart.specs,
          confirmedBy: technicianName,
          confirmedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          status: nextStatus,
          timeline: [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
              status: nextStatus,
              actor: technicianName,
              role: 'TECHNICIAN',
              actionTitle: `維修技術人員核定零件為 ${targetPart.code}`,
              comment: notes || `確認規格符合設備 ${r.equipmentName}，轉交採購進行詢價。`,
            },
          ],
        };
      })
    );
  };

  const handleDirectIssueStock = (reqId: string, warehouseOfficer: string) => {
    const targetReq = requisitions.find((r) => r.id === reqId);
    if (!targetReq) return;

    const partCodeToDeduct = targetReq.confirmedPartCode || targetReq.knownPartCode;
    const partToDeduct = catalogParts.find(
      (p) => p.code === partCodeToDeduct || p.id === targetReq.confirmedPartId
    );

    if (partToDeduct) {
      setCatalogParts((prev) =>
        prev.map((p) => {
          if (p.id === partToDeduct.id) {
            const nextStock = Math.max(0, p.currentStock - targetReq.requestedQuantity);
            return {
              ...p,
              currentStock: nextStock,
              lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
            };
          }
          return p;
        })
      );
    }

    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          status: 'IN_STOCK_ISSUED',
          isDirectStockIssued: true,
          completedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          timeline: [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
              status: 'IN_STOCK_ISSUED',
              actor: warehouseOfficer,
              role: 'WAREHOUSE',
              actionTitle: '在庫數量充足，直接完成領料出庫 (結案)',
              comment: `由儲位 ${partToDeduct?.binLocation || '倉儲區'} 領料出庫 ${r.requestedQuantity} ${r.unit}，已自動扣減即時庫存。`,
            },
          ],
        };
      })
    );
  };

  const handleUpdateQuotation = (
    reqId: string,
    supplier: string,
    unitPrice: number,
    leadDays: number
  ) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const total = unitPrice * r.requestedQuantity;
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + leadDays);

        return {
          ...r,
          supplierName: supplier,
          quotedUnitPrice: unitPrice,
          quotedTotalPrice: total,
          estimatedLeadDays: leadDays,
          expectedDeliveryDate: expectedDate.toISOString().slice(0, 10),
          rfqCompletedBy: '張雅惠 (採購專員)',
          rfqCompletedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          status: 'PENDING_APPROVAL',
          timeline: [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
              status: 'PENDING_APPROVAL',
              actor: '張雅惠 (採購專員)',
              role: 'PROCUREMENT',
              actionTitle: `登錄廠商 ${supplier} 報價 NT$ ${total.toLocaleString()}`,
              comment: `單價 NT$ ${unitPrice.toLocaleString()}，交期約 ${leadDays} 天，送呈主管核准。`,
            },
          ],
        };
      })
    );
  };

  const handleApproveRequisition = (reqId: string, approvedBy: string, remarks: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const poNum = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;

        return {
          ...r,
          approvedBy,
          approvedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          approvalRemarks: remarks,
          poNumber: poNum,
          status: 'PO_PLACED',
          orderedBy: '張雅惠 (採購專員)',
          orderedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          timeline: [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
              status: 'PO_PLACED',
              actor: approvedBy,
              role: 'SUPERVISOR',
              actionTitle: '主管審核核准，採購開立訂單完成下單',
              comment: `採購單號：${poNum}。批示：${remarks}`,
            },
          ],
        };
      })
    );
  };

  const handlePlaceOrder = (reqId: string, poNumber: string) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          poNumber,
          orderedBy: '張雅惠 (採購專員)',
          orderedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          status: 'PO_PLACED',
        };
      })
    );
  };

  const handleCompleteInspection = (
    reqId: string,
    inspectedBy: string,
    actualPrice: number,
    remarks: string
  ) => {
    const targetReq = requisitions.find((r) => r.id === reqId);
    if (!targetReq) return;

    const confirmedPartId = targetReq.confirmedPartId;
    if (confirmedPartId) {
      setCatalogParts((prev) =>
        prev.map((p) => {
          if (p.id === confirmedPartId) {
            const updatedStock = p.currentStock + targetReq.requestedQuantity;
            const newHistory = {
              id: `ph-${Date.now()}`,
              poNumber: targetReq.poNumber || `PO-${Date.now()}`,
              purchaseDate: new Date().toISOString().slice(0, 10),
              supplier: targetReq.supplierName || p.primarySupplier,
              unitPrice: actualPrice,
              quantity: targetReq.requestedQuantity,
              totalPrice: actualPrice * targetReq.requestedQuantity,
              leadTimeDays: targetReq.estimatedLeadDays || 4,
              buyerName: '張雅惠',
            };

            return {
              ...p,
              currentStock: updatedStock,
              lastPurchasePrice: actualPrice,
              lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
              purchaseHistory: [newHistory, ...p.purchaseHistory],
            };
          }
          return p;
        })
      );
    }

    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          arrivedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          inspectedBy,
          inspectionPassed: true,
          actualPurchasePrice: actualPrice,
          completedAt: new Date().toLocaleString('zh-TW', { hour12: false }),
          status: 'CLOSED_COMPLETED',
          timeline: [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
              status: 'CLOSED_COMPLETED',
              actor: inspectedBy,
              role: 'TECHNICIAN',
              actionTitle: '貨物送達現場，實體驗收合格入庫 (全案結案)',
              comment: `${remarks}。已將 ${r.requestedQuantity} ${r.unit} 入庫，並更新零件採購歷史紀錄與單價。`,
            },
          ],
        };
      })
    );
  };

  const handleStockAdjustment = (
    partId: string,
    adjustmentQty: number,
    type: 'IN' | 'OUT',
    reason: string
  ) => {
    setCatalogParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const nextStock =
            type === 'IN'
              ? p.currentStock + adjustmentQty
              : Math.max(0, p.currentStock - adjustmentQty);
          return {
            ...p,
            currentStock: nextStock,
            lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
          };
        }
        return p;
      })
    );
  };

  const handleAddPart = (newPart: SparePart) => {
    setCatalogParts((prev) => [newPart, ...prev]);
  };

  const handleResetDemoData = () => {
    if (confirm('確定要重設為系統預設的 20~30 筆回收 PP 造粒零件主檔與展示需求單嗎？')) {
      setCatalogParts(INITIAL_PARTS);
      setRequisitions(INITIAL_REQUISITIONS);
      localStorage.removeItem(PARTS_STORAGE_KEY);
      localStorage.removeItem(REQS_STORAGE_KEY);
    }
  };

  const handleInitiateRequisitionForPart = (part: SparePart) => {
    setActiveTab('REQUEST');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeLineStopCount={activeLineStopCount}
        activeUrgentCount={activeUrgentCount}
        isMobileSimulated={isMobileSimulated}
        onToggleMobileSim={() => setIsMobileSimulated(!isMobileSimulated)}
        onOpenQuickRequisition={() => {
          setActiveTab('REQUEST');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingConfirmationCount={pendingConfirmationCount}
        pendingApprovalCount={pendingApprovalCount}
      />

      {/* Production Lines (A, B, C, D, E) & Stations Real-Time Bar */}
      <ProductionLinesBar
        requisitions={requisitions}
        selectedLine={selectedLine}
        onSelectLine={(line) => {
          setSelectedLine(line);
          if (line !== 'ALL') {
            setActiveTab('PIPELINE');
          }
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        <div className={`transition-all mx-auto ${isMobileSimulated ? 'max-w-md border border-slate-200 shadow-xl bg-white my-4 rounded-3xl p-3' : 'w-full'}`}>
          {isMobileSimulated && (
            <div className="bg-slate-100 text-slate-600 text-[11px] px-4 py-2 rounded-t-2xl flex items-center justify-between border-b border-slate-200 mb-4 font-mono">
              <span className="flex items-center space-x-1.5 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>現場作業員手機端模擬檢視 (390 x 844)</span>
              </span>
              <button
                onClick={() => setIsMobileSimulated(false)}
                className="text-emerald-700 font-bold hover:underline"
              >
                切換寬螢幕
              </button>
            </div>
          )}

          {activeTab === 'REQUEST' && (
            <RequestApplicationView
              catalogParts={catalogParts}
              onSubmitRequisition={handleAddNewRequisition}
              onOpenPartDetail={(part) => setSelectedDetailPart(part)}
            />
          )}

          {activeTab === 'PIPELINE' && (
            <RequisitionsPipelineView
              requisitions={requisitions}
              currentRole={currentRole}
              onOpenDetail={(req) => setSelectedDetailReq(req)}
              onQuickAction={(req, actionType) => setSelectedDetailReq(req)}
            />
          )}

          {activeTab === 'CATALOG' && (
            <PartsCatalogView
              catalogParts={catalogParts}
              currentRole={currentRole}
              onOpenPartDetail={(part) => setSelectedDetailPart(part)}
              onOpenAddPart={() => setIsAddPartModalOpen(true)}
              onInitiateRequisitionForPart={handleInitiateRequisitionForPart}
            />
          )}

          {activeTab === 'INVENTORY' && (
            <InventoryView
              catalogParts={catalogParts}
              currentRole={currentRole}
              onStockAdjustment={handleStockAdjustment}
              onOpenPartDetail={(part) => setSelectedDetailPart(part)}
            />
          )}

          {activeTab === 'PROCUREMENT' && (
            <ProcurementManagementView
              requisitions={requisitions}
              catalogParts={catalogParts}
              currentRole={currentRole}
              onOpenDetail={(req) => setSelectedDetailReq(req)}
              onUpdateQuotation={handleUpdateQuotation}
              onApproveRequisition={handleApproveRequisition}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {activeTab === 'HISTORY' && (
            <HistoricalPurchasesView
              catalogParts={catalogParts}
              onOpenPartDetail={(part) => setSelectedDetailPart(part)}
            />
          )}

          {activeTab === 'KPI' && (
            <KpiDashboardView
              requisitions={requisitions}
              catalogParts={catalogParts}
            />
          )}
        </div>
      </main>

      {/* Global Modals */}
      <PartDetailModal
        part={selectedDetailPart}
        onClose={() => setSelectedDetailPart(null)}
        onInitiateRequisition={handleInitiateRequisitionForPart}
      />

      <RequestDetailModal
        requisition={selectedDetailReq}
        catalogParts={catalogParts}
        currentRole={currentRole}
        onClose={() => setSelectedDetailReq(null)}
        onConfirmSpec={handleConfirmSpec}
        onDirectIssueStock={handleDirectIssueStock}
        onUpdateQuotation={handleUpdateQuotation}
        onApproveRequisition={handleApproveRequisition}
        onPlaceOrder={handlePlaceOrder}
        onCompleteInspection={handleCompleteInspection}
      />

      <NewPartModal
        isOpen={isAddPartModalOpen}
        onClose={() => setIsAddPartModalOpen(false)}
        onAddPart={handleAddPart}
      />

      {/* Bottom Global Footer with Demo Reset */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-8 text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">回收 PP 造粒產業｜零件辨識與採購管理系統 (MVP v1.0)</span>
            <span>·</span>
            <span>白底俐落風格版</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetDemoData}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium"
              title="還原所有預設展示零件與採購資料"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重設展示資料</span>
            </button>
            <span className="font-mono text-[10px] text-slate-400">Gemini 3.8 Flash Multimodal Assisted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
