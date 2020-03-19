/**
 * This function adds a datafield wrapped in a div to 
 * the document under the parent div with id 'datafields'
 */
function newField(number, parentDiv, isKey) {
  var newDiv = document.createElement('div');
  let newLabel = document.createElement('label');
  let newInput = document.createElement('input');

  let type = isKey ? '_key' : '' ;
  let className = isKey ? 'fieldkey' : 'fieldvalue' ;
  let label = isKey ? ' Key: ' : ' Value: ' ;
  newDiv.setAttribute('id', 'field_' + number + type);
  newDiv.setAttribute('class', className);
  newLabel.setAttribute('for', 'field_' + number + type);
  newInput.setAttribute('id', 'field_' + number + type);
  newInput.setAttribute('name', 'field_' + number + type);
  newInput.setAttribute('type', 'text');

  newLabel.appendChild(document.createTextNode('Data Field ' + number + label));

  newDiv.appendChild(newLabel);
  newDiv.appendChild(newInput);
  parentDiv.appendChild(newDiv);
}
function addField() {
  let parentDiv = document.getElementById('datafields');
  let fieldNum = parseInt(parentDiv.lastElementChild.id.substring(6)) + 1 || 1;

  newField(fieldNum, parentDiv, true);
  newField(fieldNum, parentDiv, false);
}
function addWant() {
  // Create the Div to be the new wanted item
  let newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'want');
  // Select where we wish to append
  let parentDiv = document.getElementById('wants');
  // Create an hr to separate the items
  let newHr = document.createElement('hr');
  newDiv.appendChild(newHr);
  // Create a paragraph to denote the want number
  let newParagraph = document.createElement('p');
  newParagraph.appendChild(document.createTextNode('Want #' + wantsNum));
  // Create and populate the colour field
  let newColor = document.createElement('input');
  newColor.setAttribute('type', 'text');
  newColor.setAttribute('id', 'colour' + wantsNum);
  newColor.setAttribute('name', 'colour' + wantsNum);
  let newColorLabel = document.createElement('label');
  newColorLabel.setAttribute('for', 'colour' + wantsNum);
  newColorLabel.appendChild(document.createTextNode('Color: '));
  // Create and populate the style field
  let newStyle = document.createElement('input');
  newStyle.setAttribute('type', 'text');
  newStyle.setAttribute('id', 'style' + wantsNum);
  newStyle.setAttribute('name', 'style' + wantsNum);
  let newStyleLabel = document.createElement('label');
  newStyleLabel.setAttribute('for', 'style' + wantsNum);
  newStyleLabel.appendChild(document.createTextNode(' Style: '));
  // Append the above creations to the new Div element
  newDiv.appendChild(newParagraph);
  newDiv.appendChild(newColorLabel);
  newDiv.appendChild(newColor);
  newDiv.appendChild(newStyleLabel);
  newDiv.appendChild(newStyle);
  // Append a Div with buttons to add sizes and stores
  let newSizeDiv = document.createElement('div');
  newSizeDiv.setAttribute('class', 'size');
  let sizeBut = document.createElement('input');
  sizeBut.setAttribute('type', 'button');
  sizeBut.setAttribute('onclick', 'addSize(this)');
  sizeBut.setAttribute('value', 'Add a size');
  newSizeDiv.appendChild(sizeBut);
  addSize(sizeBut);
  newDiv.appendChild(newSizeDiv);
  let newStoreDiv = document.createElement('div');
  newStoreDiv.setAttribute('class', 'store');
  let storeBut = document.createElement('input');
  storeBut.setAttribute('type', 'button');
  storeBut.setAttribute('onclick', 'addStore(this)');
  storeBut.setAttribute('value', 'Add a store');
  newStoreDiv.appendChild(storeBut);
  addStore(storeBut);
  newDiv.appendChild(newStoreDiv);
  // Append the new Div to the old one
  parentDiv.appendChild(newDiv);
  // Update the number of wanted items for this release
  wantsNum++;
}

function addSize(caller) {
  let parentDiv = caller.parentElement;
  let newSize = document.createElement('input');
  let sizeNum = parseInt(parentDiv.lastElementChild.id.substring(6)) + 1 || 1;
  newSize.setAttribute('type', 'number');
  newSize.setAttribute('id', 'size' + wantsNum + '_' + sizeNum);
  newSize.setAttribute('name', 'size' + wantsNum + '_' + sizeNum);
  let newSizeLabel = document.createElement('label');
  newSizeLabel.setAttribute('for', 'size' + wantsNum + '_' + sizeNum);
  newSizeLabel.appendChild(document.createTextNode(' Size ' + sizeNum + ' '));
  parentDiv.appendChild(newSizeLabel);
  parentDiv.appendChild(newSize);
}
function addStore(caller) {
  let parentDiv = caller.parentElement;
  let newStore = document.createElement('input');
  let storeNum = parseInt(parentDiv.lastElementChild.id.substring(7)) + 1 || 1;
  newStore.setAttribute('type', 'text');
  newStore.setAttribute('id', 'store' + wantsNum + '_' + storeNum);
  newStore.setAttribute('name', 'store' + wantsNum + '_' + storeNum);
  let newStoreLabel = document.createElement('label');
  newStoreLabel.setAttribute('for', 'store' + wantsNum + '_' + storeNum);
  newStoreLabel.appendChild(document.createTextNode(' Store ' + storeNum + ' '));
  parentDiv.appendChild(newStoreLabel);
  parentDiv.appendChild(newStore);
}

