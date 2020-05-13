function addField(caller) {
  /* Extract number from caller's parent's id */
  let parentDiv = caller.parentNode;
  /* Create datatier div to encase KV pair */
  /* Create corridor p */
  /* Create fieldkey div for key label/input pair */
  /* Create fieldvalue div for value label/input pair */
  /* Append all to datatier */
  /* Append datatier to new parent */
  /* Alter parent's direct descendants' corridors to 
   * reflect new child */
  var newDiv = document.createElement('div');
  let newLabel = document.createElement('label');
  let newInput = document.createElement('input');
  let number = parseInt(parentDiv.lastElementChild.id.substring(6)) + 1 || 1;

  let type = "value";
  let label = "key";

  newDiv.setAttribute('id', 'field_' + number + type);
  newDiv.setAttribute('class', 'null');
  newLabel.setAttribute('for', 'field_' + number + type);
  newInput.setAttribute('id', 'field_' + number + type);
  newInput.setAttribute('name', 'field_' + number + type);
  newInput.setAttribute('type', 'text');

  newLabel.appendChild(document.createTextNode('Data Field ' + number + label));

  newDiv.appendChild(newLabel);
  newDiv.appendChild(newInput);
  parentDiv.parentNode.appendChild(newDiv);
}
function expandField() {}
function deleteField() {}
function collapseLevel() {}
function deleteLevel() {}
