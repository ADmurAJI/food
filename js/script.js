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
    modal = document.querySelector('.modal');

  // Открываем окно

  function openModal() {
    modal.classList.remove('hide'), modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach((btn) => btn.addEventListener('click', openModal));

  const modalTimerId = setTimeout(openModal, 60000);

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

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
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

  // Получение данных с сервера
  const getRecource = async (url) => {
    const resoult = await fetch(url);

    if (!resoult.ok) {
      throw new Error(
        `Не смог получить данные с ${url}, статус ошибки: ${resoult.status}`
      );
    }

    return await resoult.json();
  };

  getRecource('http://localhost:3000/menu').then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(
        img,
        altimg,
        title,
        descr,
        price,
        '.menu .container'
      ).render();
    });
  });

  // new MenuCard(
  //   'img/tabs/vegy.jpg',
  //   'vegy',
  //   'Меню "Фитнес"',
  //   'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
  //   6,
  //   '.menu .container'
  //   //'menu__item'
  // ).render();

  // new MenuCard(
  //   'img/tabs/elite.jpg',
  //   'elite',
  //   'Меню “Премиум”"',
  //   'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, свежее отборное мясо, фрукты - ресторанное меню без похода в ресторан!',
  //   11,
  //   '.menu .container',
  //   'menu__item'
  // ).render();

  // new MenuCard(
  //   'img/tabs/post.jpg',
  //   'post',
  //   'Меню "Постное""',
  //   'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
  //   7,
  //   '.menu .container',
  //   'menu__item'
  // ).render();

  // Отправка данных с форм

  const forms = document.querySelectorAll('form');

  forms.forEach((item) => {
    bindData(item);
  });

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с Вами свяжемся.',
    failure: 'Что-то пошло не так...',
  };

  // Постинг данных на сервер
  const postData = async (url, data) => {
    const resoult = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: data,
    });
    return await resoult.json();
  };

  // Функция привязки постинга
  function bindData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      // Преображение данных с формы в JSON

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          // Очистить форму
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
          statusMessage.remove();
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  // Старый способо с XML

  // const forms = document.querySelectorAll('form');

  // forms.forEach((item) => {
  //   bindData(item);
  // });

  // const message = {
  //   loading: 'img/form/spinner.svg',
  //   success: 'Спасибо! Скоро мы с Вами свяжемся.',
  //   failure: 'Что-то пошло не так...',
  // };

  // function bindData(form) {
  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const statusMessage = document.createElement('img');
  //     statusMessage.src = message.loading;
  //     statusMessage.style.cssText = `
  //       display: block;
  //       margin: 0 auto;
  //     `;
  //     form.insertAdjacentElement('afterend', statusMessage);

  //     const request = new XMLHttpRequest();
  //     request.open('POST', 'server.php');

  //     request.setRequestHeader('Content-type', 'application/json');
  //     const formData = new FormData(form);

  //     const object = {};
  //     formData.forEach(function (key, value) {
  //       object[key] = value;
  //     });

  //     const json = JSON.stringify(object);

  //     request.send(json);

  //     request.addEventListener('load', () => {
  //       if (request.status === 200) {
  //         showThanksModal(message.success);
  //         // Очистить форму
  //         form.reset();
  //         statusMessage.remove();
  //       } else {
  //         showThanksModal(message.failure);
  //         form.reset();
  //         statusMessage.remove();
  //       }
  //     });
  //   });
  // }

  // Диалоговое окно отправки формы

  function showThanksModal(message) {
    const modalDialog = document.querySelector('.modal__dialog');

    modalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      modalDialog.classList.add('show');
      modalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  fetch('http://localhost:3000/menu')
    .then((data) => data.json())
    .then((res) => console.log(res));

  // Слайдер

  const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    sliderWrapper = document.querySelector('.offer__slider-wrapper'),
    sliderInner = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(sliderWrapper).width;

  let slideIndex = 1;
  let offset = 0;

  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  sliderInner.style.width = 100 * slides.length + '%';
  slides.forEach((slide) => {
    slide.style.width = width;
  });
  sliderInner.style.display = 'flex';
  sliderInner.style.transition = '0.5s all';
  sliderWrapper.style.overflow = 'hidden';

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }
    sliderInner.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dots.forEach((dot) => (dot.style.opacity = '.5'));
    dots[slideIndex - 1].style.opacity = 1;
  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    sliderInner.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dots.forEach((dot) => (dot.style.opacity = '.5'));
    dots[slideIndex - 1].style.opacity = 1;
  });

  // Навигация для слайда

  slider.style.position = 'relative';
  const indicators = document.createElement('ol');
  const dots = [];
  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
  `;

  slider.append(indicators);

  for (i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: 0.5;
        transition: opacity 0.6s ease;
    `;

    indicators.append(dot);
    dots.push(dot);

    if (i == 0) {
      dot.style.opacity = 1;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', function (e) {
      const slideTo = e.target.getAttribute('data-slide-to');

      slideIndex = slideTo;

      offset = +width.slice(0, width.length - 2) * (slideTo - 1);

      sliderInner.style.transform = `translateX(-${offset}px)`;

      if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

      dots.forEach((dot) => (dot.style.opacity = '.5'));
      dots[slideIndex - 1].style.opacity = 1;
    });
  });
});
