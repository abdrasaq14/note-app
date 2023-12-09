window.addEventListener('scroll', function(){
    const header = document.getElementById('header');
    const headerOffset = header.offsetHeight
    let isHeaderFixed = false;
    if(window.scrollY > headerOffset){
      header.classList.add('sticky-header')
    }
    else{
      header.classList.remove('sticky-header')
    }
  });

// document.addEventListener('DOMContentLoaded', function () {
//     const header = document.getElementById('header');
//     const headerHeight = header.offsetHeight;
//     let isHeaderFixed = false;
  
//     window.addEventListener('scroll', function () {
//       const scrollY = window.scrollY;
  
//       if (scrollY > headerHeight && !isHeaderFixed) {
//         header.classList.add('sticky-header');
//         isHeaderFixed = true;
//       } else if (scrollY <= headerHeight && isHeaderFixed) {
//         header.classList.remove('sticky-header');
//         isHeaderFixed = false;
//       }
//     });
//   });