import 'jquery.maskedinput/src/jquery.maskedinput.js'

export class Validator{// use jquery.maskedinput.js => jquery 3.4.x

  constructor(el, options=null){

    this.options;
    this.init = false;
    this.target;
    this.targetTag;
    this.form = null;
    this.fields = []
    this.submit = null;

    if ( el.jquery === undefined) el = $(el );
    if ( el[0].tagName.match(/(input|form|textarea)/i) ) {
      this.target = el;
      this.targetTag = el[0].tagName.toLowerCase();
    }
    else {
      console.log(`Элемент <${el[0].tagName}> не является формой или полем`);
      return;
    };
    if ( this.targetTag === 'form' ) {
      this.form = this.target;
      this.form.attr('novalidate', 'novalidate');
      this.fields = $.makeArray( $( `input[type!="button"][type!="submit"][type!="reset"], textarea`, this.form[0] ) ).map( (el) => { return {element: el} } );
      this.submit = $('[type="submit"]', this.form[0]);
    } else if ( !this.target.attr('type').match( /(button|submit|reset)/i ) ) {
        this.fields = [{element: this.target[0]}];
    } else {
      console.log(`Элемент <${el[0].tagName}> не является полем. Тип ${this.target.attr('type')}`);
      this.init = false;
      return;
    }

    this.defaultOptions = {
      // onValidate: null,
      messageElement: 'span',
      messageClass: 'message',
      messageAnimShowClass:'',
      messageAnimHideClass:'',
      errorClass: 'error',
      validClass: 'valid',
      rules: {// список именованных наборов правил
        name: {// именованный набор правил
          required: {// правило
            value: true,
            message: 'пустое поле'
          }
        },
        phone: {
          required: true,
          pattern: {
            value: /\+7\s\(\d{3}\)\s\d{3}-\d{4}/,
            message: 'невалидный номер',
            mask: '+7 (999) 999-9999'
          }
        },
        email: {
          required: true,
          pattern: {
            value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
            message: 'невалидный адрес e-mail'
          }
        }
      },
    }

    this.options = (options) ? Object.assign(this.defaultOptions, options) : this.defaultOptions;

    this.metods = {
      required: function( field, value = true, message = 'пустое поле', parent){
        let valid = Boolean( field.element.value.trim() );
        if (!valid) {
          field.message.text(message);
          parent.showMessage(field, parent.options)
        } else {
          parent.hideMessage(field, parent.options)
        }
        return valid;
      },
      pattern: function(field, value, message, parent){
        let valid = field.element.value.trim().match(value);
        if (!valid) {
          field.message.text(message);
          parent.showMessage(field, parent.options)
        } else {
          parent.hideMessage(field, parent.options)
        }
        return valid;
      }
    }

    // фильтруем, создаем элементы сообщений, присваиваем обработчики событий

    let fieldsSort = [];
    for ( let field of this.fields ) {
      let metodExist = false;
      for ( let setOfRules of Object.entries(this.options.rules) ) {
        if ( field.element.getAttribute('name') === setOfRules[0] ) {
          metodExist = true;
          if ( setOfRules[1].pattern && setOfRules[1].pattern.mask ) {
            $(field.element).mask(setOfRules[1].pattern.mask);
            field.element.addEventListener('blur', (e) => {field.change = true} );// на маскированном эл-те не работает событие 'change'
          }
        }
      }
      if (metodExist) {
        fieldsSort.push(field);
        field.message = $(`<${this.options.messageElement}>`);
        field.message.addClass(this.options.messageClass);
        field.message.insertAfter(field.element);
        field.element.addEventListener('blur', (e) => this.validate([field]) );
        field.element.addEventListener('change', (e) => {
          field.change = true
        } );
      }
    }
    this.fields = fieldsSort;

    // проверка на валидность по нажатию

    // this.submit.click((e) => { 
    //   let valid = this.validate(this.fields, options);
    //   e.preventDefault();
    //   console.log(e);
    //   if (valid) {
    //     // console.log(this.submit);
    //     if (this.options.onValidate) {
    //       this.options.onValidate();
    //     } else {
    //       console.log('is Valid !');
    //     }
    //   } else {
    //     return false;
    //   }
    // });
  }

  showMessage(field, options){
    field.message.removeClass(options.messageAnimHideClass);
    field.message.removeClass(options.validClass);
    field.message.addClass(options.errorClass);
    field.message.addClass(options.messageAnimShowClass);
  }

  hideMessage(field, options){
    field.message.removeClass(options.messageAnimShowClass);
    field.message.removeClass(options.errorClass);
    field.message.addClass(options.validClass);
    field.message.addClass(options.messageAnimHideClass);
  }

  validate(fields = this.fields){
    for ( let field of fields ) {// [ {elements:object, message:'', valid:bool} ]
      let invalid = false;
      // console.log(`invalid 1 : ${invalid}`);
      // console.log(`condition 1 : ${(field.change === false && field.valid !== null)}`);
      if ( field.change === false && field.valid !== null ) break;

      for ( let setOfRules of Object.entries(this.options.rules) ) {// setOfRules = [ "name", {rules} ]        
        if ( field.element.getAttribute('name') === setOfRules[0] ) {// если есть именованный набор правил сопостовимый с атрибутом 'name'
          let rules = Object.entries(setOfRules[1]);// rules = [ [rule], rule] ]

          for ( let rule of rules ) {// rule = ["required", true] or ["pattern", {…}]  // применение методов
          if (invalid) break;
            if ( this.metods[rule[0]]) {// если есть соответствующее правило в this.metods
              if ( typeof rule[1] === 'boolean' ) rule[1] = {value: rule[1]};// если в опциях правило записано кратко - привести в соответствие
              if ( this.metods[rule[0]]( field, rule[1].value, rule[1].message, this ) ) {// если правило валидно
                field.valid = true;
                field.change = false;
              } else {// если правило не валидно
                invalid = true;
                // console.log(`invalid 2 : ${invalid}`);
                field.valid = false;
                field.change = false;
              }
            } else {
              console.log(`метод ${k} не задан`);
            }
          };
        }
      }
    }
    let allvalids = this.fields.map( (el, i) => el.valid );
    // console.log( allvalids );
    return allvalids.every( (i) => i===true );
  }
}