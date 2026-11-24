// Builds apps/queue.json: the ELEVEX Apps TikTok clips (@elevexapps). Each clip carries a render spec for the
// tsw-video renderer (format "elevexapps"): intro card, live-app captures, outro card, voice-over, header, footer link.
// Run: node apps/build_specs.mjs   (writes apps/queue.json)
import fs from "node:fs";
const HUB = "elevexapps.elevex.digital";
const T = "#elevex #apps #appdev #buildinpublic";
const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const sc = (headline, url, say, steps, extra) => ({ headline, url, say, steps: steps || [{ wait: 0.8 }], ...(extra || {}) });
const outro = (name, say, extra) => ({ name, line: "Try it. Tell us what you think.", url: HUB, say, ...(extra || {}) });

// ---- per-app looks and seeds (the same demo data as the earlier FreeApps videos) ----
const TSWHIDE = "[aria-label='Cookie consent'], .alerts-mobile-banner";
const TS = (scenes) => ({ accent: "#2EC4B6", bg: "#0a1a1f", icon_file: "assets/apps/travel-safety-watch.webp", scenes: scenes.map((s) => ({ hide: TSWHIDE, settle: 1.8, ...s })) });
const TP = (scenes) => ({ accent: "#F5A623", bg: "#0b1424", icon_file: "assets/apps/travelplay.webp", scenes: scenes.map((s) => ({ localStorage: { "app.v1.introSeen": "true" }, settle: 1.5, ...s })) });
const wp = "wp1demo"; const shifts = [];
for (let k = 0; k < 24; k++) { const d = new Date(Date.now() - k * 864e5); if (d.getDay() === 0 || k % 5 === 4) continue; const h = [4, 6, 8, 5, 7][k % 5]; shifts.push({ id: "sh" + k, workplaceId: wp, date: iso(d), hours: h, days: 0, counts: {}, extraMinutes: 0, total: h * 18, note: "" }); }
const DWLS = { "myplace:welcome-dismissed": "true", "myplace:currency": '"USD"', "myplace:workplaces": JSON.stringify([{ id: wp, name: "Harbour Cafe", type: "hourly", rate: 18, treatments: [], removable: true, billable: false, color: "slot-1" }]), "myplace:shifts": JSON.stringify(shifts) };
const DISMISS = { eval: "document.querySelectorAll('button').forEach(b => /^Dismiss$/.test(b.innerText.trim()) && b.click())" };
const DW = (scenes) => ({ accent: "#22B8CF", bg: "#0a1c24", icon_file: "assets/apps/daywall.webp", scenes: scenes.map((s) => ({ localStorage: DWLS, settle: 1.5, ...s, steps: [DISMISS, ...(s.steps || [])] })) });
const IKMAP = '{"dimensions":{"love":{"items":[{"id":"love-0","label":"Drawing systems on paper","score":5},{"id":"love-1","label":"Teaching one person at a time","score":4}],"avg_score":4.5},"good_at":{"items":[{"id":"good_at-0","label":"Turning mess into structure","score":4}],"avg_score":4},"needs":{"items":[{"id":"needs-0","label":"Tools that slow people down","score":3}],"avg_score":3},"paid_for":{"items":[{"id":"paid_for-0","label":"Consulting on product clarity","score":4}],"avg_score":4}},"theme":"light","history":[],"premium":false,"prefs":{"palette":"editorial","audioEnabled":false,"paperTexture":true}}';
const IK = (scenes) => ({ accent: "#F25C54", bg: "#1a0f14", icon_file: "assets/apps/ikigai.webp", scenes: scenes.map((s) => ({ localStorage: { "ikigai-guide-seen": "1", "ikigai-example": "1", "ikigai-map-v1": IKMAP }, settle: 1.5, ...s })) });
const SZ = (scenes) => ({ accent: "#C6FF3D", bg: "#0b1210", icon_file: "assets/apps/scenzy.webp", scenes: scenes.map((s) => ({ settle: 2.5, ...s })) });
const ago = (h) => new Date(Date.now() - h * 36e5).toISOString();
const MWPOSTS = [
  { id: "p1", kind: "thought", text: "Finished the first draft today. Small win, big relief.", images: [], items: [], likes: 4, comments: [], createdAt: ago(2), mood: "😊" },
  { id: "p2", kind: "list", text: "This weekend", images: [], items: [{ id: "i1", text: "Long walk by the sea", done: true }, { id: "i2", text: "Call Grandma", done: true }, { id: "i3", text: "Plan next week", done: false }], likes: 2, comments: [], createdAt: ago(9) },
  { id: "p3", kind: "diary", text: "Quiet morning, good coffee, and an hour to think. Writing it down so I remember how this felt.", images: [], items: [], likes: 6, comments: [], createdAt: ago(26), mood: "☕" },
  { id: "p4", kind: "note", text: "Ideas for the garden: tomatoes, basil, one lemon tree.", images: [], items: [], likes: 1, comments: [], createdAt: ago(50) },
];
const MW = (scenes) => ({ accent: "#A78BFA", bg: "#120d24", icon_file: "assets/apps/mywall.webp", scenes: scenes.map((s) => ({ localStorage: { "myplace:posts": JSON.stringify(MWPOSTS), "myplace:profile": JSON.stringify({ name: "", username: "you", bio: "My private wall", symbol: "🌿", showNameWhenSharing: false }), "myplace:welcome-dismissed": "true" }, settle: 1.5, ...s })) });
const HUBL = (scenes) => ({ accent: "#4C8DFF", bg: "#08122a", icon_file: "assets/apps/elevex-mark.png", scenes: scenes.map((s) => ({ settle: 1.5, ...s })) });
const MWURL = process.env.MYWALL_URL || "https://mywall.elevex.digital/";

const intro = (headline, say, app, extra) => ({ headline, say, app, ...(extra || {}) });
const clips = [
  { id: "V1", title: "These are some of the apps we're building", caption: `At Elevex, we build apps. These are some of the ones we're working on right now. Try them, and tell us what you think. Visit us at ${HUB} ${T}`,
    spec: { ...HUBL([
      sc("Some of the apps we're *building*", `https://${HUB}/`, "These are some of the ones we're working on right now.", [{ wait: 1 }, { scroll: 500, over: 3 }]),
      sc("Try them in your *browser*", `https://${HUB}/`, "Try them, and tell us what you think.", [{ wait: 0.5 }, { scroll: 900, over: 3.2 }]) ]),
      intro: intro("We build *apps*.", "At Elevex, we build apps."), outro: outro("ELEVEX Apps", `Visit Elevex apps dot Elevex dot digital.`) } },
  { id: "V2", title: "Heading abroad? Travel informed.", caption: `Heading abroad? Travel Safety Watch brings weather warnings, local news and official advice together for your destination. Try it and tell us what you think. Independent, not a government service. ${HUB} #travel #traveltips #travelsafety #elevex`,
    spec: { ...TS([
      sc("Warnings and *local news*", "https://travelsafetywatch.com/alerts", "Travel Safety Watch brings weather warnings and local news together for your destination.", [{ wait: 0.8 }, { scroll: 600, over: 3.5 }]),
      sc("Official *advice* too", "https://travelsafetywatch.com/news", "Along with official advice. Travel informed.", [{ wait: 0.8 }, { scroll: 700, over: 3 }]) ]),
      intro: intro("Heading *abroad*?", "Heading abroad?", "Travel Safety Watch"), outro: outro("Travel Safety Watch", "Try it, and tell us what you think. Visit Elevex apps dot Elevex dot digital.", { note: "Independent, not a government service" }) } },
  { id: "V8", title: "Want to be a tester on Google Play?", caption: `Want to be a tester for Google Play? Send us your email and we'll tell you how to join. Details at ${HUB} #googleplay #betatester #apps #elevex`,
    spec: { ...HUBL([
      sc("Want to *test* our apps?", `https://${HUB}/#tester`, "Send us your email, and we'll tell you how to join.", [{ wait: 1 }, { type: "input[type=email]", text: "you@example.com", delay: 80 }, { wait: 0.6 }]),
      sc("Early access on *Google Play*", `https://${HUB}/`, "Details at Elevex apps dot Elevex dot digital.", [{ wait: 0.5 }, { scroll: 700, over: 3 }]) ]),
      intro: intro("Want to be a *tester*?", "Want to be a tester for Google Play?", null, { kicker: "GOOGLE PLAY" }), outro: outro("ELEVEX Apps", "Send us your email. We'll be in touch.", { line: "Be an early tester", tester: { title: "Want to be a tester on Google Play?", text: "Send us your email at the link above" } }) } },
  { id: "V3", title: "See where it's happening", caption: `See where it's happening. Scenzy shows you what's going on around you, reported by people nearby. It's an early version, and we'd love your feedback. 18+. ${HUB} #scenzy #nearby #localevents #elevex`,
    spec: { ...SZ([
      sc("Scenes *around you*", "https://getscenzy.com/", "Scenzy shows you what's going on around you, reported by people nearby.", [{ wait: 1.2 }, { scroll: 400, over: 3 }]),
      sc("An early version. *Feedback welcome.*", "https://getscenzy.com/near", "It's an early version, and we'd love your feedback.", [{ wait: 1.2 }, { scroll: 500, over: 3 }]) ]),
      intro: intro("See where it's *happening*", "See where it's happening.", "Scenzy"), outro: outro("Scenzy", "Try it, and tell us what you think. Visit Elevex apps dot Elevex dot digital.", { note: "18+ · Early version" }) } },
  { id: "V4", title: "A social feed that's only yours", caption: `A social feed that's only yours. MyWall is a private wall for your moments, plans and wins, and it all stays on your device. Have a look and let us know. ${HUB} #mywall #privacy #journaling #elevex`,
    spec: { ...MW([
      sc("Your moments, plans and *wins*", MWURL, "MyWall is a private wall for your moments, plans and wins.", [{ wait: 1 }, { scroll: 450, over: 3.5 }]),
      sc("It stays on *your device*", MWURL, "It all stays on your device. Have a look and let us know.", [{ wait: 0.8 }, { scroll: 700, over: 3 }]) ]),
      intro: intro("A feed that's *only yours*", "A social feed that's only yours.", "MyWall"), outro: outro("MyWall", "Try it, and tell us what you think. Visit Elevex apps dot Elevex dot digital.") } },
  { id: "V9", title: "Help us shape these apps", caption: `We're building these apps with your feedback. Want to test them early on Google Play? Send us your email and we'll be in touch. ${HUB} #googleplay #beta #feedback #elevex`,
    spec: { ...HUBL([
      sc("Test early on *Google Play*", `https://${HUB}/`, "Want to test them early on Google Play?", [{ wait: 0.6 }, { scroll: 600, over: 3 }]),
      sc("Send us your *email*", `https://${HUB}/#tester`, "Send us your email and we'll be in touch.", [{ wait: 1 }, { type: "input[type=email]", text: "you@example.com", delay: 80 }, { wait: 0.6 }]) ]),
      intro: intro("Help us *shape* these apps", "We're building these apps with your feedback."), outro: outro("ELEVEX Apps", "Visit Elevex apps dot Elevex dot digital.", { line: "Be an early tester", tester: { title: "Want to be a tester on Google Play?", text: "Send us your email at the link above" } }) } },
  { id: "V5", title: "Track your shifts, pay and cash flow", caption: `Working shifts? Daywall tracks your hours, your weekly pay and your cash flow in one place, and your data stays on your phone. Try it and tell us what you think. (Demo data) ${HUB} #shiftwork #budgeting #sidehustle #elevex`,
    spec: { ...DW([
      sc("Hours and *weekly pay*", "https://daywall.elevex.digital/work", "Daywall tracks your hours and your weekly pay.", [{ wait: 0.8 }, { scroll: 500, over: 3 }]),
      sc("Your *cash flow*, one place", "https://daywall.elevex.digital/cashflow", "And your cash flow, all in one place. Your data stays on your phone.", [{ wait: 0.8 }, { scroll: 700, over: 3.5 }]) ]),
      intro: intro("Working *shifts*?", "Working shifts?", "Daywall"), outro: outro("Daywall", "Try it, and tell us what you think. Visit Elevex apps dot Elevex dot digital.", { note: "Demo data shown" }) } },
  { id: "V6", title: "Puzzle games for layovers", caption: `Stuck at the gate? TravelPlay has puzzle and word games made for layovers, and they work offline. Give it a go and tell us what you think. 18+. ${HUB} #travel #puzzle #wordgame #elevex`,
    spec: { ...TP([
      sc("Puzzle and *word games*", "https://travelplay.fun/play/daily-grid", "TravelPlay has puzzle and word games made for layovers.", [{ wait: 0.6 }, { click: "button[aria-label='Hint']" }, { wait: 0.6 }, { click: "button[aria-label='Hint']" }, { wait: 0.8 }]),
      sc("Made to work *offline*", "https://travelplay.fun/", "They work offline. Give it a go.", [{ wait: 0.8 }, { scroll: 400, over: 2.4 }]) ]),
      intro: intro("Stuck at the *gate*?", "Stuck at the gate?", "TravelPlay"), outro: outro("TravelPlay", "Tell us what you think. Visit Elevex apps dot Elevex dot digital.", { note: "18+" }) } },
  { id: "V7", title: "Where do passion, skill, need and pay meet?", caption: `Four questions. One clear picture of where your passion, skills, the world's needs and pay meet. Try My Ikigai Map and tell us what you think. (Example map) ${HUB} #ikigai #purpose #career #elevex`,
    spec: { ...IK([
      sc("Passion, skills, needs, *pay*", "https://ikigai.elevex.digital/", "Where your passion, skills, the world's needs and pay meet.", [{ wait: 0.8 }, { scroll: 450, over: 3 }]),
      sc("Your *ikigai* map", "https://ikigai.elevex.digital/map", "Try My Ikigai Map and tell us what you think.", [{ wait: 1.2 }, { scroll: 500, over: 3 }]) ]),
      intro: intro("Four questions. *One* picture.", "Four questions. One clear picture.", "My Ikigai Map"), outro: outro("My Ikigai Map", "Visit Elevex apps dot Elevex dot digital.", { note: "Example map shown" }) } },
  { id: "V10", title: "The person behind the apps", caption: `I'm Noah, lead developer at Elevex. I oversee every app on this page. Try them, and tell us what's working and what isn't. ${HUB} #developer #apps #elevex`,
    spec: { ...HUBL([
      sc("Every app, *overseen*", `https://${HUB}/`, "I oversee every app on this page.", [{ wait: 0.8 }, { scroll: 600, over: 3.2 }]),
      sc("Tell us what's *working*", `https://${HUB}/`, "Try them, and tell us what's working and what isn't.", [{ wait: 0.5 }, { scroll: 1000, over: 3.4 }]) ]),
      intro: intro("Who's *behind* these apps?", "I'm Noah, lead developer at Elevex."), outro: outro("ELEVEX Apps", "Visit Elevex apps dot Elevex dot digital.") } },
];
const FINAL = clips.map((c, i) => ({ id: c.id, title: c.title, caption: c.caption, ai: true, ready: true, spec: { format: "elevexapps", seed: 100 + i * 7, music: "upbeat", voice: "am_echo", speed: 1.04, url: HUB, ...c.spec } }));
if (process.argv[2] === "--stdout") console.log(JSON.stringify(FINAL[Number(process.argv[3] || 0)].spec));
else fs.writeFileSync(new URL("./queue.json", import.meta.url), JSON.stringify({ note: "ELEVEX Apps clips for TikTok @elevexapps. Each clip is rendered from its spec at post time by the tsw-video renderer; only clips with ready:true are posted, in this order. Regenerate with: node apps/build_specs.mjs", clips: FINAL }, null, 1));
