"use strict";

/* =========================================
   ELEMENTS
========================================= */
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const currentYear = document.getElementById("currentYear");

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const serviceInput = document.getElementById("service");
const messageInput = document.getElementById("message");


/* =========================================
   CURRENT YEAR
========================================= */
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   HEADER SCROLL EFFECT
========================================= */
function updateHeaderOnScroll() {
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeaderOnScroll);
updateHeaderOnScroll();


/* =========================================
   MOBILE NAVIGATION
========================================= */
function openMenu() {
  navbar.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");

  const icon = menuToggle.querySelector("i");

  if (icon) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  }
}

function closeMenu() {
  navbar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");

  const icon = menuToggle.querySelector("i");

  if (icon) {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
}

function toggleMenu() {
  const menuIsOpen = navbar.classList.contains("open");

  if (menuIsOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

menuToggle.addEventListener("click", toggleMenu);


/* Close menu after clicking a navigation link */
navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});


/* Close menu after clicking the project button */
const navigationButton = navbar.querySelector(".btn");

if (navigationButton) {
  navigationButton.addEventListener("click", closeMenu);
}


/* Close menu by pressing Escape */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});


/* Close mobile menu when screen becomes larger */
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});


/* Close menu when clicking outside it */
document.addEventListener("click", (event) => {
  const clickedInsideNavbar = navbar.contains(event.target);
  const clickedMenuButton = menuToggle.contains(event.target);

  if (!clickedInsideNavbar && !clickedMenuButton) {
    closeMenu();
  }
});


/* =========================================
   ACTIVE NAVIGATION LINK
========================================= */
function updateActiveNavigation() {
  let currentSectionId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 160;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const linkTarget = link.getAttribute("href");

    if (linkTarget === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation);
updateActiveNavigation();


/* =========================================
   FORM VALIDATION HELPERS
========================================= */
function showError(input, message) {
  const formGroup = input.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");

  input.classList.add("input-error");

  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  const errorMessage = formGroup.querySelector(".error-message");

  input.classList.remove("input-error");

  if (errorMessage) {
    errorMessage.textContent = "";
  }
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}


/* =========================================
   INDIVIDUAL FIELD VALIDATION
========================================= */
function validateName() {
  const nameValue = nameInput.value.trim();

  clearError(nameInput);

  if (nameValue === "") {
    showError(nameInput, "Please enter your name.");
    return false;
  }

  if (nameValue.length < 2) {
    showError(nameInput, "Name must contain at least 2 characters.");
    return false;
  }

  return true;
}

function validateEmail() {
  const emailValue = emailInput.value.trim();

  clearError(emailInput);

  if (emailValue === "") {
    showError(emailInput, "Please enter your email address.");
    return false;
  }

  if (!isValidEmail(emailValue)) {
    showError(emailInput, "Please enter a valid email address.");
    return false;
  }

  return true;
}

function validateService() {
  clearError(serviceInput);

  if (serviceInput.value === "") {
    showError(serviceInput, "Please select a service.");
    return false;
  }

  return true;
}

function validateMessage() {
  const messageValue = messageInput.value.trim();

  clearError(messageInput);

  if (messageValue === "") {
    showError(messageInput, "Please enter your project details.");
    return false;
  }

  if (messageValue.length < 15) {
    showError(
      messageInput,
      "Please provide at least 15 characters about your project."
    );

    return false;
  }

  return true;
}


/* =========================================
   REMOVE ERRORS WHILE TYPING
========================================= */
nameInput.addEventListener("input", () => {
  if (nameInput.value.trim().length >= 2) {
    clearError(nameInput);
  }
});

emailInput.addEventListener("input", () => {
  if (isValidEmail(emailInput.value.trim())) {
    clearError(emailInput);
  }
});

serviceInput.addEventListener("change", () => {
  if (serviceInput.value !== "") {
    clearError(serviceInput);
  }
});

messageInput.addEventListener("input", () => {
  if (messageInput.value.trim().length >= 15) {
    clearError(messageInput);
  }
});


/* =========================================
   FORM SUBMISSION
========================================= */
/* =========================================
   FORM SUBMISSION
========================================= */
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.className = "form-status";

  const nameIsValid = validateName();
  const emailIsValid = validateEmail();
  const serviceIsValid = validateService();
  const messageIsValid = validateMessage();

  const formIsValid =
    nameIsValid &&
    emailIsValid &&
    serviceIsValid &&
    messageIsValid;

  if (!formIsValid) {
    formStatus.textContent =
      "Please correct the highlighted fields.";

    formStatus.classList.add("error");
    return;
  }

  const submitButton = contactForm.querySelector(
    'button[type="submit"]'
  );

  const originalButtonContent = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = `
    Sending...
    <i class="fa-solid fa-spinner fa-spin"></i>
  `;

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Form submission failed.");
    }

    formStatus.textContent =
      "Thank you! Your project request has been sent successfully.";

    formStatus.className = "form-status success";

    contactForm.reset();
  } catch (error) {
    console.error("Form submission error:", error);

    formStatus.textContent =
      "Sorry, your message could not be sent. Please try again.";

    formStatus.className = "form-status error";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonContent;
  }
});