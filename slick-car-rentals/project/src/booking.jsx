// Booking flow — multi-step (Dates → Car → Contact → Confirm)

function Booking({ setRoute, carId, prefill, bookings, blocks, addBooking, copy }) {
  const S = window.SLICK;

  const stepsList = [
    { id: "dates", label: "Dates" },
    { id: "car", label: "Choose Car" },
    { id: "contact", label: "Your Details" },
    { id: "review", label: "Review" },
    { id: "payment", label: "Payment" },
  ];

  // if carId given, start at dates but car preselected
  const [step, setStep] = _R.useState(0);
  const [selectedCarId, setSelectedCarId] = _R.useState(carId || null);
  const [dates, setDates] = _R.useState({
    start: prefill?.start || null,
    end: prefill?.end || null,
  });
  const [times, setTimes] = _R.useState({ pickup: "10:00", dropoff: "10:00" });
  const today = new Date();
  const [calMonth, setCalMonth] = _R.useState({ y: today.getFullYear(), m: today.getMonth() });
  const [contact, setContact] = _R.useState({ firstName: "", lastName: "", email: "", phone: "", licence: "", notes: "" });
  const [payment, setPayment] = _R.useState({ cardNumber: "", expiry: "", cvc: "", postcode: "", name: "" });
  const [errors, setErrors] = _R.useState({});
  const [paymentErrors, setPaymentErrors] = _R.useState({});
  const [processing, setProcessing] = _R.useState(false);
  const [confirmation, setConfirmation] = _R.useState(null);

  const selectedCar = selectedCarId ? S.CARS.find(c => c.id === selectedCarId) : null;

  // for cal: per-car booking + block ranges
  const carBookings = selectedCarId ? bookings.filter(b => b.carId === selectedCarId) : [];
  const carBlocks = selectedCarId ? blocks.filter(b => b.carId === selectedCarId) : [];

  // helper: validate range against unavailability for any car
  function rangeAvailable(carId, start, end) {
    if (!start || !end) return false;
    const overlap = (ranges) => ranges.some(r => r.carId === carId && !(r.end <= start || r.start >= end));
    if (overlap(bookings)) return false;
    if (overlap(blocks)) return false;
    return true;
  }

  // cars available for selected dates
  const availableCars = _R.useMemo(() => {
    if (!dates.start || !dates.end) return [];
    return S.CARS.filter(c => rangeAvailable(c.id, dates.start, dates.end));
  }, [dates.start, dates.end, bookings, blocks]);

  const dayCount = dates.start && dates.end ? S.daysBetween(dates.start, dates.end) : 0;
  const pricing = selectedCar && dayCount ? S.priceFor(selectedCar, dayCount) : { base: 0, discount: 0, subtotal: 0, insurance: 0, total: 0, discountLabel: null };

  // step navigation helpers
  const canNext = (() => {
    if (step === 0) return !!(dates.start && dates.end);
    if (step === 1) return !!selectedCarId && rangeAvailable(selectedCarId, dates.start, dates.end);
    if (step === 2) return !!(contact.firstName && contact.lastName && contact.email && contact.phone && contact.licence);
    if (step === 3) return true;
    return true;
  })();

  function next() {
    if (step === 2 && !validateContact()) return;
    setStep(s => Math.min(s + 1, stepsList.length - 1));
  }
  function back() { setStep(s => Math.max(s - 1, 0)); }

  function validateContact() {
    const e = {};
    if (!contact.firstName) e.firstName = "Required";
    if (!contact.lastName) e.lastName = "Required";
    if (!contact.email) e.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) e.email = "Looks off — check the email";
    if (!contact.phone) e.phone = "Required";
    else if (contact.phone.replace(/\D/g, "").length < 8) e.phone = "Needs to look like a phone number";
    if (!contact.licence) e.licence = "Need this to confirm";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment() {
    const e = {};
    const num = payment.cardNumber.replace(/\s/g, "");
    if (!num) e.cardNumber = "Required";
    else if (num.length < 13 || num.length > 19) e.cardNumber = "Card number doesn't look right";
    if (!payment.expiry) e.expiry = "Required";
    else if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(payment.expiry)) e.expiry = "MM / YY";
    if (!payment.cvc) e.cvc = "Required";
    else if (!/^\d{3,4}$/.test(payment.cvc)) e.cvc = "3 digits";
    if (!payment.name) e.name = "Required";
    setPaymentErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validatePayment()) return;
    setProcessing(true);
    // mock processing delay
    setTimeout(() => {
      const code = "SC" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const booking = {
        id: code, carId: selectedCarId, start: dates.start, end: dates.end,
        times, contact, total: pricing.total, status: "confirmed",
        name: contact.firstName + " " + contact.lastName,
        paidLast4: payment.cardNumber.replace(/\s/g, "").slice(-4),
      };
      addBooking(booking);
      setProcessing(false);
      setConfirmation(booking);
    }, 1400);
  }

  if (confirmation) return <ConfirmScreen booking={confirmation} car={selectedCar} setRoute={setRoute} S={S} copy={copy} />;

  return (
    <div data-screen-label="04 Booking">
      <section style={{ background: "var(--ink)", color: "#fff", padding: "40px 0 48px", position: "relative", overflow: "hidden" }}>
        <div className="hero-glow gold"></div>
        <div className="container" style={{ position: "relative" }}>
          <span className="hero-eyebrow">Book a car · Melton VIC</span>
          <h1 className="h1" style={{ color: "#fff", marginTop: 10, fontSize: "clamp(32px, 4vw, 52px)" }}>{copy.booking_h1}</h1>
        </div>
      </section>

      <section className="section" style={{ padding: "40px 0 80px" }}>
        <div className="container">
          {/* Progress steps */}
          <div className="progress">
            <div className="progress-bar" style={{ width: `${((step + 1) / stepsList.length) * 100}%` }}></div>
          </div>
          <div className="steps">
            {stepsList.map((s, i) => (
              <div key={s.id} className={"step " + (i === step ? "active" : i < step ? "done" : "")}
                   onClick={() => i < step && setStep(i)}
                   style={{ cursor: i < step ? "pointer" : "default" }}>
                <div className="step-num">{i < step ? <I.check size={14} strokeWidth={3}/> : (i + 1)}</div>
                <div className="step-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="booking-layout">
            <div>
              {step === 0 && (
                <StepDates
                  S={S}
                  dates={dates} setDates={setDates}
                  times={times} setTimes={setTimes}
                  calMonth={calMonth} setCalMonth={setCalMonth}
                  bookings={selectedCarId ? carBookings : []}
                  blocks={selectedCarId ? carBlocks : []}
                />
              )}
              {step === 1 && (
                <StepCar
                  S={S}
                  availableCars={availableCars}
                  dates={dates}
                  selectedCarId={selectedCarId} setSelectedCarId={setSelectedCarId}
                />
              )}
              {step === 2 && (
                <StepContact contact={contact} setContact={setContact} errors={errors} />
              )}
              {step === 3 && (
                <StepReview S={S} car={selectedCar} dates={dates} times={times} contact={contact} pricing={pricing} dayCount={dayCount} copy={copy} />
              )}
              {step === 4 && (
                <StepPayment payment={payment} setPayment={setPayment} errors={paymentErrors} pricing={pricing} processing={processing} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                {step > 0 ? (
                  <button className="btn btn-ghost" onClick={back} disabled={processing}>
                    <I.chevronLeft size={14}/> Back
                  </button>
                ) : <button className="btn btn-ghost" onClick={() => setRoute({ name: "fleet" })}><I.chevronLeft size={14}/> Browse fleet</button>}
                {step < stepsList.length - 1 ? (
                  <button className="btn btn-primary" onClick={next} disabled={!canNext} style={!canNext ? { opacity: .5, cursor: "not-allowed" } : {}}>
                    Continue <I.arrowRight size={14}/>
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={submit} disabled={processing}>
                    {processing ? (
                      <>Processing<span className="spinner"></span></>
                    ) : (
                      <>Pay ${pricing.total} & {copy.confirm_btn.split(" ").slice(-1)[0]} <I.shield size={16}/></>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar summary */}
            <aside style={{ position: "sticky", top: 96 }}>
              <BookingSummary S={S} car={selectedCar} dates={dates} times={times} dayCount={dayCount} pricing={pricing} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------- Steps -----------
function StepDates({ S, dates, setDates, times, setTimes, calMonth, setCalMonth, bookings, blocks }) {
  function changeMonth(delta) {
    let { y, m } = calMonth;
    m += delta;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth({ y, m });
  }

  const hours = Array.from({ length: 12 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`);

  return (
    <div>
      <h2 className="h2" style={{ marginBottom: 6 }}>When do you need it?</h2>
      <p className="lede" style={{ marginBottom: 24 }}>Pick a pickup and drop-off date. We'll filter the fleet to cars that are free.</p>

      <Calendar
        year={calMonth.y} month={calMonth.m}
        onMonth={changeMonth}
        mode="range"
        selected={dates}
        onSelect={(r) => setDates(r)}
        bookings={bookings}
        blocks={blocks}
      />

      <div className="legend" style={{ marginTop: 14 }}>
        <span><span className="legend-swatch" style={{ background: "var(--accent)" }}></span>Selected</span>
        <span><span className="legend-swatch" style={{ background: "var(--accent-soft)" }}></span>In range</span>
        <span><span className="legend-swatch" style={{ background: "#FDE9E5" }}></span>Already booked</span>
        <span><span className="legend-swatch" style={{ background: "repeating-linear-gradient(45deg,#FDE9E5,#FDE9E5 3px,#FBD9D2 3px,#FBD9D2 6px)" }}></span>Maintenance</span>
      </div>

      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="field">
          <label>Pickup time</label>
          <select className="select" value={times.pickup} onChange={(e) => setTimes({ ...times, pickup: e.target.value })}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Drop-off time</label>
          <select className="select" value={times.dropoff} onChange={(e) => setTimes({ ...times, dropoff: e.target.value })}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {dates.start && !dates.end && (
        <div style={{ marginTop: 16, padding: 14, background: "var(--cream)", borderRadius: 8, fontSize: 14 }}>
          <strong>Pickup:</strong> {S.fmtDate(dates.start)} — now click a drop-off date.
        </div>
      )}
    </div>
  );
}

function StepCar({ S, availableCars, dates, selectedCarId, setSelectedCarId }) {
  return (
    <div>
      <h2 className="h2" style={{ marginBottom: 6 }}>Pick your wheels.</h2>
      <p className="lede" style={{ marginBottom: 24 }}>
        <strong>{availableCars.length}</strong> vehicles available from {S.fmtDate(dates.start)} to {S.fmtDate(dates.end)}.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {availableCars.map(car => (
          <div
            key={car.id}
            className="car-card"
            style={selectedCarId === car.id ? { borderColor: "var(--accent)", boxShadow: "var(--sh-gold)" } : {}}
            onClick={() => setSelectedCarId(car.id)}
          >
            <div className="car-card-img">
              <img src={car.img} alt={car.name} loading="lazy"/>
              <div className="car-card-tier">{car.tier}</div>
              <PhotoCredit car={car} compact />
              {selectedCarId === car.id && (
                <div style={{ position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#0a0a0a", display: "grid", placeItems: "center", boxShadow: "var(--sh-md)" }}>
                  <I.check size={16} strokeWidth={3}/>
                </div>
              )}
            </div>
            <div className="car-card-body" style={{ padding: 16 }}>
              <div className="car-card-title-row">
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16 }}>{car.name}</div>
                  <div className="car-card-sub" style={{ fontSize: 12 }}>{car.transmission} · {car.seats} seats</div>
                </div>
                <div className="car-card-price">
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--accent-deep)", lineHeight: 1 }}>${car.price}</div>
                  <div className="car-card-price-unit" style={{ fontSize: 10 }}>/ day</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepContact({ contact, setContact, errors }) {
  function up(k, v) { setContact({ ...contact, [k]: v }); }
  return (
    <div>
      <h2 className="h2" style={{ marginBottom: 6 }}>Your details.</h2>
      <p className="lede" style={{ marginBottom: 24 }}>Just enough so we can confirm and call if anything's up. We don't email rubbish.</p>

      <div className="form-row">
        <div className={"field" + (errors.firstName ? " field-error" : "")}>
          <label>First name</label>
          <input value={contact.firstName} onChange={(e) => up("firstName", e.target.value)} placeholder="Jamie" />
          {errors.firstName && <span className="field-error-text">{errors.firstName}</span>}
        </div>
        <div className={"field" + (errors.lastName ? " field-error" : "")}>
          <label>Last name</label>
          <input value={contact.lastName} onChange={(e) => up("lastName", e.target.value)} placeholder="Anderson" />
          {errors.lastName && <span className="field-error-text">{errors.lastName}</span>}
        </div>
      </div>
      <div className="form-row" style={{ marginTop: 16 }}>
        <div className={"field" + (errors.email ? " field-error" : "")}>
          <label>Email</label>
          <input type="email" value={contact.email} onChange={(e) => up("email", e.target.value)} placeholder="jamie@example.com" />
          {errors.email && <span className="field-error-text">{errors.email}</span>}
        </div>
        <div className={"field" + (errors.phone ? " field-error" : "")}>
          <label>Mobile</label>
          <input value={contact.phone} onChange={(e) => up("phone", e.target.value)} placeholder="0400 000 000" />
          {errors.phone && <span className="field-error-text">{errors.phone}</span>}
        </div>
      </div>
      <div className={"field" + (errors.licence ? " field-error" : "")} style={{ marginTop: 16 }}>
        <label>Driver's licence number</label>
        <input value={contact.licence} onChange={(e) => up("licence", e.target.value)} placeholder="VIC 0123 4567" />
        {errors.licence && <span className="field-error-text">{errors.licence}</span>}
        <span className="tiny" style={{ marginTop: 4 }}>You'll need to bring the physical licence at pickup.</span>
      </div>
      <div className="field" style={{ marginTop: 16 }}>
        <label>Anything we should know? (optional)</label>
        <textarea rows="3" value={contact.notes} onChange={(e) => up("notes", e.target.value)} placeholder="e.g. need a child seat, picking up after 6pm, going interstate…" />
      </div>
    </div>
  );
}

function StepReview({ S, car, dates, times, contact, pricing, dayCount, copy }) {
  return (
    <div>
      <h2 className="h2" style={{ marginBottom: 6 }}>{copy.review_h2}</h2>
      <p className="lede" style={{ marginBottom: 24 }}>{copy.review_sub}</p>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "var(--cream)", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="eyebrow">Vehicle</div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, marginTop: 4 }}>{car.name}</div>
            <div className="tiny">{car.year} · {car.tier}</div>
          </div>
          <div style={{ width: 130, height: 80, borderRadius: 6, overflow: "hidden" }}>
            <img src={car.img} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
        </div>
        <div style={{ padding: "0 22px" }}>
          <div className="summary-row"><span className="lbl">Pickup</span><span className="val">{S.fmtDate(dates.start)} · {times.pickup}</span></div>
          <div className="summary-row"><span className="lbl">Drop-off</span><span className="val">{S.fmtDate(dates.end)} · {times.dropoff}</span></div>
          <div className="summary-row"><span className="lbl">Duration</span><span className="val">{dayCount} {dayCount === 1 ? "day" : "days"}{pricing.discountLabel && <span className="badge badge-gold" style={{ marginLeft: 8 }}>{pricing.discountLabel}</span>}</span></div>
          <div className="summary-row"><span className="lbl">Pickup location</span><span className="val">4/23–25 Norton Dr, Melton VIC</span></div>
          <div className="summary-row"><span className="lbl">Driver</span><span className="val">{contact.firstName} {contact.lastName}</span></div>
          <div className="summary-row"><span className="lbl">Contact</span><span className="val">{contact.email}<br/>{contact.phone}</span></div>
          {contact.notes && <div className="summary-row"><span className="lbl">Notes</span><span className="val" style={{ maxWidth: 280 }}>{contact.notes}</span></div>}
        </div>
        <div style={{ background: "var(--ink)", color: "#fff", padding: "22px", display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Total · pay now</div>
            <div style={{ fontSize: 12, opacity: .65, marginTop: 4 }}>
              ${car.price}/day × {dayCount}
              {pricing.discount > 0 && <> · −${pricing.discount} discount</>}
              {" · +"}${pricing.insurance} insurance
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 56, color: "var(--accent)", lineHeight: 1 }}>${pricing.total}</div>
        </div>
      </div>

      <p className="tiny" style={{ marginTop: 16, lineHeight: 1.6 }}>
        Continuing to payment will charge your card after you submit. By proceeding you agree to the Slick Car Rentals hire conditions — including a $1,500 insurance excess, full-tank return policy, and a valid driver's licence presented at pickup.
      </p>
    </div>
  );
}

function StepPayment({ payment, setPayment, errors, pricing, processing }) {
  function formatCardNumber(v) {
    const digits = v.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  // detect card brand
  const num = payment.cardNumber.replace(/\s/g, "");
  let brand = "card";
  if (/^4/.test(num)) brand = "visa";
  else if (/^5[1-5]/.test(num)) brand = "mc";
  else if (/^3[47]/.test(num)) brand = "amex";

  return (
    <div>
      <h2 className="h2" style={{ marginBottom: 6 }}>Pay securely.</h2>
      <p className="lede" style={{ marginBottom: 24 }}>Pay for the full booking up front. Your card details are encrypted and never stored on our servers.</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--cream)", borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
        <I.shield size={16} style={{ color: "var(--accent-deep)" }}/>
        <span><strong>Secure payment</strong> · Encrypted end-to-end · Powered by Stripe (demo — not a real charge)</span>
      </div>

      <div className={"field" + (errors.cardNumber ? " field-error" : "")} style={{ marginBottom: 16 }}>
        <label>Card number</label>
        <div style={{ position: "relative" }}>
          <input
            value={payment.cardNumber}
            onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
            placeholder="1234 1234 1234 1234"
            inputMode="numeric"
            style={{ paddingRight: 60, fontFamily: "var(--font-head)", letterSpacing: ".05em", fontSize: 16, width: "100%" }}
          />
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".08em" }}>
            {brand.toUpperCase()}
          </div>
        </div>
        {errors.cardNumber && <span className="field-error-text">{errors.cardNumber}</span>}
      </div>

      <div className="form-row">
        <div className={"field" + (errors.expiry ? " field-error" : "")}>
          <label>Expiry</label>
          <input
            value={payment.expiry}
            onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
            placeholder="MM / YY"
            inputMode="numeric"
            style={{ fontFamily: "var(--font-head)" }}
          />
          {errors.expiry && <span className="field-error-text">{errors.expiry}</span>}
        </div>
        <div className={"field" + (errors.cvc ? " field-error" : "")}>
          <label>CVC</label>
          <input
            value={payment.cvc}
            onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            placeholder="123"
            inputMode="numeric"
            style={{ fontFamily: "var(--font-head)" }}
          />
          {errors.cvc && <span className="field-error-text">{errors.cvc}</span>}
        </div>
      </div>

      <div className={"field" + (errors.name ? " field-error" : "")} style={{ marginTop: 16 }}>
        <label>Name on card</label>
        <input
          value={payment.name}
          onChange={(e) => setPayment({ ...payment, name: e.target.value })}
          placeholder="JAMIE ANDERSON"
          style={{ textTransform: "uppercase", letterSpacing: ".04em" }}
        />
        {errors.name && <span className="field-error-text">{errors.name}</span>}
      </div>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Postcode <span style={{ fontWeight: 400, color: "var(--muted)", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
        <input
          value={payment.postcode}
          onChange={(e) => setPayment({ ...payment, postcode: e.target.value })}
          placeholder="3337"
          inputMode="numeric"
        />
      </div>

      <div style={{ marginTop: 24, padding: 18, background: "var(--cream)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="tiny" style={{ letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>You'll be charged</div>
          {pricing.discountLabel && <div style={{ fontSize: 11, color: "var(--accent-deep)", fontWeight: 700, marginBottom: 2 }}>{pricing.discountLabel} applied</div>}
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--accent-deep)", lineHeight: 1 }}>${pricing.total}</div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "center", color: "var(--muted)", fontSize: 12 }}>
        <I.shield size={14}/>
        <span>256-bit SSL · PCI DSS Level 1 · Refundable up to 24h before pickup</span>
      </div>

      {processing && (
        <div style={{ marginTop: 16, padding: 14, background: "var(--accent-soft)", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="spinner spinner-dark"></span>
          <span>Processing your payment securely…</span>
        </div>
      )}
    </div>
  );
}

function BookingSummary({ S, car, dates, times, dayCount, pricing }) {
  return (
    <div className="summary">
      <div className="eyebrow" style={{ marginBottom: 12 }}>Your Booking</div>
      {car ? (
        <>
          <div className="summary-car-img" style={{ position: "relative" }}>
            <img src={car.img} alt={car.name}/>
            <PhotoCredit car={car} compact />
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{car.name}</div>
          <div className="tiny" style={{ marginBottom: 14 }}>{car.tier} · {car.year}</div>
        </>
      ) : (
        <div style={{ background: "var(--cream-2)", aspectRatio: "16/10", borderRadius: 8, display: "grid", placeItems: "center", marginBottom: 14, color: "var(--muted)", fontSize: 13 }}>
          <div style={{ textAlign: "center" }}>
            <I.car size={32} style={{ opacity: .4 }}/>
            <div style={{ marginTop: 8 }}>Pick a car to see the summary</div>
          </div>
        </div>
      )}

      <div className="summary-row"><span className="lbl">Pickup</span><span className="val">{dates.start ? S.fmtDateShort(dates.start) : "—"} · {dates.start ? times.pickup : ""}</span></div>
      <div className="summary-row"><span className="lbl">Drop-off</span><span className="val">{dates.end ? S.fmtDateShort(dates.end) : "—"} · {dates.end ? times.dropoff : ""}</span></div>
      <div className="summary-row"><span className="lbl">Duration</span><span className="val">{dayCount ? `${dayCount} ${dayCount === 1 ? "day" : "days"}` : "—"}</span></div>
      {car && dayCount > 0 && (
        <>
          <div className="summary-row"><span className="lbl">{`Rental · ${dayCount} × $${car.price}`}</span><span className="val">${pricing.base}</span></div>
          {pricing.discount > 0 && (
            <div className="summary-row"><span className="lbl" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>{pricing.discountLabel}</span><span className="val" style={{ color: "var(--accent-deep)" }}>−${pricing.discount}</span></div>
          )}
          <div className="summary-row"><span className="lbl">Insurance + admin</span><span className="val">${pricing.insurance}</span></div>
        </>
      )}
      <div className="summary-row" style={{ borderTop: "2px solid var(--ink)", marginTop: 6, paddingTop: 14, alignItems: "baseline" }}>
        <span className="lbl" style={{ fontWeight: 700, color: "var(--text)" }}>Total</span>
        <span className="summary-total">{pricing.total > 0 ? `$${pricing.total}` : "—"}</span>
      </div>
      <div className="tiny" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <I.shield size={12}/> Paid securely at checkout
      </div>
    </div>
  );
}

function ConfirmScreen({ booking, car, setRoute, S, copy }) {
  return (
    <div data-screen-label="05 Confirmation">
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <div className="confirm-mark">
            <I.check size={48} strokeWidth={3}/>
          </div>
          <span className="eyebrow">You're locked in</span>
          <h1 className="h1" style={{ marginTop: 10, fontSize: "clamp(36px, 5vw, 56px)" }}>
            See you on <span style={{ color: "var(--accent-deep)" }}>{S.fmtDateShort(booking.start)}</span>, {booking.contact.firstName}.
          </h1>
          <p className="lede" style={{ margin: "16px auto 28px" }}>
            We've charged <strong>${booking.total}</strong> to your card ending <strong>·· {booking.paidLast4}</strong> and sent a receipt to <strong>{booking.contact.email}</strong>.
          </p>
          <div className="confirm-code">{booking.id}</div>

          <div className="panel" style={{ marginTop: 36, textAlign: "left" }}>
            <h3 className="h3" style={{ marginBottom: 14 }}>Your booking</h3>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "center" }}>
              <div style={{ aspectRatio: "16/10", borderRadius: 6, overflow: "hidden" }}>
                <img src={car.img} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20 }}>{car.name}</div>
                <div className="tiny">{car.year} · {car.tier}</div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <div className="summary-row"><span className="lbl">Pickup</span><span className="val">{S.fmtDate(booking.start)} · {booking.times.pickup}</span></div>
              <div className="summary-row"><span className="lbl">Drop-off</span><span className="val">{S.fmtDate(booking.end)} · {booking.times.dropoff}</span></div>
              <div className="summary-row"><span className="lbl">Location</span><span className="val">4/23–25 Norton Dr, Melton VIC</span></div>
              <div className="summary-row"><span className="lbl">Paid</span><span className="val" style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--accent-deep)" }}>${booking.total}</span></div>
            </div>
          </div>

          <div style={{ marginTop: 28, padding: 22, background: "var(--cream)", borderRadius: 12, textAlign: "left" }}>
            <h4 className="h4" style={{ marginBottom: 10 }}>Bring with you at pickup</h4>
            <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>
              <li style={{ display: "flex", gap: 10 }}><I.check size={16} style={{ color: "var(--accent-deep)" }}/> Your physical driver's licence</li>
              <li style={{ display: "flex", gap: 10 }}><I.check size={16} style={{ color: "var(--accent-deep)" }}/> The card you paid with (for the $1,500 insurance hold)</li>
              <li style={{ display: "flex", gap: 10 }}><I.check size={16} style={{ color: "var(--accent-deep)" }}/> Confirmation code above</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button className="btn btn-dark" onClick={() => setRoute({ name: "home" })}>Back to Home</button>
            <button className="btn btn-primary" onClick={() => setRoute({ name: "fleet" })}>Browse Fleet <I.arrowRight size={14}/></button>
          </div>
        </div>
      </section>
    </div>
  );
}

window.Booking = Booking;
