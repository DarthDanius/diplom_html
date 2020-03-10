export function animHandler(el, ...cls) {
  return new Promise((resolve) => {
    if (el.jquery !== undefined) el = el[0];
    cls.forEach( (i)=>{el.classList.add(i)});
    el.onanimationend = (e) => resolve(e);
  })
};

export function setEventDelay(e, f, ms) { // задержка для функции
  let timer
  return function(e) {
    if (!timer) {
      timer = setTimeout(
        function() {
          clearTimeout(timer)
          timer = null
          f(e)
        },
        ms,
        e
      )
    }
  }
}

export function settDelay(response, ms) {
  return new Promise((resolve) => {
    setTimeout( (r) => resolve(r), ms, response);
  })
};