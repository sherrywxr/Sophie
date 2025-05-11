let jobCache = [];
let categoryCache = [];
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
  console.log("delete");
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

async function fetchAndCacheCategories() {
  if (categoryCache.length > 0) return categoryCache;
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error("Failed to fetch Catgories");

    const categories = await response.json();
    categoryCache = categories;
    //#TODO Cache the categories# add the options for select tag, post fetch request to backend.
    const select = document.querySelector(".category-select");
    select.innerHTML = `<option value="">Select a category</option>`;
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });

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
    fetchAndCacheCategories().then((categories) => {
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
        const jobId = button.closest("figure").dataset.id;
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
      jobCard.dataset.id = job.id;
      jobCard.innerHTML = `<img class="job-thumbnail" src="${job.imageUrl}" alt="${job.title}">`;
      jobThumbnails.appendChild(jobCard);
    });
   
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
    document.getElementById("popup-content").classList.add("hidden");
    document.getElementById("popupAddPhoto").classList.remove("hidden");
    fetchAndCacheCategories();
  });
});

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        document.getElementById("addphotopic").classList.add("hidden");
        document.getElementById("addphotobutton").classList.add("hidden");
      };

      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
      preview.src = "#";
      alert("Please select a valid image file.");
    }
  });

//back button and close button
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".back-btn");
  const popupBox = document.getElementById("popupBox");
  const popupContent = document.getElementById("popup-content");
  const popupAddPhoto = document.getElementById("popupAddPhoto");
  const closeButton = document.getElementById("add-photo-close-button");

  backBtn.addEventListener("click", () => {
    popupAddPhoto.classList.add("hidden"); // Hide photo upload form
    popupContent.classList.remove("hidden"); // Show main popup gallery
  });

  // Close when clicking the close button
  closeButton.addEventListener("click", function () {
    popupBox.classList.add("hidden");
    popupAddPhoto.classList.add("hidden");
    console.log(document.querySelector(".close-button"));
  });
});

//Handle File Upload + Title + Category + POST Request
const confirmBtn = document.getElementById("confirm");
const fileInput = document.getElementById("fileInput");
const titleInput = document.querySelector(".title-enter input");
const categorySelect = document.querySelector(".category-select");

confirmBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const categoryId = categorySelect.value;

  if (!file || !title || !categoryId) {
    alert("Please fill out all fields and select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", categoryId);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // ← Use your auth system
      },
      body: formData,
    });
    const data = await response.json();
console.log(data)
    if (!response.ok) throw new Error("Upload failed");

    alert("Photo uploaded successfully!");
    // popupAddPhoto.classList.add("hidden");
    // popupBox.classList.remove("hidden");
    fileInput.value = "";
    titleInput.value = "";
    categorySelect.selectedIndex = 0;

    jobCache.push(data)
    displayJobs(jobCache);
  } catch (error) {
    console.error("Upload error:", error);
    alert("Failed to upload. Please try again.");
  }
});
