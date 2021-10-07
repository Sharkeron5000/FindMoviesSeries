import { search } from "../script.js";

let oldDate;
const menuSearch = document.getElementById('menuSearch');
const SearchText = document.querySelector('.form-control')

export function timeStartSearch() {
  menuSearch.classList.add('d-none')
  oldDate = Date.now();
  setTimeout(timeEndSearch, 1000);
}

function timeEndSearch() {
  let newDate = Date.now();
  if(newDate >= (oldDate + 1000)) {
    // location.hash = `search?${SearchText.value}`
    search();
  }
}