import { SparePart, PurchaseRequisition, ProductionLineInfo, EquipmentStationType } from '../types';

export const PRODUCTION_LINES: ProductionLineInfo[] = [
  {
    code: 'A',
    name: 'A 產線',
    fullName: 'A 產線 (PP 編織袋/薄膜高速造粒線)',
    description: '母機 160型 + 子機 135型 + 8米循環冷卻水道 + 32刀條料滾刀切粒機',
    materialType: '回收 PP 編織袋、太空包、PP 膜料',
    status: 'LINE_STOP', // Currently has active Line Stop requisition
  },
  {
    code: 'B',
    name: 'B 產線',
    fullName: 'B 產線 (PP 太空包/粉碎料標準造粒線)',
    description: '母機 150型 + 子機 125型 + 6米冷卻水道 + 32刀滾刀切粒機',
    materialType: 'PP 太空包粉碎料、中空容器料',
    status: 'RUNNING',
  },
  {
    code: 'C',
    name: 'C 產線',
    fullName: 'C 產線 (PP 棧板/硬質回收料重載造粒線)',
    description: '母機 180型 + 子機 150型 + 8米重載冷卻水道 + 40刀合金滾刀切粒機',
    materialType: 'PP 塑膠棧板破碎料、汽車保險桿料、家電注塑料',
    status: 'RUNNING',
  },
  {
    code: 'D',
    name: 'D 產線',
    fullName: 'D 產線 (PP 無紡布/邊角料高速造粒線)',
    description: '母機 135型 + 子機 110型 + 6米冷卻水道 + 變頻精密切粒機',
    materialType: 'PP 紡粘無紡布、口罩邊料、熔噴布屑',
    status: 'MAINTENANCE',
  },
  {
    code: 'E',
    name: 'E 產線',
    fullName: 'E 產線 (PP 瓶蓋/改性工程塑料特規線)',
    description: '母機 150型 + 子機 125型 + 6米恆溫冷卻水道 + 齒輪條料切粒機',
    materialType: 'PP 飲料瓶蓋料、增韌改性高流動PP',
    status: 'RUNNING',
  },
];

export const EQUIPMENT_LIST = [
  // Line A
  { code: 'LA-EXT-M', name: 'A產線｜子母式擠出機 - 母機 (160型主機)', lineCode: 'A' as const, stationType: 'MOTHER_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LA-EXT-S', name: 'A產線｜子母式擠出機 - 子機 (135型均化機)', lineCode: 'A' as const, stationType: 'BABY_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LA-CW-01', name: 'A產線｜8米循環冷卻水道 (附浸水導輪與吸水吹乾機)', lineCode: 'A' as const, stationType: 'COOLING_TROUGH' as const, category: '冷卻水道' },
  { code: 'LA-PLT-01', name: 'A產線｜32刀條料合金滾刀切粒機 (30HP)', lineCode: 'A' as const, stationType: 'PELLETIZER' as const, category: '切粒機' },

  // Line B
  { code: 'LB-EXT-M', name: 'B產線｜子母式擠出機 - 母機 (150型主機)', lineCode: 'B' as const, stationType: 'MOTHER_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LB-EXT-S', name: 'B產線｜子母式擠出機 - 子機 (125型均化機)', lineCode: 'B' as const, stationType: 'BABY_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LB-CW-01', name: 'B產線｜6米循環冷卻水道', lineCode: 'B' as const, stationType: 'COOLING_TROUGH' as const, category: '冷卻水道' },
  { code: 'LB-PLT-01', name: 'B產線｜條料滾刀切粒機 (25HP)', lineCode: 'B' as const, stationType: 'PELLETIZER' as const, category: '切粒機' },

  // Line C
  { code: 'LC-EXT-M', name: 'C產線｜子母式擠出機 - 母機 (180型重載主機)', lineCode: 'C' as const, stationType: 'MOTHER_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LC-EXT-S', name: 'C產線｜子母式擠出機 - 子機 (150型重載均化機)', lineCode: 'C' as const, stationType: 'BABY_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LC-CW-01', name: 'C產線｜8米重載循環冷卻水道 (附氣動壓條輪)', lineCode: 'C' as const, stationType: 'COOLING_TROUGH' as const, category: '冷卻水道' },
  { code: 'LC-PLT-01', name: 'C產線｜40刀鎢鋼滾刀切粒機 (40HP重型)', lineCode: 'C' as const, stationType: 'PELLETIZER' as const, category: '切粒機' },

  // Line D
  { code: 'LD-EXT-M', name: 'D產線｜子母式擠出機 - 母機 (135型強制餵料主機)', lineCode: 'D' as const, stationType: 'MOTHER_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LD-EXT-S', name: 'D產線｜子母式擠出機 - 子機 (110型均化機)', lineCode: 'D' as const, stationType: 'BABY_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LD-CW-01', name: 'D產線｜6米雙排精密冷卻水道', lineCode: 'D' as const, stationType: 'COOLING_TROUGH' as const, category: '冷卻水道' },
  { code: 'LD-PLT-01', name: 'D產線｜變頻精密微顆粒切粒機 (20HP)', lineCode: 'D' as const, stationType: 'PELLETIZER' as const, category: '切粒機' },

  // Line E
  { code: 'LE-EXT-M', name: 'E產線｜子母式擠出機 - 母機 (150型高真空主機)', lineCode: 'E' as const, stationType: 'MOTHER_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LE-EXT-S', name: 'E產線｜子母式擠出機 - 子機 (125型均化機)', lineCode: 'E' as const, stationType: 'BABY_EXTRUDER' as const, category: '子母式擠出造粒機' },
  { code: 'LE-CW-01', name: 'E產線｜6米恆溫冷卻水道', lineCode: 'E' as const, stationType: 'COOLING_TROUGH' as const, category: '冷卻水道' },
  { code: 'LE-PLT-01', name: 'E產線｜高精度條料切粒機 (25HP)', lineCode: 'E' as const, stationType: 'PELLETIZER' as const, category: '切粒機' },
];

export const SUPPLIER_LIST = [
  { name: '統億工業電熱器材行', contact: '陳經理', phone: '04-2358-1234', address: '台中市西屯區工業區一路' },
  { name: '鋒速超硬鎢鋼刀具有限公司', contact: '林廠長', phone: '04-768-5521', address: '彰化縣秀水鄉鶴鳴村' },
  { name: '台濾不鏽鋼精密網業社', contact: '黃小姐', phone: '07-372-8899', address: '高雄市仁武區竹工農場' },
  { name: '震力自動化油壓五金機械', contact: '張副理', phone: '03-498-7712', address: '桃園市中壢區大成路' },
  { name: '全翔塑膠機械五金配件行', contact: '吳老闆', phone: '06-253-6644', address: '台南市永康區鹽行路' },
  { name: '宏達重工動力傳動五金軸承', contact: '郭襄理', phone: '02-2995-3311', address: '新北市三重區光復路' },
];

function createPartSvg(title: string, color: string, iconType: string, specText: string): string {
  let innerArt = '';
  if (iconType === 'heater') {
    innerArt = `
      <circle cx="100" cy="100" r="65" fill="none" stroke="${color}" stroke-width="26" stroke-dasharray="16, 4" />
      <circle cx="100" cy="100" r="45" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" />
      <rect x="88" y="20" width="24" height="20" rx="4" fill="#f59e0b" stroke="#d97706" stroke-width="2" />
      <circle cx="94" cy="28" r="3" fill="#b45309" />
      <circle cx="106" cy="28" r="3" fill="#b45309" />
      <path d="M70 100 L130 100" stroke="#d97706" stroke-width="3" stroke-linecap="round" />
      <path d="M100 70 L100 130" stroke="#d97706" stroke-width="3" stroke-linecap="round" />
    `;
  } else if (iconType === 'blade' || iconType === 'roller-cutter') {
    // Cylindrical multi-blade cutter
    innerArt = `
      <rect x="40" y="55" width="120" height="90" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="4" />
      <line x1="55" y1="55" x2="65" y2="145" stroke="${color}" stroke-width="4" />
      <line x1="80" y1="55" x2="90" y2="145" stroke="${color}" stroke-width="4" />
      <line x1="105" y1="55" x2="115" y2="145" stroke="${color}" stroke-width="4" />
      <line x1="130" y1="55" x2="140" y2="145" stroke="${color}" stroke-width="4" />
      <circle cx="100" cy="100" r="18" fill="#e2e8f0" stroke="#475569" stroke-width="3" />
    `;
  } else if (iconType === 'water-roller') {
    // Water flume roller / air knife
    innerArt = `
      <rect x="30" y="80" width="140" height="40" rx="8" fill="#38bdf8" opacity="0.3" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="#0284c7" stroke-width="4" stroke-dasharray="10, 6" />
      <circle cx="70" cy="95" r="22" fill="#ffffff" stroke="${color}" stroke-width="6" />
      <circle cx="130" cy="95" r="22" fill="#ffffff" stroke="${color}" stroke-width="6" />
    `;
  } else if (iconType === 'mesh') {
    innerArt = `
      <circle cx="100" cy="100" r="70" fill="#f8fafc" stroke="#94a3b8" stroke-width="8" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#cbd5e1" stroke-width="2" />
      <path d="M40 70 H160 M40 85 H160 M40 100 H160 M40 115 H160 M40 130 H160" stroke="${color}" stroke-width="2" opacity="0.8" />
      <path d="M70 40 V160 M85 40 V160 M100 40 V160 M115 40 V160 M130 40 V160" stroke="${color}" stroke-width="2" opacity="0.8" />
    `;
  } else if (iconType === 'seal') {
    innerArt = `
      <circle cx="100" cy="100" r="68" fill="none" stroke="${color}" stroke-width="18" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="#f59e0b" stroke-width="4" />
      <circle cx="100" cy="100" r="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" />
    `;
  } else {
    innerArt = `
      <rect x="40" y="50" width="120" height="100" rx="8" fill="#f8fafc" stroke="${color}" stroke-width="4" />
      <circle cx="100" cy="100" r="30" fill="${color}" opacity="0.6" />
      <path d="M60 80 H140 M60 100 H140 M60 120 H120" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bg)" rx="12" stroke="#cbd5e1" stroke-width="1.5"/>
    <g>${innerArt}</g>
    <rect x="10" y="156" width="180" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
    <text x="100" y="172" fill="#0f172a" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${title}</text>
    <text x="100" y="185" fill="#64748b" font-size="9" font-family="sans-serif" text-anchor="middle">${specText}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PARTS: SparePart[] = [
  // 1. 子母式擠出機 - 母機零件
  {
    id: 'part-01',
    code: 'PP-EXT-042',
    name: '母機陶瓷電熱瓦圈 (φ180mm x 100mm)',
    alias: '母機電熱圈、螺桿一階加熱瓦',
    category: '加熱元件',
    stationType: 'MOTHER_EXTRUDER',
    applicableLines: ['A', 'B', 'C', 'E'],
    imageUrl: createPartSvg('母機陶瓷電熱瓦圈', '#0284c7', 'heater', 'φ180mm x 100mm 2.5kW 220V'),
    equipment: 'A產線｜子母式擠出機 - 母機 (160型主機)',
    equipmentCode: 'LA-EXT-M',
    specs: '陶瓷瓦晶體 / 304不鏽鋼束緊帶 / 內徑 φ180mm x 寬 100mm / 220V 2.5kW / 附防護端子盒',
    detailedSpecs: {
      material: '優質高溫陶瓷晶體 + 304不鏽鋼束帶',
      dimensions: '內徑 180mm, 寬度 100mm, 厚度 18mm',
      voltagePower: 'AC 220V / 2500W',
      operatingTemp: '常溫 ~ 450°C',
      wearCycleMonths: 14,
    },
    currentStock: 4,
    minSafeStock: 2,
    unit: '個',
    binLocation: 'A02-04-B (母機電熱區)',
    primarySupplier: '統億工業電熱器材行',
    lastPurchasePrice: 1850,
    currency: 'NTD',
    lastUpdated: '2026-10-26 16:30',
    isKeyPart: true,
    purchaseHistory: [
      { id: 'ph-1', poNumber: 'PO-20260815-01', purchaseDate: '2026-08-15', supplier: '統億工業電熱器材行', unitPrice: 1850, quantity: 4, totalPrice: 7400, leadTimeDays: 4, buyerName: '張雅惠' },
    ],
  },
  {
    id: 'part-02',
    code: 'PP-EXT-015',
    name: '母機機頭高溫熔體壓力傳感器 (0-350bar)',
    alias: '融膠壓感計、母機壓力表傳感器',
    category: '儀表感測',
    stationType: 'MOTHER_EXTRUDER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('熔體壓力傳感器', '#8b5cf6', 'heater', '0~350bar 4-20mA 1/2-20UNF'),
    equipment: 'A產線｜子母式擠出機 - 母機 (160型主機)',
    equipmentCode: 'LA-EXT-M',
    specs: '量程 0~350 bar / 輸出訊號 4~20mA / 螺紋 1/2"-20UNF / 耐溫 400°C / Inconel 膜片',
    detailedSpecs: {
      material: '英科耐爾 Inconel 718 耐腐蝕合金膜片',
      dimensions: '桿長 150mm, 柔性引線 450mm, 螺牙 1/2-20UNF',
      wearCycleMonths: 18,
    },
    currentStock: 1,
    minSafeStock: 1,
    unit: '支',
    binLocation: 'A01-03-B (儀表感測防潮箱)',
    primarySupplier: '震力自動化油壓五金機械',
    lastPurchasePrice: 16800,
    currency: 'NTD',
    lastUpdated: '2026-09-15 09:30',
    isKeyPart: true,
    purchaseHistory: [],
  },

  // 2. 子母式擠出機 - 子機零件
  {
    id: 'part-03',
    code: 'PP-EXT-043',
    name: '子機模頭鑄銅高功率電熱板',
    alias: '模頭銅瓦、子機出料加熱板',
    category: '加熱元件',
    stationType: 'BABY_EXTRUDER',
    applicableLines: ['A', 'B', 'E'],
    imageUrl: createPartSvg('子機鑄銅加熱板', '#d97706', 'heater', 'φ250mm x 80mm 3.2kW 220V'),
    equipment: 'A產線｜子母式擠出機 - 子機 (135型均化機)',
    equipmentCode: 'LA-EXT-S',
    specs: '黃銅重力鑄造 / 內徑 φ250mm x 寬 80mm / 220V 3.2kW / 防溢膠密封',
    detailedSpecs: {
      material: '高導熱鑄造黃銅 (HPb59-1)',
      dimensions: '內徑 250mm, 寬度 80mm, 厚度 25mm',
      voltagePower: 'AC 220V / 3200W',
      operatingTemp: '0 ~ 380°C',
      wearCycleMonths: 18,
    },
    currentStock: 1,
    minSafeStock: 2,
    unit: '組',
    binLocation: 'A02-05-A (子機模頭專區)',
    primarySupplier: '統億工業電熱器材行',
    lastPurchasePrice: 4200,
    currency: 'NTD',
    lastUpdated: '2026-10-18 10:15',
    isKeyPart: true,
    purchaseHistory: [],
  },
  {
    id: 'part-04',
    code: 'PP-SCR-021',
    name: '子母機雙柱油壓換網器 不鏽鋼包邊濾網 (80目/100目)',
    alias: '造粒濾網片、擠出機換網金屬濾布',
    category: '過濾耗材',
    stationType: 'BABY_EXTRUDER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('包邊高壓濾網片', '#475569', 'mesh', 'φ150mm 80/100目雙層包鋁邊'),
    equipment: 'A產線｜子母式擠出機 - 子機 (135型均化機)',
    equipmentCode: 'LA-EXT-S',
    specs: '圓片直徑 φ150mm / 鋁合金包邊 / 80目 + 100目雙層不鏽鋼密織',
    detailedSpecs: {
      material: 'SUS304 不鏽鋼絲網 + 軟質純鋁包邊條',
      dimensions: '外徑 150mm ±0.3mm, 邊厚 2.2mm',
      operatingTemp: '耐溫 350°C, 耐壓差 25MPa 不穿孔',
      wearCycleMonths: 0.5,
    },
    currentStock: 85,
    minSafeStock: 40,
    unit: '片',
    binLocation: 'C03-01-A (耗材快速發料區)',
    primarySupplier: '台濾不鏽鋼精密網業社',
    lastPurchasePrice: 95,
    currency: 'NTD',
    lastUpdated: '2026-10-22 11:30',
    isKeyPart: false,
    purchaseHistory: [],
  },
  {
    id: 'part-05',
    code: 'PP-SCR-025',
    name: '換網器耐高溫紫銅柱塞密封環',
    alias: '換網銅環、油壓密封銅墊圈',
    category: '過濾耗材',
    stationType: 'BABY_EXTRUDER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('柱塞高溫銅墊圈', '#d97706', 'seal', 'φ165 x φ150 x 3mm T2紅銅'),
    equipment: 'A產線｜子母式擠出機 - 子機 (135型均化機)',
    equipmentCode: 'LA-EXT-S',
    specs: '純紅銅 T2 經退火軟化處理 / 外徑 φ165mm x 內徑 φ150mm x 厚 3.0mm',
    detailedSpecs: {
      material: 'T2 脫氧紫銅 (硬度 HB 45-55)',
      dimensions: 'OD 165mm, ID 150mm, Thickness 3mm',
      wearCycleMonths: 4,
    },
    currentStock: 5,
    minSafeStock: 6,
    unit: '個',
    binLocation: 'C03-02-B (銅件密封儲存箱)',
    primarySupplier: '全翔塑膠機械五金配件行',
    lastPurchasePrice: 480,
    currency: 'NTD',
    lastUpdated: '2026-10-15 08:45',
    isKeyPart: true,
    purchaseHistory: [],
  },

  // 3. 冷卻水道零件
  {
    id: 'part-06',
    code: 'PP-CW-001',
    name: '冷卻水道 氣動壓條浸水導輪組',
    alias: '水槽壓條輪、浸水尼龍滾輪、水下導條輥',
    category: '冷卻水道',
    stationType: 'COOLING_TROUGH',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('水槽壓條浸水導輪', '#0284c7', 'water-roller', 'φ80mm x 250mm PTFE/SUS304'),
    equipment: 'A產線｜8米循環冷卻水道 (附浸水導輪與吸水吹乾機)',
    equipmentCode: 'LA-CW-01',
    specs: '滾輪直徑 φ80mm x 長 250mm / PTFE 鐵氟龍表面耐高溫抗沾黏 / 雙側不鏽鋼防水深溝球軸承 6204-2RS',
    detailedSpecs: {
      material: 'PTFE 鐵氟龍 + 304不鏽鋼軸心',
      dimensions: '外徑 80mm, 軸長 300mm, 安裝軸徑 φ20mm',
      operatingTemp: '耐熱水溫 90°C',
      wearCycleMonths: 6,
    },
    currentStock: 3,
    minSafeStock: 2,
    unit: '組',
    binLocation: 'B02-01-A (水道配件架)',
    primarySupplier: '全翔塑膠機械五金配件行',
    lastPurchasePrice: 2200,
    currency: 'NTD',
    lastUpdated: '2026-10-10 14:00',
    isKeyPart: false,
    purchaseHistory: [],
  },
  {
    id: 'part-07',
    code: 'PP-CW-005',
    name: '冷卻水道 強力吸水吹風機 專用吸水海綿壓輥',
    alias: '水槽吸水輥、吹乾機海綿膠輪、除水海綿輪',
    category: '冷卻水道',
    stationType: 'COOLING_TROUGH',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('條料高密度吸水海綿輥', '#38bdf8', 'water-roller', 'φ100mm x 260mm PVA高吸水'),
    equipment: 'A產線｜8米循環冷卻水道 (附浸水導輪與吸水吹乾機)',
    equipmentCode: 'LA-CW-01',
    specs: '高密度 PVA 連孔發泡吸水海綿 / 直徑 φ100mm x 長 260mm / 軸徑 φ25mm / 快速吸乾料條水分防切粒受潮',
    detailedSpecs: {
      material: '親水性聚乙烯醇 (PVA) 發泡體 + SUS304 芯棒',
      dimensions: '外徑 100mm, 內芯 25mm, 滾面長 260mm',
      wearCycleMonths: 3,
    },
    currentStock: 2,
    minSafeStock: 2,
    unit: '支',
    binLocation: 'B02-01-B (水道配件架)',
    primarySupplier: '全翔塑膠機械五金配件行',
    lastPurchasePrice: 1650,
    currency: 'NTD',
    lastUpdated: '2026-09-20 11:20',
    isKeyPart: true,
    purchaseHistory: [],
  },
  {
    id: 'part-08',
    code: 'PP-CW-008',
    name: '冷卻水道循環水泵 碳化矽耐磨機械軸封 (φ25mm)',
    alias: '水槽水泵水封、機械密封、循環水封',
    category: '冷卻水道',
    stationType: 'COOLING_TROUGH',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('循環水泵碳化矽軸封', '#059669', 'seal', '軸徑φ25mm SiC/SiC/FKM'),
    equipment: 'A產線｜8米循環冷卻水道 (附浸水導輪與吸水吹乾機)',
    equipmentCode: 'LA-CW-01',
    specs: '軸徑 φ25mm / 動環: 碳化矽 / 靜環: 碳化矽 / 彈簧: SUS316 / O-Ring: 氟橡膠',
    detailedSpecs: {
      material: '反應燒結碳化矽 + 氟橡膠 FKM',
      dimensions: '適配軸徑 25mm, 安裝長度 38mm',
      wearCycleMonths: 8,
    },
    currentStock: 2,
    minSafeStock: 2,
    unit: '組',
    binLocation: 'B02-03-A (水泵管路配件架)',
    primarySupplier: '全翔塑膠機械五金配件行',
    lastPurchasePrice: 1750,
    currency: 'NTD',
    lastUpdated: '2026-08-15 15:30',
    isKeyPart: true,
    purchaseHistory: [],
  },

  // 4. 切粒機零件
  {
    id: 'part-09',
    code: 'PP-PLT-001',
    name: '條料切粒機 32刃超微粒鎢鋼旋轉滾刀 (φ200mm x 200mm)',
    alias: '切粒機滾刀、條切旋轉滾筒刀、32刃鎢鋼滾刀',
    category: '切粒工具',
    stationType: 'PELLETIZER',
    applicableLines: ['A', 'B', 'E'],
    imageUrl: createPartSvg('32刃鎢鋼旋轉滾刀', '#059669', 'roller-cutter', 'φ200 x 200mm 32刃鎢鋼滾刀'),
    equipment: 'A產線｜32刀條料合金滾刀切粒機 (30HP)',
    equipmentCode: 'LA-PLT-01',
    specs: '32刃對稱斜刀螺旋列 / 鑲嵌 YG8X 超微粒硬質合金刀口 / 滾刀外徑 φ200mm x 刃長 200mm / 軸徑 φ45mm 雙鍵槽',
    detailedSpecs: {
      material: '40Cr 鍛造滾筒基體 + YG8X 鎢鋼合金刃 (硬度 HRA 90.5)',
      dimensions: '外徑 200mm, 刃長 200mm, 內孔 45mm',
      operatingTemp: '常溫耐衝擊耐顆粒磨損',
      wearCycleMonths: 6,
    },
    currentStock: 0,
    minSafeStock: 1,
    unit: '支',
    binLocation: 'B01-01-B (精密滾刀專用木盒)',
    primarySupplier: '鋒速超硬鎢鋼刀具有限公司',
    lastPurchasePrice: 32000,
    currency: 'NTD',
    lastUpdated: '2026-10-26 10:00',
    isKeyPart: true,
    purchaseHistory: [
      { id: 'ph-pl1', poNumber: 'PO-20260412-01', purchaseDate: '2026-04-12', supplier: '鋒速超硬鎢鋼刀具有限公司', unitPrice: 32000, quantity: 1, totalPrice: 32000, leadTimeDays: 12, buyerName: '張雅惠' },
    ],
  },
  {
    id: 'part-10',
    code: 'PP-PLT-002',
    name: '條料切粒機 硬質合金固定平底刀 (長205mm)',
    alias: '切粒機定刀、底刀、刮料固定刀',
    category: '切粒工具',
    stationType: 'PELLETIZER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('切粒機合金固定底刀', '#0d9488', 'blade', '長205mm x 寬60mm x 厚12mm'),
    equipment: 'A產線｜32刀條料合金滾刀切粒機 (30HP)',
    equipmentCode: 'LA-PLT-01',
    specs: '長 205mm x 寬 60mm x 厚 12mm / 鑲嵌鎢鋼合金 / 研磨刃口直線度 0.005mm 內',
    detailedSpecs: {
      material: 'SKD-11 基體 + YG15 鎢合金',
      dimensions: '205mm x 60mm x 12mm, 沉頭孔 M10',
      wearCycleMonths: 4,
    },
    currentStock: 2,
    minSafeStock: 2,
    unit: '片',
    binLocation: 'B01-02-A (刀具保險櫃)',
    primarySupplier: '鋒速超硬鎢鋼刀具有限公司',
    lastPurchasePrice: 4500,
    currency: 'NTD',
    lastUpdated: '2026-09-05 14:20',
    isKeyPart: true,
    purchaseHistory: [],
  },
  {
    id: 'part-11',
    code: 'PP-PLT-007',
    name: '切粒機 牽引進料橡膠壓輥 (防滑耐磨PU)',
    alias: '拉料膠輪、進料橡膠輥、引料膠輥',
    category: '切粒工具',
    stationType: 'PELLETIZER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('切粒機牽引進料膠輥', '#eab308', 'water-roller', 'φ120 x 200mm 聚氨酯85 Shore A'),
    equipment: 'A產線｜32刀條料合金滾刀切粒機 (30HP)',
    equipmentCode: 'LA-PLT-01',
    specs: '耐磨聚氨酯 (PU) 包膠 / 外徑 φ120mm x 膠面長 200mm / 軸徑 φ35mm / 菱形微紋防滑引料',
    detailedSpecs: {
      material: '耐磨高彈性聚氨酯 (硬度 85 Shore A) + 45號鋼軸芯',
      dimensions: '外徑 120mm, 軸長 280mm',
      wearCycleMonths: 5,
    },
    currentStock: 1,
    minSafeStock: 2,
    unit: '支',
    binLocation: 'B01-03-A (滾輪儲位架)',
    primarySupplier: '全翔塑膠機械五金配件行',
    lastPurchasePrice: 3800,
    currency: 'NTD',
    lastUpdated: '2026-10-14 16:10',
    isKeyPart: true,
    purchaseHistory: [],
  },

  // 5. C產線重載專用滾刀
  {
    id: 'part-12',
    code: 'PP-PLT-040',
    name: 'C產線重載 40刃鎢鋼滾刀 (硬質注塑料專用)',
    alias: 'C線重載滾刀、棧板料切粒刀',
    category: '切粒工具',
    stationType: 'PELLETIZER',
    applicableLines: ['C'],
    imageUrl: createPartSvg('40刃重載鎢鋼滾刀', '#047857', 'roller-cutter', 'φ220 x 250mm 40刃 C線專用'),
    equipment: 'C產線｜40刀鎢鋼滾刀切粒機 (40HP重型)',
    equipmentCode: 'LC-PLT-01',
    specs: '40刃重型切削刀齒 / 專門對付硬質高衝擊 PP 棧板料 / 外徑 φ220mm x 長 250mm',
    detailedSpecs: {
      material: '特種耐衝擊合金鋼 + 鎢鈷合金硬質刃面',
      dimensions: '外徑 220mm, 長 250mm, 軸孔 50mm',
      wearCycleMonths: 8,
    },
    currentStock: 1,
    minSafeStock: 1,
    unit: '支',
    binLocation: 'B01-01-C (重載刀具木箱)',
    primarySupplier: '鋒速超硬鎢鋼刀具有限公司',
    lastPurchasePrice: 42000,
    currency: 'NTD',
    lastUpdated: '2026-08-20 15:00',
    isKeyPart: true,
    purchaseHistory: [],
  },

  // 6. 通用儀表與電熱耗材
  {
    id: 'part-13',
    code: 'PP-EXT-089',
    name: '鎧裝 K型高溫測溫熱電偶 (M12螺牙 0~500°C)',
    alias: '感溫棒、機筒溫度線、測溫針',
    category: '儀表感測',
    stationType: 'COMMON',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('K型高溫熱電偶', '#dc2626', 'heater', '0~500°C 探棒長100mm M12x1.5'),
    equipment: 'A產線｜子母式擠出機 - 母機 (160型主機)',
    equipmentCode: 'LA-EXT-M',
    specs: '分度號 K型 / 測溫範圍 0~500°C / 不鏽鋼探棒直徑 φ5mm x 長 100mm / 安裝螺牙 M12x1.5 / 金屬屏蔽線長 2米',
    detailedSpecs: {
      material: '鎳鉻-鎳矽熱電偶絲 + 316L 不鏽鋼鎧裝套管',
      dimensions: '探頭長 100mm, 直徑 5.0mm, 外螺牙 M12x1.5',
      wearCycleMonths: 8,
    },
    currentStock: 6,
    minSafeStock: 4,
    unit: '條',
    binLocation: 'A01-03-A (儀表與感測器精密櫃)',
    primarySupplier: '統億工業電熱器材行',
    lastPurchasePrice: 650,
    currency: 'NTD',
    lastUpdated: '2026-10-12 11:00',
    isKeyPart: true,
    purchaseHistory: [],
  },
  {
    id: 'part-14',
    code: 'PP-VAL-004',
    name: '子母機換網液壓站 雙向高壓電磁換向閥',
    alias: '換網液壓閥、油壓換向閥',
    category: '油壓氣動',
    stationType: 'BABY_EXTRUDER',
    applicableLines: ['A', 'B', 'C', 'D', 'E'],
    imageUrl: createPartSvg('高壓油壓電磁閥', '#2563eb', 'seal', 'DSG-03-3C2 AC220V 21MPa'),
    equipment: 'A產線｜子母式擠出機 - 子機 (135型均化機)',
    equipmentCode: 'LA-EXT-S',
    specs: '油研型號 DSG-03-3C2-A220-50 / 最大工作壓力 21 MPa / 控制線圈 AC 220V',
    detailedSpecs: {
      material: '高強度鑄鐵閥體 + 表面鍍鉻閥芯',
      operatingTemp: '液壓油溫 -15°C ~ +70°C',
      wearCycleMonths: 24,
    },
    currentStock: 2,
    minSafeStock: 1,
    unit: '組',
    binLocation: 'C01-02-B (液壓配件架)',
    primarySupplier: '震力自動化油壓五金機械',
    lastPurchasePrice: 3800,
    currency: 'NTD',
    lastUpdated: '2026-08-10 14:40',
    isKeyPart: true,
    purchaseHistory: [],
  },
];

export const INITIAL_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: 'req-01',
    reqNumber: 'PR-20261026-001',
    requesterName: '陳志明',
    requesterRole: 'A班現場操作領班',
    requestDate: '2026-10-26 14:15',
    equipmentName: 'A產線｜子母式擠出機 - 母機 (160型主機)',
    equipmentCode: 'LA-EXT-M',
    lineCode: 'A',
    stationType: 'MOTHER_EXTRUDER',
    photoUrls: [INITIAL_PARTS[0].imageUrl],
    faultDescription: 'A線母機三區加熱瓦冒白煙斷電，測量電阻已開路，束緊帶斷開料溫驟降，導致A線整線停機。',
    urgency: 'LINE_STOP',
    knownPartCode: 'PP-EXT-042',
    requestedQuantity: 2,
    unit: '個',
    status: 'PENDING_CONFIRMATION',
    clarificationCount: 0,
    stockAvailableAtCheck: 4,
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-10-26 14:15',
        status: 'PENDING_CONFIRMATION',
        actor: '陳志明',
        role: 'OPERATOR',
        actionTitle: 'A線現場拍照提出停機急件申請',
        comment: 'A線母機三區加熱瓦斷路，產線停機，急需核對規格出庫更換。',
      },
    ],
  },
  {
    id: 'req-02',
    reqNumber: 'PR-20261026-002',
    requesterName: '林家豪',
    requesterRole: 'B班現場操作員',
    requestDate: '2026-10-26 09:30',
    equipmentName: 'B產線｜條料滾刀切粒機 (25HP)',
    equipmentCode: 'LB-PLT-01',
    lineCode: 'B',
    stationType: 'PELLETIZER',
    photoUrls: [INITIAL_PARTS[8].imageUrl],
    faultDescription: 'B線切粒滾刀其中三刃崩缺角，切出條料有連體拉絲現象，且牽引進料膠輪偏磨。',
    urgency: 'URGENT',
    requestedQuantity: 1,
    unit: '支',
    status: 'PENDING_RFQ',
    clarificationCount: 1,
    confirmedPartId: 'part-09',
    confirmedPartCode: 'PP-PLT-001',
    confirmedPartName: '條料切粒機 32刃超微粒鎢鋼旋轉滾刀',
    confirmedSpecs: '32刃螺旋列 / 鑲嵌 YG8X 鎢鋼 / 外徑 φ200mm x 200mm / 軸孔 45mm',
    confirmedBy: '王建國 (維修組長)',
    confirmedAt: '2026-10-26 10:10',
    stockAvailableAtCheck: 0,
    timeline: [
      {
        id: 't-2a',
        timestamp: '2026-10-26 09:30',
        status: 'PENDING_CONFIRMATION',
        actor: '林家豪',
        role: 'OPERATOR',
        actionTitle: 'B線提報滾刀崩角',
      },
      {
        id: 't-2b',
        timestamp: '2026-10-26 10:10',
        status: 'PENDING_RFQ',
        actor: '王建國 (維修組長)',
        role: 'TECHNICIAN',
        actionTitle: '維修核定規格無誤，庫存0件轉採購詢價',
      },
    ],
  },
  {
    id: 'req-03',
    reqNumber: 'PR-20261025-004',
    requesterName: '黃俊傑',
    requesterRole: '二廠維修技師',
    requestDate: '2026-10-25 15:40',
    equipmentName: 'C產線｜8米重載循環冷卻水道 (附氣動壓條輪)',
    equipmentCode: 'LC-CW-01',
    lineCode: 'C',
    stationType: 'COOLING_TROUGH',
    photoUrls: [INITIAL_PARTS[6].imageUrl],
    faultDescription: 'C線水槽吸水海綿輥硬化破皮，塑料條料表面殘水帶入切粒機造成顆粒發泡孔隙。',
    urgency: 'URGENT',
    requestedQuantity: 2,
    unit: '支',
    status: 'PENDING_APPROVAL',
    clarificationCount: 0,
    confirmedPartId: 'part-07',
    confirmedPartCode: 'PP-CW-005',
    confirmedPartName: '冷卻水道 強力吸水吹風機 專用吸水海綿壓輥',
    confirmedSpecs: 'PVA 連孔海綿 / φ100mm x 260mm / 軸徑 φ25mm',
    confirmedBy: '王建國 (維修組長)',
    confirmedAt: '2026-10-25 16:15',
    supplierName: '全翔塑膠機械五金配件行',
    quotedUnitPrice: 1650,
    quotedTotalPrice: 3300,
    estimatedLeadDays: 3,
    expectedDeliveryDate: '2026-10-28',
    rfqCompletedBy: '張雅惠 (採購專員)',
    rfqCompletedAt: '2026-10-25 17:30',
    timeline: [
      { id: 't-3a', timestamp: '2026-10-25 15:40', status: 'PENDING_CONFIRMATION', actor: '黃俊傑', role: 'OPERATOR', actionTitle: '提出海綿吸水輥申請' },
      { id: 't-3b', timestamp: '2026-10-25 16:15', status: 'PENDING_RFQ', actor: '王建國', role: 'TECHNICIAN', actionTitle: '維修核定規格無庫存轉採購' },
      { id: 't-3c', timestamp: '2026-10-25 17:30', status: 'PENDING_APPROVAL', actor: '張雅惠', role: 'PROCUREMENT', actionTitle: '完成詢價送主管審核', comment: '全翔報價 3,300 元，3天交貨。' },
    ],
  },
  {
    id: 'req-04',
    reqNumber: 'PR-20261024-001',
    requesterName: '許宏達',
    requesterRole: 'D班現場操作員',
    requestDate: '2026-10-24 08:20',
    equipmentName: 'D產線｜子母式擠出機 - 子機 (110型均化機)',
    equipmentCode: 'LD-EXT-S',
    lineCode: 'D',
    stationType: 'BABY_EXTRUDER',
    photoUrls: [INITIAL_PARTS[4].imageUrl],
    faultDescription: 'D線子機換網柱塞側漏PP高溫膠體，銅密封環嚴重偏磨。',
    urgency: 'NORMAL',
    requestedQuantity: 4,
    unit: '個',
    status: 'PO_PLACED',
    clarificationCount: 0,
    confirmedPartId: 'part-05',
    confirmedPartCode: 'PP-SCR-025',
    confirmedPartName: '換網器耐高溫紫銅柱塞密封環',
    confirmedSpecs: 'T2紫銅 / 外徑 φ165mm x 內徑 φ150mm x 厚 3.0mm',
    confirmedBy: '王建國 (維修組長)',
    confirmedAt: '2026-10-24 09:00',
    supplierName: '全翔塑膠機械五金配件行',
    quotedUnitPrice: 480,
    quotedTotalPrice: 1920,
    estimatedLeadDays: 4,
    expectedDeliveryDate: '2026-10-28',
    rfqCompletedBy: '張雅惠',
    approvedBy: '李廠長',
    poNumber: 'PO-20261024-03',
    orderedBy: '張雅惠',
    orderedAt: '2026-10-24 14:00',
    timeline: [],
  },
  {
    id: 'req-05',
    reqNumber: 'PR-20261022-003',
    requesterName: '陳志明',
    requesterRole: 'A班現場操作領班',
    requestDate: '2026-10-22 10:00',
    equipmentName: 'A產線｜子母式擠出機 - 子機 (135型均化機)',
    equipmentCode: 'LA-EXT-S',
    lineCode: 'A',
    stationType: 'BABY_EXTRUDER',
    photoUrls: [INITIAL_PARTS[3].imageUrl],
    faultDescription: 'A線例行週末換線備料，領用雙柱換網器包邊濾網片。',
    urgency: 'NORMAL',
    requestedQuantity: 20,
    unit: '片',
    status: 'IN_STOCK_ISSUED',
    clarificationCount: 0,
    confirmedPartId: 'part-04',
    confirmedPartCode: 'PP-SCR-021',
    confirmedPartName: '子母機雙柱油壓換網器 不鏽鋼包邊濾網 (80目/100目)',
    confirmedSpecs: 'φ150mm 80/100目雙層包鋁邊',
    confirmedBy: '陳志明',
    confirmedAt: '2026-10-22 10:15',
    isDirectStockIssued: true,
    stockAvailableAtCheck: 105,
    completedAt: '2026-10-22 10:20',
    timeline: [],
  },
];
