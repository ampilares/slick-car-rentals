// Calendar — date-range picker for booking + admin block editor

const { useState: _useStateCal, useMemo: _useMemoCal } = React;

function getMonthGrid(year, month) {
  // returns 42-cell grid: Mon-first
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const days = [];
  // previous month tail
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, out: true });
  }
  for (let i = 1; i <= last.getDate(); i++) {
    days.push({ date: new Date(year, month, i), out: false });
  }
  while (days.length < 42) {
    const d = new Date(year, month + 1, days.length - last.getDate() - startDow + 1);
    days.push({ date: d, out: true });
  }
  return days;
}

function Calendar({
  month, year, onMonth,
  mode = "range",          // "range" | "block-edit"
  selected = {},            // { start: iso, end: iso }
  onSelect,                 // (range) => void
  bookings = [],            // [{ start, end }]
  blocks = [],              // [{ start, end }]
  blockMode = false,        // if true, click toggles a block
  onToggleBlock,
  todayIso,
}) {
  const S = window.SLICK;
  const dows = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const grid = _useMemoCal(() => getMonthGrid(year, month), [year, month]);

  const monthName = new Date(year, month, 1).toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  // helper to check if iso falls inside any [start,end) range
  const inRange = (iso, ranges) => ranges.some(r => iso >= r.start && iso < r.end);

  const start = selected.start;
  const end = selected.end;

  function classify(d) {
    const iso = S.isoDay(d.date);
    if (d.out) return "out";
    const today = todayIso || S.todayIso();
    const past = iso < today;
    if (past) return "disabled";
    if (inRange(iso, bookings)) return "booked";
    if (inRange(iso, blocks)) return "blocked";
    if (mode === "range") {
      if (start && iso === start) return "selected";
      if (end && iso === end) return "selected";
      if (start && end && iso > start && iso < end) return "in-range";
    }
    return "";
  }

  function handleClick(d) {
    if (d.out) return;
    const iso = S.isoDay(d.date);
    if (blockMode) {
      onToggleBlock && onToggleBlock(iso);
      return;
    }
    if (mode !== "range") return;
    const cls = classify(d);
    if (cls === "disabled" || cls === "booked" || cls === "blocked") return;
    if (!start || (start && end)) {
      onSelect({ start: iso, end: null });
    } else if (start && !end) {
      if (iso < start) {
        onSelect({ start: iso, end: start });
      } else if (iso === start) {
        onSelect({ start: null, end: null });
      } else {
        // ensure no booked/blocked dates in between
        let cursor = S.addDays(start, 1);
        let bad = false;
        while (S.isoDay(cursor) < iso) {
          const c = S.isoDay(cursor);
          if (inRange(c, bookings) || inRange(c, blocks)) { bad = true; break; }
          cursor = S.addDays(cursor, 1);
        }
        if (bad) {
          onSelect({ start: iso, end: null });
        } else {
          onSelect({ start, end: iso });
        }
      }
    }
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <div className="cal-title">{monthName}</div>
        <div className="cal-nav">
          <button onClick={() => onMonth(-1)} aria-label="Previous month"><I.chevronLeft size={16}/></button>
          <button onClick={() => onMonth(1)} aria-label="Next month"><I.chevronRight size={16}/></button>
        </div>
      </div>
      <div className="cal-grid">
        {dows.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {grid.map((d, i) => {
          const cls = classify(d);
          const today = (todayIso || S.todayIso()) === S.isoDay(d.date);
          return (
            <div
              key={i}
              className={"cal-day " + cls + (today ? " today" : "")}
              onClick={() => handleClick(d)}
              title={cls === "booked" ? "Already booked" : cls === "blocked" ? "Unavailable" : ""}
            >
              {d.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Calendar = Calendar;
window.getMonthGrid = getMonthGrid;
