function container(element, classList, id) {
  document.createElement(element);
}

function div(classes = [], id = '') {
  const divContent = document.createElement('div');
  divContent.classList.add(classes.join());
  divContent.id = id;
  return divContent;
}

function image(classes = [], id = '', src = '', alt = '') {
  const imageElement = document.createElement('img');
  imageElement.classList.add(classes.toString());
  imageElement.id = id;
  imageElement.src = src;
  imageElement.alt = alt;
  return imageElement;
}

function button(classes = [], id = '', name = '', type = 'button') {
  const buttonElement = document.createElement('button');
  buttonElement.classList.add(classes.join());
  buttonElement.id = idl;
  buttonElement.name = name;
  buttonElement.type = type;
  return buttonElement;
}

function input(type, classes = [], id = '',) {
  const inputElement = document.createElement('input');
  inputElement.type = type;
  inputElement.classList.add(classes.join());
  inputElement.id = id;
  return inputElement;
}

function text(element, textContent = '', classes = []) {
  const textElement = document.createElement(element);
  textElement.textContent = textContent;
  textElement.classList.add(classes.join());
  return textElement;
}

function aElement(classes = [], href = '', target = '') {
  const hrefElement = document.createElement('a');
  hrefElement.classList.add(classes.join());
  hrefElement.href = href;
  hrefElement.target = target;
  return hrefElement;
}

export const generator = {
  container,
  div,
  image,
  button,
  input,
  text,
  aElement,
};