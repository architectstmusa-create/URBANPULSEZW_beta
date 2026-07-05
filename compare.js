document.addEventListener("DOMContentLoaded", () => {
  const savedReports = JSON.parse(localStorage.getItem("urbanpulse_reports")) || [];

  const siteASelect = document.getElementById("siteA");
  const siteBSelect = document.getElementById("siteB");

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function getRiskWeight(risk) {
    if (!risk) return 3;

    const value = risk.toLowerCase();

    if (value.includes("moderate-low")) return 2;
    if (value.includes("low")) return 1;
    if (value.includes("moderate-high")) return 4;
    if (value.includes("moderate")) return 3;
    if (value.includes("high")) return 5;

    return 3;
  }

  function populateDropdowns() {
    if (!siteASelect || !siteBSelect) return;

    siteASelect.innerHTML = `<option value="">Select first report</option>`;
    siteBSelect.innerHTML = `<option value="">Select second report</option>`;

    savedReports.forEach((report, index) => {
      const label = `${report.location || "Unnamed Site"} — ${report.buyScore || "-"} / 100`;

      const optionA = document.createElement("option");
      optionA.value = index;
      optionA.textContent = label;

      const optionB = document.createElement("option");
      optionB.value = index;
      optionB.textContent = label;

      siteASelect.appendChild(optionA);
      siteBSelect.appendChild(optionB);
    });
  }

  function winnerByNumber(siteA, siteB, field, higherIsBetter = true) {
    const a = Number(siteA[field]);
    const b = Number(siteB[field]);

    if (isNaN(a) || isNaN(b)) return "-";
    if (a === b) return "Tie";

    if (higherIsBetter) {
      return a > b ? siteA.location : siteB.location;
    }

    return a < b ? siteA.location : siteB.location;
  }

  function updateComparison() {
    const siteA = siteASelect.value !== "" ? savedReports[Number(siteASelect.value)] : null;
    const siteB = siteBSelect.value !== "" ? savedReports[Number(siteBSelect.value)] : null;

    if (!siteA || !siteB) {
      setText("winnerTitle", "Select two sites to compare");
      setText("winnerText", "Choose Site A and Site B from your saved UrbanPulse reports.");
      return;
    }

    setText("siteAHeading", siteA.location);
    setText("siteBHeading", siteB.location);

    setText("tableAScore", `${siteA.buyScore}/100`);
    setText("tableBScore", `${siteB.buyScore}/100`);

    setText("tableARoi", `${siteA.roi}%`);
    setText("tableBRoi", `${siteB.roi}%`);

    setText("tableARisk", siteA.riskRating);
    setText("tableBRisk", siteB.riskRating);

    setText("tableAPotential", siteA.developmentPotential);
    setText("tableBPotential", siteB.developmentPotential);

    setText("tableABestUse", siteA.bestUse);
    setText("tableBBestUse", siteB.bestUse);

    setText("tableABuildable", `${Number(siteA.buildableArea).toLocaleString()} m²`);
    setText("tableBBuildable", `${Number(siteB.buildableArea).toLocaleString()} m²`);

    setText("tableAAccess", `${siteA.accessibilityScore}/100`);
    setText("tableBAccess", `${siteB.accessibilityScore}/100`);

    setText("tableAInfrastructure", siteA.roadRating || "-");
    setText("tableBInfrastructure", siteB.roadRating || "-");

    const scoreDiff = Math.abs(Number(siteA.buyScore) - Number(siteB.buyScore));

    setText("scoreDifference", `${scoreDiff} pts`);
    setText("higherROI", winnerByNumber(siteA, siteB, "roi", true));

    const lowerRisk =
      getRiskWeight(siteA.riskRating) < getRiskWeight(siteB.riskRating)
        ? siteA.location
        : getRiskWeight(siteB.riskRating) < getRiskWeight(siteA.riskRating)
          ? siteB.location
          : "Tie";

    setText("lowerRisk", lowerRisk);

    const adjustedA = Number(siteA.buyScore) - getRiskWeight(siteA.riskRating) * 2;
    const adjustedB = Number(siteB.buyScore) - getRiskWeight(siteB.riskRating) * 2;

    let winner = "Tie";

    if (adjustedA > adjustedB) winner = siteA.location;
    if (adjustedB > adjustedA) winner = siteB.location;

    setText("recommendedSite", winner);

    if (winner === "Tie") {
      setText("winnerTitle", "Both sites are closely matched");
      setText(
        "winnerText",
        "Both sites perform similarly. Compare ROI, risk, accessibility and buildable area before deciding."
      );
    } else {
      setText("winnerTitle", `${winner} is the stronger opportunity`);

      const winningSite = winner === siteA.location ? siteA : siteB;

      setText(
        "winnerText",
        `${winningSite.location} performs better overall with a buy score of ${winningSite.buyScore}/100, ${winningSite.riskRating} risk, and an estimated ROI of ${winningSite.roi}%.`
      );
    }
  }

  if (!siteASelect || !siteBSelect) {
    console.error("Compare page dropdowns were not found.");
    return;
  }

  populateDropdowns();

  siteASelect.addEventListener("change", updateComparison);
  siteBSelect.addEventListener("change", updateComparison);

  if (savedReports.length < 2) {
    setText("winnerTitle", "Run at least two site analyses");
    setText("winnerText", "UrbanPulse needs at least two saved reports before comparison works.");
  }
});
function updateWinningCategories(siteA, siteB) {

    const siteAWins = document.getElementById("siteAWins");
    const siteBWins = document.getElementById("siteBWins");

    siteAWins.innerHTML = "";
    siteBWins.innerHTML = "";

    function addWinner(list, text) {
        const li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
    }

    if (siteA.buyScore > siteB.buyScore)
        addWinner(siteAWins, "Higher Buy Score");
    else if (siteB.buyScore > siteA.buyScore)
        addWinner(siteBWins, "Higher Buy Score");

    if (siteA.roi > siteB.roi)
        addWinner(siteAWins, "Higher ROI");
    else if (siteB.roi > siteA.roi)
        addWinner(siteBWins, "Higher ROI");

    if (siteA.buildableArea > siteB.buildableArea)
        addWinner(siteAWins, "Larger Buildable Area");
    else if (siteB.buildableArea > siteA.buildableArea)
        addWinner(siteBWins, "Larger Buildable Area");

    if (siteA.accessibilityScore > siteB.accessibilityScore)
        addWinner(siteAWins, "Better Accessibility");
    else if (siteB.accessibilityScore > siteA.accessibilityScore)
        addWinner(siteBWins, "Better Accessibility");

}