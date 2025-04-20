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
  document.querySelectorAll(".trashicon").forEach((button) => {
    button.addEventListener("click", () => deleteWork(button.dataset.id));
  });
}
// Function to delete a job (requires authentication)
async function deleteWork(workId) {
  console.log("delete")
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    alert("You need to be logged in to delete a job.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
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
  const menu = document.getElementById("filter");
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

// //after login
document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");
  let element = document.getElementById("edit-mode");

  if (authToken) {
    //     // User is logged in
    element.classList.remove("hidden");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");
  let element = document.getElementById("edit-button");

  if (authToken) {
    //     // User is logged in
    element.classList.remove("hidden");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");
  let element = document.getElementById("filter-container");

  if (authToken) {
    //     // User is logged in
    element.classList.add("hidden");
  }
});

// // Function to remove the filter buttons
// function removeFilterButtons() {
//   const menu = document.getElementById("category-filters");
//   if (menu) {
//     menu.innerHTML = ""; // Remove all child elements (filter buttons)
//   }

// function addElementsForLoggedInUser() {
//   const editIcon = document.getElementById("edit-icon");
// }

// function addElementsForLoggedInUser() {
//   const editMode = document.getElementById("edit-mode");
// }
//Change login url li to logout after login
document.addEventListener("DOMContentLoaded", function () {
  updateAuthLink(); // Call function to update login/logout link
});

function updateAuthLink() {
  const authToken = localStorage.getItem("authToken");
  const authLink = document.getElementById("auth-link"); // Get the login/logout link

  if (authToken) {
    // Change "Login" to "Logout"
    authLink.textContent = "Logout";
    authLink.href = "#"; // Prevents navigation
    authLink.addEventListener("click", logoutUser);
  } else {
    // Keep it as "Login"
    authLink.textContent = "Login";
    authLink.href = "login.html"; // Redirect to login page
  }
}

// Function to log out the user
function logoutUser(event) {
  event.preventDefault(); // Prevent default link action
  localStorage.removeItem("authToken"); // Remove auth token
  window.location.href = "login.html"; // Redirect to login page
}

//click on edit button
document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("edit-button");
  const popupBox = document.getElementById("popupBox");
  const closeButton = document.querySelector(".close-button"); // Ensure this exists
  console.log(document.querySelector(".close-button"));

  // if (editButton && popupBox && closeButton) {
  // Open the popup
  editButton.addEventListener("click", function () {
    popupBox.classList.remove("hidden");
    displayJobThumbnails(jobCache);
    //Add trash icon
    const thumbnails = document.querySelectorAll("figure");

    thumbnails.forEach((thumbnail) => {
      // Create the trash icon image
      const trashIcon = document.createElement("button");
      trashIcon.innerHTML =
        "<img class='trashicon' src='./assets/icons/trashicon.png' alt='Delete'>";
      trashIcon.classList.add("trashicon");

      // Add click event to remove the image
      trashIcon.addEventListener("click", (event) => {
        const button = event.target;
        console.log(button);
        console.log(button.closest(".job-thumbnail"))
        const jobId = button.closest("figure").dataset.id
        console.log(jobId);
        thumbnail.remove();
        deleteWork(jobId);
      });
      

      // Append the trash icon to each thumbnail
      thumbnail.appendChild(trashIcon);
    });
  });

  function displayJobThumbnails(jobs) {
    const jobThumbnails = document.getElementById("job-thumbnails");
    jobThumbnails.innerHTML = ""; // Clear existing content

    jobs.forEach((job) => {
      const jobCard = document.createElement("figure");
      jobCard.dataset.id = job.id
      jobCard.innerHTML = `<img class="job-thumbnail" src="${job.imageUrl}" alt="${job.title}">`;
      jobThumbnails.appendChild(jobCard);
    });
    // document.querySelectorAll(".trashicon").forEach((button) => {
    //   button.addEventListener("click", () => deleteWork(button.dataset.id));
    // });
  }
  // Close when clicking the close button
  closeButton.addEventListener("click", function () {
    popupBox.classList.add("hidden");
  });

  // Close when clicking outside the popup content
  window.addEventListener("click", function (event) {
    if (event.target === popupBox) {
      popupBox.classList.add("hidden");
    }
  });

  // Example "Add a photo" clickbox

  // const thumbnails = document.querySelectorAll(".job-thumbnail");

  const addPhotoBtn = document.getElementById("addPhotoBtn");
  addPhotoBtn.addEventListener("click", () => {
    const gallery = document.getElementById("gallery");

    const newThumbnail = document.createElement("div");
    newThumbnail.classList.add("job-thumbnail");

    const image = document.createElement("img");
    image.src = "your-new-photo.jpg"; // Replace with actual logic
    image.alt = "New Photo";

    newThumbnail.appendChild(image);
    addTrashIcon(newThumbnail); // Attach trash icon
    gallery.appendChild(newThumbnail);
  });
  // } else {
  //   console.error(
  //     "One or more elements are missing! Check your HTML structure."
  //   );
  // }
});
