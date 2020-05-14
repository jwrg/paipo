function addField(caller) {
  /* Extract number from caller's parent's id */
  let parentDiv;
  let number;
  if (caller) {
    parentDiv = caller.parentNode.parentNode;
    number = parentDiv.lastElementChild.id.substring(9);
  } else {
    parentDiv = document.getElementById('datafields');
    number = parentDiv.lastElementChild.id.substring(9);
  }

  /* Split number into array of constituent levels */
  let numbers = number.toString().split('_');
  let lastNumber = numbers.pop();
  numbers.push(++lastNumber);
  let newNumber = numbers.join('_');

  /* Create datatier div to encase KV pair */
  let newTier = document.createElement('div');
  newTier.setAttribute('id', 'datatier_' + newNumber);
  newTier.setAttribute('class', 'datatier');

  /* Create corridor p and adjust immediately prior */
  let oldCorridor = parentDiv.lastElementChild.firstElementChild;
  let newCorridor = oldCorridor.cloneNode(true);
  oldCorridor.lastElementChild.textContent = '├─';


  /* Create fieldkey div for key label/input pair */
  let newKeyDiv = document.createElement('div');
  newKeyDiv.setAttribute('id', 'field_' + newNumber + '_key');
  newKeyDiv.setAttribute('class', 'fieldkey');

  /* Create label/input pair and append to fieldkey div */
  let newKeyLabel = document.createElement('label');
  newKeyLabel.setAttribute('class', 'fieldkey');
  newKeyLabel.setAttribute('for', 'field_' + newNumber + '_key');
  newKeyLabel.appendChild(document.createTextNode('Data Field ' + numbers.join(', ') + ' Key:'));
  let newKeyInput = document.createElement('input');
  newKeyInput.setAttribute('id', 'field_' + newNumber + '_key_input');
  newKeyInput.setAttribute('class', 'fieldkey');
  newKeyInput.setAttribute('type', 'text');
  newKeyInput.setAttribute('name', 'field_' + newNumber + '_key');
  newKeyInput.setAttribute('value', '');
  newKeyDiv.appendChild(newKeyLabel);
  newKeyDiv.appendChild(newKeyInput);

  /* Create fieldvalue div for value label/input pair */
  let newValueDiv = document.createElement('div');
  newValueDiv.setAttribute('id', 'field_' + newNumber + '_value');
  newValueDiv.setAttribute('class', 'fieldvalue');

  /* Create label/input pair and append to fieldvalue div */
  let newValueLabel = document.createElement('label');
  newValueLabel.setAttribute('class', 'fieldvalue');
  newValueLabel.setAttribute('for', 'field_' + newNumber + '_value');
  newValueLabel.appendChild(document.createTextNode('Data Field ' + numbers.join(', ') + ' Value:'));
  let newValueInput = document.createElement('input');
  newValueInput.setAttribute('id', 'field_' + newNumber + '_value_input');
  newValueInput.setAttribute('class', 'fieldvalue');
  newValueInput.setAttribute('type', 'text');
  newValueInput.setAttribute('name', 'field_' + newNumber + '_value');
  newValueInput.setAttribute('value', '');
  newValueDiv.appendChild(newValueLabel);
  newValueDiv.appendChild(newValueInput);
  
  /* Create buttons for data manipulation and append
   * to fieldvalue div*/
  let newExpandButton = document.createElement('input');
  newExpandButton.setAttribute('class','button');
  newExpandButton.setAttribute('type','button');
  newExpandButton.setAttribute('onclick','expandField(this)');
  newExpandButton.setAttribute('aria-label','Expand this field');
  newExpandButton.setAttribute('title','Expand this field');
  newExpandButton.setAttribute('value','↳');
  let newDeleteButton = document.createElement('input');
  newDeleteButton.setAttribute('class','button');
  newDeleteButton.setAttribute('type','button');
  newDeleteButton.setAttribute('onclick','deleteField(this)');
  newDeleteButton.setAttribute('aria-label','Delete this field');
  newDeleteButton.setAttribute('title','Delete this field');
  newDeleteButton.setAttribute('value','⌫');
  newValueDiv.appendChild(newExpandButton);
  newValueDiv.appendChild(newDeleteButton);

  /* Append all to datatier */
  newTier.appendChild(newCorridor);
  newTier.appendChild(newKeyDiv);
  newTier.appendChild(newValueDiv);

  /* Append datatier to new parent */
  parentDiv.appendChild(newTier);
}
function expandField() {}
function deleteField() {}
function collapseLevel() {}
function deleteLevel() {}
