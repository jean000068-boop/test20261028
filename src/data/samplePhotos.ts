export interface SamplePhotoPreset {
  id: string;
  title: string;
  lineCode: 'A' | 'B' | 'C' | 'D' | 'E';
  lineName: string;
  stationName: string;
  equipmentCode: string;
  equipmentName: string;
  faultDescription: string;
  urgency: 'NORMAL' | 'URGENT' | 'LINE_STOP';
  imageUrl: string;
  targetPartCode: string;
  targetPartName: string;
  visualCues: string[];
}

function createSamplePhotoSvg(title: string, mainColor: string, damageDetails: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#f1f5f9"/>
      </linearGradient>
    </defs>
    <rect width="320" height="240" fill="url(#bg)" stroke="#cbd5e1" stroke-width="2"/>
    
    <!-- Factory floor grid texture -->
    <path d="M 0,40 L 320,40 M 0,80 L 320,80 M 0,120 L 320,120 M 0,160 L 320,160 M 0,200 L 320,200" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,6"/>
    <path d="M 40,0 L 40,240 M 80,0 L 80,240 M 120,0 L 120,240 M 160,0 L 160,240 M 200,0 L 200,240 M 240,0 L 240,240 M 280,0 L 280,240" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,6"/>

    <!-- Field Photo Scene -->
    <g transform="translate(160, 105)">
      <circle cx="0" cy="0" r="72" fill="#ffffff" stroke="${mainColor}" stroke-width="24" stroke-dasharray="24, 6"/>
      <circle cx="0" cy="0" r="48" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
      <!-- Damage / Burn / Wear markers -->
      <path d="M -30,-38 Q -10,-10 20,-32" stroke="#ef4444" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M 15,-18 L 35,-5 L 20,10" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="-25" cy="-32" r="10" fill="#ef4444" opacity="0.3"/>
      <circle cx="28" cy="-5" r="7" fill="#f59e0b" opacity="0.3"/>
    </g>

    <!-- Photo Overlay Elements -->
    <rect x="12" y="12" width="116" height="24" rx="5" fill="#ef4444" />
    <text x="70" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">現場故障拍照紀錄</text>

    <!-- Bottom info bar -->
    <rect x="0" y="180" width="320" height="60" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <text x="16" y="202" fill="#0f172a" font-size="13" font-weight="bold" font-family="sans-serif">${title}</text>
    <text x="16" y="222" fill="#64748b" font-size="11" font-family="sans-serif">${damageDetails} ｜ ${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PHOTO_PRESETS: SamplePhotoPreset[] = [
  {
    id: 'preset-heater-burn',
    title: 'A產線｜母機陶瓷加熱瓦斷裂冒煙',
    lineCode: 'A',
    lineName: 'A 產線 (PP 編織袋/薄膜線)',
    stationName: '母機 (第一階主擠出機)',
    equipmentCode: 'LA-EXT-M',
    equipmentName: 'A產線｜子母式擠出機 - 母機 (160型主機)',
    faultDescription: 'A線母機三區加熱瓦冒白煙斷電，表面覆蓋焦黑PP溢膠，不鏽鋼束緊帶斷開，整線停機。',
    urgency: 'LINE_STOP',
    imageUrl: createSamplePhotoSvg('A線母機 陶瓷電熱圈斷裂焦黑', '#0284c7', '外徑約180mm / 表面碳化溢膠', 'A線母機三區'),
    targetPartCode: 'PP-EXT-042',
    targetPartName: '母機陶瓷電熱瓦圈 (φ180mm x 100mm)',
    visualCues: ['外觀呈圓環形不鏽鋼外包陶瓷結構', '有獨立陶瓷端子絕緣接線柱', '表面有塑膠熔融焦化黑斑與束緊帶斷口'],
  },
  {
    id: 'preset-roller-cutter',
    title: 'B產線｜切粒機 32刃鎢鋼滾刀崩角',
    lineCode: 'B',
    lineName: 'B 產線 (PP 太空包粉碎料線)',
    stationName: '切粒機 (條料滾刀切粒機)',
    equipmentCode: 'LB-PLT-01',
    equipmentName: 'B產線｜條料滾刀切粒機 (25HP)',
    faultDescription: 'B線滾刀切粒機運轉異音，三刃刀口嚴重缺角，條料未切斷產生連體顆粒與大量牽絲。',
    urgency: 'URGENT',
    imageUrl: createSamplePhotoSvg('B線切粒機 32刃滾刀崩角', '#059669', '圓筒旋轉滾刀 / 刀齒缺角3mm', 'B線切粒刀箱'),
    targetPartCode: 'PP-PLT-001',
    targetPartName: '條料切粒機 32刃超微粒鎢鋼旋轉滾刀',
    visualCues: ['多刃螺旋斜刀圓筒滾刀結構', '中心孔徑 45mm 雙鍵槽', '超硬合金刀口崩缺損壞'],
  },
  {
    id: 'preset-water-sponge',
    title: 'C產線｜冷卻水道 吸水海綿輥硬化破裂',
    lineCode: 'C',
    lineName: 'C 產線 (PP 棧板重載造粒線)',
    stationName: '冷卻水道 (循環水槽與吸水機)',
    equipmentCode: 'LC-CW-01',
    equipmentName: 'C產線｜8米重載循環冷卻水道 (附氣動壓條輪)',
    faultDescription: 'C線水槽吸水機之 PVA 海綿輥硬化裂損，塑料條料未脫水即進入切粒機，顆粒氣孔發泡。',
    urgency: 'URGENT',
    imageUrl: createSamplePhotoSvg('C線水槽 吸水海綿壓輥破裂', '#38bdf8', 'φ100mm x 260mm PVA海綿', 'C線水槽吹吸乾端'),
    targetPartCode: 'PP-CW-005',
    targetPartName: '冷卻水道 強力吸水吹風機 專用吸水海綿壓輥',
    visualCues: ['藍色/白色圓柱發泡吸水海綿輥', '表面有長條撕裂痕跡與硬化結垢', '內穿不鏽鋼轉動芯軸'],
  },
  {
    id: 'preset-copper-seal',
    title: 'D產線｜子機換網柱塞紫銅密封環漏膠',
    lineCode: 'D',
    lineName: 'D 產線 (PP 無紡布邊角料線)',
    stationName: '子機 (第二階均化機模頭換網)',
    equipmentCode: 'LD-EXT-S',
    equipmentName: 'D產線｜子母式擠出機 - 子機 (110型均化機)',
    faultDescription: 'D線子機換網滑體側面持續冒出焦黑熔膠，銅密封墊受壓偏磨失圓厚度不足。',
    urgency: 'NORMAL',
    imageUrl: createSamplePhotoSvg('D線子機 紫銅密封墊圈偏磨', '#d97706', '外徑165mm x 厚3mm 紅銅色', 'D線換網柱塞腔'),
    targetPartCode: 'PP-SCR-025',
    targetPartName: '換網器耐高溫紫銅柱塞密封環',
    visualCues: ['紅銅色純銅圓形密封平墊圈', '外徑約165mm，內孔直徑約150mm', '表面有高溫氧化暗紅與高壓壓痕'],
  },
  {
    id: 'preset-pinch-roller',
    title: 'E產線｜切粒機 牽引防滑進料橡膠輥溝槽磨平',
    lineCode: 'E',
    lineName: 'E 產線 (PP 瓶蓋/改性料線)',
    stationName: '切粒機 (牽引進料輥)',
    equipmentCode: 'LE-PLT-01',
    equipmentName: 'E產線｜高精度條料切粒機 (25HP)',
    faultDescription: 'E線切粒機進料膠輥表面菱形紋磨平，牽引條料打滑，進料速度不勻導致顆粒長短不一。',
    urgency: 'NORMAL',
    imageUrl: createSamplePhotoSvg('E線切粒機 牽引橡膠壓輥打滑磨平', '#eab308', 'φ120 x 200mm 黃色聚氨酯包膠', 'E線切粒進料端'),
    targetPartCode: 'PP-PLT-007',
    targetPartName: '切粒機 牽引進料橡膠壓輥 (防滑耐磨PU)',
    visualCues: ['聚氨酯包膠圓柱牽引輥', '外表防滑花紋磨損發亮', '雙側有專用軸承位與鍵槽'],
  },
  {
    id: 'preset-water-sub-roller',
    title: 'A產線｜冷卻水道 氣動壓條浸水導輪卡死',
    lineCode: 'A',
    lineName: 'A 產線 (PP 編織袋/薄膜線)',
    stationName: '冷卻水道 (水槽壓條輪)',
    equipmentCode: 'LA-CW-01',
    equipmentName: 'A產線｜8米循環冷卻水道 (附浸水導輪與吸水吹乾機)',
    faultDescription: 'A線冷卻水槽水下導輪防水軸承進水卡死，料條刮傷磨損跳槽漂浮。',
    urgency: 'URGENT',
    imageUrl: createSamplePhotoSvg('A線水槽 浸水導輪軸承磨損', '#0284c7', 'PTFE 鐵氟龍圓輪 + 防水軸承', 'A線水槽前段'),
    targetPartCode: 'PP-CW-001',
    targetPartName: '冷卻水道 氣動壓條浸水導輪組',
    visualCues: ['白色 PTFE 鐵氟龍導條輪', '轉動軸承銹蝕卡死', '輪面有塑料條料摩擦刮痕'],
  },
];
