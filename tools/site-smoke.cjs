const assert = require("node:assert/strict");
const {execFileSync} = require("node:child_process");
const {readFileSync} = require("node:fs");
const {resolve} = require("node:path");
const vm = require("node:vm");
const {shortestRoute, routeSummary, prior, newObstacle} = require("../research-explorer.js");

const repo = resolve(__dirname, "..");
const actual = new Set([...prior, newObstacle]);
assert.deepEqual(routeSummary(shortestRoute(prior), prior), ["7", "Yes"]);
assert.deepEqual(routeSummary(shortestRoute(prior), actual), ["7", "No"]);
assert.deepEqual(routeSummary(shortestRoute(actual), actual), ["13", "Yes"]);

const analytics = readFileSync(resolve(repo, "site-analytics.js"), "utf8");
const preview = {location: {hostname: "127.0.0.1"}};
vm.runInNewContext(analytics, preview);
for (const file of ["index.html", "projects.html", "research.html"]) {
  const html = readFileSync(resolve(repo, file), "utf8");
  assert.match(html, /src="site-analytics\.js"/);
  assert.match(html, /href="research\.html"/);
}

const sha = execFileSync("git", ["rev-parse", "HEAD"], {cwd: repo, encoding: "utf8"}).trim();
const dirty = execFileSync("git", ["status", "--porcelain"], {cwd: repo, encoding: "utf8"}).length > 0;
console.log(JSON.stringify({
  schema: "personal_site.smoke.v1",
  sha, dirty,
  synthetic_route_checks: "pass",
  navigation_source_checks: "pass",
  preview_tracking_guard: "pass",
  browser: "not_checked",
  analytics_dashboard: "not_checked",
  production: "not_checked"
}, null, 2));
