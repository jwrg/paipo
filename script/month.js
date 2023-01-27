function submit() {
  let month = document.getElementById('select_month').value;
  let year = document.getElementById('select_year').value;
  window.location.assign(['/calendar', year, month].join('/'));
}

function cancel() {
  deactivateModal();
}
