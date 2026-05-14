// Shared components and icons for Slick Car Rentals

const { useState, useEffect, useRef, useMemo } = React;

// ----- ICONS (inline SVG, lucide-style strokes) -----
const Icon = ({ d, size = 18, strokeWidth = 2, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <g dangerouslySetInnerHTML={{ __html: d }} />
  </svg>
);
const I = {
  car: (p) => <Icon {...p} d='<path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>' />,
  seat: (p) => <Icon {...p} d='<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16s.5-3 4-3h10c3.5 0 4 3 4 3"/><path d="M3 21v-4"/><path d="M21 21v-4"/>' />,
  gauge: (p) => <Icon {...p} d='<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>' />,
  fuel: (p) => <Icon {...p} d='<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>' />,
  cog: (p) => <Icon {...p} d='<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/>' />,
  luggage: (p) => <Icon {...p} d='<path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/><rect width="13" height="2" x="5.5" y="11"/><path d="M6 20v2"/><path d="M18 20v2"/>' />,
  door: (p) => <Icon {...p} d='<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>' />,
  calendar: (p) => <Icon {...p} d='<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>' />,
  clock: (p) => <Icon {...p} d='<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' />,
  mapPin: (p) => <Icon {...p} d='<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>' />,
  phone: (p) => <Icon {...p} d='<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' />,
  check: (p) => <Icon {...p} d='<polyline points="20 6 9 17 4 12"/>' />,
  checkCircle: (p) => <Icon {...p} d='<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>' />,
  shield: (p) => <Icon {...p} d='<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' />,
  star: (p) => <Icon {...p} d='<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' />,
  arrowRight: (p) => <Icon {...p} d='<line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/>' />,
  chevronLeft: (p) => <Icon {...p} d='<polyline points="15 18 9 12 15 6"/>' />,
  chevronRight: (p) => <Icon {...p} d='<polyline points="9 18 15 12 9 6"/>' />,
  chevronDown: (p) => <Icon {...p} d='<polyline points="6 9 12 15 18 9"/>' />,
  menu: (p) => <Icon {...p} d='<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>' />,
  user: (p) => <Icon {...p} d='<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' />,
  mail: (p) => <Icon {...p} d='<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' />,
  trash: (p) => <Icon {...p} d='<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' />,
  plus: (p) => <Icon {...p} d='<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>' />,
  edit: (p) => <Icon {...p} d='<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>' />,
  search: (p) => <Icon {...p} d='<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' />,
  filter: (p) => <Icon {...p} d='<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' />,
  list: (p) => <Icon {...p} d='<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>' />,
  grid: (p) => <Icon {...p} d='<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' />,
  zap: (p) => <Icon {...p} d='<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' />,
  steering: (p) => <Icon {...p} d='<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 14v8"/><path d="M2 12h8"/><path d="M14 12h8"/>' />,
  key: (p) => <Icon {...p} d='<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>' />,
  x: (p) => <Icon {...p} d='<path d="M18 6 6 18"/><path d="m6 6 12 12"/>' />,
};

window.I = I;

// ----- LOGO -----
function Logo({ onDark = false }) {
  return (
    <div className="logo-badge">
      <div className="logo-mark">S</div>
      <div className="logo-text">
        <div className={"logo-text-name" + (onDark ? " on-dark" : "")}>
          Slick <span>Car</span> Rentals
        </div>
        <div className={"logo-text-tag" + (onDark ? " on-dark" : "")}>Melton VIC · Est. 2024</div>
      </div>
    </div>
  );
}

// ----- NAV -----
function Nav({ route, setRoute, onSignIn, signedIn, onSignOut }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "fleet", label: "Fleet" },
    { id: "book", label: "Book" },
    { id: "how", label: "How It Works" },
  ];
  return (
    <nav className="nav" data-screen-label="Nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#" onClick={(e) => { e.preventDefault(); setRoute({ name: "home" }); }}>
          <Logo />
        </a>
        <div className="nav-links">
          {items.map((it) => (
            <a key={it.id} href="#" className={"nav-link" + (route.name === it.id ? " active" : "")}
               onClick={(e) => { e.preventDefault(); setRoute({ name: it.id }); }}>
              {it.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <a className="nav-phone" href="tel:0423410701">
            <I.phone size={14}/> <strong>0423 410 701</strong>
          </a>
          {signedIn ? (
            <button className="btn btn-ghost btn-sm" onClick={() => { setRoute({ name: "admin" }); }}>
              <I.user size={14}/> Admin
            </button>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={onSignIn}>
              <I.user size={14}/> Sign in
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => setRoute({ name: "book" })}>
            Book Now <I.arrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}

// ----- FOOTER -----
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p style={{ marginTop: 18, maxWidth: 320, fontSize: 14, lineHeight: 1.6 }}>
              Late-model rentals from a family-run yard in Melton. Pick up the keys, hit the road — no hidden fees, no rubbish.
            </p>
          </div>
          <div>
            <h4>Fleet</h4>
            <div className="footer-links">
              <a href="#">Economy</a>
              <a href="#">Family SUVs</a>
              <a href="#">Utes &amp; 4WDs</a>
              <a href="#">Premium</a>
              <a href="#">Luxury &amp; Sport</a>
            </div>
          </div>
          <div>
            <h4>Help</h4>
            <div className="footer-links">
              <a href="#">How it works</a>
              <a href="#">Hire conditions</a>
              <a href="#">Insurance</a>
              <a href="#">FAQ</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div>
            <h4>Visit</h4>
            <div className="footer-links" style={{ fontSize: 14 }}>
              <div style={{ color: "rgba(255,255,255,.65)" }}>4/23–25 Norton Dr<br />Melton VIC 3337</div>
              <div style={{ color: "var(--accent)", marginTop: 10, fontWeight: 700, letterSpacing: ".04em" }}>0423 410 701</div>
              <div style={{ color: "rgba(255,255,255,.65)" }}>bookings@slickcar.com.au</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Slick Car Rentals · Proudly serving Melton since 2024</div>
          <div>ABN 11 222 333 444 · All vehicles fully insured</div>
        </div>
      </div>
    </footer>
  );
}

// ----- CAR CARD -----
function PhotoCredit({ car, compact = false }) {
  if (!car?.imgPage || !car?.imgCredit) return null;
  const label = compact ? "Photo credit" : `Photo: ${car.imgCredit} · ${car.imgLicense}`;
  return (
    <a
      className={"photo-credit" + (compact ? " compact" : "")}
      href={car.imgPage}
      target="_blank"
      rel="noreferrer"
      title={`${car.imgCredit} · ${car.imgLicense}`}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </a>
  );
}

function CarCard({ car, onClick }) {
  const S = window.SLICK;
  return (
    <div className="car-card" onClick={onClick}>
      <div className="car-card-img">
        <img src={car.img} alt={car.name} loading="lazy" onError={(e) => { e.target.style.display = "none"; }}/>
        <div className="car-card-tier">{car.tier}</div>
        <PhotoCredit car={car} compact />
      </div>
      <div className="car-card-body">
        <div className="car-card-title-row">
          <div>
            <div className="car-card-title">{car.name}</div>
            <div className="car-card-sub">{car.year} · {car.transmission} · {car.fuel}</div>
          </div>
          <div className="car-card-price">
            <div className="car-card-price-num">${car.price}</div>
            <div className="car-card-price-unit">per day</div>
          </div>
        </div>
        <div className="car-card-specs">
          <div className="car-card-spec"><I.seat size={14}/> {car.seats} seats</div>
          <div className="car-card-spec"><I.luggage size={14}/> {car.luggage} bags</div>
          <div className="car-card-spec"><I.door size={14}/> {car.doors} doors</div>
        </div>
      </div>
    </div>
  );
}

window.CarCard = CarCard;
window.PhotoCredit = PhotoCredit;
window.Logo = Logo;
window.Nav = Nav;
window.Footer = Footer;

// ----- SIGN IN MODAL (mock — any creds work) -----
function SignInModal({ open, onClose, onSignIn }) {
  const [email, setEmail] = useState("admin@slickcar.com.au");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!open) { setPassword(""); setShake(false); }
  }, [open]);

  if (!open) return null;

  function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onSignIn();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={"modal" + (shake ? " modal-shake" : "")} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><I.x size={18}/></button>
        <div style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div className="logo-mark" style={{ width: 56, height: 56, fontSize: 30 }}>S</div>
          </div>
          <h2 className="h2" style={{ textAlign: "center", fontSize: 24, marginBottom: 6 }}>Staff sign in</h2>
          <p className="lede" style={{ textAlign: "center", fontSize: 14, margin: "0 auto 24px" }}>Admin console for managing bookings and the fleet calendar.</p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@slickcar.com.au" autoFocus/>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"/>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: 6 }}>
              Sign in <I.arrowRight size={14}/>
            </button>
            <div className="tiny" style={{ textAlign: "center", marginTop: 4 }}>
              Demo: any password works. <a href="#" style={{ color: "var(--accent-deep)", fontWeight: 600 }} onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

window.SignInModal = SignInModal;
