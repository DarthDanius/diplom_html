export function toggleHideScroll() {

  const slidebarWidth = window.innerWidth - document.body.offsetWidth;
  const body = document.body;

  
  return (function() {
    function createSlidebarCap(){
      const slidebarCap = document.createElement('div');
      slidebarCap.classList.add('system__slidebar');
      slidebarCap.style.width = `${slidebarWidth}px`;
      slidebarCap.style.right = `-${slidebarWidth}px`;
      return slidebarCap;
    }
    let slidebarCap = document.querySelector('.system__slidebar')
    slidebarCap = slidebarCap ? slidebarCap : createSlidebarCap();
    
    if ( body.style.overflowY !== 'hidden' ) {
      body.style.overflowY = 'hidden';
      let bodyWidthPercent = slidebarWidth / body.offsetWidth *100
      body.style.width = `${100 - bodyWidthPercent}%`;
      body.append(slidebarCap);
      return true
    } else if (body.style.overflowY === 'hidden') {
      body.style.overflowY = '';
      body.style.width = '';
      slidebarCap.remove();
      return true;
    }
  })()

  
}
