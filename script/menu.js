function menuOpen() {
  document.getElementById('menu-open').style.display = 'none';
  [...document.getElementById('navigation').children, document.getElementById('menu-close')]
    .forEach((el) => el.style.display = 'inline-block');
}

function menuClose() {
  [...document.getElementById('navigation').children, document.getElementById('menu-close')]
    .forEach((el) => el.style.display = 'none');
  document.getElementById('menu-open').style.display = 'inline-block';
}
