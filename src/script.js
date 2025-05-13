// Set default date to today
const today = new Date();
const formattedToday = today.toISOString().split("T")[0];
document.getElementById("date-input").value = formattedToday;

// Elements
const dateInput = document.getElementById("date-input");
const exploreBtn = document.getElementById("explore-btn");
const randomDateBtn = document.getElementById("random-date-btn");
const resultsSection = document.getElementById("results");
const loadingSection = document.getElementById("loading");
const emptyState = document.getElementById("empty-state");
const resultsContent = document.getElementById("results-content");
const displayDate = document.getElementById("display-date");
const categoryBtns = document.querySelectorAll(".category-btn");

// Format date for display
function formatDisplayDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

// Generate a random date between 1900 and today
function getRandomDate() {
  const start = new Date(1900, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split("T")[0];
}

// Show loading state
function showLoading() {
  loadingSection.classList.remove("hidden");
  resultsContent.innerHTML = "";
  resultsContent.classList.add("hidden");
}

// Hide loading state
function hideLoading() {
  loadingSection.classList.add("hidden");
  resultsContent.classList.remove("hidden");
}

randomDateBtn.addEventListener("click", function () {
  const randomDate = getRandomDate();
  dateInput.value = randomDate;
  showLoading();
});

// API calls
async function fetchEventData(endPoint) {
  const ENV = "prod"; //! in development, change it to "DEV"

  const BASE_URL = ENV !== "DEV" ? "https://date-explorer.onrender.com" : "";
  const res = await fetch(`${BASE_URL}/${endPoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: dateInput.value }),
  });

  const parsedData = await res.json();
  return parsedData;
}

// Sample Data
// const eventData =
// {
//   Events: [
//     {
//       title: "1902", // Event title (could be year or event name)
//       desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, quae!", // Description of the event
//       category: "events", // The category of the event
//     },
//   ],
//   Births: [
//     {
//       title: "1910", // Birth year or notable person
//       desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, quae!", // Description or additional details
//       category: "birthdays",
//     },
//   ],
//   Deaths: [
//     {
//       title: "1945", // Death year or notable person
//       desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, quae!", // Description or additional details
//       category: "deaths",
//     },
//   ],
// };

async function generateResults(date) {
  const factData = await fetchEventData("facts");
  const eventData = await fetchEventData("all-events");

  // Format the display date
  displayDate.textContent = formatDisplayDate(date);

  // Clear previous results
  resultsContent.innerHTML = "";

  const data = [...eventData.Events, ...eventData.Births, ...eventData.Deaths];
  const fData = factData.dateFacts;

  fData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "result-card shadow-md";
    card.dataset.category = item.category;

    const content = `
      <div class="p-5">
          <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <i class="fas fa-lightbulb text-yellow-500"></i>
              </div>
              <h4 class="font-bold text-lg">Fun-Fact</h4>
          </div>
          <div class="text-sm mb-2 opacity-50">
              <span class="font-semibold">Category:</span> ${item.category}
          </div>
          <p class="text-gray-700">${item.fact}</p>
      </div>
    `;

    card.innerHTML = content;
    resultsContent.appendChild(card);
  });

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "result-card shadow-md";
    card.dataset.category = item.category;

    const categoryStyles = {
      events: {
        icon: '<i class="fas fa-landmark text-blue-500"></i>',
        bgColor: "bg-blue-100",
      },
      birthdays: {
        icon: '<i class="fas fa-birthday-cake text-purple-500"></i>',
        bgColor: "bg-purple-100",
      },
      deaths: {
        icon: '<i class="fas fa-cross text-gray-800"></i>',
        bgColor: "bg-gray-300",
      },
      default: {
        icon: '<i class="fas fa-lightbulb text-yellow-500"></i>',
        bgColor: "bg-yellow-100",
      },
    };

    const { icon, bgColor } = categoryStyles[item.category] || categoryStyles.default;

    const content = `
      <div class="p-5">
          <div class="flex items-center mb-3">
              <div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center mr-3">
                  ${icon}
              </div>
              <h4 class="font-bold text-lg">${item.title}</h4>
          </div>
          <div class="text-sm mb-2 opacity-50">
              <span class="font-semibold">Category:</span> ${item.category}
          </div>
          <p class="text-gray-700">${item.desc}</p>
      </div>
    `;

    card.innerHTML = content;
    resultsContent.appendChild(card);
  });

  // Show results section
  resultsSection.classList.remove("hidden");
  emptyState.classList.add("hidden");
  hideLoading();
}

// Filter results by category
function filterResults(category) {
  const allCards = document.querySelectorAll(".result-card");

  allCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });

  // Update active button
  categoryBtns.forEach((btn) => {
    if (btn.dataset.category === category) {
      btn.classList.remove("bg-gray-100", "text-gray-600");
      btn.classList.add("bg-blue-100", "text-blue-600");
    } else {
      btn.classList.remove("bg-blue-100", "text-blue-600");
      btn.classList.add("bg-gray-100", "text-gray-600");
    }
  });
}

// Event Listeners
exploreBtn.addEventListener("click", function () {
  const selectedDate = dateInput.value;
  if (selectedDate) {
    showLoading();
    // Simulate API call with timeout
    setTimeout(() => {
      generateResults(selectedDate);
    }, 1000);
  }
});

randomDateBtn.addEventListener("click", function () {
  const randomDate = getRandomDate();
  dateInput.value = randomDate;
  showLoading();
  // Simulate API call with timeout
  setTimeout(() => {
    generateResults(randomDate);
  }, 1000);
});

// Category filter buttons
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    filterResults(this.dataset.category);
  });
});

// Initialize with today's date
showLoading();
setTimeout(() => {
  generateResults(formattedToday);
}, 1000);
