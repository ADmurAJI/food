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
    const time = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(time / (1000 * 60 * 60 * 24)),
      hours = Math.floor((time / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((time / (1000 * 60)) % 60),
      seconds = Math.floor((time / 1000) % 60);

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

      // Склонение слов

      // const say = document.querySelector('.timer__text');

      // function declensionWord(num, word) {
      //   const cases = [2, 0, 1, 1, 1, 2];
      //   const words = [word, word + 'а', word + 'ов'];
      //   let index =
      //     num % 100 > 4 && num % 100 < 20 ? 2 : cases[Math.min(num % 10, 5)];
      //   return words[index];
      // }

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
});
