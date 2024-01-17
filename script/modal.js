function blurPage() {
  document.getElementsByTagName('main')[0].style.filter = 'blur(0.5rem)';
}

function unblurPage() {
  document.getElementsTagName('main')[0].style.filter = '';
}

function activateModal () {
  blurPage();
  let modal = document.getElementById('modal');
  document.getElementsByTagName('body')[0].prepend(modal);
  modal.style.display = 'block';
}

function deactivateModal () {
  unblurPage();
  document.getElementById('modal').style.display = 'none';
}
