'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function FabFeedback() {
  const [open, setOpen] = useState(false);
  const formUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL || '';

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const feedbackOpen = searchParams.get('feedback');
    if (feedbackOpen === 'open') {
      // 如果是 Google Form，直接新开标签页
      if (formUrl.includes('docs.google.com/forms')) {
        window.open(formUrl, '_blank');
      } else {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [pathname, searchParams, formUrl]);

  // 防止提前渲染出错，通过 useEffect 延迟获取环境变量
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    // 在客户端再次检查配置，避免服务端渲染冲突
    setShowButton(!!formUrl);
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [formUrl]);

  // 控制 body 滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  if (!showButton) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Feedback"
        className="feedback-button fixed right-4 bottom-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-lg hover:opacity-95"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="text-lg font-medium">Feedback</div>
              <div className="flex items-center gap-2">
                <a 
                  href={formUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Open in new window
                </a>
                <button onClick={() => setOpen(false)} className="px-3 py-1 rounded bg-gray-100">Close</button>
              </div>
            </div>
            {!formUrl.includes('docs.google.com/forms') && (
              <iframe
                src={formUrl}
                title="Feedback Form"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}