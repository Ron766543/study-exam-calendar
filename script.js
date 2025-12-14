const currentDateElem = document.getElementById("current-date");
const currentTimeElem = document.getElementById("current-time");
const calendarDays = document.getElementById("calendar-days");
const monthYearElem = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentMonth, currentYear;

function updateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateElem.textContent = now.toLocaleDateString(undefined, options);
  currentTimeElem.textContent = now.toLocaleTimeString();

  setTimeout(updateTime, 1000);
}

function renderCalendar(month, year) {
  calendarDays.innerHTML = "";
  currentMonth = month; currentYear = year;

  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // update header
  const monthName = new Date(year, month, 1).toLocaleString(undefined, { month: 'long' });
  monthYearElem.textContent = `${monthName} ${year}`;

  // add empty placeholders to align first day (keeps grid positions)
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "empty";
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const box = document.createElement("div");
    box.className = "day";
    box.textContent = day;

    const key = `${year}-${month + 1}-${day}`;
    const saved = localStorage.getItem(key);
    if (saved === "study") box.classList.add("study");
    if (saved === "exam") box.classList.add("exam");

    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    if (isToday) box.classList.add("today");

    box.addEventListener("click", () => {
      const raw = prompt("Type 'study', 'exam', or 'clear':");
      if (raw === null) return;
      const label = raw.toLowerCase().trim();
      box.classList.remove("study", "exam");
      if (label === "study") {
        box.classList.add("study");
        localStorage.setItem(key, "study");
      } else if (label === "exam") {
        box.classList.add("exam");
        localStorage.setItem(key, "exam");
      } else {
        localStorage.removeItem(key);
      }
    });

    calendarDays.appendChild(box);
  }
}

(function init() {
  const now = new Date();
  renderCalendar(now.getMonth(), now.getFullYear());
  updateTime();

  prevBtn.addEventListener('click', () => {
    let m = currentMonth - 1;
    let y = currentYear;
    if (m < 0) { m = 11; y -= 1; }
    renderCalendar(m, y);
  });
  nextBtn.addEventListener('click', () => {
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) { m = 0; y += 1; }
    renderCalendar(m, y);
  });

})();