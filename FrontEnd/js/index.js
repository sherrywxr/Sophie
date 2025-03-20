let jobCache = [];
async function fetchJobs() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error("Failed to fetch jobs");
    const jobs = await response.json();
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

function displayJobs(jobs) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Clear existing content

  jobs.forEach((job) => {
    const jobCard = document.createElement("figure");
    jobCard.innerHTML = `
            <img src="${job.imageUrl}" alt="${job.title}">
            <figcaption>${job.title}</figcaption>

        `;
    gallery.appendChild(jobCard);
  });
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteWork(button.dataset.id));
  });
}
// Function to delete a job (requires authentication)
async function deleteWork(workId) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    alert("You need to be logged in to delete a job.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Work deleted successfully.");
      jobCache = jobCache.filter((job) => job.id !== parseInt(workId));
      displayJobs(jobCache); // Refresh UI
    } else {
      alert("Failed to delete work.");
    }
  } catch (error) {
    console.error("Error deleting work:", error);
  }
}
// Fetch and display jobs
fetchJobs().then((jobs) => {
  jobCache = jobs;
  if (jobs) displayJobs(jobs);
});

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error("Failed to fetch Catgories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function displayCategories(categories) {
  console.log(categories);
  const menu = document.getElementById("category-filters");
  menu.innerHTML = '<button class="active" data-category="All">All</button>'; // Default option
  const allButton = menu.querySelector("button");
  allButton.addEventListener("click", () => {
    console.log("allButton");
    filterJobsByCategory("All");
  });
  categories.forEach((category) => {
    console.log(category);
    const button = document.createElement("button");
    button.dataset.category = category.name;
    button.textContent = category.name;

    button.addEventListener("click", () => {
      filterJobsByCategory(category.name);
    });

    menu.appendChild(button);
  });
}

function filterJobsByCategory(category) {
  console.log(category);
  console.log(jobCache);
  const filteredJobs =
    category === "All"
      ? jobCache
      : jobCache.filter((job) => job.category.name === category);
  console.log(filteredJobs);
  displayJobs(filteredJobs);
}
// Fetch jobs and categories
fetchJobs().then((jobs) => {
  if (jobs) {
    fetchCategories().then((categories) => {
      displayJobs(jobs);
      displayCategories(categories);
    });
  }
});

