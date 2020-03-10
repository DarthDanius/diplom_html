
if (!window.Symbol) {
  getPolyfill('https://cdnjs.cloudflare.com/ajax/libs/core-js/2.6.11/core.min.js');
}

if (!window.fetch) {
  getPolyfill('https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0/dist/fetch.umd.min.js');
}

if (!window.CSS || !window.CSS.supports) {
  getPolyfill(window.location.href+'libs/css-supports.js');
}

if (!window.CSS.supports('display', 'content')) {
  console.log('display:content не поддерживается')
  // getPolyfill(window.location.href+'libs/css-display-content.js');
}

function getPolyfill(cdnUrl, async) {
  if (!async) async = false;
  // let resourceKey = cdnUrl.match(/(?<=\/)[^\/]+js$/);
  let resourceKey = cdnUrl.slice(cdnUrl.lastIndexOf('/')+1);
  console.log('resourceKey = ' + resourceKey);
  let resource = localStorage.getItem(resourceKey)
  if (resource) {
    console.log(resourceKey + ' взят из localStorage');
    eval(resource);
  } else {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', cdnUrl, async);
    try {
      xhr.send();
      if (xhr.status != 200) {
        alert('Ошибка ${xhr.status}: ${xhr.statusText}');
      } else {
        resource = xhr.response;
        localStorage.setItem(resourceKey, resource);
        console.log(resourceKey + ' добавлен в localStorage');
        eval(resource);
      }
    } catch(err) {
      console.error("Запрос не удался" + err.message);
    }
  }
}