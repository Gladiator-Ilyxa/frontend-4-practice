import { useState, useEffect, useRef } from 'react';
import ProgressBar from './components/ProgressBar';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import { fetchToday, fetchSlots } from './api';
import './booking.css';

const toKey = ({ day, month, year }) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function App() {
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);
  const [todayRetry, setTodayRetry] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);
  const [slotsRetry, setSlotsRetry] = useState(0);

  const latestKey = useRef(null);

  // Шаг 1 — «сегодня» один раз при монтировании (+ повтор по кнопке).
  useEffect(() => {
    let cancelled = false;
    setLoadingToday(true);
    setErrorToday(null);
    fetchToday()
      .then((res) => {
        if (cancelled) return;
        setToday(res);
        setCurrentMonth(res.month);
        setCurrentYear(res.year);
        setSelectedDay({ day: res.day, month: res.month, year: res.year });
      })
      .catch((e) => { if (!cancelled) setErrorToday(e.message || 'Ошибка загрузки даты'); })
      .finally(() => { if (!cancelled) setLoadingToday(false); });
    return () => { cancelled = true; };
  }, [todayRetry]);

  // Шаг 2 — слоты при каждой смене selectedDay (+ повтор). Защита от гонок по эхо-date.
  useEffect(() => {
    if (!selectedDay) {
      setSlots([]); setErrorSlots(null); setLoadingSlots(false);
      latestKey.current = null;
      return;
    }
    const key = toKey(selectedDay);
    latestKey.current = key;
    let cancelled = false;
    setLoadingSlots(true);
    setErrorSlots(null);
    fetchSlots(selectedDay)
      .then((res) => {
        if (cancelled || latestKey.current !== key || res.date !== key) return;
        setSlots(res.slots);
      })
      .catch((e) => {
        if (!cancelled && latestKey.current === key) setErrorSlots(e.message || 'Ошибка загрузки слотов');
      })
      .finally(() => {
        if (!cancelled && latestKey.current === key) setLoadingSlots(false);
      });
    return () => { cancelled = true; };
  }, [selectedDay, slotsRetry]);

  const handleDayClick = (dayInfo) => {
    setSelectedDay(dayInfo);
    setSelectedTime(null);
  };

  const shiftMonth = (delta) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
    setErrorSlots(null);
  };

  const handleContinue = () => {
    if (selectedDay && selectedTime) {
      alert(`Запись оформлена!\nДата: ${selectedDay.day}.${selectedDay.month + 1}.${selectedDay.year}\nВремя: ${selectedTime}`);
    } else {
      alert('Пожалуйста, выберите дату и время');
    }
  };

  const booking = () => {
    if (errorToday) {
      return (
        <div className="panel panel--error" role="alert">
          <span>Ошибка: {errorToday}</span>
          <button type="button" className="panel__retry" onClick={() => setTodayRetry((n) => n + 1)}>
            Повторить
          </button>
        </div>
      );
    }
    if (loadingToday || !today || currentMonth === null) {
      return (
        <>
          <div className="booking">
            <div className="card">
              <span className="skel skel--title" />
              <span className="skel skel--grid" />
            </div>
            <div className="card">
              <span className="skel skel--title" />
              <span className="skel skel--rows" />
            </div>
          </div>
          <p className="status status--center"><span className="spinner" />Загрузка…</p>
        </>
      );
    }
    return (
      <div className="booking">
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedDay={selectedDay}
          today={today}
          onPrevMonth={() => shiftMonth(-1)}
          onNextMonth={() => shiftMonth(1)}
          onDayClick={handleDayClick}
        />
        <TimeSlots
          slots={slots}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          onTimeClick={setSelectedTime}
          loading={loadingSlots}
          error={errorSlots}
          onRetry={() => setSlotsRetry((n) => n + 1)}
        />
      </div>
    );
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <a href="#" className="header__logo">
            <img src="/images/logo1.jpg" alt="Логотип барбершопа" className="header__logo-img" />
          </a>
          <nav className="header__nav">
            <a href="#" className="header__nav-link">Услуги</a>
            <a href="#" className="header__nav-link">Галерея</a>
            <a href="#" className="header__nav-link">Команда</a>
            <a href="#" className="header__nav-link">Отзывы</a>
            <a href="#" className="header__nav-link">Контакты</a>
          </nav>
        </div>
      </header>

      <ProgressBar />

      <main className="main">
        <div className="main__container">
          <h1 className="main__title">
            <span className="main__title-accent" />
            Выбор доступного времени
          </h1>

          {booking()}

          <div className="booking__actions">
            <button className="btn btn--primary" onClick={handleContinue}>Продолжить</button>
          </div>
        </div>
      </main>

      <BottomBar selectedDay={selectedDay} selectedTime={selectedTime} />

      <footer className="footer">
        <div className="footer__container">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">
                <img src="/images/logo1.jpg" alt="Логотип" className="footer__logo-img" />
              </div>
              <p className="footer__description">Дружелюбное описание услуг</p>
            </div>
            <div className="footer__contacts">
              <h3 className="footer__heading">КОНТАКТЫ</h3>
              <p className="footer__contact-item">📍 ул. Садовая, 15, Москва</p>
              <p className="footer__contact-item">📞 +7 (495) 123-45-67</p>
            </div>
            <div className="footer__schedule">
              <h3 className="footer__heading">РЕЖИМ РАБОТЫ</h3>
              <p className="footer__schedule-item">Пн–Пт: 9:00 – 21:00</p>
              <p className="footer__schedule-item">Сб–Вс: 10:00 – 19:00</p>
            </div>
          </div>
          <div className="footer__bottom">
            <span className="footer__copyright">© 2026. Все права защищены.</span>
            <a href="#" className="footer__privacy">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;