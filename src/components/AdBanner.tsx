import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '../context/SiteContext';

interface AdBannerProps {
  placementId: string;
  className?: string;
  // Fallbacks used if placement not found in context
  fallbackWidth?: number;
  fallbackHeight?: number;
}

const AdBanner: React.FC<AdBannerProps> = ({
  placementId,
  className = '',
  fallbackWidth = 300,
  fallbackHeight = 250
}) => {
  const { adPlacements } = useSiteSettings();
  const config = adPlacements?.[placementId];
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config || !config.active || !adRef.current) return;

    const container = adRef.current;

    // Clear previous content
    container.innerHTML = '';

    if (config.type === 'zone' && config.value) {
      // Adsterra Zone Logic
      try {
        const optionsScript = document.createElement('script');
        optionsScript.type = "text/javascript";
        optionsScript.text = `
          atOptions = {
            'key' : '${config.value}',
            'format' : 'iframe',
            'height' : ${config.height},
            'width' : ${config.width},
            'params' : {}
          };
        `;
        container.appendChild(optionsScript);

        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = `//www.topcreativeformat.com/${config.value}/invoke.js`;
        invokeScript.async = true;
        container.appendChild(invokeScript);
      } catch (e) {
        console.error('Failed to inject Adsterra script', e);
      }
    } else if (config.type === 'script' && config.value) {
      // Custom Script Logic
      try {
        const range = document.createRange();
        range.selectNode(container);
        const documentFragment = range.createContextualFragment(config.value);
        container.appendChild(documentFragment);
      } catch (e) {
        console.error('Failed to inject ad script', e);
        container.textContent = 'Ad Error';
      }
    }

    // Cleanup function to prevent removeChild errors on unmount/re-render
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [config, placementId]);

  if (!config || !config.active) return null;

  return (
    <div className={`flex justify-center items-center my-4 ${className}`}>
      <div
        style={{ width: `${config.width || fallbackWidth}px`, height: `${config.height || fallbackHeight}px` }}
        className="bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative"
      >
        {/* Placeholder - Managed by React */}
        {!config.value && (
          <div className="text-slate-400 text-xs text-center p-2 z-0">
            Ad Space<br />({placementId})
          </div>
        )}

        {/* Ad Container - Managed manually by Script, isolated from React children */}
        <div ref={adRef} className="absolute inset-0 z-10" />
      </div>
    </div>
  );
};

export default AdBanner;