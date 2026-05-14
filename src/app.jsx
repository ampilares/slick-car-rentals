// Top-level app shell, routing, and Tweaks

const _R = React;

function App() {
  const S = window.SLICK;
  const [route, _setRoute] = _R.useState({ name: "home" });
  const [bookings, setBookings] = _R.useState(() => S.buildMockBookings());
  const [blocks, setBlocks] = _R.useState(() => S.buildMockBlocks());
  const [signedIn, setSignedIn] = _R.useState(false);
  const [showSignIn, setShowSignIn] = _R.useState(false);

  function setRoute(r) {
    // gate admin
    if (r.name === "admin" && !signedIn) {
      setShowSignIn(true);
      return;
    }
    _setRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function addBooking(b) {
    setBookings(list => [...list, b]);
  }

  function handleSignIn() {
    setSignedIn(true);
    setShowSignIn(false);
    _setRoute({ name: "admin" });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleSignOut() {
    setSignedIn(false);
    _setRoute({ name: "home" });
  }

  // Tweaks
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const copy = S.COPY[tweaks.copyTone] || S.COPY.matey;

  // Apply tweaks to root
  _R.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = tweaks.dark ? "dark" : "light";
    const accentMap = {
      "#D4A24C": { deep: "#B6822E", soft: "#F0D899", band: "#E8C66F" },
      "#E89540": { deep: "#C66B14", soft: "#F8D5A6", band: "#F2B66E" },
      "#E14B3A": { deep: "#A6261A", soft: "#F8C9C2", band: "#EE8E80" },
      "#3D7DE0": { deep: "#22569F", soft: "#C5D9F7", band: "#84A9E6" },
      "#A8C82D": { deep: "#688019", soft: "#E1ECA6", band: "#C5D962" },
    };
    const a = { a: tweaks.accent, ...(accentMap[tweaks.accent] || accentMap["#D4A24C"]) };
    root.style.setProperty("--accent", a.a);
    root.style.setProperty("--accent-deep", a.deep);
    root.style.setProperty("--accent-soft", a.soft);
    root.style.setProperty("--accent-band", a.band);
  }, [tweaks.dark, tweaks.accent]);

  const isAdmin = route.name === "admin";

  return (
    <>
      {!isAdmin && <Nav route={route} setRoute={setRoute} onSignIn={() => setShowSignIn(true)} signedIn={signedIn} onSignOut={handleSignOut} />}

      {route.name === "home" && <Landing setRoute={setRoute} tweaks={tweaks} copy={copy} />}
      {route.name === "fleet" && <Fleet setRoute={setRoute} initialFilter={route.filter} bookings={bookings} blocks={blocks} copy={copy} />}
      {route.name === "car" && <CarDetail carId={route.carId} setRoute={setRoute} bookings={bookings} blocks={blocks} prefill={route.prefill} copy={copy} />}
      {route.name === "book" && <Booking setRoute={setRoute} carId={route.carId} prefill={route.prefill} bookings={bookings} blocks={blocks} addBooking={addBooking} copy={copy} />}
      {route.name === "how" && <HowItWorks setRoute={setRoute} copy={copy} />}
      {route.name === "admin" && <Admin S={S} bookings={bookings} setBookings={setBookings} blocks={blocks} setBlocks={setBlocks} setRoute={setRoute} onSignOut={handleSignOut} />}

      {!isAdmin && <Footer/>}

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} onSignIn={handleSignIn} />

      {/* Tweaks Panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakToggle label="Dark mode" value={tweaks.dark} onChange={(v) => setTweak("dark", v)} />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#D4A24C", "#E89540", "#E14B3A", "#3D7DE0", "#A8C82D"]}
          />
        </TweakSection>

        <TweakSection label="Copy & Layout">
          <TweakRadio
            label="Copy tone"
            value={tweaks.copyTone}
            onChange={(v) => setTweak("copyTone", v)}
            options={[
              { label: "Matey", value: "matey" },
              { label: "Neutral", value: "neutral" },
            ]}
          />
          <TweakRadio
            label="Hero layout"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak("heroVariant", v)}
            options={[
              { label: "Split", value: "split" },
              { label: "Minimal", value: "minimal" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Quick demo">
          <TweakButton label="Jump to booking" onClick={() => setRoute({ name: "book" })} />
          <TweakButton label="Sign in & open admin" onClick={() => { setSignedIn(true); _setRoute({ name: "admin" }); }} secondary />
          <TweakButton label="Open BMW M3 detail" onClick={() => setRoute({ name: "car", carId: "c17" })} secondary />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ----- How It Works page -----
function HowItWorks({ setRoute, copy }) {
  return (
    <div data-screen-label="07 How It Works">
      <section style={{ background: "var(--ink)", color: "#fff", padding: "60px 0 70px", position: "relative", overflow: "hidden" }}>
        <div className="hero-glow gold"></div>
        <div className="container" style={{ position: "relative" }}>
          <span className="hero-eyebrow">How it works</span>
          <h1 className="h1" style={{ color: "#fff", marginTop: 10, fontSize: "clamp(36px, 5vw, 64px)" }}>Booking a car here<br/>is <span style={{ color: "var(--accent)" }}>actually easy.</span></h1>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          {[
            { n: "01", t: "Pick dates", d: "Choose the days you want a car. Our calendar shows you exactly what's free and what's already spoken for." },
            { n: "02", t: "Pick a car", d: "20 vehicles. Hatch, SUV, ute, premium sedan, weekend toy. Click into any car for the full spec sheet." },
            { n: "03", t: "Give us your details", d: "Name, mobile, email, licence number. That's it." },
            { n: "04", t: "Pay securely", d: "Pay the full booking up front by card. Encrypted end-to-end. Refundable up to 24h before pickup." },
            { n: "05", t: "Get the confirmation", d: "You'll get an instant SMS with the booking code and a receipt by email. One of us will give you a quick ring to confirm." },
            { n: "06", t: "Pick up the keys", d: "Roll into our Melton yard on the day. Bring your physical licence and the card you paid with for the $1,500 insurance hold. We'll do a quick walkaround and you're off." },
            { n: "07", t: "Drop it back", d: "Return the car with a full tank by the agreed time. We'll do the same walkaround in reverse. You're done." },
          ].map((s, i, arr) => (
            <div key={i} className="how-step-row" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, paddingBottom: 32, marginBottom: 32, borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div style={{ width: 56, height: 56, background: "var(--accent)", color: "#0a0a0a", borderRadius: 8, display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: ".04em" }}>{s.n}</div>
              <div>
                <h3 className="h3" style={{ marginBottom: 8 }}>{s.t}</h3>
                <p className="lede" style={{ margin: 0 }}>{s.d}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button className="btn btn-primary btn-lg" onClick={() => setRoute({ name: "book" })}>{copy.cta_start} <I.arrowRight size={16}/></button>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container-narrow">
          <span className="eyebrow">Common questions</span>
          <h2 className="h2" style={{ marginTop: 8, marginBottom: 24 }}>The bits people always ask.</h2>
          {[
            { q: "When does my card get charged?", a: "Your card is charged in full when you complete the booking. Full refund if you cancel more than 24 hours before pickup; 50% refund within 24 hours." },
            { q: "Do you offer weekly or monthly discounts?", a: "Yep. Bookings of 7 days or more get an automatic 10% discount. Bookings of 28 days or more get 20% off. The discount applies automatically at checkout — no code needed." },
            { q: "What's the minimum hire age?", a: "21 for economy and family SUVs, 25 for premium and luxury sport. Drivers under 25 will pay a small young-driver surcharge — it's flagged at booking." },
            { q: "Can I drive interstate?", a: "Yes, by request at booking. Some restrictions apply to the luxury sport tier (no off-bitumen, no track use, please)." },
            { q: "What if the car breaks down?", a: "24/7 roadside assistance is included on every car, every booking. Call the number on your booking confirmation and we'll sort it." },
            { q: "What's the fuel policy?", a: "Pick up full, return full. Easy. If you don't, we'll refuel and charge the cost plus a small fee — but we'd rather you didn't, and neither would you." },
          ].map((f, i) => (
            <details key={i} className="panel" style={{ marginBottom: 10, padding: 0 }}>
              <summary style={{ padding: 18, cursor: "pointer", fontWeight: 700, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {f.q}
                <I.chevronDown size={18} style={{ color: "var(--accent-deep)" }}/>
              </summary>
              <div style={{ padding: "0 18px 18px", color: "var(--text-2)", lineHeight: 1.6 }}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

window.App = App;
window.HowItWorks = HowItWorks;
