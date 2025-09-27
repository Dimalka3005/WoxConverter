// --- Start Screen Animation ---
const getStartedBtn = document.querySelector(".getStartedBtn");
const startScreen = document.querySelector(".start-screen");
const navbar = document.querySelector(".navbar");
getStartedBtn.addEventListener("click", () => {
  startScreen.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
    {
      duration: 1000,
      fill: "forwards",
    }
  );
  navbar.classList.remove("d-none");
  navbar.animate(
    [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
    {
      duration: 1000,
      fill: "forwards",
    }
  );
});

// --- Conversion Types ---
const conversionTypes = {
  Length: {
    icon: "rulers",
    baseUnit: "m",
    units: ["km", "m", "cm", "mm", "inch", "foot", "yard", "mile"],
    rates: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34,
    },
  },
  Temperature: {
    icon: "thermometer-half",
    baseUnit: "C",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    rates: {},
  },
  Area: {
    icon: "bounding-box-circles",
    baseUnit: "m2",
    units: ["mm2", "cm2", "m2", "ha", "km2", "in2", "yd2", "ft2", "ac", "mi2"],
    rates: {
      mm2: 1e-6,
      cm2: 1e-4,
      m2: 1,
      ha: 10000,
      km2: 1e6,
      in2: 0.00064516,
      yd2: 0.836127,
      ft2: 0.092903,
      ac: 4046.86,
      mi2: 2589988,
    },
  },
  Mass: {
    icon: "scale",
    baseUnit: "kg",
    units: ["mcg", "mg", "g", "kg", "mt", "oz", "lb", "t"],
    rates: {
      mcg: 1e-9,
      mg: 1e-6,
      g: 0.001,
      kg: 1,
      mt: 1000,
      oz: 0.0283495,
      lb: 0.453592,
      t: 907.185,
    },
  },
  Volume: {
    icon: "droplet-half",
    baseUnit: "m3",
    units: [
      "mm3",
      "cm3",
      "ml",
      "cl",
      "dl",
      "l",
      "kl",
      "m3",
      "km3",
      "tsp",
      "Tbs",
      "in3",
      "fl-oz",
      "cup",
      "pnt",
      "qt",
      "gal",
      "ft3",
      "yd3",
    ],
    rates: {
      mm3: 1e-9,
      cm3: 1e-6,
      ml: 1e-6,
      cl: 1e-5,
      dl: 1e-4,
      l: 0.001,
      kl: 1,
      m3: 1,
      km3: 1e9,
      tsp: 4.92892e-6,
      Tbs: 14.7868e-6,
      in3: 0.0000163871,
      "fl-oz": 0.0000295735,
      cup: 0.000236588,
      pnt: 0.000473176,
      qt: 0.000946353,
      gal: 0.00378541,
      ft3: 0.0283168,
      yd3: 0.764555,
    },
  },
  Time: {
    icon: "clock-history",
    baseUnit: "s",
    units: ["ns", "mu", "ms", "s", "min", "h", "d", "week", "month", "year"],
    rates: {
      ns: 1e-9,
      mu: 1e-6,
      ms: 0.001,
      s: 1,
      min: 60,
      h: 3600,
      d: 86400,
      week: 604800,
      month: 2629746,
      year: 31556952,
    },
  },
  Digital: {
    icon: "hdd-network",
    baseUnit: "b",
    units: ["b", "Kb", "Mb", "Gb", "Tb", "B", "KB", "MB", "GB", "TB"],
    rates: {
      b: 1,
      Kb: 1000,
      Mb: 1e6,
      Gb: 1e9,
      Tb: 1e12,
      B: 8,
      KB: 8000,
      MB: 8e6,
      GB: 8e9,
      TB: 8e12,
    },
  },
};

let currentTypeId = null;

// --- Render UI ---
function renderConversionUI(title, units) {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  const unitOptions = units
    .map((unit) => `<option value="${unit}">${unit}</option>`)
    .join("");

  const html = `
    <div id="${id}" class="conversion-interface bg-dark-custom p-4 p-md-5 rounded-4 shadow-lg border border-secondary">
      <h2 class="fs-3 fw-bold text-primary mb-4 text-center">${title} Converter</h2>

      <div class="row g-3 g-md-4 align-items-center">
        <div class="col-12 col-md-5">
          <label class="form-label text-secondary fw-semibold">Input Value (From)</label>
          <input type="number" id="${id}-from-value" class="form-control form-control-lg text-primary text-end fw-bold"
            placeholder="0" oninput="triggerConversion()" />
          <label class="form-label text-secondary fw-semibold mt-3">Select Unit</label>
          <select id="${id}-from-unit" class="form-select form-select-lg" onchange="triggerConversion()">
            ${unitOptions}
          </select>
        </div>

        <div class="col-12 col-md-2 d-flex justify-content-center py-3 py-md-0">
          <button id="switch-button" onclick="swapUnits()" class="btn btn-primary rounded-circle shadow-lg p-3"
            style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
            <i class="bi bi-arrow-left-right fs-4"></i>
          </button>
        </div>

        <div class="col-12 col-md-5">
          <label class="form-label text-primary fw-semibold">Converted Result (To)</label>
          <input type="text" id="${id}-to-result" class="form-control form-control-lg text-primary text-end fw-bold"
            placeholder="0" readonly />
          <label class="form-label text-primary fw-semibold mt-3">Select Unit</label>
          <select id="${id}-to-unit" class="form-select form-select-lg" onchange="triggerConversion()">
            ${unitOptions}
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-center mt-5">
        <button onclick="clearConversion()" class="btn btn-outline-secondary btn-lg rounded-pill px-5 shadow-sm">
          <i class="bi bi-x-lg me-2"></i>Clear
        </button>
      </div>
    </div>
  `;

  document.getElementById("conversion-panel").innerHTML = html;

  document.getElementById(`${id}-from-unit`).selectedIndex = 0;
  document.getElementById(`${id}-to-unit`).selectedIndex = units.length > 1 ? 1 : 0;
}

// --- Initialize App ---
function initializeApp() {
  const selectorContainer = document.getElementById("converter-buttons-container");
  selectorContainer.innerHTML = "";

  Object.entries(conversionTypes).forEach(([title, config]) => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    const button = document.createElement("button");
    button.className = "btn btn-outline-light converter-select-button fw-medium";
    button.setAttribute("data-target", id);

    button.onclick = () => {
      selectConverter(title);
      // collapse menu on mobile
      const navbar = document.querySelector("#navbarContent");
      const bsCollapse = bootstrap.Collapse.getInstance(navbar);
      if (bsCollapse) bsCollapse.hide();
    };

    button.innerHTML = `<i class="bi bi-${config.icon} me-2"></i><span>${title}</span>`;
    selectorContainer.appendChild(button);
  });

  selectConverter(Object.keys(conversionTypes)[0]);
}

// --- Select Converter ---
function selectConverter(title) {
  const pageId = title.toLowerCase().replace(/\s+/g, "-");
  const config = conversionTypes[title];
  if (!config) return;

  currentTypeId = pageId;
  renderConversionUI(title, config.units);

  document.querySelectorAll(".converter-select-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`button[data-target="${pageId}"]`).classList.add("active");

  triggerConversion();
}

// --- Swap Units ---
function swapUnits() {
  if (!currentTypeId) return;
  const fromSelect = document.getElementById(`${currentTypeId}-from-unit`);
  const toSelect = document.getElementById(`${currentTypeId}-to-unit`);
  if (!fromSelect || !toSelect) return;

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  triggerConversion();
}

// --- Conversion Logic ---
function triggerConversion() {
  if (!currentTypeId) return;
  const config = conversionTypes[
    Object.keys(conversionTypes).find(
      (key) => key.toLowerCase().replace(/\s+/g, "-") === currentTypeId
    )
  ];
  if (!config) return;

  const fromValue = parseFloat(document.getElementById(`${currentTypeId}-from-value`).value);
  const fromUnit = document.getElementById(`${currentTypeId}-from-unit`).value;
  const toUnit = document.getElementById(`${currentTypeId}-to-unit`).value;
  const resultInput = document.getElementById(`${currentTypeId}-to-result`);

  if (isNaN(fromValue)) {
    resultInput.value = "";
    return;
  }

  let result;
  if (currentTypeId === "temperature") {
    result = convertTemperature(fromValue, fromUnit, toUnit);
  } else {
    result = fromValue * (config.rates[fromUnit] / config.rates[toUnit]);
  }

  resultInput.value = result.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

// --- Temperature Conversion ---
function convertTemperature(value, from, to) {
  if (from === to) return value;

  if (from === "Celsius") {
    if (to === "Fahrenheit") return value * 9 / 5 + 32;
    if (to === "Kelvin") return value + 273.15;
  }
  if (from === "Fahrenheit") {
    if (to === "Celsius") return (value - 32) * 5 / 9;
    if (to === "Kelvin") return (value - 32) * 5 / 9 + 273.15;
  }
  if (from === "Kelvin") {
    if (to === "Celsius") return value - 273.15;
    if (to === "Fahrenheit") return (value - 273.15) * 9 / 5 + 32;
  }

  return value;
}

// --- Clear Conversion ---
function clearConversion() {
  if (!currentTypeId) return;
  document.getElementById(`${currentTypeId}-from-value`).value = "";
  document.getElementById(`${currentTypeId}-to-result`).value = "";
}

// --- Initialize on Load ---
document.addEventListener("DOMContentLoaded", initializeApp);
