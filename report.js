document.addEventListener("DOMContentLoaded", () => {
  const city = localStorage.getItem("urbanpulse_city") || "Harare";
  const location = localStorage.getItem("urbanpulse_location") || "Borrowdale";
  const areaValue = Number(localStorage.getItem("urbanpulse_area")) || 2400;
  const unit = localStorage.getItem("urbanpulse_unit") || "sqm";
  const type = localStorage.getItem("urbanpulse_type") || "Residential";

  let hectares = areaValue;

  if (unit === "sqm") {
    hectares = areaValue / 10000;
  }

  const lowYield = Math.round(hectares * 20);
  const mediumYield = Math.round(hectares * 60);
  const highYield = Math.round(hectares * 120);

  let buyScore = 72;

  if (hectares >= 0.2) buyScore += 5;
  if (hectares >= 0.5) buyScore += 5;
  if (hectares >= 1) buyScore += 5;
  if (city === "Harare") buyScore += 5;
  if (type === "Mixed-use") buyScore += 4;
  if (type === "Residential") buyScore += 3;

  if (buyScore > 92) buyScore = 92;

  let buyLabel = "Moderate Opportunity";
  let riskRating = "Moderate";
  let developmentPotential = "Moderate";

  if (buyScore >= 85) {
    buyLabel = "Strong Opportunity";
    riskRating = "Moderate-Low";
    developmentPotential = "High";
  } else if (buyScore >= 75) {
    buyLabel = "Good Opportunity";
    riskRating = "Moderate";
    developmentPotential = "Good";
  } else {
    buyLabel = "Needs Caution";
    riskRating = "High";
    developmentPotential = "Limited";
  }

  let bestUse = "Medium Density Residential";

  if (type === "Commercial") {
    bestUse = "Commercial Development";
  }

  if (type === "Mixed-use") {
    bestUse = "Mixed-Use Residential + Retail";
  }

  if (type === "Residential" && hectares < 0.3) {
    bestUse = "Low Density Residential";
  }

  if (type === "Residential" && hectares >= 1) {
    bestUse = "Cluster Housing / Townhouses";
  }

  document.getElementById("reportLocation").textContent = location;
  document.getElementById("reportCity").textContent = city;
  document.getElementById("reportArea").textContent =
    unit === "sqm" ? areaValue + " m²" : areaValue + " hectares";
  document.getElementById("reportType").textContent = type;

  document.getElementById("buyScore").textContent = buyScore + "/100";
  document.getElementById("buyScoreLabel").textContent = buyLabel;
  document.getElementById("bestUse").textContent = bestUse;
  document.getElementById("riskRating").textContent = riskRating;
  document.getElementById("developmentPotential").textContent = developmentPotential;

  document.getElementById("lowYield").textContent = lowYield;
  document.getElementById("mediumYield").textContent = mediumYield;
  document.getElementById("highYield").textContent = highYield;

  document.getElementById("recommendationTitle").textContent =
    buyScore >= 80
      ? "Proceed with further due diligence."
      : "Proceed cautiously and verify key risks.";

  document.getElementById("recommendationText").textContent =
    `${location}, ${city} shows ${developmentPotential.toLowerCase()} development potential for ${type.toLowerCase()} use. Based on the submitted site area, UrbanPulse estimates between ${lowYield} and ${highYield} possible residential units depending on density. Before purchase or development, confirm title status, zoning, infrastructure connections, flood risk and servicing costs.`;
});