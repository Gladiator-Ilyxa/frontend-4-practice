export default function TimeSlots({
  slots, selectedDay, selectedTime, onTimeClick, loading, error, onRetry,
}) {
  return (
    <section className="card ts" aria-label="Доступное время" aria-busy={loading}>
      <h2 className="ts__title">Доступное время</h2>

      {loading && (
        <>
          <div className="ts__list">
            {Array.from({ length: 6 }).map((_, i) => (
              <span className="skel skel--slot" key={i} />
            ))}
          </div>
          <p className="status"><span className="spinner" />Загрузка слотов…</p>
        </>
      )}

      {!loading && error && (
        <div className="panel panel--error" role="alert">
          <span>Ошибка: {error}</span>
          <button type="button" className="panel__retry" onClick={onRetry}>Повторить</button>
        </div>
      )}

      {!loading && !error && !selectedDay && (
        <p className="ts__empty">Выберите дату в календаре</p>
      )}

      {!loading && !error && selectedDay && slots.length === 0 && (
        <p className="ts__empty">На эту дату нет свободных слотов</p>
      )}

      {!loading && !error && selectedDay && slots.length > 0 && (
        <>
          <p className="ts__meta">
            Свободно {slots.filter((s) => s.available).length} из {slots.length}
          </p>
          <div className="ts__list">
            {slots.map((slot) => {
              const active = selectedTime === slot.time;
              const busy = !slot.available;
              return (
                <button
                  type="button"
                  key={slot.time}
                  className={[
                    'ts__item',
                    active && 'ts__item--active',
                    busy && 'ts__item--busy',
                  ].filter(Boolean).join(' ')}
                  disabled={busy}
                  aria-pressed={active}
                  onClick={() => onTimeClick(slot.time)}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}