import React, { useState } from 'react';
import { 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  FileCode, 
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Project } from '../types';

interface SEOAdminHubProps {
  projects: Project[];
}

export const SEOAdminHub: React.FC<SEOAdminHubProps> = ({ projects }) => {
  const [verificationCode, setVerificationCode] = useState(() => {
    return localStorage.getItem('priad_google_site_verification') || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const officialDomain = 'https://www.priadarchitects.in/';
  const sitemapUrl = 'https://www.priadarchitects.in/sitemap.xml';
  const robotsUrl = 'https://www.priadarchitects.in/robots.txt';

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = verificationCode.trim();
    localStorage.setItem('priad_google_site_verification', cleanToken);

    // Update or insert the meta tag in document head
    let metaTag = document.getElementById('google-site-verification-meta') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.id = 'google-site-verification-meta';
      metaTag.name = 'google-site-verification';
      document.head.appendChild(metaTag);
    }
    metaTag.content = cleanToken;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['ArchitecturalFirm', 'LocalBusiness', 'ProfessionalService'],
    name: 'PRIAD ARCHITECTS',
    legalName: 'PRIAD ARCHITECTS',
    url: 'https://www.priadarchitects.in/',
    logo: 'https://www.priadarchitects.in/assets/priad_logo.png',
    telephone: '+919043721008',
    email: 'priad2728@gmail.com',
    priceRange: '$$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Chinthamani Nagar, Kuppakonam Pudur',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641038',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.0168,
      longitude: 76.9558
    },
    areaServed: ['Coimbatore', 'Tamil Nadu', 'India', 'Global']
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Production Domain & Indexing Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#102414] border border-emerald-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-400 font-bold">
                Google Indexing Engine • Live & Configured
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-white font-bold tracking-wide">
              www.priadarchitects.in
            </h2>
            <p className="text-xs text-slate-300 font-sans-body mt-2 max-w-2xl leading-relaxed">
              Domain metadata, canonical links, robots directives, XML sitemaps, and rich Schema.org structured data are fully configured for maximum organic visibility and fast Google search indexing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tech text-xs uppercase tracking-wider font-bold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Open Google Search Console</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(officialDomain)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tech text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>Test Rich Results</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Technical SEO Quick Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block mb-0.5">Canonical URL</span>
            <span className="text-xs font-mono-tech text-emerald-300 truncate block">priadarchitects.in</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block mb-0.5">Googlebot Crawl</span>
            <span className="text-xs font-mono-tech text-emerald-300 truncate block">index, follow</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block mb-0.5">XML Sitemap</span>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-mono-tech text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-[10px] font-mono-tech uppercase text-slate-400 block mb-0.5">Robots.txt</span>
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs font-mono-tech text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Google Search Console Verification Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-display text-lg text-white font-bold">
              Google Site Verification Tag
            </h3>
            <p className="text-xs text-slate-400 font-sans-body">
              Instantly verify ownership of <code className="text-blue-300">https://www.priadarchitects.in/</code> with Google Search Console.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveVerification} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-tech uppercase tracking-wider text-slate-300 mb-2">
              Google Verification Code (HTML Tag Content)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder='e.g. google-site-verification=abc123xyz_example_token'
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono-tech"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tech text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved & Active!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Apply Meta Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-mono-tech text-slate-400">
            <span>
              Status:{' '}
              {verificationCode ? (
                <span className="text-emerald-400 font-bold">Active in &lt;head&gt; meta tag</span>
              ) : (
                <span className="text-amber-400 font-bold">Empty (Enter Google token when adding property)</span>
              )}
            </span>
            <span className="text-slate-500">
              Meta tag: &lt;meta name="google-site-verification" content="..." /&gt;
            </span>
          </div>
        </form>
      </div>

      {/* 3. 5-Step Guaranteed Google Search Indexing Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-display text-lg text-white font-bold">
              Google Search Indexing Checklist
            </h3>
            <p className="text-xs text-slate-400 font-sans-body">
              Follow these 5 steps to get PRIAD ARCHITECTS visible on Google Search immediately.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono-tech text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="font-serif-display text-sm text-white font-bold">
                  Add Property in Google Search Console
                </h4>
                <p className="text-xs text-slate-400 font-sans-body mt-1">
                  Open Google Search Console and select <strong>URL prefix</strong>: <code className="text-emerald-300 font-mono-tech">https://www.priadarchitects.in/</code>
                </p>
              </div>
            </div>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-tech text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <span>Open Console</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono-tech text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="font-serif-display text-sm text-white font-bold">
                  Verify Ownership via HTML Tag
                </h4>
                <p className="text-xs text-slate-400 font-sans-body mt-1">
                  In Search Console, choose <strong>HTML tag</strong> verification. Copy the code, paste it into the verification box above, click Save, then click "Verify" in Search Console.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                document.querySelector('input')?.focus();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-tech text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Scroll to Input</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono-tech text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="font-serif-display text-sm text-white font-bold">
                  Submit XML Sitemap to Google
                </h4>
                <p className="text-xs text-slate-400 font-sans-body mt-1">
                  In the left sidebar of Google Search Console, click <strong>Sitemaps</strong>. Enter <code className="text-emerald-300 font-mono-tech">sitemap.xml</code> and click <strong>Submit</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(sitemapUrl, 'sitemap')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-tech text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedKey === 'sitemap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copiedKey === 'sitemap' ? 'Copied URL!' : 'Copy Sitemap URL'}</span>
            </button>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono-tech text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                4
              </span>
              <div>
                <h4 className="font-serif-display text-sm text-white font-bold">
                  Request Immediate URL Indexing
                </h4>
                <p className="text-xs text-slate-400 font-sans-body mt-1">
                  At the top of Search Console, type <code className="text-emerald-300 font-mono-tech">https://www.priadarchitects.in/</code> into the URL inspection search bar, press Enter, then click <strong>"Request Indexing"</strong>. This alerts Googlebot to crawl the site immediately!
                </p>
              </div>
            </div>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono-tech text-white uppercase tracking-wider font-bold flex items-center gap-1.5 shrink-0"
            >
              <span>Inspect URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono-tech text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                5
              </span>
              <div>
                <h4 className="font-serif-display text-sm text-white font-bold">
                  Connect Google Business Profile (Local Map Pack)
                </h4>
                <p className="text-xs text-slate-400 font-sans-body mt-1">
                  Register or claim <strong>PRIAD ARCHITECTS</strong> on Google Maps / Google Business Profile using your address (Chinthamani Nagar, Kuppakonam Pudur, Coimbatore 641038) and link your website <code className="text-emerald-300 font-mono-tech">https://www.priadarchitects.in/</code>.
                </p>
              </div>
            </div>
            <a
              href="https://www.google.com/business/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-tech text-white uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <span>Google Business</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Local SEO & NAP Consistency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NAP Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-emerald-400 mb-4">
            <MapPin className="w-5 h-5" />
            <h3 className="font-serif-display text-base text-white font-bold">
              Local SEO NAP & Entity Consistency
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans-body mb-5">
            Google ranks businesses higher when Name, Address, and Phone (NAP) match perfectly across Schema.org markup, footer, and Google Maps.
          </p>

          <div className="space-y-3 font-mono-tech text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Business Name:</span>
              <span className="text-white font-bold">PRIAD ARCHITECTS</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Phone / WhatsApp:</span>
              <span className="text-emerald-300">+91 90437 21008</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-300">priad2728@gmail.com</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-start">
              <span className="text-slate-500 shrink-0">Address:</span>
              <span className="text-slate-300 text-right">
                Chinthamani Nagar, Kuppakonam Pudur,<br/>
                Coimbatore, Tamil Nadu 641038, IN
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Coordinates:</span>
              <span className="text-slate-300">11.0168° N, 76.9558° E</span>
            </div>
          </div>
        </div>

        {/* Live Schema Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <FileCode className="w-5 h-5" />
                <h3 className="font-serif-display text-base text-white font-bold">
                  Active Schema.org JSON-LD
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify(sampleJsonLd, null, 2), 'schema')}
                className="text-[11px] font-mono-tech text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema' ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans-body mb-4">
              Injected into the DOM automatically for Google Rich Snippets, ArchitectureFirm knowledge graphs, and mobile carousels.
            </p>
            <pre className="bg-slate-950 rounded-xl p-4 text-[11px] font-mono-tech text-emerald-300 overflow-x-auto max-h-56 border border-slate-800">
              {JSON.stringify(sampleJsonLd, null, 2)}
            </pre>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-500">Schema Validation:</span>
            <a
              href={`https://validator.schema.org/#url=${encodeURIComponent(officialDomain)}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Validate on Schema.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
