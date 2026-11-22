"use strict";

// Set the public GoatCounter site code after creating the dashboard.
const goatCounterSite = "";
if (location.hostname === "caoweijia.github.io" && /^[a-z0-9-]+$/.test(goatCounterSite)) {
  const tracker = document.createElement("script");
  tracker.async = true;
  tracker.dataset.goatcounter = `https://${goatCounterSite}.goatcounter.com/count`;
  tracker.src = "https://gc.zgo.at/count.js";
  document.head.append(tracker);
}
