import { formatWeekdayDate } from '../data/date';

export default function BottomBar({ selectedDay, selectedTime }) {
  return (
    <div className="bb">
      <div className="bb__inner">
        <span className={selectedDay ? 'bb__date' : 'bb__date bb__date--empty'}>
          {selectedDay
            ? formatWeekdayDate(selectedDay.day, selectedDay.month, selectedDay.year)
            : 'Выберите дату'}
        </span>
        <span className="bb__dot" aria-hidden="true">•</span>
        <span className={selectedTime ? 'bb__time bb__time--set' : 'bb__time'}>
          {selectedTime || 'и время'}
        </span>
      </div>
    </div>
  );
}