// Admin panel — fleet list, calendar block editor, bookings list, stats

function Admin({ S, bookings, setBookings, blocks, setBlocks, setRoute, onSignOut }) {
  const [tab, setTab] = _R.useState("dashboard");
  const [selectedCarId, setSelectedCarId] = _R.useState(null);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <I.grid size={16}/> },
    { id: "calendar", label: "Calendar", icon: <I.calendar size={16}/> },
    { id: "bookings", label: "Bookings", icon: <I.list size={16}/> },
    { id: "fleet", label: "Fleet", icon: <I.car size={16}/> },
  ];

  return (
    <div data-screen-label="06 Admin" className="admin-layout">
      <aside className="admin-side">
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 16 }}>
          <Logo/>
          <div style={{ marginTop: 14, fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>Admin Console</div>
        </div>
        {tabs.map(t => (
          <a key={t.id} href="#" className={"admin-side-link" + (tab === t.id ? " active" : "")} onClick={(e) => { e.preventDefault(); setTab(t.id); }}>
            {t.icon} {t.label}
          </a>
        ))}
        <div style={{ marginTop: "auto", padding: "20px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <a href="#" className="admin-side-link" style={{ padding: "10px 0", borderLeft: "none" }} onClick={(e) => { e.preventDefault(); setRoute({ name: "home" }); }}>
            <I.chevronLeft size={14}/> Back to site
          </a>
          <a href="#" className="admin-side-link" style={{ padding: "10px 0", borderLeft: "none", color: "rgba(255,255,255,.5)" }} onClick={(e) => { e.preventDefault(); onSignOut && onSignOut(); }}>
            <I.x size={14}/> Sign out
          </a>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "dashboard" && <AdminDashboard S={S} bookings={bookings} blocks={blocks} setTab={setTab} setSelectedCarId={setSelectedCarId} />}
        {tab === "calendar" && <AdminCalendar S={S} bookings={bookings} blocks={blocks} setBlocks={setBlocks} selectedCarId={selectedCarId} setSelectedCarId={setSelectedCarId} />}
        {tab === "bookings" && <AdminBookings S={S} bookings={bookings} setBookings={setBookings} />}
        {tab === "fleet" && <AdminFleet S={S} bookings={bookings} blocks={blocks} onPickCar={(id) => { setSelectedCarId(id); setTab("calendar"); }} />}
      </main>
    </div>
  );
}

// -- dashboard --
function AdminDashboard({ S, bookings, blocks, setTab, setSelectedCarId }) {
  const today = S.todayIso();
  const upcoming = bookings.filter(b => b.end >= today).sort((a, b) => a.start.localeCompare(b.start));
  const active = upcoming.filter(b => b.start <= today && b.end > today);
  const next7 = upcoming.filter(b => b.start >= today && b.start <= S.isoDay(S.addDays(new Date(), 7)));
  const totalRevenue = bookings.reduce((sum, b) => {
    const car = S.CARS.find(c => c.id === b.carId);
    if (!car) return sum;
    return sum + (b.total || car.price * S.daysBetween(b.start, b.end));
  }, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 24 }}>
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="h1" style={{ fontSize: 32, marginTop: 4 }}>G'day, Slick admin.</h1>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{S.fmtDate(new Date())}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <div className="stat"><div className="stat-num">{active.length}</div><div className="stat-label">Cars Out Today</div></div>
        <div className="stat"><div className="stat-num">{next7.length}</div><div className="stat-label">Pickups Next 7 Days</div></div>
        <div className="stat"><div className="stat-num">{S.CARS.length - active.length}</div><div className="stat-label">Available Now</div></div>
        <div className="stat"><div className="stat-num">${(totalRevenue / 1000).toFixed(1)}k</div><div className="stat-label">Revenue Booked</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 className="h3">Next pickups</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>See all</button>
          </div>
          {upcoming.slice(0, 6).map(b => {
            const car = S.CARS.find(c => c.id === b.carId);
            return (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ width: 60, height: 40, borderRadius: 5, overflow: "hidden", flexShrink: 0, background: "#222" }}>
                  <img src={car?.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{b.name}</div>
                  <div className="tiny">{car?.name} · {S.fmtDateShort(b.start)} → {S.fmtDateShort(b.end)}</div>
                </div>
                <span className={"badge " + (b.status === "pending" ? "badge-soft" : "badge-success")}>
                  <span className={"dot " + (b.status === "pending" ? "dot-pending" : "dot-active")}></span>
                  {b.status || "confirmed"}
                </span>
              </div>
            );
          })}
          {upcoming.length === 0 && <div className="lede" style={{ textAlign: "center", padding: 24 }}>Nothing on the books. Quiet week.</div>}
        </div>

        <div className="panel">
          <h3 className="h3" style={{ marginBottom: 16 }}>Fleet utilisation · this week</h3>
          {(() => {
            const counts = {};
            S.CARS.forEach(c => counts[c.tier] = { booked: 0, total: 0 });
            S.CARS.forEach(c => counts[c.tier].total++);
            const weekEnd = S.isoDay(S.addDays(new Date(), 7));
            bookings.forEach(b => {
              const car = S.CARS.find(c => c.id === b.carId);
              if (!car) return;
              if (b.start <= weekEnd && b.end >= today) counts[car.tier].booked++;
            });
            return Object.entries(counts).map(([tier, c]) => {
              const pct = (c.booked / c.total) * 100;
              return (
                <div key={tier} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{tier}</span>
                    <span className="tiny">{c.booked}/{c.total}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--cream-2)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 70 ? "var(--danger)" : "var(--accent)", transition: "width .3s" }}></div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

// -- calendar/availability editor --
function AdminCalendar({ S, bookings, blocks, setBlocks, selectedCarId, setSelectedCarId }) {
  const car = selectedCarId ? S.CARS.find(c => c.id === selectedCarId) : null;
  const today = new Date();
  const [calMonth, setCalMonth] = _R.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [blockDraft, setBlockDraft] = _R.useState({ start: null, end: null, reason: "Service" });

  function changeMonth(delta) {
    let { y, m } = calMonth;
    m += delta;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth({ y, m });
  }

  const carBookings = car ? bookings.filter(b => b.carId === car.id) : [];
  const carBlocks = car ? blocks.filter(b => b.carId === car.id) : [];

  function addBlock() {
    if (!blockDraft.start || !blockDraft.end || !car) return;
    setBlocks([...blocks, { carId: car.id, start: blockDraft.start, end: blockDraft.end, reason: blockDraft.reason }]);
    setBlockDraft({ start: null, end: null, reason: "Service" });
  }
  function removeBlock(i) {
    const target = carBlocks[i];
    setBlocks(blocks.filter(b => b !== target));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Availability</span>
          <h1 className="h1" style={{ fontSize: 32, marginTop: 4 }}>Per-car calendar</h1>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 6 }}>Choose a car</label>
          <select className="select" value={selectedCarId || ""} onChange={(e) => setSelectedCarId(e.target.value)}>
            <option value="">— Pick a vehicle —</option>
            {S.CARS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>)}
          </select>
        </div>
        {car && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 8px 0 16px", borderLeft: "1px solid var(--line)" }}>
            <div style={{ width: 64, height: 42, borderRadius: 5, overflow: "hidden" }}>
              <img src={car.img} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{car.name}</div>
              <div className="tiny">${car.price}/day · {car.tier}</div>
            </div>
          </div>
        )}
      </div>

      {!car ? (
        <div className="panel" style={{ textAlign: "center", padding: 48 }}>
          <I.calendar size={32} style={{ color: "var(--muted)", marginBottom: 12 }}/>
          <h3 className="h3">Pick a car to manage its calendar</h3>
          <p className="lede" style={{ margin: "8px auto" }}>You can block dates for service, detailing, or anything else.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          <div>
            <Calendar
              year={calMonth.y} month={calMonth.m}
              onMonth={changeMonth}
              mode="range"
              selected={blockDraft}
              onSelect={(r) => setBlockDraft({ ...blockDraft, ...r })}
              bookings={carBookings}
              blocks={carBlocks}
            />
            <div className="legend">
              <span><span className="legend-swatch" style={{ background: "var(--accent)" }}></span>New block (selecting)</span>
              <span><span className="legend-swatch" style={{ background: "#FDE9E5" }}></span>Customer booking</span>
              <span><span className="legend-swatch" style={{ background: "repeating-linear-gradient(45deg,#FDE9E5,#FDE9E5 3px,#FBD9D2 3px,#FBD9D2 6px)" }}></span>Maintenance block</span>
            </div>
          </div>

          <div>
            <div className="panel">
              <h3 className="h3" style={{ marginBottom: 16 }}>Add maintenance block</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="field">
                  <label>From → To</label>
                  <div style={{ fontWeight: 600, padding: "11px 12px", background: "var(--cream)", borderRadius: 6, fontSize: 14 }}>
                    {blockDraft.start ? S.fmtDateShort(blockDraft.start) : "—"} → {blockDraft.end ? S.fmtDateShort(blockDraft.end) : "—"}
                  </div>
                  <span className="tiny">Click two dates in the calendar to set the range.</span>
                </div>
                <div className="field">
                  <label>Reason</label>
                  <select className="select" value={blockDraft.reason} onChange={(e) => setBlockDraft({ ...blockDraft, reason: e.target.value })}>
                    <option>Service</option>
                    <option>Detailing</option>
                    <option>Tyre rotation</option>
                    <option>Maintenance</option>
                    <option>Owner use</option>
                    <option>Other</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={addBlock} disabled={!blockDraft.start || !blockDraft.end}>
                  <I.plus size={14}/> Block these dates
                </button>
              </div>
            </div>

            <div className="panel" style={{ marginTop: 16 }}>
              <h3 className="h3" style={{ marginBottom: 12 }}>Active blocks</h3>
              {carBlocks.length === 0 && <div className="tiny" style={{ padding: 8 }}>No blocks. This car is fully available outside of customer bookings.</div>}
              {carBlocks.map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{S.fmtDateShort(b.start)} → {S.fmtDateShort(b.end)}</div>
                    <div className="tiny">{b.reason}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeBlock(i)}>
                    <I.trash size={14}/>
                  </button>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 16 }}>
              <h3 className="h3" style={{ marginBottom: 12 }}>Customer bookings ({carBookings.length})</h3>
              {carBookings.length === 0 && <div className="tiny">No bookings on this car.</div>}
              {carBookings.map(b => (
                <div key={b.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: 14 }}>{b.name}</strong>
                    <span className="tiny" style={{ fontFamily: "var(--font-display)", letterSpacing: ".06em" }}>{b.id}</span>
                  </div>
                  <div className="tiny">{S.fmtDateShort(b.start)} → {S.fmtDateShort(b.end)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -- bookings list --
function AdminBookings({ S, bookings, setBookings }) {
  const [filter, setFilter] = _R.useState("all");
  const today = S.todayIso();
  const filtered = bookings.filter(b => {
    if (filter === "all") return true;
    if (filter === "upcoming") return b.start >= today;
    if (filter === "active") return b.start <= today && b.end > today;
    if (filter === "past") return b.end < today;
    if (filter === "pending") return b.status === "pending";
    return true;
  }).sort((a, b) => a.start.localeCompare(b.start));

  function cancel(b) {
    if (confirm(`Cancel ${b.id} for ${b.name}?`)) {
      setBookings(bookings.filter(x => x !== b));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Bookings</span>
          <h1 className="h1" style={{ fontSize: 32, marginTop: 4 }}>All bookings</h1>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom: 18 }}>
        {[
          { id: "all", label: "All", n: bookings.length },
          { id: "upcoming", label: "Upcoming", n: bookings.filter(b => b.start >= today).length },
          { id: "active", label: "Active", n: bookings.filter(b => b.start <= today && b.end > today).length },
          { id: "pending", label: "Pending", n: bookings.filter(b => b.status === "pending").length },
          { id: "past", label: "Past", n: bookings.filter(b => b.end < today).length },
        ].map(t => (
          <button key={t.id} className={"chip" + (filter === t.id ? " active" : "")} onClick={() => setFilter(t.id)}>
            {t.label} <span style={{ opacity: .6, marginLeft: 4 }}>{t.n}</span>
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th>Code</th><th>Customer</th><th>Vehicle</th><th>Dates</th><th>Days</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const car = S.CARS.find(c => c.id === b.carId);
              const days = S.daysBetween(b.start, b.end);
              const total = b.total || (car ? car.price * days : 0);
              const isPast = b.end < today;
              const isActive = b.start <= today && b.end > today;
              return (
                <tr key={b.id}>
                  <td style={{ fontFamily: "var(--font-display)", letterSpacing: ".06em", fontSize: 16, color: "var(--accent-deep)" }}>{b.id}</td>
                  <td><strong>{b.name}</strong></td>
                  <td>{car?.name || "—"}</td>
                  <td>{S.fmtDateShort(b.start)} → {S.fmtDateShort(b.end)}</td>
                  <td>{days}</td>
                  <td style={{ fontWeight: 700 }}>${total}</td>
                  <td>
                    {isPast ? <span className="badge">Completed</span> :
                      isActive ? <span className="badge badge-gold">On Hire</span> :
                      b.status === "pending" ? <span className="badge badge-soft">Pending</span> :
                      <span className="badge badge-success"><span className="dot dot-active"></span>Confirmed</span>}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {!isPast && (
                      <button className="btn btn-ghost btn-sm" onClick={() => cancel(b)}>
                        <I.trash size={12}/>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>No bookings in this view.</div>}
      </div>
    </div>
  );
}

// -- fleet management --
function AdminFleet({ S, bookings, blocks, onPickCar }) {
  const today = S.todayIso();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
        <div>
          <span className="eyebrow">Fleet</span>
          <h1 className="h1" style={{ fontSize: 32, marginTop: 4 }}>All {S.CARS.length} vehicles</h1>
        </div>
        <button className="btn btn-dark">
          <I.plus size={14}/> Add vehicle
        </button>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr><th></th><th>Name</th><th>Tier</th><th>Year</th><th>Per day</th><th>Active bookings</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {S.CARS.map(c => {
              const carBookings = bookings.filter(b => b.carId === c.id && b.end >= today);
              const isOut = bookings.some(b => b.carId === c.id && b.start <= today && b.end > today);
              const inService = blocks.some(b => b.carId === c.id && b.start <= today && b.end > today);
              return (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => onPickCar(c.id)}>
                  <td style={{ width: 70 }}>
                    <div style={{ width: 60, height: 40, borderRadius: 5, overflow: "hidden", background: "#222" }}>
                      <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    </div>
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td><span className="badge">{c.tier}</span></td>
                  <td>{c.year}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent-deep)", fontFamily: "var(--font-head)" }}>${c.price}</td>
                  <td>{carBookings.length}</td>
                  <td>
                    {inService ? <span className="badge badge-soft">In Service</span> :
                      isOut ? <span className="badge badge-gold">On Hire</span> :
                      <span className="badge badge-success"><span className="dot dot-active"></span>Available</span>}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onPickCar(c.id); }}>
                      <I.calendar size={12}/> Calendar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Admin = Admin;
