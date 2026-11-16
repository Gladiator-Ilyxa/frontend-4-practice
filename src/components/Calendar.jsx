import {
  buildCalendarGrid, isDateSelectable, MONTHS_NOMINATIVE, WEEKDAYS_SHORT,
} from '../data/date';

const Chevron = ({ dir }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'prev'
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

export default function Calendar({
  currentMonth, currentYear, selectedDay, today, onPrevMonth, onNextMonth, onDayClick,
}) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);
  const same = (c, o) => o && c.day === o.day && c.month === o.month && c.year === o.year;

  return (
    <section className="card cal" aria-label="Календарь">
      <header className="cal__head">
        <h2 className="cal__title">{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
        <div className="cal__nav">
          <button type="button" className="cal__nav-btn" onClick={onPrevMonth} aria-label="Предыдущий месяц">
            <Chevron dir="prev" />
          </button>
          <button type="button" className="cal__nav-btn" onClick={onNextMonth} aria-label="Следующий месяц">
            <Chevron dir="next" />
          </button>
        </div>
      </header>

      <div className="cal__weekdays">
        {WEEKDAYS_SHORT.map((w) => <span className="cal__weekday" key={w}>{w}</span>)}
      </div>

      <div className="cal__grid">
        {weeks.map((week, wi) => (
          <div className="cal__week" key={wi}>
            {week.map((cell) => {
              const selectable = cell.isCurrentMonth
                && isDateSelectable(cell.day, cell.month, cell.year, today);
              const isSelected = same(cell, selectedDay);
              const isToday = same(cell, today);
              const cls = [
                'cal__day',
                !cell.isCurrentMonth && 'cal__day--muted',
                !selectable && 'cal__day--disabled',
                isSelected && 'cal__day--selected',
                isToday && !isSelected && 'cal__day--today',
              ].filter(Boolean).join(' ');
              return (
                <button
                  type="button"
                  key={`${cell.year}-${cell.month}-${cell.day}`}
                  className={cls}
                  disabled={!selectable}
                  aria-pressed={isSelected}
                  onClick={() => onDayClick({ day: cell.day, month: cell.month, year: cell.year })}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}