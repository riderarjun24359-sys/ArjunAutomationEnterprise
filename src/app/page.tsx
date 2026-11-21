"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  School,
  ShoppingBag,
  Globe,
  X,
} from "lucide-react";

const SITE = {
  name: "Arjun Automation Enterprises",
  phone: "[MY_NUMBER]",
  email: "[MY_EMAIL]",
  starterPrice: "Rs.[LOW]",
  supermarketDemo: "[DEMO_LINK]",
  schoolDemo: "[DEMO_LINK/SCREENSHOT]",
  founderName: "[NAME]",
  founderPhoto: "[PHOTO]",
};

const configured = (value: string) => value && !value.startsWith("[") && value.trim().length > 0;
const phoneDigits = SITE.phone.replace(/\D/g, "");
const whatsappUrl = configured(SITE.phone) && phoneDigits.length >= 10
  ? "https://wa.me/" + phoneDigits
  : "#contact";

type Language = "en" | "te";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const te = language === "te";

  const nav = [
    { href: "#services", en: "Services", te: "సేవలు" },
    { href: "#school-software", en: "School Software", te: "స్కూల్ సాఫ్ట్‌వేర్" },
    { href: "#demos", en: "Demos", te: "డెమోలు" },
    { href: "#pricing", en: "Pricing", te: "ధరలు" },
    { href: "#contact", en: "Contact", te: "సంప్రదించండి" },
  ];

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const business = String(data.get("business") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !business || !message) {
      setFormMessage(te ? "దయచేసి అన్ని వివరాలు నమోదు చేయండి." : "Please complete all fields.");
      return;
    }

    if (!configured(SITE.phone) || phoneDigits.length < 10) {
      setFormMessage("Before publishing, replace [MY_NUMBER] in the site settings with your WhatsApp number. The form is ready; no details have been sent or stored.");
      return;
    }

    const text = [
      "New website enquiry — " + SITE.name,
      "Name: " + name,
      "Phone: " + phone,
      "Business type: " + business,
      "Requirement: " + message,
    ].join("\n");
    window.open(whatsappUrl + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
    setFormMessage(te ? "WhatsApp తెరుచుకుంటుంది. అక్కడ Send నొక్కండి." : "WhatsApp is opening with your enquiry. Press Send there to submit it.");
    event.currentTarget.reset();
  }

  const demoLink = (value: string) => configured(value) ? value : "";

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label={SITE.name + " home"}>
            <span className="brand-mark">AA</span>
            <span className="brand-name">{SITE.name}</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((item) => <a key={item.href} href={item.href}>{te ? item.te : item.en}</a>)}
          </nav>

          <div className="header-contact">
            {configured(SITE.phone) ? <a href={"tel:" + SITE.phone}><Phone size={13} /> {SITE.phone}</a> : <span><Phone size={13} /> [MY_NUMBER]</span>}
            {configured(SITE.email) ? <a href={"mailto:" + SITE.email}><Mail size={13} /> {SITE.email}</a> : <span><Mail size={13} /> [MY_EMAIL]</span>}
          </div>

          <div className="header-actions">
            <button className="language-toggle" onClick={() => setLanguage(te ? "en" : "te")} aria-label="Toggle language">
              {te ? "EN" : "తెలుగు"}
            </button>
            <a className="button button-small button-whatsapp" href={whatsappUrl}>
              <MessageCircle size={16} /> <span>{te ? "WhatsApp" : "WhatsApp"}</span>
            </a>
            <button className="menu-toggle" aria-label="Open navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-nav container" aria-label="Mobile navigation">
            {nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>{te ? item.te : item.en}</a>)}
            <a href={whatsappUrl} className="mobile-nav-cta"><MessageCircle size={16} /> WhatsApp</a>
          </nav>
        )}
      </header>

      <section className="hero-section" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> {te ? "స్థానిక వ్యాపారాల కోసం సులభమైన సాఫ్ట్‌వేర్" : "Practical software for local businesses"}</div>
            <h1>{te ? "తల్లిదండ్రులు, కస్టమర్లకు మళ్లీ మళ్లీ ఫోన్ చేయాల్సిన పని లేదు. WhatsApp చూసుకుంటుంది." : "Stop chasing parents and customers. Let WhatsApp do it."}</h1>
            <p className="hero-description">{te ? "ఫీజు రిమైండర్లు, హాజరు సమాచారం, ఆర్డర్లు, enquiries — స్కూల్స్, షాప్స్, క్లినిక్స్ కోసం ఆటోమేటిక్‌గా నిర్వహించండి." : "Fee reminders, attendance alerts, orders and enquiries handled automatically for schools, shops and clinics."}</p>
            <div className="hero-buttons">
              <a className="button button-primary" href={whatsappUrl}><MessageCircle size={18} /> {te ? "WhatsApp లో మాట్లాడండి" : "Chat on WhatsApp"}</a>
              <a className="button button-outline" href="#demos">{te ? "లైవ్ డెమో చూడండి" : "See live demo"} <ArrowUpRight size={17} /></a>
            </div>
            <div className="trust-points">
              <span><Check size={15} /> {te ? "తెలుగు సపోర్ట్" : "Telugu support"}</span>
              <span><Check size={15} /> WhatsApp-first</span>
              <span><Check size={15} /> {te ? "చెల్లించే ముందు డెమో" : "Demo before you pay"}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustration of a school and shop receiving WhatsApp updates">
            <div className="visual-glow" />
            <div className="visual-card visual-main-card">
              <div className="visual-card-top"><span className="visual-icon"><MessageCircle size={19} /></span><span className="live-label"><i /> WhatsApp update</span></div>
              <div className="message-bubble">
                <small>{te ? "తల్లిదండ్రులకు సందేశం" : "Message to parent"}</small>
                <strong>{te ? "ఈ రోజు హాజరు నమోదు అయింది." : "Attendance recorded for today."}</strong>
                <span>{te ? "మీ పిల్లల హాజరు వివరాలు స్కూల్ ద్వారా పంపబడ్డాయి." : "Your child's attendance update is shared by the school."}</span>
                <time>Sample message</time>
              </div>
              <div className="visual-divider" />
              <div className="visual-order-row"><span className="visual-mini-icon"><ShoppingBag size={16} /></span><span><b>{te ? "కొత్త ఆర్డర్" : "New shop order"}</b><small>{te ? "కస్టమర్ WhatsApp ద్వారా పంపారు" : "Received through WhatsApp"}</small></span><span className="order-status">{te ? "కొత్తది" : "New"}</span></div>
            </div>
            <div className="floating-note note-one"><span className="note-icon"><GraduationCap size={17} /></span><span><b>{te ? "స్కూల్ అప్డేట్స్" : "School updates"}</b><small>{te ? "తల్లిదండ్రులకు సమాచారం" : "Parents stay informed"}</small></span></div>
            <div className="floating-note note-two"><span className="note-icon note-green"><ShoppingBag size={17} /></span><span><b>{te ? "షాప్ ఆర్డర్లు" : "Shop orders"}</b><small>{te ? "ఒకే చోట వివరాలు" : "Details in one place"}</small></span></div>
            <div className="visual-caption">{te ? "నమూనా మాత్రమే — నిజమైన కస్టమర్ డేటా కాదు." : "Illustrative sample — not live customer data."}</div>
          </div>
        </div>
        <div className="container hero-bottom"><span>{te ? "Giddalur, Markapuram, Cumbum మరియు సమీప ప్రాంతాలు" : "Serving Giddalur, Markapuram, Cumbum and nearby"}</span><span className="hero-bottom-line" /><span>{te ? "హైదరాబాద్ స్కూల్స్ కూడా" : "Also serving schools in Hyderabad"}</span></div>
      </section>

      <section className="section section-soft" id="services">
        <div className="container">
          <div className="section-heading">
            <div><span className="section-kicker">{te ? "మేము అందించే సేవలు" : "What I can build"}</span><h2>{te ? "మీ రోజువారీ పనులను సులభం చేసే సాఫ్ట్‌వేర్" : "Useful software for everyday business work."}</h2></div>
            <p>{te ? "పెద్ద కంపెనీలకు మాత్రమే కాదు. స్థానిక స్కూల్స్, షాప్స్, క్లినిక్స్ కూడా ఉపయోగించగల సులభమైన పరిష్కారాలు." : "Straightforward tools for schools, shops and clinics — scoped to what you actually need."}</p>
          </div>
          <div className="service-grid">
            <article className="service-card service-card-featured" id="service-schools">
              <div className="service-icon"><School size={23} /></div><span className="service-number">01 / SCHOOLS</span>
              <h3>{te ? "స్కూల్ & కాలేజ్ మేనేజ్‌మెంట్" : "School & College Management"}</h3>
              <p>{te ? "ఫీజులు, హాజరు, పరీక్షల ఫలితాలు, విద్యార్థుల వివరాలు మరియు తల్లిదండ్రులకు WhatsApp సమాచారం — ఒకే సిస్టమ్‌లో." : "Manage fees, attendance, results and student details in one place. Share useful updates with parents on WhatsApp."}</p>
              <a href="#school-software" className="text-link">{te ? "స్కూల్ సాఫ్ట్‌వేర్ వివరాలు" : "Explore school software"} <ArrowRight size={16} /></a>
            </article>
            <article className="service-card" id="service-whatsapp">
              <div className="service-icon service-icon-green"><MessageCircle size={23} /></div><span className="service-number">02 / SHOPS & CLINICS</span>
              <h3>{te ? "షాప్స్ & క్లినిక్స్ కోసం WhatsApp ఆటోమేషన్" : "WhatsApp Automation for Shops and Clinics"}</h3>
              <p>{te ? "కస్టమర్ enquiries, ఆర్డర్లు, అపాయింట్‌మెంట్ రిమైండర్లు మరియు ఫాలో-అప్ మెసేజ్‌లను సులభంగా నిర్వహించండి." : "Handle customer enquiries, orders, appointment reminders and follow-up messages with less manual work."}</p>
              <a href="#contact" className="text-link">{te ? "మీ అవసరం చెప్పండి" : "Discuss your requirement"} <ArrowRight size={16} /></a>
            </article>
            <article className="service-card" id="service-websites">
              <div className="service-icon service-icon-violet"><Globe size={23} /></div><span className="service-number">03 / LOCAL BUSINESS</span>
              <h3>{te ? "స్థానిక వ్యాపారాల కోసం వెబ్‌సైట్లు" : "Websites for Local Business"}</h3>
              <p>{te ? "మొబైల్‌లో బాగా పనిచేసే వెబ్‌సైట్, మీ సేవల వివరాలు, ఫోన్, WhatsApp మరియు enquiries కోసం సులభమైన మార్గం." : "A clean mobile-friendly website that explains your services and makes it easy for customers to call or message you."}</p>
              <a href="#pricing" className="text-link">{te ? "ధరలు చూడండి" : "View pricing"} <ArrowRight size={16} /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="section school-section" id="school-software">
        <div className="container school-layout">
          <div className="school-copy">
            <span className="section-kicker">{te ? "స్కూల్స్ కోసం ప్రత్యేకంగా" : "For schools and colleges"}</span>
            <h2>{te ? "ఫీజులు, హాజరు, తల్లిదండ్రుల సమాచారం — అన్నీ సులభంగా నిర్వహించండి." : "Spend less time following up. Keep school information organised."}</h2>
            <p>{te ? "స్కూల్ ఆఫీస్, టీచర్స్, తల్లిదండ్రులకు అవసరమైన రోజువారీ సమాచారం ఒకే చోట అందుబాటులో ఉండేలా సిస్టమ్ రూపొందించవచ్చు." : "A school management system can bring everyday administration into one place, with clear updates for staff and parents."}</p>
            <div className="school-checks">
              {[
                ["Fees management", "ఫీజుల నిర్వహణ"],
                ["Attendance records", "హాజరు వివరాలు"],
                ["Parent WhatsApp updates", "తల్లిదండ్రులకు WhatsApp సమాచారం"],
                ["Exam results", "పరీక్షల ఫలితాలు"],
                ["Student tracking", "విద్యార్థుల పురోగతి"],
              ].map((item) => <div key={item[0]}><Check size={17} /> {te ? item[1] : item[0]}</div>)}
            </div>
            <a className="button button-primary" href="#contact">{te ? "ఉచిత డెమో పొందండి" : "Get a free demo"} <ArrowUpRight size={17} /></a>
          </div>
          <div className="school-feature-panel">
            <div className="school-panel-header"><span className="panel-brand"><BookOpen size={18} /> {te ? "విద్యార్థి వివరాలు" : "Student overview"}</span><span className="panel-demo-label">{te ? "డెమో ఉదాహరణ" : "Sample layout"}</span></div>
            <div className="student-profile"><div className="student-avatar">S</div><div><strong>{te ? "విద్యార్థి ప్రొఫైల్" : "Student profile"}</strong><small>{te ? "తరగతి, సెక్షన్, వివరాలు" : "Class, section and details"}</small></div><span className="profile-dot" /></div>
            <div className="school-data-list">
              <div><span>{te ? "అసైన్‌మెంట్లు" : "Assignments"}</span><span className="data-pill">01</span></div>
              <div><span>{te ? "ప్రాజెక్టులు" : "Projects"}</span><span className="data-pill">02</span></div>
              <div><span>{te ? "కార్యకలాపాలు" : "Activities"}</span><span className="data-pill">03</span></div>
              <div><span>{te ? "సాంస్కృతిక కార్యక్రమాలు" : "Culturals"}</span><span className="data-pill">04</span></div>
              <div><span>{te ? "క్రీడలు" : "Sports"}</span><span className="data-pill">05</span></div>
            </div>
            <div className="parent-update"><MessageCircle size={18} /><span><b>{te ? "తల్లిదండ్రులకు అప్డేట్" : "Parent update"}</b><small>{te ? "అవసరమైన సమాచారం WhatsApp ద్వారా" : "Share important information on WhatsApp"}</small></span><ArrowUpRight size={16} /></div>
            <p className="panel-footnote">{te ? "చిత్రం వివరణ కోసం మాత్రమే. నిజమైన విద్యార్థుల డేటా కాదు." : "Illustrative demo layout — not real student data."}</p>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="demos">
        <div className="container">
          <div className="section-heading">
            <div><span className="section-kicker">{te ? "పని ఉదాహరణలు" : "See the idea in action"}</span><h2>{te ? "డెమో ప్రాజెక్టులు" : "Demo projects"}</h2></div>
            <p>{te ? "ఇవి చూపించడానికి తయారు చేసిన డెమోలు. నిజమైన కస్టమర్ ప్రాజెక్టులుగా చూపించడం లేదు." : "Demonstration projects to show the kind of software that can be built. These are not presented as client deployments."}</p>
          </div>
          <div className="demo-grid">
            <article className="demo-card">
              <div className="demo-art supermarket-art"><div className="shop-window"><span>SS</span><b>Sri Sai<br />Supermarket</b><small>Giddalur</small></div><div className="demo-art-bag"><ShoppingBag size={48} /></div><div className="demo-art-spark">✳</div></div>
              <div className="demo-card-body"><div className="demo-label">DEMO PROJECT</div><h3>Sri Sai Supermarket ordering app</h3><p>{te ? "వస్తువులు వెతకడం, కార్ట్‌లో వేయడం, WhatsApp ద్వారా ఆర్డర్ పంపడం." : "Browse products, add items to a cart and prepare an order for WhatsApp."}</p>
                {demoLink(SITE.supermarketDemo) ? <a className="text-link" href={SITE.supermarketDemo} target="_blank" rel="noreferrer">Open demo <ArrowUpRight size={16} /></a> : <span className="demo-placeholder">Add public demo URL: [DEMO_LINK]</span>}
              </div>
            </article>
            <article className="demo-card">
              <div className="demo-art school-art"><div className="school-art-building"><div className="school-roof" /><div className="school-building"><span /><span /><span /><span /><b>SCHOOL</b></div></div><div className="school-art-book"><BookOpen size={35} /></div><div className="school-art-sun" /></div>
              <div className="demo-card-body"><div className="demo-label">DEMO PROJECT</div><h3>School management</h3><p>{te ? "ఫీజులు, హాజరు, విద్యార్థుల వివరాలు మరియు తల్లిదండ్రుల సమాచారం కోసం డెమో." : "A sample school system for fees, attendance, student records and parent updates."}</p>
                {demoLink(SITE.schoolDemo) ? <a className="text-link" href={SITE.schoolDemo} target="_blank" rel="noreferrer">Open demo <ArrowUpRight size={16} /></a> : <span className="demo-placeholder">Add demo link or screenshot: [DEMO_LINK/SCREENSHOT]</span>}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="how-we-work">
        <div className="container">
          <div className="section-heading">
            <div><span className="section-kicker">{te ? "పని చేసే విధానం" : "How we work"}</span><h2>{te ? "మూడు సులభమైన దశలు" : "A clear process, from first call to launch."}</h2></div>
            <p>{te ? "ముందుగా మీ అవసరం అర్థం చేసుకుంటాను. తర్వాత డెమో చూపించి, అంగీకరించిన పనిని నిర్మిస్తాను." : "You speak directly with the person planning and building your project."}</p>
          </div>
          <div className="steps-grid">
            <article className="step-card"><span>01</span><h3>{te ? "మాట్లాడి అర్థం చేసుకోవడం" : "Talk and understand"}</h3><p>{te ? "మీ ప్రస్తుత పని విధానం, సమస్యలు, అవసరాలు తెలుసుకుంటాను." : "We discuss how you work today and what you want to improve."}</p></article>
            <article className="step-card"><span>02</span><h3>{te ? "డెమో చూపించడం" : "Plan and show a demo"}</h3><p>{te ? "మీ అవసరానికి సరిపోయే నమూనా చూపించి, పని పరిధి మరియు ధర వివరిస్తాను." : "I show a relevant demo and explain the scope, timeline and quote."}</p></article>
            <article className="step-card"><span>03</span><h3>{te ? "నిర్మించి ప్రారంభించడం" : "Build and launch"}</h3><p>{te ? "మీ ఆమోదం తర్వాత సాఫ్ట్‌వేర్ నిర్మించి, ఉపయోగించడం చూపిస్తాను." : "After approval, I build the agreed solution and walk you through using it."}</p></article>
          </div>
        </div>
      </section>

      <section className="founder-section">
        <div className="container founder-layout">
          <div className="founder-photo-placeholder"><div className="photo-frame"><span className="photo-symbol">[PHOTO]</span><small>{te ? "మీ నిజమైన ఫోటో ఇక్కడ జోడించండి" : "Add your real founder photo here"}</small></div></div>
          <div className="founder-copy"><span className="section-kicker">{te ? "వ్యక్తిగత పరిచయం" : "A direct line to the person doing the work"}</span><h2>{te ? "Meet " : "Meet "}{SITE.founderName}</h2>
            <p>{te ? "నేను స్వయంగా నేర్చుకుని సాఫ్ట్‌వేర్ అభివృద్ధి చేస్తున్నాను." : "I am a self-taught founder."}</p>
            <p>{te ? "ఆధునిక AI టూల్స్ ఉపయోగించి ఉపయోగకరమైన సాఫ్ట్‌వేర్ నిర్మిస్తాను." : "I build practical software with modern AI tools."}</p>
            <p>{te ? "ప్రతి ప్రాజెక్ట్‌ను మొదటి చర్చ నుంచి డెలివరీ వరకు నేనే వ్యక్తిగతంగా చూసుకుంటాను." : "I personally handle every project, from the first discussion through delivery."}</p>
            <div className="founder-note"><span className="founder-note-dot" /> {te ? "మీరు నేరుగా నాతోనే మాట్లాడుతారు." : "You work directly with me — no sales hand-off."}</div>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="pricing">
        <div className="container">
          <div className="section-heading pricing-heading">
            <div><span className="section-kicker">{te ? "స్పష్టమైన ధరలు" : "Straightforward pricing"}</span><h2>{te ? "మీ అవసరానికి సరిపోయే ప్యాకేజ్" : "Start with what you need."}</h2></div>
            <p>{te ? "ధరలు సూచన మాత్రమే. మీ అవసరాలు మాట్లాడుకున్న తర్వాత తుది ధర చెబుతాను." : "Indicative pricing only. Final quote after we discuss your requirements."}</p>
          </div>
          <div className="pricing-grid">
            <article className="price-card"><span className="price-label">LOCAL STARTER</span><h3>Local Starter</h3><div className="price-amount">{SITE.starterPrice}</div><p className="price-sub">{te ? "చిన్న స్థానిక వ్యాపారాల కోసం" : "For a local shop, clinic or service business"}</p><div className="price-list-title">Includes</div><ul><li><Check size={15} /> Mobile-friendly business website</li><li><Check size={15} /> Services, contact and WhatsApp details</li><li><Check size={15} /> Basic search setup</li></ul><div className="price-list-title not-included-title">Not included</div><ul className="not-included"><li>Domain and hosting renewal fees</li><li>Online payments or custom admin panel</li><li>Paid third-party service charges</li></ul><a href="#contact" className="button button-outline button-full">{te ? "ధర అడగండి" : "Ask about this plan"} <ArrowRight size={16} /></a></article>
            <article className="price-card price-card-featured"><span className="price-label">SCHOOLS</span><h3>School Pack</h3><div className="price-amount price-custom">{te ? "Custom quote" : "Custom quote"}</div><p className="price-sub">{te ? "స్కూల్ అవసరాలకు అనుగుణంగా" : "Scoped to your school's requirements"}</p><div className="price-list-title">Includes</div><ul><li><Check size={15} /> Fees and attendance records</li><li><Check size={15} /> Parent WhatsApp updates</li><li><Check size={15} /> Results and student tracking</li><li><Check size={15} /> Assignments, projects and activities</li></ul><div className="price-list-title not-included-title">Not included</div><ul className="not-included"><li>WhatsApp/SMS provider charges</li><li>Data migration and hardware links unless quoted</li><li>Ongoing third-party subscriptions</li></ul><a href="#contact" className="button button-primary button-full">{te ? "ఉచిత డెమో పొందండి" : "Get a free demo"} <ArrowRight size={16} /></a></article>
            <article className="price-card"><span className="price-label">CUSTOM BUILD</span><h3>Custom Project</h3><div className="price-amount price-custom">Quote</div><p className="price-sub">{te ? "ప్రత్యేక సాఫ్ట్‌వేర్ అవసరాల కోసం" : "For a specific website or software requirement"}</p><div className="price-list-title">Includes</div><ul><li><Check size={15} /> Agreed pages and features</li><li><Check size={15} /> Mobile-friendly design</li><li><Check size={15} /> Handover and usage walkthrough</li></ul><div className="price-list-title not-included-title">Not included</div><ul className="not-included"><li>Unagreed extra features</li><li>Third-party API or subscription fees</li><li>Ongoing maintenance unless quoted</li></ul><a href="#contact" className="button button-outline button-full">{te ? "ప్రాజెక్ట్ గురించి మాట్లాడండి" : "Discuss a project"} <ArrowRight size={16} /></a></article>
          </div>
          <p className="pricing-note"><Check size={15} /> {te ? "ఇవి సూచన ధరలు మాత్రమే. మీ అవసరాలు చర్చించిన తర్వాత తుది కోట్ ఇస్తాను." : "Prices are indicative. Final quote will be shared after a discussion about your requirements."}</p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="container faq-layout">
          <div><span className="section-kicker">{te ? "సాధారణ ప్రశ్నలు" : "Questions, answered"}</span><h2>{te ? "ముందుగా తెలుసుకోవాల్సిన విషయాలు" : "A few things you may want to know."}</h2><p>{te ? "మీకు ఇంకేదైనా సందేహం ఉంటే నేరుగా అడగండి." : "If something is not covered here, ask me directly."}</p><a href="#contact" className="text-link">{te ? "ప్రశ్న అడగండి" : "Ask a question"} <ArrowRight size={16} /></a></div>
          <div className="faq-list">
            <details><summary>{te ? "చిన్న స్కూల్స్, షాప్స్ కోసం కూడా చేస్తారా?" : "Do you work with small schools and shops?"}<ChevronDown size={17} /></summary><p>{te ? "అవును. మీ ప్రస్తుత అవసరాలకు సరిపోయే చిన్న పరిష్కారంతో మొదలుపెట్టి, అవసరమైతే తర్వాత విస్తరించవచ్చు." : "Yes. We can start with the essentials and expand only when your business needs more."}</p></details>
            <details><summary>{te ? "తెలుగులో సపోర్ట్ ఉంటుందా?" : "Can you support Telugu communication?"}<ChevronDown size={17} /></summary><p>{te ? "అవును. అవసరాన్ని బట్టి సాఫ్ట్‌వేర్‌లో తెలుగు లేబుల్స్, WhatsApp సందేశాలు ఏర్పాటు చేయవచ్చు." : "Yes. Telugu labels and WhatsApp messages can be included where needed."}</p></details>
            <details><summary>{te ? "పని పూర్తయ్యాక సపోర్ట్ ఎలా ఉంటుంది?" : "What support is available after delivery?"}<ChevronDown size={17} /></summary><p>{te ? "WhatsApp ద్వారా సపోర్ట్ అందిస్తాను. పని దినాల్లో 24 గంటల్లోపు సమాధానం ఇస్తాను." : "WhatsApp support is available. I reply within 24 hours on working days."}</p></details>
            <details><summary>{te ? "ప్రోటోటైప్ కంటే లైవ్ సాఫ్ట్‌వేర్ ఖర్చు ఎందుకు ఎక్కువ?" : "Why does going live cost more than a prototype?"}<ChevronDown size={17} /></summary><p>{te ? "డెమోలో ప్రధాన స్క్రీన్లు, విధానం చూపిస్తాం. నిజంగా ఉపయోగించే సాఫ్ట్‌వేర్ కోసం డేటా, యూజర్ యాక్సెస్, పరీక్షలు, భద్రత, హోస్టింగ్ మరియు ప్రారంభ సహాయం అవసరం. అందుకే తుది ధర డెమో కంటే ఎక్కువ కావచ్చు." : "A prototype shows the idea. A live system also needs real data setup, user access, testing, security checks, hosting and launch support. That additional work is included in the final scope and quote."}</p></details>
          </div>
        </div>
      </section>

      <section className="local-section">
        <div className="container local-inner">
          <div className="local-icon"><MapPin size={22} /></div>
          <div><span className="section-kicker">{te ? "స్థానికంగా అందుబాటులో" : "Local service area"}</span><h2>{te ? "Giddalur, Markapuram, Cumbum మరియు సమీప ప్రాంతాలు" : "Serving Giddalur, Markapuram, Cumbum and nearby."}</h2><p>{te ? "ప్రకాశం జిల్లాలోని స్థానిక వ్యాపారాలు, అలాగే హైదరాబాద్‌లోని స్కూల్స్ కోసం." : "For local businesses in Prakasam district and schools in Hyderabad."}</p></div>
          <a className="button button-outline" href="#contact">{te ? "మాట్లాడండి" : "Talk to me"} <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-layout">
          <div className="contact-copy">
            <span className="section-kicker">{te ? "సంప్రదించండి" : "Let's discuss your requirement"}</span>
            <h2>{te ? "మీ పని సులభం చేయడానికి ఏ సాఫ్ట్‌వేర్ కావాలి?" : "Tell me what you want to make easier."}</h2>
            <p>{te ? "మీ అవసరం పంపండి. మీకు సరిపోయే పరిష్కారం, డెమో మరియు అంచనా ధర గురించి మాట్లాడుకుందాం." : "Share a few details. I will get back to understand the requirement and discuss a suitable demo and quote."}</p>
            <div className="contact-methods">
              <div><span className="contact-method-icon"><Phone size={17} /></span><span><small>Phone / WhatsApp</small>{configured(SITE.phone) ? <a href={"tel:" + SITE.phone}>{SITE.phone}</a> : <b>[MY_NUMBER]</b>}</span></div>
              <div><span className="contact-method-icon"><Mail size={17} /></span><span><small>Email</small>{configured(SITE.email) ? <a href={"mailto:" + SITE.email}>{SITE.email}</a> : <b>[MY_EMAIL]</b>}</span></div>
              <div><span className="contact-method-icon"><Clock3 size={17} /></span><span><small>Support</small><b>{te ? "పని దినాల్లో 24 గంటల్లోపు సమాధానం" : "Reply within 24 hours on working days"}</b></span></div>
            </div>
          </div>
          <form className="contact-form" onSubmit={submitLead}>
            <h3>{te ? "మీ వివరాలు పంపండి" : "Send an enquiry"}</h3>
            <label>Your name / పేరు<input name="name" required placeholder="Enter your name" /></label>
            <label>Phone number / ఫోన్ నంబర్<input name="phone" required type="tel" inputMode="tel" placeholder="Your mobile number" /></label>
            <label>Business type / వ్యాపారం
              <select name="business" required defaultValue=""><option value="" disabled>Select one</option><option>School / College</option><option>Shop / Supermarket</option><option>Clinic</option><option>Other local business</option></select>
            </label>
            <label>What do you need? / మీ అవసరం<textarea name="message" required rows={4} placeholder="Briefly describe what you want to improve…" /></label>
            <button className="button button-primary button-full" type="submit">{te ? "WhatsApp ద్వారా పంపండి" : "Send enquiry on WhatsApp"} <ArrowUpRight size={17} /></button>
            {formMessage && <p className="form-message" role="status">{formMessage}</p>}
            <small className="form-note">This form opens WhatsApp with your details. It does not save enquiries on this website.</small>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand-block"><a className="brand footer-brand" href="#top"><span className="brand-mark">AA</span><span className="brand-name">{SITE.name}</span></a><p>{te ? "స్కూల్స్, షాప్స్, క్లినిక్స్ కోసం సులభమైన సాఫ్ట్‌వేర్ మరియు WhatsApp పరిష్కారాలు." : "Practical websites, school software and WhatsApp automation for local businesses."}</p><div className="footer-location"><MapPin size={15} /> Giddalur • Markapuram • Cumbum • Hyderabad schools</div></div>
          <div className="footer-links"><strong>{te ? "త్వరిత లింకులు" : "Quick links"}</strong>{nav.map((item) => <a key={item.href} href={item.href}>{te ? item.te : item.en}</a>)}</div>
          <div className="footer-contact"><strong>{te ? "సంప్రదించండి" : "Contact"}</strong>{configured(SITE.phone) ? <a href={"tel:" + SITE.phone}>{SITE.phone}</a> : <span>[MY_NUMBER]</span>}{configured(SITE.email) ? <a href={"mailto:" + SITE.email}>{SITE.email}</a> : <span>[MY_EMAIL]</span>}<a href={whatsappUrl}>WhatsApp</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 {SITE.name}. All rights reserved.</span><span>Built personally by the founder.</span></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl} aria-label="Chat on WhatsApp"><MessageCircle size={22} /><span>WhatsApp</span></a>
    </main>
  );
}
