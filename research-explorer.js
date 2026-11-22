"use strict";

const size = 8;
const start = 24;
const goal = 31;
const prior = new Set([11, 19, 35, 43]);
const newObstacle = 27;

function shortestRoute(blocked) {
  const queue = [start];
  const parent = new Map([[start, null]]);
  for (const cell of queue) {
    if (cell === goal) {
      const route = [];
      for (let step = goal; step !== null; step = parent.get(step)) {
        route.push(step);
      }
      return route.reverse();
    }
    const x = cell % size;
    const y = Math.floor(cell / size);
    for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
      const next = ny * size + nx;
      if (blocked.has(next) || parent.has(next)) continue;
      parent.set(next, cell);
      queue.push(next);
    }
  }
  return [];
}

function routeSummary(route, actual) {
  if (!route.length) return ["—", "No route"];
  return [String(route.length - 1), route.some(cell => actual.has(cell)) ? "No" : "Yes"];
}

function draw(canvas, route, outdated) {
  const context = canvas.getContext("2d");
  const unit = canvas.width / size;
  const cells = new Set(route);
  context.font = "bold 20px system-ui";
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (let cell = 0; cell < size * size; cell += 1) {
    const x = (cell % size) * unit;
    const y = Math.floor(cell / size) * unit;
    let color = "#f1f5f7";
    if (cells.has(cell)) color = "#74b9e6";
    if (prior.has(cell)) color = "#455763";
    if (outdated && cell === newObstacle) color = "#f2a45a";
    context.fillStyle = color;
    context.fillRect(x, y, unit, unit);
    context.strokeStyle = "#a4b5bd";
    context.strokeRect(x, y, unit, unit);
    if (cell === start || cell === goal) {
      context.fillStyle = "#142c3b";
      context.fillText(cell === start ? "S" : "G", x + unit / 2, y + unit / 2);
    }
  }
}

if (typeof document !== "undefined") {
  const scenario = document.querySelector("#scenario");
  const selection = document.querySelector("#route");
  const table = document.querySelector("#results");
  const status = document.querySelector("#status");
  const canvas = document.querySelector("#grid");

  function render() {
    const outdated = scenario.value === "stale";
    const actual = new Set(prior);
    if (outdated) actual.add(newObstacle);
    const routes = {prior: shortestRoute(prior), updated: shortestRoute(actual)};
    const labels = {prior: "Prior map only", updated: "Map after observation"};
    table.replaceChildren();
    for (const key of Object.keys(routes)) {
      const row = table.insertRow();
      const header = document.createElement("th");
      header.scope = "row";
      header.textContent = labels[key];
      row.append(header);
      for (const value of routeSummary(routes[key], actual)) {
        row.insertCell().textContent = value;
      }
    }
    draw(canvas, routes[selection.value], outdated);
    const [moves, clear] = routeSummary(routes[selection.value], actual);
    status.textContent = `${labels[selection.value]} shown. Planned moves: ${moves}. Route clear: ${clear}.`;
  }
  scenario.addEventListener("change", render);
  selection.addEventListener("change", render);
  render();
}

if (typeof module !== "undefined") {
  module.exports = {shortestRoute, routeSummary, prior, newObstacle};
}
