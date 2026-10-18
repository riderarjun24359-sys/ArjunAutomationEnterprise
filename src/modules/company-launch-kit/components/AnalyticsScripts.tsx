import Script from "next/script";
import { ANALYTICS } from "@/src/config/analytics";

/**
 * Analytics loader.
 *
 * An audit of the codebase found `NEXT_PUBLIC_GA4_ID` declared in the env
 * schema but never read by any component, so the site had no measurement at
 * all. These tags now consume the shared config in `src/config/analytics`.
 *
 * Behaviour
 * ---------
 * Renders nothing for any provider that is not configured, so local and
 * preview environments stay clean and no empty script tags ship. Loading is
 * `afterInteractive`, keeping the tags off the critical rendering path.
 *
 * Before enabling this for regulated markets or for EU/UK visitors, add
 * consent gating (Google Consent Mode v2 or a CMP) — GA4 should not fire
 * before consent is recorded.
 */
export function AnalyticsScripts() {
    const { ga4Id, gtmId, metaPixelId } = ANALYTICS;

    return (
        <>
            {gtmId ? (
                <Script id="gtm" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
                </Script>
            ) : null}

            {ga4Id ? (
                <>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
                    <Script id="ga4" strategy="afterInteractive">
                        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
                    </Script>
                </>
            ) : null}

            {metaPixelId ? (
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
                </Script>
            ) : null}
        </>
    );
}
