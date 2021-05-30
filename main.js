// ==UserScript==
// @name         E-timecard 勤務時間表示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://e-timecard.ne.jp/s/EPSINP03/selfIndex
// @match        https://e-timecard.ne.jp/s/EPSINP03/
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.9.8/dayjs.min.js
// @grant        none
// ==/UserScript==


(() => {
  const table = document.querySelector("#mainarea > div > table:last-of-type");

  const header = document.createElement("th");
  header.textContent = "拡_勤務合計";
  header.classList.add("cmWidthP10");

  const rowsHeader = table.querySelector("tr:nth-of-type(1) > th:nth-of-type(9)");
  rowsHeader.parentNode.insertBefore(header, rowsHeader);

  const rows = Array.from(table.querySelectorAll("tr:not(:nth-of-type(1))"));
  rows.forEach(row => {
    const td = document.createElement("td");

    if (!row.querySelector("td:nth-of-type(5) > input")) {
      // 休憩時間
      const breakTime = Number(row.querySelector("td:nth-of-type(7)").textContent.trim());

      // 開始時刻
      const startDateText = row.querySelector("td:nth-of-type(5)").textContent.trim();
      const startDate = new Date(`1970-01-01 ${startDateText}:00`);

      // 終了時刻
      const endDateText = row.querySelector("td:nth-of-type(6)").textContent.trim();
      const endDate = new Date(`1970-01-01 ${endDateText}:00`);

      if (!isNaN(startDate) && !isNaN(endDate)) {
        // 勤務時間（分）
        const workingTime = endDate - startDate;

        const workingMinutes = (workingTime / (60 * 1000)) - breakTime;
        const workingHours = Math.floor(workingMinutes / 60);
        const workingMinute = workingMinutes % 60;

        const zeroPadding = new Intl.NumberFormat('ja', { minimumIntegerDigits: 2 });
        td.textContent = `${zeroPadding.format(workingHours)}:${zeroPadding.format(workingMinute)}`;
      }
    }

    const target = row.querySelector("td:nth-of-type(9)");
    target.parentNode.insertBefore(td, target);
  });
})();
(() => {
  window.setRegTime = (() => {
    const org = window.setRegTime;
    return n => {
      document.querySelector(`#workPlaceKbnHome${n}`).checked = true;
      return org(n);
    };
  })();
})();
(() => {
  window.onload = () => {
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
  };
})();