import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '../context/SiteContext';

const CodeInjector: React.FC = () => {
    const { headCode, footerCode } = useSiteSettings();
    const headRef = useRef<string>('');
    const footerRef = useRef<HTMLDivElement>(null);

    // Helper to safely inject scripts
    const injectScripts = (html: string, container: HTMLElement | HTMLHeadElement) => {
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(html);
        container.appendChild(fragment);
    };

    // Handle Head Injection
    useEffect(() => {
        if (!headCode || headCode === headRef.current) return;

        // Very basic simple dedup check, ideally use IDs in scripts
        headRef.current = headCode;

        // We append to head
        try {
            injectScripts(headCode, document.head);
        } catch (e) {
            console.error("Failed to inject head code", e);
        }
    }, [headCode]);

    // Handle Footer Injection
    useEffect(() => {
        if (!footerCode || !footerRef.current) return;

        const container = footerRef.current;
        container.innerHTML = ''; // Clear previous to avoid dups on re-render if code changes

        try {
            injectScripts(footerCode, container);
        } catch (e) {
            console.error("Failed to inject footer code", e);
        }

    }, [footerCode]);

    // We render a hidden div for footer code (appended to body by layout, effectively footer)
    return <div ref={footerRef} className="hidden" id="custom-footer-code" />;
};

export default CodeInjector;
