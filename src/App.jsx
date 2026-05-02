import { useState, useEffect, useCallback } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const WEEKDAYS_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// PFS brand colors
const COLORS = {
  ocean: "#0A6E8A",
  oceanDark: "#064E63",
  oceanLight: "#E0F4F8",
  sand: "#F5E6D3",
  coral: "#E8734A",
  foam: "#F0F9FB",
  seaweed: "#2D8B5E",
  drift: "#8B7355",
  deep: "#0B2D3A",
  white: "#FFFFFF",
  gray100: "#F7F8FA",
  gray200: "#E8ECF0",
  gray300: "#CDD4DB",
  gray500: "#7A8A97",
  gray700: "#3D4F5C",
  gray900: "#1A2B35",
};

// Awareness days relevant to PFS — sourced from Dana's calendar, eco-calendar, and HandsOnHK
const AWARENESS_DAYS = [
  // January
  { month: 1, day: 1, title: "New Year - Ocean Resolutions Post", icon: "🎆", type: "awareness" },
  // February
  { month: 2, day: 2, title: "World Wetlands Day", icon: "🌿", type: "awareness" },
  { month: 2, day: 6, title: "Chinese New Year Post", icon: "🧧", type: "awareness" },
  // March
  { month: 3, day: 18, title: "Global Recycling Day", icon: "♻️", type: "awareness" },
  { month: 3, day: 22, title: "World Water Day", icon: "💧", type: "awareness" },
  { month: 3, day: 30, title: "International Day of Zero Waste", icon: "🚯", type: "awareness" },
  // April
  { month: 4, day: 22, title: "Earth Day", icon: "🌍", type: "awareness" },
  // May
  { month: 5, day: 23, title: "World Turtle Day", icon: "🐢", type: "awareness" },
  // June
  { month: 6, day: 1, title: "World Reef Awareness Day", icon: "🪸", type: "awareness" },
  { month: 6, day: 5, title: "World Environment Day", icon: "🌱", type: "awareness" },
  { month: 6, day: 8, title: "World Ocean Day", icon: "🐋", type: "awareness" },
  { month: 6, day: 16, title: "Sea Turtle Day / World Refill Day", icon: "🐢", type: "awareness" },
  // July
  { month: 7, day: 1, title: "Plastic Free July Begins 🗓️", icon: "🚫", type: "campaign" },
  { month: 7, day: 3, title: "Intl Plastic Bag Free Day", icon: "🛍️", type: "awareness" },
  { month: 7, day: 4, title: "No Butt's Day (Cigarette Butts)", icon: "🚬", type: "campaign" },
  { month: 7, day: 14, title: "Shark Awareness Day", icon: "🦈", type: "awareness" },
  { month: 7, day: 26, title: "Intl Day for Mangrove Conservation", icon: "🌳", type: "awareness" },
  // September
  { month: 9, day: 20, title: "Intl Coastal Cleanup Day (3rd Sat)", icon: "🏖️", type: "awareness" },
  { month: 9, day: 25, title: "Mid-Autumn Festival Post", icon: "🥮", type: "awareness" },
  // October
  { month: 10, day: 1, title: "Great Global Nurdle Hunt Begins 🗓️", icon: "🔍", type: "campaign" },
  { month: 10, day: 4, title: "No Disposable Cup Day", icon: "☕", type: "awareness" },
  // November
  { month: 11, day: 8, title: "Call to Earth Day (CNN)", icon: "📡", type: "awareness" },
  // December
  { month: 12, day: 25, title: "Christmas Post", icon: "🎄", type: "awareness" },
  { month: 12, day: 31, title: "New Year's / Year in Review Post", icon: "🎆", type: "awareness" },
];

// Specific HandsOnHK / PFS events (manually updated from HandsOnHK calendar)
const HOHK_EVENTS = [
  { year: 2026, month: 5, day: 16, title: "Serve-a-thon: Mangrove & Beach Cleanup + Biodiversity Talk (Pak Nai)", icon: "🌿", type: "cleanup" },
  { year: 2026, month: 5, day: 30, title: "Beach Cleaning in Cheung Sha Lan (HandsOnHK)", icon: "🏖️", type: "cleanup" },
];

// Recurring monthly events — spaced ~1.5 weeks apart
// School roundup posts on the 5th; HandsOnHK cleanup on 3rd Saturday (~17th–21st)
const RECURRING = [
  { dayOfMonth: 5, title: "School Talks & Workshops Roundup (Previous Month)", icon: "🏫", type: "roundup" },
  { weekOfMonth: 3, dayOfWeek: 6, title: "HandsOnHK Community Beach Cleanup", icon: "🏖️", type: "cleanup" },
];

// Partner handles database
const PARTNER_HANDLES = {
  "handsonhk": { ig: "@handsonhongkong", fb: "HandsOnHongKong", li: "HandsOn Hong Kong" },
  "hands on hk": { ig: "@handsonhongkong", fb: "HandsOnHongKong", li: "HandsOn Hong Kong" },
  "hands on hong kong": { ig: "@handsonhongkong", fb: "HandsOnHongKong", li: "HandsOn Hong Kong" },
  "ocean park": { ig: "@oceanparkhk", fb: "OceanParkHongKong", li: "Ocean Park Hong Kong" },
  "wwf": { ig: "@wwf_hk", fb: "wwfhk", li: "WWF Hong Kong" },
  "green monday": { ig: "@greenmonday", fb: "GreenMondayHK", li: "Green Monday" },
  "greenpeace": { ig: "@greenpeace", fb: "greenpeace", li: "Greenpeace" },
  "hku": { ig: "@haborku", fb: "haborku", li: "The University of Hong Kong" },
  "swire": { ig: "@swiregroup", fb: "SwireGroup", li: "Swire" },
  "cathay pacific": { ig: "@cathaypacific", fb: "cathaypacific", li: "Cathay Pacific" },
  "hsbc": { ig: "@hsbc", fb: "HSBC", li: "HSBC" },
};

// Hashtag sets
const HASHTAGS = {
  core: ["#PlasticFreeSeas", "#無塑海洋", "#PlasticPollution", "#SaveOurOcean", "#HongKong", "#香港"],
  cleanup: ["#BeachCleanupHK", "#淨灘", "#海灘清潔", "#CoastalCleanup", "#VolunteerHK", "#義工", "#OceanAction", "#PlasticFree", "#走塑"],
  education: ["#OceanEducation", "#海洋教育", "#SayNoToSingleUse", "#走塑生活", "#EcoHK", "#環保", "#SustainabilityHK", "#可持續發展"],
  corporate: ["#CSRHongKong", "#企業社會責任", "#ESG", "#CorporateSustainability", "#可持續發展", "#SustainableBusiness"],
  awareness: ["#WorldOceanDay", "#世界海洋日", "#EarthDay", "#地球日", "#EnvironmentDay", "#環境日", "#ActForOceans", "#ClimateAction", "#氣候行動"],
};

// Creative guidance rules
function getCreativeGuidance(description, imageCount) {
  const tips = [];
  const desc = description.toLowerCase();

  if (imageCount >= 3) {
    tips.push({ icon: "📸", text: "With " + imageCount + " photos, a carousel post is ideal — carousels get 1.4x more reach and 3.1x more engagement than single images on Instagram.", priority: "high" });
  } else if (imageCount === 1) {
    tips.push({ icon: "📸", text: "Consider adding more photos if available — carousel posts consistently outperform single images. Even 3 photos make a difference.", priority: "medium" });
  }

  if (desc.includes("cleanup") || desc.includes("clean up") || desc.includes("beach")) {
    tips.push({ icon: "📊", text: "Include a specific stat (e.g. '42kg of plastic collected by 30 volunteers'). PFS's best-performing posts always include concrete numbers.", priority: "high" });
    tips.push({ icon: "📷", text: "Before/after photos of the beach get significantly more engagement. If you have them, lead with the 'after' (clean beach) in the first slide.", priority: "medium" });
  }

  if (desc.includes("school") || desc.includes("student") || desc.includes("talk") || desc.includes("education")) {
    tips.push({ icon: "💬", text: "Include a student quote if possible — 'One student told us...' posts humanise the mission and get high shares from parents.", priority: "high" });
    tips.push({ icon: "🏫", text: "Tag the school's account to get reshares and reach parents in their network.", priority: "medium" });
  }

  if (desc.includes("corporate") || desc.includes("company") || desc.includes("csr") || desc.includes("partner")) {
    tips.push({ icon: "🤝", text: "Tag the corporate partner — their reshare could expose PFS to thousands of their employees and followers.", priority: "high" });
    tips.push({ icon: "📈", text: "Frame this around ESG impact metrics for LinkedIn. Companies love reposting content that showcases their sustainability efforts.", priority: "medium" });
  }

  if (desc.includes("volunteer")) {
    tips.push({ icon: "🙌", text: "Spotlight a specific volunteer by name (with permission) — personal stories drive 2x more comments than general group posts.", priority: "medium" });
  }

  // General tips
  tips.push({ icon: "⏰", text: "Best posting times for HK: Wed–Fri, 12–2pm or 7–9pm HKT. Weekend mornings also work well for cleanup content.", priority: "info" });

  // Post vs Story recommendation
  if (desc.length < 50 && imageCount <= 2) {
    tips.push({ icon: "📱", text: "This might work better as an Instagram Story (add to Highlights!) rather than a feed post — short updates with few images feel more natural in Stories.", priority: "medium" });
  } else {
    tips.push({ icon: "📱", text: "This has enough substance for a full feed post across all platforms. Consider also sharing a behind-the-scenes Story to drive traffic to the post.", priority: "info" });
  }

  return tips;
}

// Detect partners mentioned in description
function detectPartners(description) {
  const desc = description.toLowerCase();
  const found = [];
  for (const [key, handles] of Object.entries(PARTNER_HANDLES)) {
    if (desc.includes(key)) {
      found.push({ name: key, ...handles });
    }
  }
  return found;
}

// Generate captions in PFS tone
function generateCaptions(description, eventType, partners) {
  const partnerTagIG = partners.map(p => p.ig).join(" ");
  const partnerTagFB = partners.map(p => p.fb).join(", ");
  const partnerTagLI = partners.map(p => p.li).join(", ");

  const hashtagSet = eventType === "cleanup" ? [...HASHTAGS.core, ...HASHTAGS.cleanup]
    : eventType === "education" ? [...HASHTAGS.core, ...HASHTAGS.education]
    : eventType === "roundup" ? [...HASHTAGS.core, ...HASHTAGS.education]
    : eventType === "corporate" ? [...HASHTAGS.core, ...HASHTAGS.corporate]
    : eventType === "awareness" ? [...HASHTAGS.core, ...HASHTAGS.awareness]
    : [...HASHTAGS.core, ...HASHTAGS.cleanup];

  // Vary caption body by event type
  const igBody = eventType === "roundup"
    ? `${description}\n\nAnother month of inspiring the next generation to protect our oceans! 🌊📚 Every classroom we visit brings us closer to a plastic-free Hong Kong.\n每一間教室，都讓我們更接近無塑香港 💙`
    : eventType === "cleanup"
    ? `${description}\n\nEvery piece of plastic removed from our beaches is a step toward cleaner oceans for Hong Kong 🌊\n每一塊被撿起的塑膠，都是香港海洋的希望 💪`
    : eventType === "awareness"
    ? `${description}\n\nToday we stand with communities around the world to protect our oceans 🌍💙\n今天我們與全球社區一起守護海洋`
    : `${description}\n\nEvery piece of plastic removed from our beaches is a step toward cleaner oceans for Hong Kong 🌊`;

  const igCaption = `${igBody}\n\n${partners.length > 0 ? `Thank you to our partners ${partnerTagIG} for making this possible! 🙌\n\n` : ""}Join us at our next event — link in bio 👆\n\n${hashtagSet.slice(0, 15).join(" ")}`;

  const fbBody = eventType === "roundup"
    ? `${description}\n\nEducation is at the heart of everything we do at Plastic Free Seas. Last month, our team visited schools across Hong Kong to teach students about plastic pollution and what they can do to make a difference. The energy and enthusiasm from these young ocean advocates never fails to inspire us!`
    : `${description}\n\nAt Plastic Free Seas, we believe every action counts. Whether it's picking up one bottle or educating one classroom, we're building a movement for cleaner oceans in Hong Kong.`;

  const fbCaption = `${fbBody}\n\n${partners.length > 0 ? `A huge thank you to ${partnerTagFB} for their support and partnership! ` : ""}Want to get involved? Visit our website to sign up for our next event or learn how your organisation can partner with us.\n\n🔗 www.plasticfreeseas.com`;

  const liBody = eventType === "roundup"
    ? `${description}\n\nPlastic Free Seas' education programme continues to grow. Since 2013, we've reached nearly 100,000 students across 280+ schools in Hong Kong, equipping the next generation with the knowledge to drive meaningful change in how we produce, consume, and dispose of plastic.`
    : `${description}\n\nPlastic Free Seas continues its mission to reduce plastic pollution through education and community action in Hong Kong. Since 2013, we've reached nearly 100,000 students across 280+ schools and mobilised thousands of volunteers for coastal cleanups.`;

  const liCaption = `${liBody}\n\n${partners.length > 0 ? `We're grateful to work alongside ${partnerTagLI} in this effort. ` : ""}Organisations interested in CSR partnerships or educational programmes can reach out to learn more about how we can work together to create measurable environmental impact.\n\n${HASHTAGS.core.slice(0, 6).join(" ")} ${HASHTAGS.corporate.slice(0, 3).join(" ")}`;

  return { ig: igCaption, fb: fbCaption, li: liCaption };
}

// Get calendar events for a given month/year
function getCalendarEvents(year, month) {
  const events = [];

  // Awareness days
  AWARENESS_DAYS.forEach(ad => {
    if (ad.month === month + 1) {
      events.push({ day: ad.day, ...ad });
    }
  });

  // Recurring events
  RECURRING.forEach(rec => {
    if (rec.weekOfMonth && rec.dayOfWeek !== undefined) {
      // Find nth occurrence of dayOfWeek
      let count = 0;
      for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
        if (new Date(year, month, d).getDay() === rec.dayOfWeek) {
          count++;
          if (count === rec.weekOfMonth) {
            events.push({ day: d, ...rec, type: rec.type });
            break;
          }
        }
      }
    } else if (rec.dayOfMonth) {
      const maxDay = new Date(year, month + 1, 0).getDate();
      if (rec.dayOfMonth <= maxDay) {
        events.push({ day: rec.dayOfMonth, ...rec, type: rec.type });
      }
    }
  });

  // Specific HandsOnHK events (manually updated)
  HOHK_EVENTS.forEach(evt => {
    if (evt.year === year && evt.month === month + 1) {
      events.push({ day: evt.day, ...evt });
    }
  });

  return events;
}

// ─── Icons (inline SVG) ───
const Icons = {
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Palette: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Image: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
    </svg>
  ),
  Info: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Wave: () => (
    <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" style={{display:'block'}}>
      <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill={COLORS.oceanLight} opacity="0.5"/>
      <path d="M0,35 C300,55 500,15 700,35 C900,55 1100,15 1200,35 L1200,60 L0,60 Z" fill={COLORS.oceanLight} opacity="0.3"/>
    </svg>
  ),
};

// ─── Styles ───
const styles = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: `linear-gradient(180deg, ${COLORS.foam} 0%, ${COLORS.white} 100%)`,
    minHeight: "100vh",
    color: COLORS.gray900,
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.oceanDark} 0%, ${COLORS.ocean} 60%, ${COLORS.seaweed} 100%)`,
    padding: "20px 24px 0",
    color: COLORS.white,
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    backdropFilter: "blur(8px)",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.3px",
  },
  logoSub: {
    fontSize: "11px",
    fontWeight: "400",
    opacity: 0.7,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  nav: {
    display: "flex",
    gap: "4px",
  },
  navBtn: (active) => ({
    padding: "10px 18px",
    border: "none",
    background: active ? "rgba(255,255,255,0.18)" : "transparent",
    color: COLORS.white,
    borderRadius: "10px 10px 0 0",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    transition: "all 0.2s",
    opacity: active ? 1 : 0.7,
    fontFamily: "inherit",
    borderBottom: active ? `2px solid ${COLORS.coral}` : "2px solid transparent",
  }),
  content: {
    padding: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  // Calendar
  calendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  monthNav: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  monthNavBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: `1px solid ${COLORS.gray200}`,
    background: COLORS.white,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: COLORS.gray700,
    transition: "all 0.15s",
  },
  monthTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: COLORS.deep,
    minWidth: "200px",
    textAlign: "center",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "1px",
    background: COLORS.gray200,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  calDayHeader: {
    background: COLORS.oceanDark,
    color: "rgba(255,255,255,0.8)",
    padding: "10px 4px",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  calDay: (isToday, isEmpty, hasEvent) => ({
    background: isToday ? COLORS.oceanLight : isEmpty ? COLORS.gray100 : COLORS.white,
    padding: "8px 6px",
    minHeight: "90px",
    position: "relative",
    cursor: hasEvent ? "pointer" : "default",
    transition: "background 0.15s",
  }),
  calDayNum: (isToday) => ({
    fontSize: "13px",
    fontWeight: isToday ? "700" : "400",
    color: isToday ? COLORS.ocean : COLORS.gray700,
    marginBottom: "4px",
    width: isToday ? "24px" : "auto",
    height: isToday ? "24px" : "auto",
    borderRadius: "50%",
    background: isToday ? COLORS.ocean : "transparent",
    color: isToday ? COLORS.white : COLORS.gray700,
    display: isToday ? "flex" : "block",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: isToday ? "24px" : "1",
  }),
  calEvent: (type) => ({
    fontSize: "10px",
    fontWeight: "500",
    padding: "3px 5px",
    borderRadius: "4px",
    marginBottom: "2px",
    lineHeight: "1.3",
    background: type === "cleanup" ? "#E8F5E9" : type === "awareness" ? "#FFF3E0" : type === "roundup" ? "#E3F2FD" : type === "campaign" ? "#FCE4EC" : "#F3E5F5",
    color: type === "cleanup" ? "#2E7D32" : type === "awareness" ? "#E65100" : type === "roundup" ? "#1565C0" : type === "campaign" ? "#AD1457" : "#6A1B9A",
    cursor: "pointer",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }),
  legend: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: COLORS.gray700,
  },
  legendDot: (color) => ({
    width: "10px",
    height: "10px",
    borderRadius: "3px",
    background: color,
  }),
  // Create Post
  createContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    background: COLORS.white,
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: `1px solid ${COLORS.gray200}`,
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: COLORS.deep,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  inputLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: COLORS.gray500,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "6px",
    display: "block",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px 14px",
    border: `1.5px solid ${COLORS.gray200}`,
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.2s",
    lineHeight: "1.6",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${COLORS.gray200}`,
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    background: COLORS.white,
    cursor: "pointer",
    appearance: "none",
    boxSizing: "border-box",
  },
  uploadZone: {
    border: `2px dashed ${COLORS.gray300}`,
    borderRadius: "12px",
    padding: "32px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: COLORS.gray100,
  },
  uploadText: {
    fontSize: "13px",
    color: COLORS.gray500,
    marginTop: "8px",
  },
  imagePreviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: "8px",
    marginTop: "12px",
  },
  imageThumb: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    borderRadius: "8px",
    border: `1px solid ${COLORS.gray200}`,
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    background: `linear-gradient(135deg, ${COLORS.ocean}, ${COLORS.seaweed})`,
    color: COLORS.white,
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    transition: "opacity 0.2s, transform 0.15s",
    marginTop: "16px",
  },
  // Guidance
  guidanceTip: (priority) => ({
    display: "flex",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: priority === "high" ? "#FFF8E1" : priority === "medium" ? COLORS.foam : COLORS.gray100,
    borderLeft: `3px solid ${priority === "high" ? "#FFC107" : priority === "medium" ? COLORS.ocean : COLORS.gray300}`,
    marginBottom: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    color: COLORS.gray700,
  }),
  // Platform previews
  platformTab: (active, platform) => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? "600" : "400",
    fontFamily: "inherit",
    transition: "all 0.2s",
    background: active
      ? platform === "ig" ? "linear-gradient(135deg, #E1306C, #F77737)" : platform === "fb" ? "#1877F2" : "#0A66C2"
      : COLORS.gray100,
    color: active ? COLORS.white : COLORS.gray700,
  }),
  captionPreview: {
    background: COLORS.gray100,
    borderRadius: "10px",
    padding: "16px",
    fontSize: "13px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    color: COLORS.gray900,
    minHeight: "160px",
    maxHeight: "300px",
    overflowY: "auto",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
    boxSizing: "border-box",
    border: `1.5px solid ${COLORS.gray200}`,
    resize: "vertical",
    outline: "none",
  },
  copyBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    border: `1px solid ${COLORS.gray200}`,
    borderRadius: "8px",
    background: COLORS.white,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    color: COLORS.gray700,
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  // Style guide
  styleCard: {
    background: COLORS.white,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: `1px solid ${COLORS.gray200}`,
    marginBottom: "16px",
  },
  pill: (color) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "500",
    background: color + "20",
    color: color,
    marginRight: "6px",
    marginBottom: "4px",
  }),
  // Full-width sections
  fullWidth: {
    gridColumn: "1 / -1",
  },
  partnerTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    background: COLORS.oceanLight,
    borderRadius: "6px",
    fontSize: "12px",
    color: COLORS.ocean,
    fontWeight: "500",
    marginRight: "6px",
    marginBottom: "4px",
  },
};

// ─── Main App ───
export default function PFSSocialMediaHub() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("cleanup");
  const [images, setImages] = useState([]);
  const [generated, setGenerated] = useState(null);
  const [activePlatform, setActivePlatform] = useState("ig");
  const [copiedPlatform, setCopiedPlatform] = useState(null);
  const [guidance, setGuidance] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);
  const [partners, setPartners] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Analytics state
  const [postLog, setPostLog] = useState([
    // Sample data to show the feature
    { id: 1, date: "2026-03-05", platform: "ig", type: "cleanup", title: "Shek O Beach Cleanup", likes: 87, comments: 12, shares: 8, saves: 15 },
    { id: 2, date: "2026-03-05", platform: "fb", type: "cleanup", title: "Shek O Beach Cleanup", likes: 34, comments: 6, shares: 11, saves: 0 },
    { id: 3, date: "2026-03-05", platform: "li", type: "cleanup", title: "Shek O Beach Cleanup", likes: 45, comments: 3, shares: 5, saves: 0 },
    { id: 4, date: "2026-02-20", platform: "ig", type: "education", title: "Feb School Talks Roundup", likes: 62, comments: 8, shares: 14, saves: 22 },
    { id: 5, date: "2026-02-20", platform: "fb", type: "education", title: "Feb School Talks Roundup", likes: 28, comments: 4, shares: 9, saves: 0 },
    { id: 6, date: "2026-02-10", platform: "ig", type: "awareness", title: "World Wetlands Day", likes: 105, comments: 18, shares: 24, saves: 31 },
    { id: 7, date: "2026-01-15", platform: "ig", type: "cleanup", title: "Big Wave Bay Cleanup", likes: 73, comments: 9, shares: 6, saves: 12 },
    { id: 8, date: "2026-01-15", platform: "li", type: "cleanup", title: "Big Wave Bay Cleanup", likes: 52, comments: 7, shares: 4, saves: 0 },
  ]);
  const [logForm, setLogForm] = useState({ date: "", platform: "ig", type: "cleanup", title: "", likes: "", comments: "", shares: "", saves: "" });
  const [showLogForm, setShowLogForm] = useState(false);

  // Load font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;
    const detectedPartners = detectPartners(description);
    setPartners(detectedPartners);
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, description, imageCount: images.length, partners: detectedPartners }),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error ?? "Request failed");
      }

      const data = await res.json();

      setGenerated({ ig: data.ig, fb: data.fb, li: data.li });
      setGuidance(data.guidance ?? []);
      setBestTime(data.bestTime ?? null);
      setActivePlatform("ig");
    } catch (err) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (platform) => {
    if (!generated) return;
    const text = platform === "ig" ? generated.ig : platform === "fb" ? generated.fb : generated.li;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch {
      // Clipboard API might not be available
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    }
  };

  const handleEventClick = (evt) => {
    setSelectedEvent(evt);
    setActiveTab("create");
    setEventType(evt.type === "cleanup" ? "cleanup" : evt.type === "awareness" ? "awareness" : evt.type === "campaign" ? "awareness" : "roundup");
    setDescription(`${evt.title} — `);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // Calendar computation
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const events = getCalendarEvents(calYear, calMonth);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === calMonth && today.getFullYear() === calYear;

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌊</div>
            <div>
              <div style={styles.logoText}>Plastic Free Seas</div>
              <div style={styles.logoSub}>Social Media Hub</div>
            </div>
          </div>
        </div>
        <div style={styles.nav}>
          <button style={styles.navBtn(activeTab === "calendar")} onClick={() => setActiveTab("calendar")}>
            <Icons.Calendar /> Calendar
          </button>
          <button style={styles.navBtn(activeTab === "create")} onClick={() => setActiveTab("create")}>
            <Icons.Plus /> Create Post
          </button>
          <button style={styles.navBtn(activeTab === "style")} onClick={() => setActiveTab("style")}>
            <Icons.Palette /> Style Guide
          </button>
          <button style={styles.navBtn(activeTab === "analytics")} onClick={() => setActiveTab("analytics")}>
            <Icons.BarChart /> Analytics
          </button>
        </div>
      </div>
      <Icons.Wave />

      <div style={styles.content}>
        {/* ═══ CALENDAR TAB ═══ */}
        {activeTab === "calendar" && (
          <div>
            <div style={styles.calendarHeader}>
              <div style={styles.monthNav}>
                <button style={styles.monthNavBtn} onClick={prevMonth}><Icons.ChevronLeft /></button>
                <div style={styles.monthTitle}>{MONTHS[calMonth]} {calYear}</div>
                <button style={styles.monthNavBtn} onClick={nextMonth}><Icons.ChevronRight /></button>
              </div>
              <button
                style={{ ...styles.generateBtn, width: "auto", marginTop: 0, padding: "10px 20px", fontSize: "13px" }}
                onClick={() => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); }}
              >
                Today
              </button>
            </div>

            <div style={styles.calendarGrid}>
              {DAYS.map(d => (
                <div key={d} style={styles.calDayHeader}>{d}</div>
              ))}
              {calendarCells.map((day, i) => {
                const dayEvents = day ? events.filter(e => e.day === day) : [];
                const isToday = isCurrentMonth && day === today.getDate();
                return (
                  <div
                    key={i}
                    style={styles.calDay(isToday, !day, dayEvents.length > 0)}
                    onClick={() => dayEvents.length > 0 && handleEventClick(dayEvents[0])}
                  >
                    {day && (
                      <>
                        <div style={styles.calDayNum(isToday)}>{day}</div>
                        {dayEvents.map((evt, ei) => (
                          <div key={ei} style={styles.calEvent(evt.type)} title={evt.title}>
                            {evt.icon} {evt.title}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={styles.legendDot("#E8F5E9")} /> Community Cleanup
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot("#FFF3E0")} /> Awareness Day
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot("#E3F2FD")} /> School Talks Roundup
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendDot("#FCE4EC")} /> Campaign
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "16px 20px", background: COLORS.white, borderRadius: "12px", border: `1px solid ${COLORS.gray200}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: COLORS.deep, marginBottom: "10px" }}>📌 Upcoming Posts To-Do</div>
              {events.length === 0 ? (
                <div style={{ fontSize: "13px", color: COLORS.gray500 }}>No scheduled events this month. Check awareness days in other months!</div>
              ) : (
                events.sort((a, b) => a.day - b.day).map((evt, i) => {
                  const evtDate = new Date(calYear, calMonth, evt.day);
                  const isPast = evtDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        background: isPast ? COLORS.gray100 : COLORS.foam,
                        opacity: isPast ? 0.5 : 1,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => handleEventClick(evt)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{evt.icon}</span>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "500", color: COLORS.gray900 }}>{evt.title}</div>
                          <div style={{ fontSize: "11px", color: COLORS.gray500 }}>
                            {WEEKDAYS_FULL[evtDate.getDay()]}, {MONTHS[calMonth]} {evt.day}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: isPast ? COLORS.gray200 : COLORS.ocean,
                        color: isPast ? COLORS.gray500 : COLORS.white,
                      }}>
                        {isPast ? "Past" : "Draft Post →"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ═══ CREATE POST TAB ═══ */}
        {activeTab === "create" && (
          <div>
            <div style={styles.createContainer}>
              {/* Left: Input */}
              <div>
                <div style={styles.card}>
                  <div style={styles.cardTitle}>
                    <Icons.Sparkle /> What happened?
                  </div>
                  <label style={styles.inputLabel}>Event Type</label>
                  <select style={styles.select} value={eventType} onChange={e => setEventType(e.target.value)}>
                    <option value="cleanup">🏖️ Beach Cleanup</option>
                    <option value="education">🏫 School / Education Talk</option>
                    <option value="corporate">🤝 Corporate Event</option>
                    <option value="awareness">🌍 Awareness Day</option>
                    <option value="roundup">🏫 School Talks & Workshops Roundup</option>
                    <option value="other">📣 Other</option>
                  </select>

                  <div style={{ marginTop: "16px" }}>
                    <label style={styles.inputLabel}>Description</label>
                    <textarea
                      style={styles.textarea}
                      placeholder="E.g. 'We joined HandsOnHK for our monthly community beach cleanup at Shek O. 35 volunteers collected 52kg of plastic waste including 200+ bottles and countless microplastics. Amazing turnout!'"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <label style={styles.inputLabel}>Photos</label>
                    <div
                      style={styles.uploadZone}
                      onClick={() => document.getElementById("file-input").click()}
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = COLORS.ocean; }}
                      onDragLeave={(e) => { e.currentTarget.style.borderColor = COLORS.gray300; }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = COLORS.gray300;
                        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                        const newImages = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
                        setImages(prev => [...prev, ...newImages]);
                      }}
                    >
                      <Icons.Image />
                      <div style={styles.uploadText}>
                        Tap to upload or drag photos here
                      </div>
                      <div style={{ fontSize: "11px", color: COLORS.gray500, marginTop: "4px" }}>
                        JPG, PNG — Instagram carousel supports up to 20 images
                      </div>
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    {images.length > 0 && (
                      <div style={styles.imagePreviewGrid}>
                        {images.map((img, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={img.url} style={styles.imageThumb} alt={img.name} />
                            <button
                              onClick={() => removeImage(i)}
                              style={{
                                position: "absolute", top: "2px", right: "2px",
                                width: "20px", height: "20px", borderRadius: "50%",
                                background: "rgba(0,0,0,0.6)", color: "#fff",
                                border: "none", cursor: "pointer", fontSize: "12px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                lineHeight: "1",
                              }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    style={{
                      ...styles.generateBtn,
                      opacity: description.trim() ? 1 : 0.5,
                      cursor: description.trim() ? "pointer" : "not-allowed",
                    }}
                    onClick={handleGenerate}
                    disabled={!description.trim() || generating}
                  >
                    <Icons.Sparkle /> {generating ? "Generating…" : "Generate Draft Posts"}
                  </button>
                  {generateError && (
                    <div style={{ marginTop: "8px", fontSize: "12px", color: COLORS.coral }}>
                      ⚠️ {generateError}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Guidance + Partners */}
              <div>
                {/* Creative Guidance */}
                <div style={styles.card}>
                  <div style={styles.cardTitle}>💡 Creative Guidance</div>
                  {guidance.length === 0 ? (
                    <div style={{ fontSize: "13px", color: COLORS.gray500, lineHeight: "1.6" }}>
                      Enter a description and generate a post to receive tailored creative recommendations based on PFS's best-performing content and competitor benchmarks.
                    </div>
                  ) : (
                    guidance.map((tip, i) => (
                      <div key={i} style={styles.guidanceTip(tip.priority)}>
                        <span style={{ fontSize: "16px", flexShrink: 0 }}>{tip.icon}</span>
                        <span>{tip.text}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Detected Partners */}
                {partners.length > 0 && (
                  <div style={{ ...styles.card, marginTop: "16px" }}>
                    <div style={styles.cardTitle}>🔗 Partner Handles Detected</div>
                    <div style={{ fontSize: "13px", color: COLORS.gray500, marginBottom: "12px" }}>
                      Tag these accounts when posting for maximum reach:
                    </div>
                    {partners.map((p, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.deep, marginBottom: "4px", textTransform: "capitalize" }}>
                          {p.name}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          <span style={styles.partnerTag}>IG: {p.ig}</span>
                          <span style={styles.partnerTag}>FB: {p.fb}</span>
                          <span style={styles.partnerTag}>LI: {p.li}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Posting time */}
                {generated && bestTime && (
                  <div style={{ ...styles.card, marginTop: "16px" }}>
                    <div style={styles.cardTitle}>⏰ Best Time to Post</div>
                    <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "1.6" }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ ...styles.pill(COLORS.ocean), fontWeight: "600" }}>Weekdays</span>
                        <span style={{ fontSize: "13px" }}>{bestTime.weekdays}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ ...styles.pill(COLORS.seaweed), fontWeight: "600" }}>Weekends</span>
                        <span style={{ fontSize: "13px" }}>{bestTime.weekends}</span>
                      </div>
                      <div style={{ marginTop: "10px", fontSize: "12px", color: COLORS.gray500 }}>
                        {bestTime.note}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Generated Posts Preview - Full Width */}
              {generated && (
                <div style={styles.fullWidth}>
                  <div style={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div style={styles.cardTitle}>📋 Draft Posts for Review</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[
                          { key: "ig", label: "Instagram" },
                          { key: "fb", label: "Facebook" },
                          { key: "li", label: "LinkedIn" },
                        ].map(p => (
                          <button
                            key={p.key}
                            style={styles.platformTab(activePlatform === p.key, p.key)}
                            onClick={() => setActivePlatform(p.key)}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image carousel preview */}
                    {images.length > 0 && (
                      <div style={{
                        display: "flex",
                        gap: "8px",
                        overflowX: "auto",
                        paddingBottom: "12px",
                        marginBottom: "16px",
                      }}>
                        {images.map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt={img.name}
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              flexShrink: 0,
                              border: `1px solid ${COLORS.gray200}`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: COLORS.gray500 }}>
                          {activePlatform === "ig" ? "INSTAGRAM CAPTION" : activePlatform === "fb" ? "FACEBOOK POST" : "LINKEDIN POST"}
                        </span>
                        {activePlatform === "ig" && images.length >= 3 && (
                          <span style={{ ...styles.pill(COLORS.seaweed) }}>📸 Carousel recommended</span>
                        )}
                        {activePlatform === "ig" && images.length > 0 && images.length < 3 && (
                          <span style={{ ...styles.pill(COLORS.coral) }}>📱 Consider for Stories + Highlights</span>
                        )}
                      </div>
                    </div>

                    <textarea
                      style={styles.captionPreview}
                      value={activePlatform === "ig" ? generated.ig : activePlatform === "fb" ? generated.fb : generated.li}
                      onChange={(e) => setGenerated(prev => ({ ...prev, [activePlatform]: e.target.value }))}
                    />

                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button style={styles.copyBtn} onClick={() => handleCopy(activePlatform)}>
                        {copiedPlatform === activePlatform ? <><Icons.Check /> Copied!</> : <><Icons.Copy /> Copy Caption</>}
                      </button>
                      {images.length > 0 && (
                        <button style={styles.copyBtn}>
                          <Icons.Download /> Images ready in camera roll
                        </button>
                      )}
                    </div>

                    {/* Quick copy all */}
                    <div style={{
                      marginTop: "16px",
                      padding: "14px 16px",
                      background: COLORS.foam,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ fontSize: "13px", color: COLORS.gray700 }}>
                        <strong>Quick workflow:</strong> Copy caption → Open {activePlatform === "ig" ? "Instagram" : activePlatform === "fb" ? "Facebook" : "LinkedIn"} → Select photos from camera roll → Paste caption → Post!
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ STYLE GUIDE TAB ═══ */}
        {activeTab === "style" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: COLORS.deep, marginBottom: "6px" }}>
                PFS Voice & Style Reference
              </h2>
              <p style={{ fontSize: "14px", color: COLORS.gray500, lineHeight: "1.6", margin: 0 }}>
                This guide is derived from Plastic Free Seas' existing social media presence. All generated captions follow these patterns.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Tone */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "12px" }}>🎯 Tone of Voice</div>
                <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "1.7" }}>
                  <p style={{margin: "0 0 8px"}}>PFS communicates with <strong>optimistic urgency</strong> — the tone is warm and community-oriented, never preachy or guilt-based. Posts celebrate collective action rather than shame individual behaviour.</p>
                  <p style={{margin: "0 0 8px"}}>Language is <strong>accessible and direct</strong>. Avoid jargon. Use concrete numbers and outcomes ("52kg of plastic removed") rather than abstract statements ("making a difference").</p>
                  <p style={{margin: 0}}>The voice is that of a <strong>passionate local friend</strong> who happens to be an ocean expert — knowledgeable but approachable.</p>
                </div>
              </div>

              {/* Content Pillars */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "12px" }}>📐 Content Pillars</div>
                <div style={{ marginBottom: "10px" }}>
                  <span style={styles.pill(COLORS.ocean)}>🌊 Action & Impact</span>
                  <span style={styles.pill(COLORS.seaweed)}>📚 Education & Facts</span>
                  <span style={styles.pill(COLORS.coral)}>🤝 Community & Partners</span>
                  <span style={styles.pill("#8B5CF6")}>📣 Calls to Action</span>
                </div>
                <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "1.6" }}>
                  Every post should map to one of these four pillars. The best posts combine two: e.g., an Action post with a Call to Action, or an Education post with a Community spotlight.
                </div>
              </div>

              {/* Platform Differences */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "12px" }}>📱 Platform Differences</div>
                <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "1.7" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#E1306C" }}>Instagram:</strong> Visual-first. Emoji-friendly. Hashtag-heavy (10–15 per post). Captions can be longer but front-load the hook. Reels and carousels get priority reach.
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#1877F2" }}>Facebook:</strong> Slightly longer, more conversational. Link to website. Good for event promotion. Native video outperforms external links.
                  </div>
                  <div>
                    <strong style={{ color: "#0A66C2" }}>LinkedIn:</strong> Professional framing. Impact metrics and ESG language. Tag corporate partners. Thought leadership for founders.
                  </div>
                </div>
              </div>

              {/* Hashtag Strategy */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "6px" }}># Hashtag Strategy</div>
                <div style={{ fontSize: "12px", color: COLORS.gray500, marginBottom: "14px", lineHeight: "1.5" }}>
                  Bilingual hashtags (English + Traditional Chinese) help PFS reach both expat and local Cantonese-speaking audiences in Hong Kong. Mix both in every post.
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.gray500, marginBottom: "6px" }}>ALWAYS USE (Core — English + 中文)</div>
                  <div>{HASHTAGS.core.map(h => <span key={h} style={styles.pill(COLORS.ocean)}>{h}</span>)}</div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.gray500, marginBottom: "6px" }}>CLEANUP EVENTS</div>
                  <div>{HASHTAGS.cleanup.map(h => <span key={h} style={styles.pill(COLORS.seaweed)}>{h}</span>)}</div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.gray500, marginBottom: "6px" }}>EDUCATION</div>
                  <div>{HASHTAGS.education.map(h => <span key={h} style={styles.pill(COLORS.coral)}>{h}</span>)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.gray500, marginBottom: "6px" }}>CORPORATE / CSR</div>
                  <div>{HASHTAGS.corporate.map(h => <span key={h} style={styles.pill("#8B5CF6")}>{h}</span>)}</div>
                </div>
              </div>

              {/* Key Stats */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "12px" }}>📊 Key Stats to Reference</div>
                <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "1.7" }}>
                  Use these in posts to ground PFS's impact in concrete numbers:
                </div>
                <div style={{ marginTop: "10px" }}>
                  {[
                    { stat: "100,000+", label: "students reached through education programmes" },
                    { stat: "280+", label: "schools partnered with across Hong Kong" },
                    { stat: "5 million", label: "plastic bottles go to HK landfills daily" },
                    { stat: "Since 2013", label: "founding year — over a decade of ocean action" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "10px",
                      padding: "8px 0",
                      borderBottom: i < 3 ? `1px solid ${COLORS.gray100}` : "none",
                    }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: COLORS.ocean, minWidth: "90px" }}>{s.stat}</span>
                      <span style={{ fontSize: "13px", color: COLORS.gray700 }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Handles */}
              <div style={styles.styleCard}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep, marginBottom: "12px" }}>🔗 PFS Social Handles</div>
                <div style={{ fontSize: "13px", color: COLORS.gray700, lineHeight: "2" }}>
                  <div><strong>Instagram:</strong> @plasticfreeseas</div>
                  <div><strong>Facebook:</strong> Plastic Free Seas</div>
                  <div><strong>LinkedIn:</strong> Plastic Free Seas</div>
                  <div><strong>Website:</strong> plasticfreeseas.com</div>
                </div>
                <div style={{ marginTop: "12px", fontSize: "12px", color: COLORS.gray500, lineHeight: "1.5" }}>
                  Current Instagram: ~2,982 followers · 372 posts<br/>
                  Current LinkedIn: ~772 followers
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS TAB ═══ */}
        {activeTab === "analytics" && (() => {
          // Compute insights from postLog
          const igPosts = postLog.filter(p => p.platform === "ig");
          const fbPosts = postLog.filter(p => p.platform === "fb");
          const liPosts = postLog.filter(p => p.platform === "li");

          const engRate = (posts) => {
            if (posts.length === 0) return 0;
            const total = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares + (p.saves || 0), 0);
            return (total / posts.length).toFixed(0);
          };

          const avgByType = (type) => {
            const typed = postLog.filter(p => p.type === type);
            if (typed.length === 0) return null;
            return {
              type,
              count: typed.length,
              avgLikes: (typed.reduce((s, p) => s + p.likes, 0) / typed.length).toFixed(0),
              avgComments: (typed.reduce((s, p) => s + p.comments, 0) / typed.length).toFixed(0),
              avgShares: (typed.reduce((s, p) => s + p.shares, 0) / typed.length).toFixed(0),
              avgSaves: (typed.reduce((s, p) => s + (p.saves || 0), 0) / typed.length).toFixed(0),
              totalEng: (typed.reduce((s, p) => s + p.likes + p.comments + p.shares + (p.saves || 0), 0) / typed.length).toFixed(0),
            };
          };

          const typeStats = ["cleanup", "education", "awareness", "corporate", "roundup"]
            .map(avgByType)
            .filter(Boolean)
            .sort((a, b) => b.totalEng - a.totalEng);

          const bestPost = postLog.length > 0
            ? postLog.reduce((best, p) => {
                const eng = p.likes + p.comments + p.shares + (p.saves || 0);
                const bestEng = best.likes + best.comments + best.shares + (best.saves || 0);
                return eng > bestEng ? p : best;
              })
            : null;

          const bestPlatform = [
            { key: "ig", label: "Instagram", avg: engRate(igPosts) },
            { key: "fb", label: "Facebook", avg: engRate(fbPosts) },
            { key: "li", label: "LinkedIn", avg: engRate(liPosts) },
          ].sort((a, b) => b.avg - a.avg);

          // Generate smart insights
          const insights = [];
          if (bestPost) {
            const eng = bestPost.likes + bestPost.comments + bestPost.shares + (bestPost.saves || 0);
            insights.push({
              icon: "🏆",
              text: `Your best-performing post was "${bestPost.title}" on ${bestPost.platform === "ig" ? "Instagram" : bestPost.platform === "fb" ? "Facebook" : "LinkedIn"} with ${eng} total engagements. Consider replicating its format.`,
              priority: "high",
            });
          }

          if (typeStats.length >= 2) {
            insights.push({
              icon: "📊",
              text: `${typeStats[0].type.charAt(0).toUpperCase() + typeStats[0].type.slice(1)} posts get the most engagement (avg ${typeStats[0].totalEng} per post), followed by ${typeStats[1].type} posts (avg ${typeStats[1].totalEng}).`,
              priority: "high",
            });
          }

          if (bestPlatform[0].avg > 0) {
            insights.push({
              icon: "📱",
              text: `${bestPlatform[0].label} is your strongest platform with an average of ${bestPlatform[0].avg} engagements per post. ${bestPlatform[bestPlatform.length - 1].label} could use more attention (avg ${bestPlatform[bestPlatform.length - 1].avg}).`,
              priority: "medium",
            });
          }

          const igSavePosts = igPosts.filter(p => (p.saves || 0) > 0);
          if (igSavePosts.length > 0) {
            const avgSaves = (igSavePosts.reduce((s, p) => s + p.saves, 0) / igSavePosts.length).toFixed(0);
            insights.push({
              icon: "🔖",
              text: `Instagram posts are getting an average of ${avgSaves} saves — this is a strong signal. The algorithm weights saves heavily. Content people save tends to be educational or stat-driven.`,
              priority: "medium",
            });
          }

          if (postLog.length >= 3) {
            const sorted = [...postLog].sort((a, b) => new Date(b.date) - new Date(a.date));
            const recent3 = sorted.slice(0, 3);
            const older = sorted.slice(3);
            if (older.length > 0) {
              const recentAvg = recent3.reduce((s, p) => s + p.likes + p.comments + p.shares, 0) / recent3.length;
              const olderAvg = older.reduce((s, p) => s + p.likes + p.comments + p.shares, 0) / older.length;
              if (recentAvg > olderAvg * 1.1) {
                insights.push({ icon: "📈", text: `Your recent posts are trending upward — engagement is ${((recentAvg / olderAvg - 1) * 100).toFixed(0)}% higher than your earlier posts. Keep the momentum!`, priority: "info" });
              } else if (recentAvg < olderAvg * 0.9) {
                insights.push({ icon: "📉", text: `Recent posts are getting less engagement than earlier ones. Try varying the format — carousels, Reels, or posts with specific stats tend to re-engage audiences.`, priority: "medium" });
              }
            }
          }

          if (insights.length === 0) {
            insights.push({ icon: "📝", text: "Log a few more posts to start seeing patterns and personalised recommendations.", priority: "info" });
          }

          const handleAddLog = () => {
            if (!logForm.title || !logForm.date) return;
            const newEntry = {
              id: Date.now(),
              date: logForm.date,
              platform: logForm.platform,
              type: logForm.type,
              title: logForm.title,
              likes: parseInt(logForm.likes) || 0,
              comments: parseInt(logForm.comments) || 0,
              shares: parseInt(logForm.shares) || 0,
              saves: parseInt(logForm.saves) || 0,
            };
            setPostLog(prev => [newEntry, ...prev]);
            setLogForm({ date: "", platform: "ig", type: "cleanup", title: "", likes: "", comments: "", shares: "", saves: "" });
            setShowLogForm(false);
          };

          const handleDeleteLog = (id) => {
            setPostLog(prev => prev.filter(p => p.id !== id));
          };

          const typeLabel = (t) => t === "cleanup" ? "🏖️ Cleanup" : t === "education" ? "🏫 Education" : t === "awareness" ? "🌍 Awareness" : t === "corporate" ? "🤝 Corporate" : t === "roundup" ? "🏫 Roundup" : "📣 Other";
          const platLabel = (p) => p === "ig" ? "Instagram" : p === "fb" ? "Facebook" : "LinkedIn";
          const platColor = (p) => p === "ig" ? "#E1306C" : p === "fb" ? "#1877F2" : "#0A66C2";

          return (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: COLORS.deep, marginBottom: "6px", margin: "0 0 6px" }}>
                  Analytics & Insights
                </h2>
                <p style={{ fontSize: "14px", color: COLORS.gray500, lineHeight: "1.6", margin: 0 }}>
                  Log your post performance after publishing. The more data you add, the smarter the recommendations become.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {/* Smart Insights */}
                <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
                  <div style={styles.cardTitle}>💡 Monthly Reflection & Insights</div>
                  {insights.map((tip, i) => (
                    <div key={i} style={styles.guidanceTip(tip.priority)}>
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>{tip.icon}</span>
                      <span>{tip.text}</span>
                    </div>
                  ))}
                </div>

                {/* Platform Overview Cards */}
                {[
                  { key: "ig", label: "Instagram", icon: "📷", posts: igPosts },
                  { key: "fb", label: "Facebook", icon: "👍", posts: fbPosts },
                  { key: "li", label: "LinkedIn", icon: "💼", posts: liPosts },
                ].map(plat => (
                  <div key={plat.key} style={{
                    ...styles.card,
                    borderTop: `3px solid ${platColor(plat.key)}`,
                    gridColumn: plat.key === "li" ? "1 / -1" : undefined,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.deep }}>
                        {plat.icon} {plat.label}
                      </div>
                      <span style={{ fontSize: "12px", color: COLORS.gray500 }}>{plat.posts.length} posts logged</span>
                    </div>
                    {plat.posts.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                        {[
                          { label: "Avg Likes", value: (plat.posts.reduce((s, p) => s + p.likes, 0) / plat.posts.length).toFixed(0) },
                          { label: "Avg Comments", value: (plat.posts.reduce((s, p) => s + p.comments, 0) / plat.posts.length).toFixed(0) },
                          { label: "Avg Shares", value: (plat.posts.reduce((s, p) => s + p.shares, 0) / plat.posts.length).toFixed(0) },
                          ...(plat.key === "ig" ? [{ label: "Avg Saves", value: (plat.posts.reduce((s, p) => s + (p.saves || 0), 0) / plat.posts.length).toFixed(0) }] : [{ label: "Total Eng", value: (plat.posts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0) / plat.posts.length).toFixed(0) }]),
                        ].map((stat, si) => (
                          <div key={si} style={{ textAlign: "center", padding: "10px 4px", background: COLORS.gray100, borderRadius: "8px" }}>
                            <div style={{ fontSize: "20px", fontWeight: "700", color: platColor(plat.key) }}>{stat.value}</div>
                            <div style={{ fontSize: "10px", color: COLORS.gray500, fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: "13px", color: COLORS.gray500 }}>No posts logged yet for {plat.label}.</div>
                    )}
                  </div>
                ))}

                {/* Performance by Event Type */}
                {typeStats.length > 0 && (
                  <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
                    <div style={styles.cardTitle}>📊 Performance by Event Type</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ borderBottom: `2px solid ${COLORS.gray200}` }}>
                            {["Event Type", "Posts", "Avg Likes", "Avg Comments", "Avg Shares", "Avg Saves", "Avg Engagement"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: "11px", fontWeight: "600", color: COLORS.gray500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {typeStats.map((ts, i) => (
                            <tr key={i} style={{ borderBottom: `1px solid ${COLORS.gray100}`, background: i === 0 ? "#FFFDE7" : "transparent" }}>
                              <td style={{ padding: "10px", fontWeight: "500" }}>{typeLabel(ts.type)}</td>
                              <td style={{ padding: "10px", color: COLORS.gray500 }}>{ts.count}</td>
                              <td style={{ padding: "10px" }}>{ts.avgLikes}</td>
                              <td style={{ padding: "10px" }}>{ts.avgComments}</td>
                              <td style={{ padding: "10px" }}>{ts.avgShares}</td>
                              <td style={{ padding: "10px" }}>{ts.avgSaves}</td>
                              <td style={{ padding: "10px", fontWeight: "700", color: COLORS.ocean }}>{ts.totalEng}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Log Form + Post History */}
                <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={styles.cardTitle}>📝 Post Log</div>
                    <button
                      style={{
                        ...styles.generateBtn,
                        width: "auto",
                        marginTop: 0,
                        padding: "8px 16px",
                        fontSize: "13px",
                      }}
                      onClick={() => setShowLogForm(!showLogForm)}
                    >
                      <Icons.Plus /> Log a Post
                    </button>
                  </div>

                  {showLogForm && (
                    <div style={{
                      padding: "16px",
                      background: COLORS.foam,
                      borderRadius: "10px",
                      marginBottom: "16px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: "10px",
                    }}>
                      <div>
                        <label style={styles.inputLabel}>Date</label>
                        <input
                          type="date"
                          style={{ ...styles.select, padding: "8px 10px" }}
                          value={logForm.date}
                          onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Platform</label>
                        <select style={{ ...styles.select, padding: "8px 10px" }} value={logForm.platform} onChange={e => setLogForm(f => ({ ...f, platform: e.target.value }))}>
                          <option value="ig">Instagram</option>
                          <option value="fb">Facebook</option>
                          <option value="li">LinkedIn</option>
                        </select>
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Event Type</label>
                        <select style={{ ...styles.select, padding: "8px 10px" }} value={logForm.type} onChange={e => setLogForm(f => ({ ...f, type: e.target.value }))}>
                          <option value="cleanup">Beach Cleanup</option>
                          <option value="education">Education</option>
                          <option value="awareness">Awareness Day</option>
                          <option value="corporate">Corporate</option>
                          <option value="roundup">School Roundup</option>
                        </select>
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Post Title</label>
                        <input
                          type="text"
                          style={{ ...styles.select, padding: "8px 10px" }}
                          placeholder="E.g. Shek O Cleanup"
                          value={logForm.title}
                          onChange={e => setLogForm(f => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Likes</label>
                        <input type="number" style={{ ...styles.select, padding: "8px 10px" }} placeholder="0" value={logForm.likes} onChange={e => setLogForm(f => ({ ...f, likes: e.target.value }))} />
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Comments</label>
                        <input type="number" style={{ ...styles.select, padding: "8px 10px" }} placeholder="0" value={logForm.comments} onChange={e => setLogForm(f => ({ ...f, comments: e.target.value }))} />
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Shares</label>
                        <input type="number" style={{ ...styles.select, padding: "8px 10px" }} placeholder="0" value={logForm.shares} onChange={e => setLogForm(f => ({ ...f, shares: e.target.value }))} />
                      </div>
                      <div>
                        <label style={styles.inputLabel}>Saves (IG only)</label>
                        <input type="number" style={{ ...styles.select, padding: "8px 10px" }} placeholder="0" value={logForm.saves} onChange={e => setLogForm(f => ({ ...f, saves: e.target.value }))} />
                      </div>
                      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px", marginTop: "4px" }}>
                        <button
                          style={{ ...styles.generateBtn, marginTop: 0, opacity: logForm.title && logForm.date ? 1 : 0.5 }}
                          onClick={handleAddLog}
                          disabled={!logForm.title || !logForm.date}
                        >
                          Save Entry
                        </button>
                        <button
                          style={{ ...styles.copyBtn, padding: "10px 20px" }}
                          onClick={() => setShowLogForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Post history list */}
                  <div>
                    {[...postLog].sort((a, b) => new Date(b.date) - new Date(a.date)).map(post => {
                      const eng = post.likes + post.comments + post.shares + (post.saves || 0);
                      return (
                        <div
                          key={post.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            marginBottom: "4px",
                            background: COLORS.gray100,
                            transition: "background 0.15s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                            <div style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: platColor(post.platform), flexShrink: 0,
                            }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: "13px", fontWeight: "500", color: COLORS.gray900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {post.title}
                              </div>
                              <div style={{ fontSize: "11px", color: COLORS.gray500 }}>
                                {platLabel(post.platform)} · {post.date} · {typeLabel(post.type)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: COLORS.gray700 }}>
                              <span title="Likes">❤️ {post.likes}</span>
                              <span title="Comments">💬 {post.comments}</span>
                              <span title="Shares">🔄 {post.shares}</span>
                              {post.platform === "ig" && <span title="Saves">🔖 {post.saves || 0}</span>}
                            </div>
                            <div style={{
                              fontSize: "12px", fontWeight: "600", color: COLORS.ocean,
                              background: COLORS.oceanLight, padding: "3px 8px", borderRadius: "12px",
                            }}>
                              {eng}
                            </div>
                            <button
                              onClick={() => handleDeleteLog(post.id)}
                              style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: COLORS.gray500, padding: "4px", display: "flex",
                                alignItems: "center",
                              }}
                              title="Remove"
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {postLog.length === 0 && (
                      <div style={{ textAlign: "center", padding: "32px", color: COLORS.gray500, fontSize: "13px" }}>
                        No posts logged yet. Click "Log a Post" to start tracking your performance.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
