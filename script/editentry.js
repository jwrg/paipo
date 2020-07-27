function extractIdentifier(node) {
  return node.parentNode.parentNode.id.substring(9);
}

function nextIdentifier(node) {
  return incrementIdentifier(node.parentNode.parentNode.lastElementChild.id.substring(9));
}

function incrementIdentifier(str) {
  /* Split number into array of constituent levels */
  let numbers = str.toString().split('_');
  /* Pop last number, increment and push it back */
  let lastNumber = numbers.pop();
  numbers.push(++lastNumber);
  /* Make a new string to use in id attributes */
  return numbers.join('_');
} 

function decrementIdentifier(str) {
  /* Split number into array of constituent levels */
  let numbers = str.toString().split('_');
  /* Pop last number, increment and push it back */
  let lastNumber = numbers.pop();
  numbers.push(--lastNumber);
  /* Make a new string to use in id attributes */
  return numbers.join('_');
}

function createEditorButton(onclick) {
  let words = [];
  if (onclick === 'addField') {
    words = ['add','Field','Add','a subfield','∃'];
  }
  if (onclick === 'expandField') {
    words = ['expand','Field','Expand','this field','↳'];
  }
  if (onclick === 'deleteField') {
    words = ['delete','Field','Delete','this field','⌫'];
  }
  if (onclick === 'collapseLevel') {
    words = ['collapse','Level','Collapse','this level','↰'];
  }
  if (onclick === 'deleteLevel') {
    words = ['delete','Level','Delete','this level','⌫'];
  }
  let newButton = document.createElement('input');
  newButton.setAttribute('class','button');
  newButton.setAttribute('type','button');
  newButton.setAttribute('onclick',words[0] + words[1] + '(this)');
  newButton.setAttribute('aria-label',words[2] + ' ' + words[3]);
  newButton.setAttribute('title',words[2] + ' ' + words[3]);
  newButton.setAttribute('value',words[4]);
  return newButton;
}

function createDatatier(number, key = '', value = '') {
  /* Create datatier div to encase KV pair */
  let newTier = document.createElement('div');
  newTier.setAttribute('id', 'datatier_' + number);
  newTier.setAttribute('class', 'datatier');

  /* Create fieldkey div for key label/input pair */
  let newKeyDiv = document.createElement('div');
  newKeyDiv.setAttribute('id', 'field_' + number + '_key');
  newKeyDiv.setAttribute('class', 'fieldkey');

  /* Create label/input pair and append to fieldkey div */
  let newKeyLabel = document.createElement('label');
  newKeyLabel.setAttribute('class', 'fieldkey');
  newKeyLabel.setAttribute('for', 'field_' + number + '_key');
  newKeyLabel.appendChild(document.createTextNode('Data Field ' + number.split('_').join(', ') + ' Key:'));
  let newKeyInput = document.createElement('input');
  newKeyInput.setAttribute('id', 'field_' + number + '_key_input');
  newKeyInput.setAttribute('class', 'fieldkey');
  newKeyInput.setAttribute('type', 'text');
  newKeyInput.setAttribute('name', 'field_' + number + '_key');
  newKeyInput.setAttribute('value', key);
  newKeyDiv.appendChild(newKeyLabel);
  newKeyDiv.appendChild(newKeyInput);

  /* Create fieldvalue div for value label/input pair */
  let newValueDiv = document.createElement('div');
  newValueDiv.setAttribute('id', 'field_' + number + '_value');
  newValueDiv.setAttribute('class', 'fieldvalue');

  /* Create label/input pair and append to fieldvalue div */
  let newValueLabel = document.createElement('label');
  newValueLabel.setAttribute('class', 'fieldvalue');
  newValueLabel.setAttribute('for', 'field_' + number + '_value');
  newValueLabel.appendChild(document.createTextNode('Data Field ' + number.split('_').join(', ') + ' Value:'));
  let newValueInput = document.createElement('input');
  newValueInput.setAttribute('id', 'field_' + number + '_value_input');
  newValueInput.setAttribute('class', 'fieldvalue');
  newValueInput.setAttribute('type', 'text');
  newValueInput.setAttribute('name', 'field_' + number + '_value');
  newValueInput.setAttribute('value', value);
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
  newTier.appendChild(newKeyDiv);
  newTier.appendChild(newValueDiv);

  return newTier;
}

function addField(caller) {
  /* Extract number from caller's parent's id */
  let parentDiv;
  let number;
  if (caller) {
    parentDiv = caller.parentNode.parentNode;
    number = nextIdentifier(caller);
  } else {
    parentDiv = document.getElementById('datafields');
    if (parentDiv.lastElementChild) {
      number = (parseInt(parentDiv.lastElementChild.id.substring(9)) + 1).toString();
    } else {
      number = '1';
    }
  }

  /* Create a new datatier with empty key and value */
  let newTier = createDatatier(number);

  /* Create corridor p and adjust immediately prior */
  let newCorridor;
  if (caller || number !== '1') {
    let oldCorridor = parentDiv.lastElementChild.firstElementChild;
    newCorridor = oldCorridor.cloneNode(true);
    if (oldCorridor.lastElementChild.textContent == '└┬') {
      newCorridor.lastElementChild.textContent = '└─';
      /* Adjust children of child tier we're appending after 
       * so they have corridors connecting to the new item */
      document.querySelectorAll('[id^="' + parentDiv.lastElementChild.id + '_"]')
        .forEach(tier => {tier.firstElementChild.childNodes[oldCorridor.childElementCount - 1].textContent ='│'});
      oldCorridor.lastElementChild.textContent = '├┬';
    } else {
      oldCorridor.lastElementChild.textContent = '├─';
    }
  } else {
    newCorridor = document.createElement('p');
    newCorridor.setAttribute('class', 'corridor');
    let newCorridorTt = document.createElement('tt');
    newCorridorTt.appendChild(document.createTextNode('└─'));
    newCorridor.appendChild(newCorridorTt);
  }
  newTier.prepend(newCorridor);

  /* Append datatier to new parent */
  parentDiv.appendChild(newTier);
}

function expandField(caller) {
  /* Extract number from caller's parent id */
  let number = extractIdentifier(caller);

  /* Get current field's value for use as new field's key */
  let value = document.getElementById('field_' + number + '_value_input').value;
  let values = document.getElementById('field_' + number + '_value_input').value.split(',');

  let counter = 1;
  values.forEach(value => {
    /* Create datatier div to encase new KV pair */
    let newTier = createDatatier(number + '_' + counter++, value, '');

    /* Duplicate and adjust parent's corridor */
    let topCorridor = caller.parentNode.parentNode.firstElementChild;
    let newCorridor = topCorridor.cloneNode(true);
    /* New corridor is contingent on old one, in
     * particular, whether it has children */
    if (topCorridor.lastElementChild.textContent == '└─'
      || topCorridor.lastElementChild.textContent == '└┬') {
      newCorridor.lastElementChild.textContent = '\xa0';
    } else {
      newCorridor.lastElementChild.textContent = '│';
    }
    let newPipe = document.createElement('tt');
    newPipe.appendChild(document.createTextNode('└─'));
    newCorridor.appendChild(newPipe);
    newTier.prepend(newCorridor);

    /* Change parent corridor to branch down */
    topCorridor.lastElementChild.textContent = topCorridor.lastElementChild.textContent.slice(0,1) + '┬';

    /* If appending multiple tiers, make them connect */
    if (caller.parentNode.parentNode.lastElementChild.firstElementChild.lastElementChild)
      caller.parentNode.parentNode.lastElementChild.firstElementChild.lastElementChild.textContent = '├─';

    /* Append new subtier */
    caller.parentNode.parentNode.appendChild(newTier);

  });
  /* Create buttons for key div and append */
  let newAddButton = createEditorButton('addField');
  let newCollapseButton = createEditorButton('collapseLevel');
  let newDeleteButton = createEditorButton('deleteLevel');
  caller.parentNode.appendChild(newAddButton);
  caller.parentNode.appendChild(newCollapseButton);
  caller.parentNode.appendChild(newDeleteButton);
  /* Change old value to be new sub-key */

  /* Delete old value div (and children) */
  caller.nextElementSibling.remove();
  caller.previousElementSibling.remove();
  caller.previousElementSibling.remove();
  caller.remove();
}

function deleteField(caller) {
  /* Check whether the caller is the only child */
  if (caller.parentNode.parentNode.parentNode.childElementCount === 4
  && caller.parentNode.parentNode.parentNode.id !== 'datafields') {
  /* If yes, change parent corridor to no longer
   * branch off */
    if (caller.parentNode.parentNode.parentNode.nextElementSibling) {
      caller.parentNode.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '├─';
    } else {
      caller.parentNode.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '└─';
    }
    collapseLevel(caller.parentNode.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.previousElementSibling);
  /* Check whether the caller is the last child */
  } else if (caller.parentNode.parentNode.firstElementChild.lastElementChild.textContent == '└─'
  && caller.parentNode.parentNode.parentNode.id !== 'datafields') {
  /* If yes, change previous sibling's corridor
   * to reflect its new last-child status */
    caller.parentNode.parentNode.previousElementSibling.firstElementChild.lastElementChild.textContent = '└' + caller.parentNode.parentNode.previousElementSibling.firstElementChild.lastElementChild.textContent.substring(1);
    document.querySelectorAll('[id^="' + caller.parentNode.parentNode.previousElementSibling.id + '_"]')
      .forEach(tier => tier.firstElementChild.childNodes[caller.parentNode.parentNode.firstElementChild.childElementCount - 1].textContent = '\xa0');
    caller.parentNode.parentNode.remove();
  } else {
    caller.parentNode.parentNode.remove();
  }
}

function collapseLevel(caller) {
  /* Extract number from caller's parent id */
  let number = extractIdentifier(caller);

  /* Condense all keys into an array */
  let values = [];
  document.querySelectorAll('[id^="field_' + number + '_"][id$="_key_input"]')
    .forEach(el => values.push(el.value));
  /* Join array into a comma-separated string */
  let value = values.slice(1).join(',');

  /* Turn the parent datatier back into a KV pair */

  /* Create fieldvalue div for value label/input pair */
  let oldValueDiv = document.getElementById('field_' + number + '_value')
  let newValueDiv = document.createElement('div');
  newValueDiv.setAttribute('id', 'field_' + number + '_value');
  newValueDiv.setAttribute('class', 'fieldvalue');

  /* Create label/input pair and append to fieldvalue div */
  let newValueLabel = document.createElement('label');
  newValueLabel.setAttribute('class', 'fieldvalue');
  newValueLabel.setAttribute('for', 'field_' + number + '_value');
  newValueLabel.appendChild(document.createTextNode('Data Field ' + number.split('_').join(', ') + ' Value:'));
  let newValueInput = document.createElement('input');
  newValueInput.setAttribute('id', 'field_' + number + '_value_input');
  newValueInput.setAttribute('class', 'fieldvalue');
  newValueInput.setAttribute('type', 'text');
  newValueInput.setAttribute('name', 'field_' + number + '_value');
  newValueInput.setAttribute('value', value);
  oldValueDiv.appendChild(newValueLabel);
  oldValueDiv.appendChild(newValueInput);

  /* Add back the value label and field */
  /* Add the necessary two buttons */
  let newExpandButton = createEditorButton('expandField');
  let newDeleteButton = createEditorButton('deleteField');
  oldValueDiv.appendChild(newExpandButton);
  oldValueDiv.appendChild(newDeleteButton);

  /* Delete all children */
  document.querySelectorAll('[id^="datatier_' + number + '_"]')
    .forEach(el => el.remove(el.value));
  /* Append new value div to caller's parent */
  //caller.parentNode.parentNode.appendChild(newValueDiv);

  /* Adjust corridor to reflect lack of children */
  if (caller.parentNode.parentNode.nextElementSibling) {
    caller.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '├─';
  } else {
    caller.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '└─';
  }

  /* Delete the three seashells (buttons) */
  caller.previousElementSibling.remove();
  caller.nextElementSibling.remove();
  caller.remove();
}
function deleteLevel() {
  /* Confirm the user that they want to delete a whole level */
  /* Delete all children */
  /* Call deleteField on the remaining field */
}
