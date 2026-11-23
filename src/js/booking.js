const STORE_KEY = 'beauty-booking-demo-v1';

const SERVICES = [
  {
    id: 'facial-signature',
    name: 'Facial signature',
    duration: 60,
    price: 85,
    meta: 'Cabina individual · Cuidado facial',
  },
  {
    id: 'ritual-de-luz',
    name: 'Ritual de luz',
    duration: 75,
    price: 95,
    meta: 'Cabina individual · Vitamina C',
  },
  {
    id: 'limpieza-profunda',
    name: 'Limpieza profunda',
    duration: 50,
    price: 70,
    meta: 'Cabina individual · Poros y textura',
  },
  {
    id: 'masaje-craneofacial',
    name: 'Masaje craneofacial',
    duration: 45,
    price: 65,
    meta: 'Camilla · Tensión y descanso',
  },
  {
    id: 'ritual-corporal',
    name: 'Ritual corporal',
    duration: 90,
    price: 120,
    meta: 'Camilla · Cuerpo y respiración',
  },
];

const PROFESSIONALS = [
  { id: 'ana', name: 'Ana' },
  { id: 'lucia', name: 'Lucía' },
];

const OPEN_MINUTES = 10 * 60;
const CLOSE_MINUTES = 20 * 60;
const STEP_MINUTES = 30;
const LUNCH_START = 14 * 60;
const LUNCH_END = 15 * 60;

const pad = (value) => String(value).padStart(2, '0');
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1);
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const toKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const fromKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const timeLabel = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

const formatMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const formatDateShort = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
const formatDateLong = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const today = startOfDay(new Date());
const maxMonth = startOfMonth(addMonths(today, 3));

const hash = (value) => {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[character];
  });

const escapeIcs = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const readBookings = () => {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeBookings = (list) => {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch (error) {
    /* La demo funciona igual sin almacenamiento local */
  }
};

export function initBooking() {
  const dialog = document.querySelector('[data-booking]');
  if (!dialog) return;

  const scroll = dialog.querySelector('[data-booking-scroll]');
  const steps = dialog.querySelector('[data-booking-steps]');
  const servicesElement = dialog.querySelector('[data-services]');
  const professionalsElement = dialog.querySelector('[data-professionals]');
  const calendarElement = dialog.querySelector('[data-calendar]');
  const monthElement = dialog.querySelector('[data-month]');
  const previousMonth = dialog.querySelector('[data-cal-prev]');
  const nextMonth = dialog.querySelector('[data-cal-next]');
  const timesElement = dialog.querySelector('[data-times]');
  const emptyElement = dialog.querySelector('[data-empty]');
  const dateLabelElement = dialog.querySelector('[data-date-label]');
  const selectionElement = dialog.querySelector('[data-selection]');
  const selectionStepThree = dialog.querySelector('[data-selection-step3]');
  const nextButton = dialog.querySelector('[data-next="3"]');
  const form = dialog.querySelector('[data-form]');
  const summaryElement = dialog.querySelector('[data-summary]');
  const confirmLead = dialog.querySelector('[data-confirm-lead]');
  const confirmCard = dialog.querySelector('[data-confirm-card]');
  const icsButton = dialog.querySelector('[data-ics]');
  const newBookingButton = dialog.querySelector('[data-new-booking]');
  const resetButton = dialog.querySelector('[data-reset]');

  let bookings = readBookings();
  let state = null;

  const serviceById = (id) => SERVICES.find((service) => service.id === id);
  const professionalById = (id) => PROFESSIONALS.find((professional) => professional.id === id);

  const slotsFor = (date, service, professionalId) => {
    const key = toKey(date);
    const duration = service.duration;
    const isToday = sameDay(date, today);
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const slots = [];

    for (let start = OPEN_MINUTES; start + duration <= CLOSE_MINUTES; start += STEP_MINUTES) {
      const lunch = start < LUNCH_END && start + duration > LUNCH_START;
      const simulated = hash(`${key}|${professionalId}|${start}`) % 100 < 27;
      const occupied = bookings.some(
        (booking) =>
          booking.date === key &&
          booking.proId === professionalId &&
          start < booking.end &&
          start + duration > booking.start,
      );
      const past = isToday && start <= nowMinutes + 30;

      slots.push({ start, full: lunch || simulated || occupied || past });
    }

    return slots;
  };

  const dayHasAvailability = (date) => {
    if (!state.service) return false;
    const weekday = date.getDay();
    if (weekday < 2 || weekday > 6) return false;
    if (date < today) return false;
    return slotsFor(date, state.service, state.proId).some((slot) => !slot.full);
  };

  const firstAvailableDate = () => {
    const year = state.month.getFullYear();
    const month = state.month.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day);
      if (dayHasAvailability(date)) return date;
    }

    return null;
  };

  const updateContinue = () => {
    if (!nextButton) return;
    nextButton.disabled = !(state.service && state.date && state.time !== null);
  };

  const updateSelection = () => {
    if (!selectionElement) return;

    let text = '';

    if (state.service && state.date) {
      const professional = professionalById(state.proId);
      const parts = [
        state.service.name,
        `${state.service.duration} min`,
        professional ? professional.name : '',
        capitalize(formatDateShort.format(state.date).replace(/\.$/, '')),
      ];

      if (state.time !== null) parts.push(timeLabel(state.time));
      text = parts.filter(Boolean).join(' · ');
    }

    selectionElement.textContent = text;
    if (selectionStepThree) selectionStepThree.textContent = text;
  };

  const renderServices = () => {
    servicesElement.innerHTML = SERVICES.map(
      (service) => `
        <button type="button" class="booking-service" data-service="${service.id}">
          <span>
            <span class="booking-service__name t-card-title">${service.name}</span>
            <span class="booking-service__meta t-card-meta">${service.duration} min · ${service.meta}</span>
          </span>
          <span class="booking-service__price t-card-price">Desde ${service.price} €</span>
        </button>`,
    ).join('');
  };

  const renderProfessionals = () => {
    professionalsElement.innerHTML = PROFESSIONALS.map(
      (professional) => `
        <button
          type="button"
          class="booking-pill t-nav"
          data-pro="${professional.id}"
          aria-pressed="${professional.id === state.proId}"
        >${professional.name}</button>`,
    ).join('');
  };

  const renderCalendar = () => {
    const year = state.month.getFullYear();
    const month = state.month.getMonth();
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();

    monthElement.textContent = capitalize(formatMonth.format(state.month));

    const cells = [];
    for (let i = 0; i < offset; i += 1) {
      cells.push('<span class="booking-cal__blank" aria-hidden="true"></span>');
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day);
      const available = dayHasAvailability(date);
      const selected = state.date ? sameDay(date, state.date) : false;
      const isToday = sameDay(date, today);
      const label = `${capitalize(formatDateLong.format(date))}${available ? '' : ', sin disponibilidad'}`;

      cells.push(`
        <button
          type="button"
          class="booking-cal__day${selected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}"
          data-date="${toKey(date)}"
          aria-pressed="${selected}"
          aria-label="${label}"
          ${isToday ? 'aria-current="date"' : ''}
          ${available ? '' : 'disabled'}
        >${day}</button>`);
    }

    calendarElement.innerHTML = cells.join('');
    previousMonth.disabled = state.month.getTime() <= startOfMonth(today).getTime();
    nextMonth.disabled = state.month.getTime() >= maxMonth.getTime();
  };

  const renderTimes = () => {
    if (!dateLabelElement || !timesElement || !emptyElement) return;

    dateLabelElement.textContent = state.date
      ? capitalize(formatDateShort.format(state.date).replace(/\.$/, ''))
      : '';

    if (!state.service || !state.date) {
      timesElement.innerHTML = '';
      emptyElement.hidden = false;
      emptyElement.textContent = 'Elige un día en el calendario.';
      return;
    }

    const slots = slotsFor(state.date, state.service, state.proId);
    const available = slots.filter((slot) => !slot.full);

    timesElement.innerHTML = slots
      .map(
        (slot) => `
          <button
            type="button"
            class="booking-slot"
            data-time="${slot.start}"
            aria-pressed="${state.time === slot.start}"
            aria-label="${timeLabel(slot.start)}, ${slot.full ? 'lleno' : 'disponible'}"
            ${slot.full ? 'disabled' : ''}
          >
            <span>${timeLabel(slot.start)}</span>
            ${slot.full ? '<span class="booking-slot__status">Lleno</span>' : ''}
          </button>`,
      )
      .join('');

    emptyElement.hidden = available.length > 0;
    if (!available.length) {
      emptyElement.textContent = 'No quedan horas disponibles para este día. Prueba otro día u otra profesional.';
    }
  };

  const summaryRows = () => {
    const professional = professionalById(state.proId);
    return [
      ['Tratamiento', state.service.name],
      ['Fecha', capitalize(formatDateLong.format(state.date))],
      ['Hora', timeLabel(state.time)],
      ['Profesional', professional ? professional.name : ''],
      ['Duración', `${state.service.duration} min`],
      ['Precio', `Desde ${state.service.price} €`],
    ];
  };

  const renderSummary = () => {
    if (!summaryElement || !state.service || !state.date) return;

    const rows = summaryRows()
      .map(([term, value]) => `<dt>${term}</dt><dd>${escapeHtml(value)}</dd>`)
      .join('');

    summaryElement.innerHTML = `
      <p class="t-label">Tu cita</p>
      <p class="booking-summary__service">${escapeHtml(state.service.name)}</p>
      <dl class="booking-details">${rows}</dl>
      <p class="booking-summary__note t-label">Pago en el salón · [REEMPLAZAR]</p>`;
  };

  const showStep = (step, { focus = true } = {}) => {
    state.step = step;

    dialog.querySelectorAll('[data-step]').forEach((section) => {
      section.hidden = Number(section.dataset.step) !== step;
    });

    steps.hidden = step === 4;
    steps.querySelectorAll('[data-indicator]').forEach((item) => {
      if (Number(item.dataset.indicator) === step) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    if (step === 2) {
      renderCalendar();
      renderTimes();
      updateContinue();
      updateSelection();
    }

    if (step === 3) {
      renderSummary();
      updateSelection();
    }

    scroll.scrollTop = 0;

    if (focus) {
      const heading = dialog.querySelector(`[data-step="${step}"] .booking-heading`);
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  };

  const resetFlow = () => {
    state = {
      step: 1,
      service: null,
      proId: PROFESSIONALS[0].id,
      month: startOfMonth(today),
      date: null,
      time: null,
      confirmation: null,
    };
    bookings = readBookings();
    form.reset();
    summaryElement.innerHTML = '';
    confirmLead.textContent = '';
    confirmCard.innerHTML = '';
    renderServices();
    renderProfessionals();
    renderCalendar();
    renderTimes();
    updateContinue();
    updateSelection();
    showStep(1, { focus: false });
  };

  const renderConfirmation = () => {
    const confirmation = state.confirmation;
    if (!confirmation) return;

    const service = serviceById(confirmation.serviceId);
    const professional = professionalById(confirmation.proId);

    confirmLead.textContent = `${service.name} el ${formatDateLong.format(
      confirmation.date,
    )} a las ${timeLabel(confirmation.time)}.`;

    const rows = [
      ['Tratamiento', service.name],
      ['Fecha', capitalize(formatDateLong.format(confirmation.date))],
      ['Hora', timeLabel(confirmation.time)],
      ['Profesional', professional ? professional.name : ''],
      ['Duración', `${service.duration} min`],
      ['Precio', `Desde ${service.price} €`],
      ['Nombre', confirmation.name],
      ['Email', confirmation.email],
    ];

    confirmCard.innerHTML = `<dl class="booking-details">${rows
      .map(([term, value]) => `<dt>${term}</dt><dd>${escapeHtml(value)}</dd>`)
      .join('')}</dl>`;
  };

  const buildIcs = () => {
    const confirmation = state.confirmation;
    if (!confirmation) return;

    const service = serviceById(confirmation.serviceId);
    const professional = professionalById(confirmation.proId);
    const date = confirmation.date;
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Math.floor(confirmation.time / 60),
      confirmation.time % 60,
    );
    const end = new Date(start.getTime() + service.duration * 60 * 1000);
    const utc = (date) => `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Salon Belleza Demo//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@salon-demo`,
      `DTSTAMP:${utc(new Date())}`,
      `DTSTART:${utc(start)}`,
      `DTEND:${utc(end)}`,
      `SUMMARY:${escapeIcs(`${service.name} · [NOMBRE DEL SALÓN]`)}`,
      'LOCATION:Calle [REEMPLAZAR]\\, [CIUDAD]',
      `DESCRIPTION:${escapeIcs(`Cita demo con ${professional ? professional.name : 'el salón'}`)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cita-salon.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  /* ------------------------------ Eventos ------------------------------ */

  document.querySelectorAll('[data-booking-open]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      resetFlow();
      if (!dialog.open) dialog.showModal();
      document.documentElement.classList.add('booking-open');
      if (window.__lenis) window.__lenis.stop();
    });
  });

  dialog.querySelectorAll('[data-booking-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('booking-open');
    if (window.__lenis) window.__lenis.start();
  });

  servicesElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-service]');
    if (!button) return;

    const service = serviceById(button.dataset.service);
    if (!service) return;

    state.service = service;
    state.date = firstAvailableDate();
    state.time = null;
    showStep(2);
  });

  professionalsElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pro]');
    if (!button) return;

    state.proId = button.dataset.pro;
    state.time = null;
    if (!state.date || !dayHasAvailability(state.date)) {
      state.date = firstAvailableDate();
    }
    renderProfessionals();
    renderCalendar();
    renderTimes();
    updateContinue();
    updateSelection();
  });

  previousMonth.addEventListener('click', () => {
    if (state.month.getTime() <= startOfMonth(today).getTime()) return;
    state.month = addMonths(state.month, -1);
    state.date = firstAvailableDate();
    state.time = null;
    renderCalendar();
    renderTimes();
    updateContinue();
    updateSelection();
  });

  nextMonth.addEventListener('click', () => {
    if (state.month.getTime() >= maxMonth.getTime()) return;
    state.month = addMonths(state.month, 1);
    state.date = firstAvailableDate();
    state.time = null;
    renderCalendar();
    renderTimes();
    updateContinue();
    updateSelection();
  });

  calendarElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-date]');
    if (!button || button.disabled) return;

    state.date = fromKey(button.dataset.date);
    state.time = null;
    renderCalendar();
    renderTimes();
    updateContinue();
    updateSelection();
  });

  timesElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-time]');
    if (!button || button.disabled) return;

    state.time = Number(button.dataset.time);
    renderTimes();
    updateContinue();
    updateSelection();
  });

  dialog.querySelectorAll('[data-back]').forEach((button) => {
    button.addEventListener('click', () => showStep(Number(button.dataset.back)));
  });

  nextButton.addEventListener('click', () => {
    if (nextButton.disabled) return;
    showStep(3);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!state.service || !state.date || state.time === null) {
      showStep(2);
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const service = state.service;
    const end = state.time + service.duration;

    bookings.push({
      serviceId: service.id,
      proId: state.proId,
      date: toKey(state.date),
      start: state.time,
      end,
    });
    writeBookings(bookings);

    state.confirmation = {
      serviceId: service.id,
      proId: state.proId,
      date: state.date,
      time: state.time,
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      email: String(data.get('email') || '').trim(),
      notes: String(data.get('notes') || '').trim(),
    };

    renderConfirmation();
    showStep(4);
  });

  icsButton.addEventListener('click', buildIcs);

  newBookingButton.addEventListener('click', () => {
    resetFlow();
    showStep(1);
  });

  resetButton.addEventListener('click', () => {
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch (error) {
      /* nada */
    }
    bookings = [];
    resetFlow();
  });

  resetFlow();
}
