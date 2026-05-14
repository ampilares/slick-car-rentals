// Fleet listing + car detail

function Fleet({ setRoute, initialFilter, bookings, blocks, copy }) {
  const S = window.SLICK;
  const [tier, setTier] = _R.useState(initialFilter?.tier || "All");
  const [sort, setSort] = _R.useState("price-asc");
  const [search, setSearch] = _R.useState("");
  const [start, setStart] = _R.useState(initialFilter?.start || "");
  const [end, setEnd] = _R.useState(initialFilter?.end || "");

  // filter
  const filtered = _R.useMemo(() => {
    let list = S.CARS.slice();
    if (tier !== "All") list = list.filter(c => c.tier === tier);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.tier.toLowerCase().includes(q));
    }
    if (start && end) {
      // remove cars booked or blocked within range
      list = list.filter(c => {
        const overlap = (ranges) => ranges.some(r => r.carId === c.id && !(r.end <= start || r.start >= end));
        if (overlap(bookings)) return false;
        if (overlap(blocks)) return false;
        return true;
      });
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [tier, search, sort, start, end, bookings, blocks]);

  const dayCount = start && end ? S.daysBetween(start, end) : 0;

  return (
    <div data-screen-label="02 Fleet">
      {/* Header band */}
      <section style={{ background: "var(--ink)", color: "#fff", padding: "56px 0 64px", borderBottom: "4px solid var(--accent)", position: "relative", overflow: "hidden" }}>
        <div className="hero-glow gold" style={{ top: -200, right: -200, left: "auto" }}></div>
        <div className="container" style={{ position: "relative" }}>
          <span className="hero-eyebrow">The Fleet · Melton VIC</span>
          <h1 className="h1" style={{ color: "#fff", marginTop: 12, marginBottom: 8 }}>Every car. <span style={{ color: "var(--accent)" }}>Every spec.</span></h1>
          <p className="lede" style={{ color: "rgba(255,255,255,.72)" }}>20 vehicles, all serviced in-house. Click any car for full details and to book.</p>
        </div>
      </section>

      <section style={{ padding: "32px 0", background: "var(--cream)" }}>
        <div className="container">
          {/* Date pre-filter */}
          <div className="filter-bar">
            <div className="filter-field" style={{ flex: ".4" }}>
              <label>Pickup</label>
              <input type="date" className="input" value={start} min={S.todayIso()} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="filter-field" style={{ flex: ".4" }}>
              <label>Drop-off</label>
              <input type="date" className="input" value={end} min={start || S.todayIso()} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="filter-field" style={{ flex: 1 }}>
              <label>Search</label>
              <div style={{ position: "relative" }}>
                <I.search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input className="input" placeholder="e.g. RAV4, BMW, ute…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }}/>
              </div>
            </div>
            <div className="filter-field" style={{ flex: ".5", maxWidth: 200 }}>
              <label>Sort by</label>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
                <option value="name">Name · A→Z</option>
              </select>
            </div>
          </div>

          {/* tier chips */}
          <div className="chip-row" style={{ marginBottom: 22 }}>
            {S.TIERS.map(t => (
              <button key={t} className={"chip" + (tier === t ? " active" : "")} onClick={() => setTier(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* Status line */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, fontSize: 13, color: "var(--text-2)" }}>
            <div>
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "vehicle" : "vehicles"}
              {dayCount > 0 && <> · available for <strong>{dayCount} {dayCount === 1 ? "day" : "days"}</strong> ({S.fmtDateShort(start)} → {S.fmtDateShort(end)})</>}
            </div>
            {dayCount > 0 && <button className="btn btn-ghost btn-sm" onClick={() => { setStart(""); setEnd(""); }}>Clear dates</button>}
          </div>

          {filtered.length === 0 ? (
            <div className="panel" style={{ textAlign: "center", padding: 48 }}>
              <I.search size={32} style={{ color: "var(--muted)", marginBottom: 12 }}/>
              <h3 className="h3">No cars match those filters.</h3>
              <p className="lede" style={{ margin: "8px auto 16px" }}>Try a different vehicle type, or pick different dates.</p>
              <button className="btn btn-dark" onClick={() => { setTier("All"); setSearch(""); setStart(""); setEnd(""); }}>Reset filters</button>
            </div>
          ) : (
            <div className="fleet-grid">
              {filtered.map(car => (
                <CarCard key={car.id} car={car} onClick={() => setRoute({ name: "car", carId: car.id, prefill: dayCount > 0 ? { start, end } : null })} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- CAR DETAIL ----------
function CarDetail({ carId, setRoute, bookings, blocks, prefill }) {
  const S = window.SLICK;
  const car = S.CARS.find(c => c.id === carId);
  if (!car) return <div className="container section"><h2>Car not found.</h2></div>;

  function start() {
    setRoute({ name: "book", carId: car.id, prefill });
  }

  const carBookings = bookings.filter(b => b.carId === car.id);
  const carBlocks = blocks.filter(b => b.carId === car.id);

  return (
    <div data-screen-label="03 Car Detail">
      <section style={{ background: "var(--ink)", color: "#fff", paddingBottom: 0, position: "relative", overflow: "hidden" }}>
        <div className="hero-glow gold" style={{ top: -180 }}></div>
        <div className="container" style={{ padding: "32px 24px 0", position: "relative" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "#fff", borderColor: "rgba(255,255,255,.2)", background: "transparent" }} onClick={() => setRoute({ name: "fleet" })}>
            <I.chevronLeft size={14}/> Back to fleet
          </button>
        </div>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, padding: "32px 24px 56px", position: "relative", alignItems: "center" }}>
          <div style={{ aspectRatio: "16/10", borderRadius: 16, overflow: "hidden", background: "#111", boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)" }}>
            <img src={car.img} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
          <div>
            <span className="hero-eyebrow">{car.tier} · {car.year}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", letterSpacing: ".01em", lineHeight: .95, color: "#fff", margin: "12px 0 12px" }}>{car.name}</h1>
            <p className="lede" style={{ color: "rgba(255,255,255,.74)" }}>{car.blurb}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "26px 0 18px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 72, color: "var(--accent)", lineHeight: 1 }}>${car.price}</span>
              <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 600 }}>/ per day · inc. insurance</span>
            </div>
            <button className="btn btn-primary btn-lg" onClick={start}>
              Book This Car <I.arrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
            <div>
              <span className="eyebrow">The Specs</span>
              <h2 className="h2" style={{ marginTop: 8, marginBottom: 24 }}>What you're driving.</h2>
              <div className="spec-list">
                <div className="spec-item"><div className="lbl">Seats</div><div className="val">{car.seats}</div></div>
                <div className="spec-item"><div className="lbl">Doors</div><div className="val">{car.doors}</div></div>
                <div className="spec-item"><div className="lbl">Transmission</div><div className="val">{car.transmission}</div></div>
                <div className="spec-item"><div className="lbl">Fuel</div><div className="val">{car.fuel}</div></div>
                <div className="spec-item"><div className="lbl">Luggage</div><div className="val">{car.luggage} bags</div></div>
                <div className="spec-item"><div className="lbl">Kilometres</div><div className="val">{car.mileage}</div></div>
              </div>

              <h3 className="h3" style={{ marginTop: 36, marginBottom: 16 }}>Features included</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {car.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", color: "#0a0a0a", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <I.check size={12} strokeWidth={3}/>
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <h3 className="h3" style={{ marginTop: 36, marginBottom: 16 }}>What's included</h3>
              <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 10, color: "var(--text-2)" }}>
                <li style={{ display: "flex", gap: 10 }}><I.shield size={18} style={{ color: "var(--accent-deep)", flexShrink: 0 }}/>Comprehensive insurance with $1,500 excess</li>
                <li style={{ display: "flex", gap: 10 }}><I.zap size={18} style={{ color: "var(--accent-deep)", flexShrink: 0 }}/>24/7 roadside assistance Australia-wide</li>
                <li style={{ display: "flex", gap: 10 }}><I.fuel size={18} style={{ color: "var(--accent-deep)", flexShrink: 0 }}/>Full tank pickup, full tank return</li>
                <li style={{ display: "flex", gap: 10 }}><I.mapPin size={18} style={{ color: "var(--accent-deep)", flexShrink: 0 }}/>Unlimited kms within Victoria · interstate by request</li>
              </ul>
            </div>

            <aside style={{ position: "sticky", top: 96 }}>
              <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ background: "var(--ink)", color: "#fff", padding: 20 }}>
                  <div className="eyebrow" style={{ color: "var(--accent)" }}>Quick book</div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, marginTop: 6 }}>${car.price}<span style={{ fontSize: 14, fontWeight: 500, opacity: .6 }}>/day</span></div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", gap: 8, padding: "12px 14px", background: "var(--cream)", borderRadius: 8, alignItems: "center", marginBottom: 16, fontSize: 13 }}>
                    <I.mapPin size={16} style={{ color: "var(--accent-deep)" }}/>
                    <div><strong>4/23–25 Norton Dr</strong><div className="tiny">Melton VIC 3337</div></div>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={start}>
                    Check Availability <I.arrowRight size={14}/>
                  </button>
                  <div className="tiny" style={{ textAlign: "center", marginTop: 12 }}>No card required to check dates.</div>
                </div>
              </div>

              {/* upcoming bookings preview */}
              {(carBookings.length + carBlocks.length) > 0 && (
                <div className="panel" style={{ marginTop: 16 }}>
                  <h4 className="h4" style={{ marginBottom: 10 }}>Already booked / unavailable</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[...carBookings.map(b => ({ ...b, kind: "Booked" })), ...carBlocks.map(b => ({ ...b, kind: "Maintenance", name: b.reason }))]
                      .sort((a, b) => a.start.localeCompare(b.start))
                      .slice(0, 5)
                      .map((b, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                          <div>{S.fmtDateShort(b.start)} → {S.fmtDateShort(b.end)}</div>
                          <span className={"badge " + (b.kind === "Booked" ? "badge-danger" : "badge-soft")}>{b.kind}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

window.Fleet = Fleet;
window.CarDetail = CarDetail;
