// Landing page for Slick Car Rentals

function Landing({ setRoute, tweaks, copy }) {
  const S = window.SLICK;
  const featured = S.CARS.slice(0, 3);
  const sportsCar = S.CARS.find(c => c.id === "c19");

  // Quick date search state
  const [quickStart, setQuickStart] = _R.useState(S.todayIso());
  const [quickEnd, setQuickEnd] = _R.useState(S.isoDay(S.addDays(new Date(), 3)));
  const [tier, setTier] = _R.useState("All");

  function go() {
    setRoute({ name: "fleet", filter: { start: quickStart, end: quickEnd, tier } });
  }

  const heroVariant = tweaks.heroVariant || "split";

  return (
    <div data-screen-label="01 Landing">
      {/* HERO */}
      {heroVariant === "split" && (
        <section className="hero">
          <div className="hero-glow gold"></div>
          <div className="hero-glow warm"></div>
          <div className="hero-grid">
            <div>
              <span className="hero-eyebrow">Melton VIC · Same-day pickup</span>
              <h1>{copy.hero_h1_a}<br/><span className="gold">{copy.hero_h1_b}</span></h1>
              <p className="lede">{copy.hero_sub}</p>
              <div className="hero-cta">
                <button className="btn btn-primary btn-lg" onClick={() => setRoute({ name: "book" })}>
                  {copy.cta_book} <I.arrowRight size={16}/>
                </button>
                <button className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,.06)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }} onClick={() => setRoute({ name: "fleet" })}>
                  {copy.cta_browse}
                </button>
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: 28, color: "rgba(255,255,255,.6)", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <I.star size={14} fill="var(--accent)" style={{ color: "var(--accent)" }} /> 4.9 · 312 reviews
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <I.shield size={14} style={{ color: "var(--accent)" }} /> Comprehensive insurance
                </div>
              </div>
            </div>
            <div className="hero-art">
              <img src={sportsCar.img} alt="" />
              <div className="hero-art-card">
                <div>
                  <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", opacity: .7 }}>Featured this week</div>
                  <div className="hero-art-name">Porsche 911</div>
                </div>
                <div className="hero-art-price">FROM ${sportsCar.price}/DAY</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {heroVariant === "minimal" && (
        <section className="hero" style={{ borderBottom: "none" }}>
          <div className="hero-glow gold"></div>
          <div className="container" style={{ padding: "120px 24px 100px", textAlign: "center", position: "relative" }}>
            <span className="hero-eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Melton VIC · 20 vehicles · 7 days</span>
            <h1 style={{ marginInline: "auto", maxWidth: 900, textAlign: "center" }}>{copy.hero_h1_a} <span className="gold">{copy.hero_h1_b}</span></h1>
            <p className="lede" style={{ color: "rgba(255,255,255,.7)", margin: "20px auto 0" }}>{copy.hero_sub}</p>
            <div className="hero-cta" style={{ justifyContent: "center" }}>
              <button className="btn btn-primary btn-lg" onClick={() => setRoute({ name: "book" })}>{copy.cta_book} <I.arrowRight size={16}/></button>
              <button className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,.06)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }} onClick={() => setRoute({ name: "fleet" })}>{copy.cta_browse}</button>
            </div>
          </div>
        </section>
      )}

      {/* Quick-pick band */}
      <section style={{ background: "var(--cream)", padding: "32px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="panel" style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr auto", gap: 16, alignItems: "end", marginBottom: 0, padding: 18 }}>
            <div style={{ paddingRight: 8, borderRight: "1px solid var(--line)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="eyebrow">Find a car</div>
              <div className="h3" style={{ marginTop: 4 }}>Quick search</div>
            </div>
            <div className="field">
              <label>Pickup</label>
              <input type="date" className="input" value={quickStart} min={S.todayIso()} onChange={(e) => setQuickStart(e.target.value)} />
            </div>
            <div className="field">
              <label>Drop-off</label>
              <input type="date" className="input" value={quickEnd} min={quickStart} onChange={(e) => setQuickEnd(e.target.value)} />
            </div>
            <div className="field">
              <label>Vehicle Type</label>
              <select className="select" value={tier} onChange={(e) => setTier(e.target.value)}>
                {S.TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-lg" onClick={go}>
              Search Fleet <I.arrowRight size={14}/>
            </button>
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="eyebrow">The Fleet</span>
              <h2 className="h2" style={{ marginTop: 8 }}>{copy.section_fleet_h2_a} <span style={{ color: "var(--accent-deep)" }}>{copy.section_fleet_h2_b}</span></h2>
              <p className="lede" style={{ marginTop: 10 }}>Economy hatches, family SUVs, work utes, and a few proper toys for the weekend.</p>
            </div>
            <button className="btn btn-dark" onClick={() => setRoute({ name: "fleet" })}>
              See All 20 Cars <I.arrowRight size={14}/>
            </button>
          </div>
          <div className="fleet-grid">
            {featured.map(car => (
              <CarCard key={car.id} car={car} onClick={() => setRoute({ name: "car", carId: car.id })} />
            ))}
            <CarCard car={S.CARS[16]} onClick={() => setRoute({ name: "car", carId: S.CARS[16].id })} />
            <CarCard car={S.CARS[8]} onClick={() => setRoute({ name: "car", carId: S.CARS[8].id })} />
            <CarCard car={S.CARS[18]} onClick={() => setRoute({ name: "car", carId: S.CARS[18].id })} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2 className="h2" style={{ marginTop: 8 }}>{copy.section_how_a} <span style={{ color: "var(--accent-deep)" }}>{copy.section_how_b}</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {[
              { n: "01", icon: <I.calendar size={28}/>, t: "Pick your dates", d: "Tell us when you need a car. We'll show you what's free that week." },
              { n: "02", icon: <I.key size={28}/>, t: "Pick your wheels", d: "Hatch, SUV, ute, or the M3 — whatever suits the job. Real photos, real specs." },
              { n: "03", icon: <I.car size={28}/>, t: "Pick up the keys", d: "Drop into our Melton yard, sign the form, drive away. Usually under 10 minutes." },
            ].map((step, i) => (
              <div key={i} className="panel" style={{ position: "relative", paddingTop: 40 }}>
                <div style={{ position: "absolute", top: -20, left: 24, background: "var(--accent)", color: "#0a0a0a", fontFamily: "var(--font-display)", fontSize: 22, padding: "6px 14px", borderRadius: 4, letterSpacing: ".06em" }}>{step.n}</div>
                <div style={{ background: "var(--cream)", width: 56, height: 56, borderRadius: 10, display: "grid", placeItems: "center", color: "var(--accent-deep)", marginBottom: 16 }}>
                  {step.icon}
                </div>
                <h3 className="h3">{step.t}</h3>
                <p className="lede" style={{ fontSize: 15, marginTop: 8 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2 className="h2" style={{ marginTop: 8 }}>The longer you hire, <span style={{ color: "var(--accent-deep)" }}>the more you save.</span></h2>
            <p className="lede" style={{ marginTop: 10 }}>One simple discount system. Applies to every car. No codes, no fine print.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, maxWidth: 1080, margin: "0 auto" }}>
            {[
              { label: "Daily", days: "1–6 days", price: "Full rate", note: "Perfect for a weekend escape or a quick trip.", discount: "" },
              { label: "Weekly", days: "7–27 days", price: "10% off", note: "Automatic discount applied at checkout — book any 7+ days.", discount: "10%", popular: true },
              { label: "Monthly", days: "28+ days", price: "20% off", note: "For longer projects, extended visits, or that big trip.", discount: "20%" },
            ].map((p, i) => (
              <div key={i} className="panel" style={{ position: "relative", padding: 28, borderColor: p.popular ? "var(--accent)" : "var(--line)", borderWidth: p.popular ? 2 : 1, boxShadow: p.popular ? "var(--sh-gold)" : "none" }}>
                {p.popular && <div style={{ position: "absolute", top: -12, left: 24, background: "var(--accent)", color: "#0a0a0a", fontFamily: "var(--font-head)", fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 4 }}>Most popular</div>}
                <div className="eyebrow">{p.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: p.popular ? "var(--accent-deep)" : "var(--text)", lineHeight: 1, marginTop: 8 }}>{p.price}</div>
                <div className="tiny" style={{ marginTop: 6 }}>{p.days}</div>
                <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us strip */}
      <section style={{ padding: "72px 0", background: "var(--cream)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              { v: "20", l: "Vehicles in fleet" },
              { v: "0", l: "Hidden fees, ever" },
              { v: "24/7", l: "Roadside cover" },
              { v: "10min", l: "Pickup time" },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: i ? "1px solid var(--line)" : "none", paddingLeft: i ? 28 : 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 64, color: "var(--accent-deep)", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: ".12em", marginTop: 10, color: "var(--text-2)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {[
              { name: "Sarah M.", car: "RAV4 · 7 days", q: "Easy as. Picked up at 8am Saturday, dropped back the next Friday. The car was spotless and the booking took five minutes flat." },
              { name: "Bluegum Builders", car: "HiLux · monthly", q: "We use Slick when our work ute is in for service. They've never let us down, prices are fair, and the boys know us by name." },
              { name: "Beck & Vic", car: "Mustang GT · weekend", q: "Booked the Mustang for our anniversary. Best weekend we've had in years — and the sound of that V8 is something else." },
            ].map((t, i) => (
              <div key={i} className="panel" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 2, color: "var(--accent)" }}>
                  {[...Array(5)].map((_, j) => <I.star key={j} size={16} fill="var(--accent)" />)}
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.55, margin: 0, color: "var(--text)" }}>"{t.q}"</p>
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div className="tiny">{t.car}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark" style={{ padding: "80px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>Ready when you are</span>
          <h2 className="h2" style={{ color: "#fff", marginTop: 12, fontSize: "clamp(32px, 4vw, 56px)" }}>
            {copy.cta_final_a} <span style={{ color: "var(--accent)" }}>{copy.cta_final_b}</span>
          </h2>
          <p className="lede" style={{ color: "rgba(255,255,255,.7)", margin: "16px auto 28px" }}>
            {copy.cta_final_sub}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => setRoute({ name: "book" })}>
              {copy.cta_start} <I.arrowRight size={16}/>
            </button>
            <a className="btn btn-ghost btn-lg" href="tel:0423410701" style={{ color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>
              <I.phone size={14}/> {copy.cta_call}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

window.Landing = Landing;
