'use client';

import { useEffect } from 'react';

export default function AdBanner({ dataAdSlot, dataAdFormat = 'auto', dataFullWidthResponsive = true, style = {} }) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_ID) {
                // Wait a tiny bit to ensure the ins tag is in the DOM
                setTimeout(() => {
                    const adsbygoogle = window.adsbygoogle || [];
                    adsbygoogle.push({});
                }, 100);
            }
        } catch (error) {
            console.error('AdSense Initialization Error:', error);
        }
    }, []);

    const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

    if (!adSenseId || adSenseId === 'ca-pub-XXXXXXXXXXXXXXXX') {
        return (
            <div className="ad-container" style={{ ...style }}>
                <span className="ad-label">Advertisement</span>
            </div>
        );
    }

    return (
        <div className="ad-wrapper" style={{ overflow: 'hidden', textAlign: 'center', width: '100%', minHeight: '250px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={adSenseId}
                data-ad-slot={dataAdSlot || '1234567890'} // Provide a default slot or require one
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
}
