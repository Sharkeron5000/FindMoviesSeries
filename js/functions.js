import { showTopFilms } from "../script.js";
import { content } from "./domContent.js";
import { changeTopDayWeek } from "./events.js";

/** Получение панели управления и установка ему события */
export function getControlPanelInput() {
  const checkTopWeekDay = document.getElementById('checkTopWeekDay');
  checkTopWeekDay.innerHTML = content.changeTopContent();
  const checkboxTopDayWeek = document.getElementById('checkboxTopChange');
  checkboxTopDayWeek.addEventListener('change', changeTopDayWeek);
}

/** Настройка типа поиска */
export function configSearch(objectCheck) {
  let countCheck = [];
  let type = 'multi';

  for (let key in objectCheck) {
    if (objectCheck[key]) {
      countCheck.push(key)
    }
  }

  if (countCheck.length === 1) {
    type = countCheck[0]
  }

  return type
}