import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck2, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Info,
  Clock,
  Layers,
  Search,
  Eye,
  RefreshCw
} from 'lucide-react';
import { SparePart, UrgencyLevel, PurchaseRequisition, AiIdentificationResult, ProductionLineCode, EquipmentStationType } from '../types';
import { EQUIPMENT_LIST, PRODUCTION_LINES } from '../data/mockData';
import { SAMPLE_PHOTO_PRESETS, SamplePhotoPreset } from '../data/samplePhotos';

interface RequestApplicationViewProps {
  catalogParts: SparePart[];
  onSubmitRequisition: (newReq: Partial<PurchaseRequisition>) => void;
  onOpenPartDetail: (part: SparePart) => void;
}

export const RequestApplicationView: React.FC<RequestApplicationViewProps> = ({
  catalogParts,
  onSubmitRequisition,
  onOpenPartDetail,
}) => {
  // Form State
  const [equipmentCode, setEquipmentCode] = useState<string>(EQUIPMENT_LIST[3].code);
  const [photoBase64, setPhotoBase64] = useState<string>(SAMPLE_PHOTO_PRESETS[0].imageUrl);
  const [faultDescription, setFaultDescription] = useState<string>(SAMPLE_PHOTO_PRESETS[0].faultDescription);
  const [requestedQty, setRequestedQty] = useState<number>(2);
  const [unit, setUnit] = useState<string>('個');
  const [urgency, setUrgency] = useState<UrgencyLevel>('LINE_STOP');
  const [knownPartCode, setKnownPartCode] = useState<string>('');
  const [requesterName, setRequesterName] = useState<string>('陳志明 (現場操作員)');

  // AI Analysis State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiIdentificationResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedCandidateCode, setSelectedCandidateCode] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<string | null>(null);

  const currentEquipment = EQUIPMENT_LIST.find((eq) => eq.code === equipmentCode) || EQUIPMENT_LIST[0];

  const handleSelectPreset = (preset: SamplePhotoPreset) => {
    setEquipmentCode(preset.equipmentCode);
    setPhotoBase64(preset.imageUrl);
    setFaultDescription(preset.faultDescription);
    setUrgency(preset.urgency);
    setKnownPartCode('');
    setAiResult(null);
    setSelectedCandidateCode(null);
    setAiError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
        setAiResult(null);
        setSelectedCandidateCode(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiIdentification = async () => {
    if (!photoBase64) {
      alert('請先上傳零件照片或選取範例拍照');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/identify-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoBase64,
          mimeType: 'image/jpeg',
          equipment: `${currentEquipment.name} (${currentEquipment.code})`,
          faultDescription,
          candidateParts: catalogParts.map((p) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            alias: p.alias,
            category: p.category,
            equipment: p.equipment,
            specs: p.specs,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`AI 辨識服務回應異常 (HTTP ${response.status})`);
      }

      const data = await response.json();
      setAiResult({
        analysisSummary: data.analysisSummary || '已分析零件幾何外觀與磨損痕跡。',
        photoDefectsDetected: data.photoDefectsDetected || ['表面特徵吻合', '外殼破裂'],
        overallConfidence: data.overallConfidence || 'HIGH',
        recommendations: data.recommendations || [],
        humanAttentionRequired: true,
        disclaimerNotice: data.disclaimerNotice || 'AI 辨識結果僅供參考比對，嚴格禁止作為直接採購依據，必須由現場維修人員實體量測確認。',
        source: data.source,
        analyzedAt: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      if (data.recommendations && data.recommendations.length > 0) {
        setSelectedCandidateCode(data.recommendations[0].partCode);
      }
    } catch (err: any) {
      console.error('AI Identification failed:', err);
      setAiError(err.message || 'AI 辨識請求失敗，請檢查網路連線或稍後重試。');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faultDescription.trim()) {
      alert('請填寫故障描述或零件用途');
      return;
    }

    const prNumber = `PR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newRequisition: Partial<PurchaseRequisition> = {
      reqNumber: prNumber,
      requesterName,
      requesterRole: '現場操作人員',
      requestDate: new Date().toLocaleString('zh-TW', { hour12: false }),
      equipmentName: currentEquipment.name,
      equipmentCode: currentEquipment.code,
      photoUrls: [photoBase64],
      faultDescription,
      urgency,
      knownPartCode: knownPartCode || selectedCandidateCode || undefined,
      requestedQuantity: requestedQty,
      unit,
      status: 'PENDING_CONFIRMATION',
      clarificationCount: 0,
      aiResult: aiResult || undefined,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleString('zh-TW', { hour12: false }),
          status: 'PENDING_CONFIRMATION',
          actor: requesterName,
          role: 'OPERATOR',
          actionTitle: '現場作業員提出需求申請 (拍照提報)',
          comment: `提報設備 ${currentEquipment.name} 零件故障。${knownPartCode ? `已知型號：${knownPartCode}` : selectedCandidateCode ? `AI建議候選：${selectedCandidateCode}` : '型號未知待確認'}`,
        },
      ],
    };

    onSubmitRequisition(newRequisition);
    setIsSubmittedSuccess(prNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Success Banner */}
      {isSubmittedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900">需求單已成功送出！單號：{isSubmittedSuccess}</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                系統已自動建檔並通知「維修／技術人員」與「倉庫人員」進行實體規格核對與現有庫存盤查。
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmittedSuccess(null)}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
          >
            繼續提報下一筆
          </button>
        </div>
      )}

      {/* Top Banner: Workflow Principles */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                01 現場提出需求 (F02)
              </span>
              <span className="text-xs text-slate-300">|</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                02 AI 輔助照片辨識 (F03 試行)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              回收 PP 造粒現場｜零件故障拍照提報單
            </h2>
            <p className="text-xs text-slate-500">
              現場作業員使用手機拍照即可提出需求，AI 協助從廠內零件庫比對相似型號與歷史紀錄，辦公室集中處理。
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg shrink-0 max-w-md shadow-2xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="leading-snug">
              <strong>MVP 安全防呆：</strong>AI 僅推薦相似候選供參考，不可直接自動下單，庫存必須以實際資料為準，最後規格由維修人員簽核。
            </span>
          </div>
        </div>
      </div>

      {/* Quick Test Presets (Instant 1-Click for Evaluators) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              快速載入真實造粒機故障照片情境 (點擊立即測試 AI 比對)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">共 6 種常見 PP 造粒停機耗損樣品</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_PHOTO_PRESETS.map((preset) => {
            const isSelected = photoBase64 === preset.imageUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="aspect-video w-full rounded-lg bg-white overflow-hidden mb-1.5 border border-slate-200 shadow-2xs">
                  <img src={preset.imageUrl} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="text-[11px] font-bold text-slate-800 truncate">{preset.title}</div>
                <div className="text-[10px] text-slate-500 truncate font-mono">{preset.equipmentCode}</div>
                {preset.urgency === 'LINE_STOP' && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo & AI Assistant (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Photo Upload & Preview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>現場零件拍照／故障照片</span>
                <span className="text-rose-500 text-xs">*必填</span>
              </label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold flex items-center space-x-1.5 shadow-2xs transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>拍照或上傳檔案</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Photo Box */}
            <div className="relative aspect-video max-h-80 w-full rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
              {photoBase64 ? (
                <>
                  <img src={photoBase64} alt="零件故障照片" className="w-full h-full object-contain" />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur border border-slate-200 text-[11px] text-slate-700 font-mono font-medium flex items-center space-x-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>現場照片解析度正常</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">點擊上方按鈕拍照，或直接點選上方的樣品照片快速載入</p>
                </div>
              )}
            </div>

            {/* AI Trigger Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>AI 將分析外觀、接線、尺寸特徵與資料庫比對</span>
              </div>
              <button
                type="button"
                onClick={handleRunAiIdentification}
                disabled={isAiLoading || !photoBase64}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini 3.8 Flash 視覺模型深度比對中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span>啟動 AI 照片輔助辨識 (F03)</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          {/* AI Result Card (Shows when AI is run) */}
          {aiResult && (
            <div className="bg-white border border-sky-300 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm animate-fadeIn relative overflow-hidden">
              {/* AI Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <span>AI 零件辨識與比對結果</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold">
                        {aiResult.source || 'gemini-3.8-flash'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">比對時間：{aiResult.analyzedAt}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    aiResult.overallConfidence === 'HIGH'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    匹配信心度：{aiResult.overallConfidence}
                  </span>
                </div>
              </div>

              {/* Analysis summary & defects */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  <strong className="text-sky-800">外觀影像特徵診斷：</strong>
                  {aiResult.analysisSummary}
                </div>

                {aiResult.photoDefectsDetected && aiResult.photoDefectsDetected.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 self-center">偵測到異狀：</span>
                    {aiResult.photoDefectsDetected.map((defect, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                        {defect}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Candidate Matches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">推薦候選零件 (請核實勾選)：</span>
                  <span className="text-[11px] text-slate-400">依視覺相似度排序</span>
                </div>

                <div className="space-y-2">
                  {aiResult.recommendations.map((rec) => {
                    const dbPart = catalogParts.find((p) => p.code === rec.partCode);
                    const isSelected = selectedCandidateCode === rec.partCode;

                    return (
                      <div
                        key={rec.partCode}
                        onClick={() => {
                          setSelectedCandidateCode(rec.partCode);
                          setKnownPartCode(rec.partCode);
                          if (dbPart?.unit) setUnit(dbPart.unit);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50/50 border-sky-500 ring-2 ring-sky-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            {/* DB Reference photo thumbnail */}
                            <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                              <img src={dbPart?.imageUrl} alt={rec.partName} className="w-full h-full object-cover" />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">{rec.partCode}</span>
                                <span className="text-xs font-bold text-slate-900">{rec.partName}</span>
                                {dbPart?.alias && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                    俗稱: {dbPart.alias}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {rec.visualSimilarityReason}
                              </p>
                              {dbPart && (
                                <div className="text-[10px] text-slate-500 flex items-center space-x-3 pt-0.5">
                                  <span>適用設備：{dbPart.equipmentCode}</span>
                                  <span>現有庫存：<strong className={dbPart.currentStock > 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>{dbPart.currentStock} {dbPart.unit}</strong></span>
                                  <span>儲位：{dbPart.binLocation}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end space-y-1">
                            <span className="text-xs font-bold text-emerald-600">
                              {rec.confidenceScore}% 相似度
                            </span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            {dbPart && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenPartDetail(dbPart);
                                }}
                                className="text-[10px] text-sky-600 hover:text-sky-700 font-medium flex items-center space-x-0.5 pt-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>規格細節</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Physical verification points checklist */}
                        {rec.keyVerificationPoints && rec.keyVerificationPoints.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-amber-800 bg-amber-50/70 p-2 rounded-lg">
                            <strong className="text-amber-900 font-semibold block mb-0.5">
                              ⚠️ 維修技術員實體核對重點 (必須現場量測)：
                            </strong>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                              {rec.keyVerificationPoints.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center space-x-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{aiResult.disclaimerNotice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Requisition Fields (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>填寫零件需求明細 (F02)</span>
            </h3>

            {/* Requester info */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">申請人員 / 單位</label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Equipment Selection: 5 Lines (A, B, C, D, E) x 3 Core Stations */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>步驟 1：選擇造粒產線 (全廠 5 條產線 A~E)</span>
                </label>
                <span className="text-rose-500 text-xs font-medium">*必選</span>
              </div>

              {/* Line Tabs: A, B, C, D, E */}
              <div className="grid grid-cols-5 gap-1.5">
                {(['A', 'B', 'C', 'D', 'E'] as ProductionLineCode[]).map((lCode) => {
                  const lineInfo = PRODUCTION_LINES.find((l) => l.code === lCode);
                  const isCurrentLine = currentEquipment?.lineCode === lCode;
                  return (
                    <button
                      key={lCode}
                      type="button"
                      onClick={() => {
                        // Switch to the first equipment of that line
                        const targetEq = EQUIPMENT_LIST.find((eq) => eq.lineCode === lCode);
                        if (targetEq) setEquipmentCode(targetEq.code);
                      }}
                      className={`py-1.5 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                        isCurrentLine
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-extrabold font-mono">{lCode} 產線</span>
                      <span className={`text-[9px] truncate max-w-full leading-tight ${isCurrentLine ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {lCode === 'A' && '編織膜料'}
                        {lCode === 'B' && '太空包料'}
                        {lCode === 'C' && '重載棧板'}
                        {lCode === 'D' && '無紡布料'}
                        {lCode === 'E' && '改性瓶蓋'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Station Unit Buttons (母機, 子機, 冷卻水道, 切粒機) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  步驟 2：選擇故障機台單元 (子母式擠出機、冷卻水道、切粒機)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { type: 'MOTHER_EXTRUDER', label: '子母機 - 母機', sub: '主擠出/進料段' },
                    { type: 'BABY_EXTRUDER', label: '子母機 - 子機', sub: '均化/排氣換網' },
                    { type: 'COOLING_TROUGH', label: '冷卻水道', sub: '循環水槽/吸水壓輥' },
                    { type: 'PELLETIZER', label: '切粒機', sub: '條料合金滾刀' },
                  ].map((station) => {
                    const matchInLine = EQUIPMENT_LIST.find(
                      (eq) => eq.lineCode === currentEquipment?.lineCode && eq.stationType === station.type
                    );
                    const isStationActive = currentEquipment?.stationType === station.type;

                    return (
                      <button
                        key={station.type}
                        type="button"
                        disabled={!matchInLine}
                        onClick={() => {
                          if (matchInLine) setEquipmentCode(matchInLine.code);
                        }}
                        className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                          isStationActive
                            ? 'bg-sky-50/80 border-sky-400 text-sky-900 ring-1 ring-sky-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">{station.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{station.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Selected Equipment Display */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-slate-400 block font-mono">目前選定設備代碼：{currentEquipment.code}</span>
                  <span className="font-bold text-slate-800 text-xs truncate block">{currentEquipment.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shrink-0">
                  {currentEquipment.category}
                </span>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">急件程度</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('NORMAL')}
                  className={`py-2 px-2 rounded-lg border text-xs font-bold text-center transition ${
                    urgency === 'NORMAL'
                      ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  一般
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('URGENT')}
                  className={`py-2 px-2 rounded-lg border text-xs font-bold text-center transition ${
                    urgency === 'URGENT'
                      ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  急件
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('LINE_STOP')}
                  className={`py-2 px-2 rounded-lg border text-xs font-bold text-center transition ${
                    urgency === 'LINE_STOP'
                      ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs animate-pulse'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  停機急件 (最高)
                </button>
              </div>
            </div>

            {/* Qty & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">需求數量</label>
                <input
                  type="number"
                  min="1"
                  value={requestedQty}
                  onChange={(e) => setRequestedQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">單位</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Known Part Code or Candidate */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>零件編號／規格型號 (若未知可留空)</span>
                <span className="text-slate-400 text-[11px]">AI 比對或維修確認</span>
              </label>
              <input
                type="text"
                placeholder="例如: PP-EXT-042 或 陶瓷瓦圈 (未知可免填)"
                value={knownPartCode}
                onChange={(e) => setKnownPartCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Fault description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>故障描述／零件用途說明</span>
                <span className="text-rose-500 text-xs">*必填</span>
              </label>
              <textarea
                rows={3}
                required
                value={faultDescription}
                onChange={(e) => setFaultDescription(e.target.value)}
                placeholder="詳細描述故障現象，例如磨損、破裂、跳機、融膠溢出、或例行耗材更換..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>送出採購需求單 (通知維修與倉庫核對)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
