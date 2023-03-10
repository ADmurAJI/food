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

  //const modalTimerId = setTimeout(openModal, 10000);

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

  // Классы для карточек

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 60; // Как будто курс доллара
      this.changeRUB();
    }
    changeRUB() {
      return this.price * this.transfer;
    }
    render() {
      const element = document.createElement('div');

      // Если забыли добавить класс
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
            <img src=${this.src} alt=${this.alt} />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
              ${this.descr}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.changeRUB()}</span> руб/день</div>
            </div>
      `;
      this.parent.append(element);
    }
  }

  new MenuCard(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    6,
    '.menu .container'
    //'menu__item'
  ).render();

  new MenuCard(
    'img/tabs/elite.jpg',
    'elite',
    'Меню “Премиум”"',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, свежее отборное мясо, фрукты - ресторанное меню без похода в ресторан!',
    11,
    '.menu .container',
    'menu__item'
  ).render();

  new MenuCard(
    'img/tabs/post.jpg',
    'post',
    'Меню "Постное""',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    7,
    '.menu .container',
    'menu__item'
  ).render();
});
