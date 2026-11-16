const STEPS = ['Услуга', 'Мастер', 'Выбор времени', 'Данные', 'Готово'];
const ACTIVE = 2;

export default function ProgressBar() {
  return (
    <div className="pb">
      <div className="pb__inner">
        {STEPS.map((label, i) => {
          const state = i < ACTIVE ? 'done' : i === ACTIVE ? 'active' : 'todo';
          return (
            <div className="pb__step" key={label}>
              <span className={`pb__num pb__num--${state}`}>{i + 1}</span>
              {i === ACTIVE && <span className="pb__label">{label}</span>}
              {i < STEPS.length - 1 && (
                <span className={`pb__conn pb__conn--${i < ACTIVE ? 'done' : 'todo'}`}>
                  <i className="pb__conn-line" />
                  <i className="pb__conn-dash" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}