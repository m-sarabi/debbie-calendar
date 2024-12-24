function generateDays(month, year) {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        // days.push(day);
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.dataset.day = day.toString();
        dayElement.textContent = day.toString();
        days.push(dayElement);
    }

    // find out what day of the week the first day of the month is. monday = 1, tuesday = 2, etc.
    const firstDayOfWeek = firstDay.getDay() + 1;

    return [days, firstDayOfWeek];
}

function getCurrentDayMonth() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    return {month, day};
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.calendar-container');
    const monthContainer = document.querySelectorAll('.month-container');
    const monthsCount = monthContainer.length;
    const radius = 70; // Radius of the circle
    const yearElement = document.querySelector('.year');
    const dayNamesTemplate = document.getElementById('day-names-template');

    let year = new Date().getFullYear();

    yearElement.textContent = year.toString();
    updateCalendar();

    // if right-clicked on year, decrement year, else increment it
    yearElement.addEventListener('click', function () {
        year++;
        yearElement.textContent = year.toString();
        updateCalendar();
    });

    yearElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        year--;
        yearElement.textContent = year.toString();
        updateCalendar();
    });

    function updateCalendar() {
        for (let i = 0; i < monthsCount; i++) {
            const angle = (i / monthsCount) * 360 - 90; // Calculate angle
            const radians = angle * Math.PI / 180;

            const x = radius * Math.cos(radians);
            const y = radius * Math.sin(radians);

            monthContainer[i].style.left = (container.offsetWidth / 2) + x - (monthContainer[i].offsetWidth / 2) + 'px';
            monthContainer[i].style.top = (container.offsetHeight / 2) + y - (monthContainer[i].offsetHeight) + 'px';
            monthContainer[i].style.transform = `rotate(${angle + 90}deg)`;

            // add day names to monthContainer
            const dayNames = dayNamesTemplate.content.cloneNode(true);
            if (monthContainer[i].querySelector('.day-name-container')){
                monthContainer[i].querySelector('.day-name-container').remove();
            }
            monthContainer[i].querySelector('.month').insertBefore(dayNames, monthContainer[i].querySelector('.days'));

            // Generate days dynamically
            const [days, firstDayOfWeek] = generateDays(i, year);

            // add dummy days to make the first day of the month the first day of the week
            const dummyDays = [];
            for (let j = 0; j < firstDayOfWeek - 1; j++) {
                const dummyDay = document.createElement('div');
                dummyDay.classList.add('dummy-day');
                dummyDay.classList.add('day');
                dummyDay.textContent = '';
                dummyDays.push(dummyDay);
            }
            days.unshift(...dummyDays);

            const daysContainer = monthContainer[i].querySelector('.days');
            daysContainer.innerHTML = '';
            days.forEach(day => daysContainer.appendChild(day));

            // Highlight current day
            const {month, day} = getCurrentDayMonth();
            if (i === month && year === new Date().getFullYear()) {
                const currentDay = daysContainer.querySelector(`[data-day="${day}"]`);
                currentDay.classList.add('current-day');
            }
        }
    }
});