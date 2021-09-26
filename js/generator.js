function container(element, classList, id) {
  document.createElement(element);

}

function div() {
  document.createElement('div');

}

function image() {
  document.createElement('img');
}

function button() {
  document.createElement('button');
}

function input() {
  document.createElement('input');
}

function text(element) {
  document.createElement('element');
}

function href() {
  document.createElement('a');
}

export const generator = {
  container,
  div,
  image,
  button,
  input,
  text,
  href,
};