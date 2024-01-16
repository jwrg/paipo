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
  /* Pop last number, decrement and push it back */
  let lastNumber = numbers.pop();
  numbers.push(--lastNumber);
  /* Make a new string to use in id attributes */
  return numbers.join('_');
}

function decrementLevel(str, level) {
  /* Split number into array of constituent levels */
  let numbers = str.toString().split('_');
  /* Splice desired number, decrement and splice it back in */
  let oldNumber = numbers.splice(level, 1);
  oldNumber[0] = --oldNumber[0];
  let newNumber = numbers.splice(level, 0, oldNumber[0]);
  /* Make a new string to use in id attributes */
  return numbers.join('_');
}

function decrementLevelTextNode(str, level) {
  /* Split string into array of constituents */
  let numbers = str.toString().split(/,? /);
  /* Splice desired number, decrement and splice it back in */
  let oldNumber = numbers.splice(level + 1, 1);
  oldNumber[0] = --oldNumber[0];
  let newNumber = numbers.splice(level + 1, 0, oldNumber[0]);
  /* Make a new string to use as a textNode */
  let prefix = numbers.splice(0, 2).join(' ') + ' ';
  let suffix = ' ' + numbers.pop();
  return prefix + numbers.join(', ') + suffix;
}

function decrementDatatier(datatier, level) {
  /* Adjust all the identifiers in a datatier such
   * that it reflects the deletion of a preceeding
   * field */

  /* First, adjust the datatier id */
  datatier.setAttribute('id', decrementLevel(datatier.id, level));

  /* Adjust the id's for the key and value sections */
  datatier.firstElementChild.nextElementSibling.setAttribute('id', decrementLevel(datatier.firstElementChild.nextElementSibling.id, level));
  datatier.firstElementChild.nextElementSibling.nextElementSibling.setAttribute('id', decrementLevel(datatier.firstElementChild.nextElementSibling.nextElementSibling.id, level));

  /* Adjust the 'for' attribute and the textnode for
   * the key and value labels */
  datatier.firstElementChild.nextElementSibling.firstElementChild.setAttribute('for', decrementLevel(datatier.firstElementChild.nextElementSibling.firstElementChild.htmlFor, level));
  datatier.firstElementChild.nextElementSibling.firstElementChild.textContent = decrementLevelTextNode(datatier.firstElementChild.nextElementSibling.firstElementChild.textContent, level);
  if (datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.tagName === 'LABEL') {
    datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.setAttribute('for', decrementLevel(datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.htmlFor, level));
    datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.textContent = decrementLevelTextNode(datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.textContent, level);
  }

  /* Adjust the 'id' and 'name' attributes for the
   * key and value inputs */
  datatier.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.setAttribute('id', decrementLevel(datatier.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.id, level));
  datatier.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.setAttribute('name', decrementLevel(datatier.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.name, level));
  if (datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.tagName === 'LABEL') {
    datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.setAttribute('id', decrementLevel(datatier.lastChild.firstElementChild.nextElementSibling.id, level));
    datatier.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.setAttribute('name', decrementLevel(datatier.lastChild.firstElementChild.nextElementSibling.name, level));
  }
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
  /* Create datatier section to encase KV pair */
  let newTier = document.createElement('section');
  newTier.setAttribute('id', 'datatier_' + number);
  newTier.setAttribute('class', 'datatier');

  /* Create fieldkey section for key label/input pair */
  let newKeyDiv = document.createElement('section');
  newKeyDiv.setAttribute('id', 'field_' + number + '_key');
  newKeyDiv.setAttribute('class', 'fieldkey');

  /* Create label/input pair and append to fieldkey section */
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

  /* Create fieldvalue section for value label/input pair */
  let newValueDiv = document.createElement('section');
  newValueDiv.setAttribute('id', 'field_' + number + '_value');
  newValueDiv.setAttribute('class', 'fieldvalue');

  /* Create label/input pair and append to fieldvalue section */
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
   * to fieldvalue section*/
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
        .forEach(tier => {tier.firstElementChild.childNodes[oldCorridor.childElementCount - 1].textContent ='│';});
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
    /* Create datatier section to encase new KV pair */
    let newTier = createDatatier(number + '_' + counter++, value, '');

    /* Duplicate and adjust parent's corridor */
    let topCorridor = caller.parentNode.parentNode.firstElementChild;
    let newCorridor = topCorridor.cloneNode(true);
    /* New corridor is contingent on old one, in
     * particular, whether it has children */
    if (topCorridor.lastElementChild.textContent == '└─' || 
      topCorridor.lastElementChild.textContent == '└┬') {
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
  /* Create buttons for key section and append */
  let newAddButton = createEditorButton('addField');
  let newCollapseButton = createEditorButton('collapseLevel');
  let newDeleteButton = createEditorButton('deleteLevel');
  caller.parentNode.appendChild(newAddButton);
  caller.parentNode.appendChild(newCollapseButton);
  caller.parentNode.appendChild(newDeleteButton);
  /* Change old value to be new sub-key */

  /* Delete old value section (and children) */
  caller.nextElementSibling.remove();
  caller.previousElementSibling.remove();
  caller.previousElementSibling.remove();
  caller.remove();
}

function deleteField(caller) {
  /* Adjust all succeeding siblings and their childrens'
   * identifiers to reflect the deletion */
  caller.parentNode.parentNode.parentNode.querySelectorAll('section#' + caller.parentNode.parentNode.id + ' ~ section[id^="datatier"], section#' + caller.parentNode.parentNode.id + ' ~ section[id^="datatier"] section[id^="datatier"]').forEach(tier => decrementDatatier(tier, caller.parentNode.parentNode.id.split('_').length - 1));
  /* Check whether the caller is the only child */
  if (caller.parentNode.parentNode.parentNode.childElementCount === 4 && 
    caller.parentNode.parentNode.parentNode.id !== 'datafields') {
    /* If yes, change parent corridor to no longer
     * branch off */
    if (caller.parentNode.parentNode.parentNode.nextElementSibling) {
      caller.parentNode.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '├─';
    } else {
      caller.parentNode.parentNode.parentNode.firstElementChild.lastElementChild.textContent = '└─';
    }
    collapseLevel(caller.parentNode.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.previousElementSibling);
    /* Check whether the caller is the last child */
  } else if (caller.parentNode.parentNode.firstElementChild.lastElementChild.textContent == '└─' && 
    caller.parentNode.parentNode.previousElementSibling) {
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

  /* Create fieldvalue section for value label/input pair */
  let oldValueDiv = document.getElementById('field_' + number + '_value');
  let newValueDiv = document.createElement('section');
  newValueDiv.setAttribute('id', 'field_' + number + '_value');
  newValueDiv.setAttribute('class', 'fieldvalue');

  /* Create label/input pair and append to fieldvalue section */
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
  /* Append new value section to caller's parent */
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
function deleteLevel(caller) {
  /* Confirm the user that they want to delete a whole level */
  if (window.confirm("Are you sure you want to delete this level?")) {
    /* Adjust all succeeding siblings and their childrens'
     * identifiers to reflect the deletion */
    caller.parentNode.parentNode.parentNode.querySelectorAll('section#' + caller.parentNode.parentNode.id + ' ~ section[id^="datatier"], section#' + caller.parentNode.parentNode.id + ' ~ section[id^="datatier"] section[id^="datatier"]').forEach(tier => decrementDatatier(tier, caller.parentNode.parentNode.id.split('_').length - 1));
    /* Adjust corridor of previous sibling if the deleted
     * datatier is the last child of its parent */
    if (!caller.parentNode.parentNode.nextElementSibling && caller.parentNode.parentNode.previousElementSibling) {
      document.querySelectorAll('[id^="' + caller.parentNode.parentNode.previousElementSibling.id + '_"]')
        .forEach(tier => tier.firstElementChild.childNodes[caller.parentNode.parentNode.firstElementChild.childElementCount - 1].textContent = '\xa0');
      if (caller.parentNode.parentNode.previousElementSibling.firstElementChild.lastElementChild.textContent == '├┬') {
        caller.parentNode.parentNode.previousElementSibling.firstElementChild.lastElementChild.textContent = '└┬';
      } else {
        caller.parentNode.parentNode.previousElementSibling.firstElementChild.lastElementChild.textContent = '└─';
      }
    }
    /* Call deleteField on the datatier, its children
     * should follow it into death */
    caller.parentNode.parentNode.remove();
  }
}
