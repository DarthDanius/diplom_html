export function toggleHideScroll() {

  const body = $('body');
  const slidebarWidth = window.innerWidth - body.width();

  return (function() {
    function createSlidebarCap(){
      const slidebarCap = $('<div class="system__slidebar">');
      slidebarCap.css('width', `${slidebarWidth}px`);
      slidebarCap.css('right', `-${slidebarWidth}px`);
      return slidebarCap;
    }
    let slidebarCap = $('.system__slidebar')
    slidebarCap = slidebarCap.length ? slidebarCap : createSlidebarCap();

    if ( body.css('overflowY') !== 'hidden' ) {
      body.css('overflowY', 'hidden');
      let bodyWidthPercent = slidebarWidth / body.width() * 100
      body.css('width', `${100 - bodyWidthPercent}%`);
      body.append(slidebarCap);
      return true;
    } else if (body.css('overflowY') === 'hidden') {
      body.css('overflowY', '');
      body.css('width', '');
      slidebarCap.remove();
      return true;
    }
  })()
}
