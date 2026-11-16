const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const toKey = ({ day, month, year }) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export async function fetchToday() {
  await delay(700);
  return { year: 2026, month: 10, day: 16 };
}

export async function fetchSlots(dayInfo) {
  await delay(900);
  const key = toKey(dayInfo);

  if (dayInfo.day === 13) {
    throw new Error('Сервер недоступен. Попробуйте другую дату.');
  }

  const times = ['10:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const slots = times.map((time, i) => ({
    time,
    available: (dayInfo.day + i) % 4 !== 0,
  }));

  return { date: key, slots };
}