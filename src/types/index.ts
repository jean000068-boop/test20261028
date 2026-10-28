export type UserRole =
  | 'OPERATOR'     // 現場作業員
  | 'TECHNICIAN'   // 維修／技術人員
  | 'WAREHOUSE'    // 倉庫管理人員
  | 'PROCUREMENT'  // 採購／行政人員
  | 'SUPERVISOR'   // 主管
  | 'ADMIN';       // 系統管理者

export type UrgencyLevel =
  | 'NORMAL'       // 一般
  | 'URGENT'       // 急件
  | 'LINE_STOP';   // 停機急件 (最高等級)

export type RequestStatus =
  | 'PENDING_CONFIRMATION'  // 01 待確認規格 (維修/技術人員核對)
  | 'IN_STOCK_ISSUED'       // 02 有庫存·已直接領料出庫 (結案)
  | 'PENDING_RFQ'           // 03 無庫存·待詢價 (採購詢問廠商)
  | 'PENDING_APPROVAL'      // 04 已詢價·待主管核准 (送主管審核)
  | 'PO_PLACED'             // 05 主管已核准·已下單 (採購已向廠商採購)
  | 'ARRIVED_INSPECTING'    // 06 零件已到貨·待驗收 (倉庫/技術點交)
  | 'CLOSED_COMPLETED';     // 07 驗收完成·結案入庫 (更新庫存與歷史價格)

export type ProductionLineCode = 'A' | 'B' | 'C' | 'D' | 'E';

export type EquipmentStationType = 
  | 'MOTHER_EXTRUDER'  // 母機 (第一階主擠出機)
  | 'BABY_EXTRUDER'    // 子機 (第二階均化擠出機)
  | 'COOLING_TROUGH'   // 冷卻水道 (冷卻水槽/導條水路)
  | 'PELLETIZER'       // 切粒機 (條料滾刀切粒機)
  | 'COMMON';          // 全廠/多線通用配件

export interface ProductionLineInfo {
  code: ProductionLineCode;
  name: string;
  fullName: string;
  description: string;
  materialType: string;
  status: 'RUNNING' | 'LINE_STOP' | 'MAINTENANCE';
}

export interface HistoricalPurchaseRecord {
  id: string;
  poNumber: string;
  purchaseDate: string;
  supplier: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  leadTimeDays: number;
  buyerName: string;
  invoiceNo?: string;
}

export interface SparePart {
  id: string;
  code: string;              // 零件編號 (如: PP-EXT-042)
  name: string;              // 零件正式名稱
  alias?: string;            // 現場俗稱 (如: 螺桿電熱圈、加熱瓦)
  category: string;          // 類別 (如: 加熱元件, 切粒工具, 過濾耗材, 破碎刀刃, 傳動機構, 油壓氣動)
  imageUrl: string;          // 零件主要照片
  secondaryImageUrl?: string;// 工程圖面或細部照片
  equipment: string;         // 適用設備 (如: 雙階擠出主機 150型)
  equipmentCode: string;     // 設備編號 (如: EXT-01)
  specs: string;             // 零件型號／規格 (尺寸、材質、功率等)
  detailedSpecs?: {
    material?: string;
    dimensions?: string;
    voltagePower?: string;
    operatingTemp?: string;
    tolerance?: string;
    wearCycleMonths?: number;
  };
  currentStock: number;      // 庫存數量
  minSafeStock: number;      // 安全庫存警示值
  unit: string;              // 單位 (個、組、條、片、公斤)
  binLocation: string;       // 儲位 (如: A02-04-B)
  primarySupplier: string;   // 常用供應商
  lastPurchasePrice: number; // 最近採購價格 (NT$)
  currency: string;
  lastUpdated: string;       // 最後更新時間
  purchaseHistory: HistoricalPurchaseRecord[];
  isKeyPart: boolean;        // 是否為關鍵停機零組件
  applicableLines?: ProductionLineCode[]; // 適用產線 (A, B, C, D, E 或通用)
  stationType?: EquipmentStationType;     // 設備單元 (母機, 子機, 冷卻水道, 切粒機)
}

export interface AiCandidateRecommendation {
  partCode: string;
  partName: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;   // 0 - 100
  visualSimilarityReason: string;
  keyVerificationPoints: string[];
}

export interface AiIdentificationResult {
  analysisSummary: string;
  photoDefectsDetected: string[];
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  recommendations: AiCandidateRecommendation[];
  humanAttentionRequired: boolean;
  disclaimerNotice: string;
  source?: string;
  analyzedAt: string;
}

export interface RequisitionTimelineItem {
  id: string;
  timestamp: string;
  status: RequestStatus;
  actor: string;
  role: UserRole;
  actionTitle: string;
  comment?: string;
}

export interface PurchaseRequisition {
  id: string;
  reqNumber: string;         // 需求單號 (如: PR-20261026-001)
  requesterName: string;     // 申請人
  requesterRole: string;     // 申請人職稱
  requestDate: string;       // 申請日期時間
  equipmentName: string;     // 設備名稱
  equipmentCode: string;     // 設備編號
  lineCode?: ProductionLineCode; // 所屬產線 (A, B, C, D, E)
  stationType?: EquipmentStationType; // 設備單元 (母機, 子機, 冷卻水道, 切粒機)
  photoUrls: string[];       // 零件現場拍攝照片 (可多張)
  faultDescription: string;  // 故障描述／用途
  urgency: UrgencyLevel;     // 急件程度
  
  // 零件辨識與確認欄位
  knownPartCode?: string;    // 申請時已知編號
  aiResult?: AiIdentificationResult; // AI 推薦紀錄
  confirmedPartId?: string;  // 人工確認之零件 ID
  confirmedPartCode?: string;// 人工確認之零件編號
  confirmedPartName?: string;// 人工確認之零件名稱
  confirmedSpecs?: string;   // 人工確認之零件規格
  confirmedBy?: string;      // 確認人
  confirmedAt?: string;      // 確認時間
  clarificationCount: number;// 反覆確認次數 (追蹤 KPI)

  // 數量與庫存
  requestedQuantity: number;
  unit: string;
  stockAvailableAtCheck?: number; // 檢查時之可用庫存
  isDirectStockIssued?: boolean;  // 是否直接在庫領料出庫

  // 採購與詢價資訊
  supplierName?: string;
  quotedUnitPrice?: number;
  quotedTotalPrice?: number;
  estimatedLeadDays?: number;
  expectedDeliveryDate?: string;
  rfqCompletedBy?: string;
  rfqCompletedAt?: string;

  // 主管核准
  approvedBy?: string;
  approvedAt?: string;
  approvalRemarks?: string;

  // 採購下單
  poNumber?: string;
  orderedBy?: string;
  orderedAt?: string;

  // 到貨驗收與結案
  arrivedAt?: string;
  inspectedBy?: string;
  inspectionPassed?: boolean;
  inspectionRemarks?: string;
  actualPurchasePrice?: number;
  completedAt?: string;

  // 目前狀態與歷程
  status: RequestStatus;
  timeline: RequisitionTimelineItem[];
}

export interface KpiMetrics {
  avgConfirmTimeHours: number;      // 零件確認時間 (基準: 14.5 hr -> 現況: 6.8 hr, 縮短 53%)
  avgClarificationCount: number;    // 反覆確認次數 (基準: 2.8 次 -> 現況: 1.2 次, 減少 57%)
  aiTopCandidateHitRate: number;    // AI 候選辨識命中率 (例如: 84.6%)
  specErrorRate: number;            // 採購規格錯誤率 (基準: 8.5% -> 現況: 1.4%)
  avgStockLookupMinutes: number;    // 庫存查詢時間 (基準: 35 min -> 現況: 2.1 min)
  dataCompletenessRate: number;     // 資料完整率 (例如: 98.2%)
}
