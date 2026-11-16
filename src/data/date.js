export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export const WEEKDAYS = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function formatDisplayDate(day, month, year) {
  return `${day} ${MONTHS_GENITIVE[month]} ${year}`;
}

export function formatWeekdayDate(day, month, year) {
  const weekday = WEEKDAYS[new Date(year, month, day).getDay()];
  return `${weekday}, ${formatDisplayDate(day, month, year)}`;
}

function makeCell(date, isCurrentMonth) {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    isCurrentMonth,
  };
}

// Массив недель; каждая неделя — массив объектов-дней (включая соседние месяцы).
export function buildCalendarGrid(year, month) {
  const first = new Date(year, month, 1);
  let start = first.getDay();
  start = start === 0 ? 6 : start - 1; // понедельник = 0

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = start - 1; i >= 0; i--) {
    cells.push(makeCell(new Date(year, month - 1, daysInPrev - i), false));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(makeCell(new Date(year, month, d), true));
  }
  let next = 1;
  while (cells.length < 42) {
    cells.push(makeCell(new Date(year, month + 1, next++), false));
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function isDateSelectable(day, month, year, today) {
  if (!today) return false;
  const a = new Date(year, month, day); a.setHours(0, 0, 0, 0);
  const b = new Date(today.year, today.month, today.day); b.setHours(0, 0, 0, 0);
  return a >= b;
}