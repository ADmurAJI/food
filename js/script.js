window.addEventListener('DOMContentLoaded', () => {
  // Табы ///////////////////////////////////////////////////////

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabContent = document.querySelectorAll('.tabcontent'),
    tabParent = document.querySelector('.tabheader__items');

  // Скрываем контент табов

  function hideTabeContetn() {
    tabContent.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });
    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  // Отображаем контент первого таба

  function showTabContent(i = 0) {
    tabContent[i].classList.add('show', 'fade');
    tabContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabeContetn();
  showTabContent();

  // Слушаем клилки по табам и отображаем контент выбранного таба

  tabParent.addEventListener('click', function (event) {
    const target = event.target;
    tabs.forEach((item, i) => {
      if (target == item) {
        hideTabeContetn();
        showTabContent(i);
      }
    });
  });

  // Таймер ////////////////////////////////////////////////////////////

  const deadline = '2023-12-08';

  // Получаем оставшиеся дни, часы, минуты, секунды

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;

    const time = Date.parse(endtime) - Date.parse(new Date());

    // Если акция закончилась

    if (time <= 0) {
      (days = 0), (hours = 0), (minutes = 0), (seconds = 0);
    } else {
      (days = Math.floor(time / (1000 * 60 * 60 * 24))),
        (hours = Math.floor((time / (1000 * 60 * 60)) % 24)),
        (minutes = Math.floor((time / (1000 * 60)) % 60)),
        (seconds = Math.floor((time / 1000) % 60));
    }

    return {
      time,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  // Подставляем ноль для одной цифры

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  // Устанавливаем таймер на сайте

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    // Обновление таймера

    updateClock();

    function updateClock() {
      const time = getTimeRemaining(endtime);

      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      // Остановка таймера

      if (time <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline);

  // Модальное окно

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modalCloseBtn = document.querySelector('[data-close]'),
    modal = document.querySelector('.modal');

  // Открываем окно

  function openModal() {
    modal.classList.remove('hide'), modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach((btn) => btn.addEventListener('click', openModal));

  const modalTimerId = setTimeout(openModal, 10000);

  function openModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      openModal();
      window.removeEventListener('scroll', openModalByScroll);
      clearInterval(modalTimerId);
    }
  }
  window.addEventListener('scroll', openModalByScroll);

  // Закрываем окно

  function closeModal() {
    modal.classList.remove('show'), modal.classList.add('hide');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
});
