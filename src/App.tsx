import React, { useState, useEffect } from 'react';
import pages, { design, meta } from '../slides/three-generations-parenting/index';

const NOTES: Record<number, string> = {
  0: '【開場 00-10分鐘】破冰與建立同盟：現場雙職輪班家庭多，點出阿公阿嬤辛勞付出，宣示今天不是批判大會，而是尋求兩代雙贏。',
  1: '【第一幕 10-25分鐘】托育現況：澳門雙職輪班超60%依賴隔代托育，80%曾有生活習慣摩擦。問題在於缺乏邊界協議。',
  2: '【第一幕】兩代心聲對照：長輩怕被挑毛病、渴望被尊重；父母焦慮自理與規矩，尋求一致管教。',
  3: '【第二幕 25-45分鐘】4大摩擦焦點：1.飲食習慣（追著餵飯）、2.電子屏幕（手機安撫）、3.自理代勞、4.當面袒護。',
  4: '【第二幕】行為套利真相：父母立規 -> 長輩放水 -> 孩子套利鑽漏洞 -> 常規瓦解。孩子學會的是看人下菜碟。',
  5: '【第二幕】責任重構：父母扛起第一責任人嚴師角色，長輩卸下管教重擔、專注慈愛情感支持。',
  6: '【第三幕 45-70分鐘】邊界劃分：父母守住安全、睡眠、禮貌底線；生活照料與文化傳承充分授權長輩。',
  7: '【第三幕】核心心法鐵律：「當面補台，私下商量；有異議，背後談。」維護大人統一權威。',
  8: '【第三幕】溝通四步法：1.肯定辛勞 -> 2.客觀陳述 -> 3.替代方案 -> 4.主動接手。',
  9: '【第三幕】情境實戰1（3C屏幕）：進門不情緒指責，體貼長輩辛勞並主動接手引導孩子洗手擺碗筷。',
  10: '【第三幕】情境實戰2（飲食零食）：肯定爺爺疼愛心意，將即時給予轉化為晚餐後全家共享儀式。',
  11: '【第三幕】第三方權威借力：善用兒科醫生、幼兒園老師、科學睡眠標準，用專業診斷化解主觀對立。',
  12: '【第四幕 70-90分鐘】長輩獨特價值：家族歷史傳承、受挫時無條件的情緒避風港、從容耐心的慢陪伴。',
  13: '【第四幕】父母及時接棒：18:30進門主動接手 -> 19:30親自輔導課業 -> 21:00深度陪伴就寢。',
  14: '【第四幕】全家三大底線：1.固定就寢（21:30） 2.屏幕限額（30分鐘） 3.尊重長輩禮貌。',
  15: '【第四幕】現場互動問答：邀請台下父母與長輩分享零食與穿鞋情境的實戰應對。',
  16: '【第四幕】家庭通關暗號：「超人休息」（暫停爭吵）、「暗號333」（背後談）、「今天我請喝茶」（溫情修復）。',
  17: '【結語昇華】雙倍的愛，共同的智慧：三代同堂是兩代大人攜手為孩子築起穩定成長空間。',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const totalPages = pages.length;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleW = w / 1920;
      const scaleH = h / 1080;
      setScale(Math.min(scaleW, scaleH) * 0.95);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPage = (nextPage: number) => {
    if (nextPage === currentPage || nextPage < 0 || nextPage >= totalPages || isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(nextPage);
      setIsFading(false);
    }, 120);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        goToPage(currentPage - 1);
      } else if (e.key === 'Home') {
        goToPage(0);
      } else if (e.key === 'End') {
        goToPage(totalPages - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        setShowDrawer((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isFading]);

  const CurrentComponent = pages[currentPage];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif' }}>
      
      {/* Top Studio Bar */}
      <div style={{ position: 'fixed', top: 16, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', padding: '6px 16px', borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ color: '#f8fafc', fontSize: 13, fontWeight: 700 }}>OpenSlide Studio</span>
          <span style={{ color: '#64748b', fontSize: 13 }}>·</span>
          <span style={{ color: '#cbd5e1', fontSize: 13 }}>三代共贏的教養智慧</span>
        </div>

        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            style={{ background: showDrawer ? '#b45309' : 'rgba(15,23,42,0.85)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(12px)' }}
          >
            📑 頁面目錄 (M)
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{ background: showNotes ? '#0284c7' : 'rgba(15,23,42,0.85)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(12px)' }}
          >
            🎙️ 講者講稿 (N)
          </button>
        </div>
      </div>

      {/* 1920x1080 Slide Canvas */}
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          boxShadow: '0 30px 90px -20px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: design.palette.bg,
          color: design.palette.text,
          position: 'relative',
          transition: 'opacity 120ms ease-out',
          opacity: isFading ? 0.2 : 1,
        }}
      >
        {CurrentComponent ? <CurrentComponent /> : <div>Page not found</div>}
      </div>

      {/* Bottom Control Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          borderRadius: 40,
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: '#f8fafc',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.5)',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
          style={{
            background: currentPage === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            color: currentPage === 0 ? '#64748b' : '#f8fafc',
            border: 'none',
            borderRadius: 20,
            padding: '6px 14px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ◀ 上一頁
        </button>

        <span style={{ fontSize: 14, fontWeight: 800, minWidth: 90, textAlign: 'center', color: '#38bdf8', letterSpacing: '0.05em' }}>
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          style={{
            background: currentPage === totalPages - 1 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            color: currentPage === totalPages - 1 ? '#64748b' : '#f8fafc',
            border: 'none',
            borderRadius: 20,
            padding: '6px 14px',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          下一頁 ▶
        </button>

        <div style={{ width: 1, height: 18, background: 'rgba(148, 163, 184, 0.3)' }} />

        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          按 F 全螢幕 · 按 M 開啟目錄 · 按 N 講稿
        </span>
      </div>

      {/* Slide Drawer Modal (M) */}
      {showDrawer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setShowDrawer(false)}>
          <div style={{ width: 440, height: '100%', background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>📑 18 頁簡報目錄</div>
              <button onClick={() => setShowDrawer(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => { goToPage(idx); setShowDrawer(false); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: currentPage === idx ? 'rgba(180, 83, 9, 0.25)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${currentPage === idx ? '#b45309' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    color: currentPage === idx ? '#fbbf24' : '#e2e8f0',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, width: 28, color: currentPage === idx ? '#fbbf24' : '#64748b' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {NOTES[idx]?.split('：')[0] || `Slide ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Presenter Notes Modal (N) */}
      {showNotes && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', width: 800, maxWidth: '90vw', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 20, padding: '24px 28px', color: '#f8fafc', zIndex: 150, boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎙️ 講者口播要點 · 第 {currentPage + 1} 頁</span>
            </div>
            <button onClick={() => setShowNotes(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#e2e8f0', margin: 0 }}>
            {NOTES[currentPage] || '暫無講者備忘錄'}
          </p>
        </div>
      )}
    </div>
  );
}
