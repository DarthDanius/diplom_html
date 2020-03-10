function cap (){
  let styleImg = 'style="border: none; width: 75px; height: 75px"';
  let cap = `
    <div id="capOldBrowser" style="border: 1px solid #F7941D; background: #FEEFDA; text-align: center; clear: both; height: 75px; position: relative;">
        <div style="position: absolute; right: 0; top: 0; font-family: courier new; font-weight: bold; line-height: 0">
            <a id="capClose" href="" style="line-height: 0;">
                <img src="img/close.png" ${styleImg} alt="Close this notice" />
            </a>
        </div>
        <div style="width: 640px; margin: 0 auto; text-align: left; padding: 0; overflow: hidden; color: black; line-height: 0">
            <div style="float: left; margin-right: 10px">
                <img src="img/warning.png" ${styleImg} alt="Warning!"/>
            </div>
            <div style="float: left; font-family: Arial, sans-serif; line-height: 1.4; width: 265px;">
                <div style="font-size: 14px; font-weight: bold;">Вы используете устаревший браузер</div>
                <div style="font-size: 12px; margin-top: 6px;">Для полноценной работы, пожалуйста, воспользуйтесь любым современным браузером.</div>
            </div>
            <div style="float: left;">
                <a href="https://www.mozilla.org/ru/firefox/new/" target="_blank" style="line-height: 0;">
                <img src="img/firefox.png" ${styleImg} alt="Get Firefox" /></a>
            </div>
            <div style="float: left;">
                <a href="https://www.opera.com/ru" target="_blank" style="line-height: 0;">
                    <img src="img/opera.png" ${styleImg} alt="Get Opera" />
                </a>
            </div>
            <div style="float: left;">
                <a href="https://www.google.com/intl/ru_ru/chrome/" target="_blank" style="line-height: 0;">
                    <img src="img/chrome.png" ${styleImg} alt="Get Google Chrome" />
                </a>
            </div>
        </div>
    </div>
  `;

    if ( !window.CSS || !window.CSS.supports || !CSS.supports(`(display: grid) or (display-style: -ms-grid)`) ) {
      console.log(true);
      $('body').prepend($(cap));
      $('#capClose').click(()=>{
        $('#capOldBrowser').remove();
        return false;
      })
    };
 
}

document.addEventListener('DOMContentLoaded', cap);