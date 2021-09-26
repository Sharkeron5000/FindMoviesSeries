import { showTopFilms } from "../script.js";
import { content } from "./domContent.js";
import { changeTopDayWeek } from "./events.js";

const checkTopWeekDay = document.getElementById('checkTopWeekDay');

export function getControlPanelInput() {
  checkTopWeekDay.innerHTML = content.changeTopContent();
  const checkboxTopDayWeek = document.getElementById('checkboxTopChange');
  checkboxTopDayWeek.addEventListener('change', changeTopDayWeek);
  
  showTopFilms()
}