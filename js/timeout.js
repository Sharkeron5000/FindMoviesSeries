import { apiSearch } from "./functions.js";

let oldDate;

export function timeStartSearch(event) {
  oldDate = Date.now();
  setTimeout(timeEndSearch, 1000);
}

function timeEndSearch() {
  let newDate = Date.now();
  if(newDate >= (oldDate + 1000)) {
    apiSearch()
  }
}