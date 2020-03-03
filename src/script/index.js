'use strict'

// import 'babel-polyfill';
import '../style/index.scss'
import '../modules/cap'
import {toggleHideScroll} from './toggleHideScroll.js'
import {Validator} from './validator.js'
import 'jquery.maskedinput/src/jquery.maskedinput.js'
import 'slick-carousel/slick/slick.min.js'

document.addEventListener('DOMContentLoaded', () => {

//global config

  const config = {};
  config.touch = ( ('ontouchstart' in window || ( window.DocumentTouch && document instanceof DocumentTouch) ) ) ? true : false;
  config.adaptiveElements = 'button, a';

  function settDelay(response, ms) {
    return new Promise((resolve) => {
      setTimeout( (r) => resolve(r), ms, response);
    })
  };

  function animHandler(el, ...cls) {
    return new Promise((resolve) => {
      cls.forEach( (i)=>el.classList.add(i));
      el.onanimationend = (e) => resolve(e);
    })
  };

// плавный переход по якорям

  $('a[href^="#"]').on('click', function(event) {
    event.preventDefault();    
    let target = $(this).attr("href");
    let targetScrollOffset = $(target).offset().top;
    $('html, body').animate({scrollTop: targetScrollOffset}, 500);
  });

// touch buttons modify

  if ( !config.touch ) $(config.adaptiveElements).each( (i, el) => el.dataset.touch = "false" );

// set drop-down menu-nav

  $('.header-main__btn-nav').on('click', (e) => {
    const $el_nav = $('.nav');
    if ( !$el_nav.hasClass('nav_mobile') ) {
      $el_nav.removeClass('slideUp');
      $el_nav.addClass('slideDown');
      $el_nav.addClass('nav_mobile');
      e.currentTarget.classList.add('btn-nav_close');
    } else {
      $el_nav.removeClass('slideDown');
      e.currentTarget.classList.remove('btn-nav_close');
      animHandler( $el_nav[0], 'slideUp' )
      .then( (r) => {
        $el_nav.removeClass('nav_mobile');
        $el_nav.removeClass('slideUp');
    } );
    }
  })

// create html forms for buttons

  function setBtnForm($_buttons, inputs){// data-action="getform-[name, phone, email]" | return attributes = ['name', 'phone', 'email']

    $_buttons.each( function(i, button) {// находит кнопки с атрибутами и цепляет к ним функцию создания формы
      let attributes = button.getAttribute('data-action').match(/\[.*\]/);
      if (attributes) {
        attributes = attributes[0].slice(1,-1).split(',').map( (j)=> j = j.trim().toLowerCase() );
        $(button).on('click', (e) => createForm(button, attributes) );
      }
    });

    // создание и вставка форм
      //blackout-container
        //form
          //form__wrap
            //form__btn_close
            //form__label
            //form__icon
            //form__input

    function createForm(el, attributes) {
      const action = 'mail.php';

      if ( !attributes || attributes.length === 0) return;// бессмысленная проверка
      attributes = new Set(attributes);// еще одна бессмысленная проверка. Так, на всякий

      toggleHideScroll();

      const $_blackout = $('<div class="blackout-container">').on( 'click', function(e) {
        if (e.target !== e.currentTarget) return false;
        e.stopPropagation();
        toggleHideScroll();
        $_blackout.remove();
      });

      const $_form_wrap = $('<div class="form">');
 
      const $_form = $(`<form class="form__wrap" autocomplete="on" action=${action} method="POST" >`);

      const $_btn_close = $(`
      <button class="form__btn_close" type="button">
        <svg class="form__icon form__icon_close" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 288 288">
          <g class="svg__icons">
            <path class="fil0 str0" d="M144 288c-79,0 -144,-64 -144,-144 0,-79 65,-144 144,-144 80,0 144,65 144,144 0,80 -64,144 -144,144zm0 -11c-73,0 -133,-59 -133,-133 0,-73 60,-133 133,-133 74,0 133,60 133,133 0,74 -59,133 -133,133z"/>
            <polygon class="fil1 str1" points="225,208 161,144 225,80 208,63 144,127 80,63 63,80 127,144 63,208 80,225 144,161 208,225 "/>
          </g>
        </svg>
      </button>`).on( 'click', function(e) {
        e.stopPropagation();
        toggleHideScroll();
        $_blackout.remove();
      });
      if ( !config.touch ) $_btn_close[0].dataset.touch = "false";
      $_form.prepend($_btn_close);

      const $_label = $('<label for="firstName">* Фамилия, имя, отчество:</label>')

      for ( let i of attributes ) {
        for ( let j of Object.entries(inputs) ) {
          if ( i === j[0] ) {
            const $_div = $(`<div class="form__input-wrap">`).append(j[1].icon).append(j[1].input);
            const $_label = $(`<label class="form__group">`).append(j[1].title).append($_div);
            $_form.append($_label);
          }
        }
      }

      const $_submit = $(`<button type="submit" class="form__btn btn_orang">${$(el).text()}</button>`);
      if ( !config.touch ) $_submit[0].dataset.touch = "false";
      $_form.append($_submit);

      const validator = new Validator( $_form, {parentClass: 'form__input-wrap', messageClass: 'form__message', messageAnimShowClass: 'slideDown', messageAnimHideClass: 'slideUp'} );
      $_form_wrap.append($_form)
      $_blackout.append($_form_wrap);
      $('body').append($_blackout);

      $_submit.click((e) => {
        e.preventDefault();
        if ( validator.validate() ) {
          $_form_wrap.html('<img src="img/ajax-loader.svg">');
          let options =  {
            method: 'POST',
            body:  new FormData($_form[0])
          };
          fetch(action, options)
          .then( (r)=> {
            // console.log(r);
            if (r.ok) {
              r.text().then( r => $_form_wrap.html(`<div class="form"><h3 class="form__response">${r}</h3></div>`) )
            } else {
              $_form_wrap.html(`<div class="form"><h3 class="form__response">Ошибка !</h3></div>`);
            }
          })
        }
      })

    }
  }

  const inputs = {
    name: {
      input: $('<input class="form__input-text form__input-text_name" type="text" id="name" name="name" placeholder="имя">'),
      // label: $('<label class="form__label" for="name">имя</label>'),
      icon: $('<svg class="form__icon form__icon_name" viewBox="0 0 96 98" aria-hidden="true" focusable="false"><use xlink:href="img/icons.svg#icon-user"></use></svg>'),
      title: $('<h2 class="form__title">имя:</h2>')
    },

    email: {
      input: $('<input class="form__input-text form__input-text_email" type="email" id="email" name="email" placeholder="e-mail">'),
      // label: $('<label class="form__label" for="email">e-mail</label>'),
      icon: $('<svg class="form__icon form__icon_mail" viewBox="0 0 63 41" aria-hidden="true" focusable="false"><use xlink:href="img/icons.svg#icon-mail"></use></svg>'),
      title: $('<h2 class="form__title">e-mail:</h2>')
    },

    phone: {
      input: $('<input class="form__input-text form__input-text_phone" type="tel" id="phone" name="phone" placeholder="телефон">'),
      // label: $('<label class="form__label" for="phone">телефон</label>'),
      icon: $('<svg class="form__icon form__icon_phone" viewBox="0 0 43 43" aria-hidden="true" focusable="false"><use xlink:href="img/icons.svg#icon-phone"></use></svg>'),
      title: $('<h2 class="form__title">телефон:</h2>')
    }
  }

  setBtnForm( $('[data-action^=getform-]'), inputs );

  //jQuery slick setting

  const $_slider = $('[data-type="slider"]');
  const $_slideCont = $('[data-type="image-cont"]');

  function setTopStyle(e, slick){
    function getOffsetTop(el) {
      let offsetTopSum = 0;
      if (el !== $_slider[0]) {
        offsetTopSum += el.offsetTop + getOffsetTop(el.offsetParent);
      }
      return offsetTopSum;
    }
    const $_arrow = $('.slick-arrow');
    let top = Math.floor(getOffsetTop($_slideCont[0]) + $_slideCont[0].offsetHeight / 2) + 'px';
    $_arrow.css('top', top);
  }

  function Handlers() {
    setTopStyle();
    if ( !config.touch ) $(config.adaptiveElements, $_slider).attr('data-touch', "false");
  }

  $_slider.on('setPosition', Handlers);
  
  $_slider.slick({
    slidesToShow: 3,
    dots: false,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    prevArrow: '<button id="prev" type="button" class="slider__arrow-back"></button>',
    nextArrow: '<button id="next" type="button" class="slider__arrow-forward"></button>',
    dotsClass: 'slider__dots',
    responsive: [
	    {
	      breakpoint: 1025,
	      settings: {
          slidesToShow: 2,
          dots: true,
          arrows: false
	      }
	    },
	    {
	      breakpoint: 801,
	      settings: {
          slidesToShow: 1,
          dots: true,
          arrows: false
	      }
	    }
    ]
  })

})
