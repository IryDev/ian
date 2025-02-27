document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle("hidden");
    menuButton.setAttribute("aria-expanded", isMenuOpen.toString());

    const iconPath = menuButton.querySelector("svg path");
    if (isMenuOpen) {
      iconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
    } else {
      iconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    }
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", toggleMenu);

    document.addEventListener("click", (event) => {
      const isClickInside =
        menuButton.contains(event.target) || mobileMenu.contains(event.target);
      if (!isClickInside && isMenuOpen) {
        toggleMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        toggleMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        toggleMenu();
      }
    });
  }

  const form = document.getElementById("contactForm");
  const fields = ["name", "email", "subject", "message"];

  const showError = (fieldId, show, message = "") => {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (show) {
      errorElement.classList.remove("hidden");
      inputElement.setAttribute("aria-invalid", "true");
      inputElement.setAttribute("aria-describedby", `${fieldId}-error`);
      if (message) {
        errorElement.textContent = message;
      }
    } else {
      errorElement.classList.add("hidden");
      inputElement.removeAttribute("aria-invalid");
      inputElement.removeAttribute("aria-describedby");
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getErrorMessage = (field, value) => {
    switch (field) {
      case "name":
        return "Veuillez entrer votre nom";
      case "email":
        return value === ""
          ? "Veuillez entrer votre email"
          : "Veuillez entrer une adresse email valide";
      case "subject":
        return "Veuillez sélectionner un sujet";
      case "message":
        return "Veuillez entrer votre message";
      default:
        return "Ce champ est requis";
    }
  };

  const validateField = (field) => {
    const element = document.getElementById(field);
    const value = element.value.trim();
    let isValid = true;

    switch (field) {
      case "email":
        isValid = value !== "" && validateEmail(value);
        break;
      default:
        isValid = value !== "";
    }

    const errorMessage = getErrorMessage(field, value);
    showError(field, !isValid, errorMessage);
    return isValid;
  };

  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.classList.add("sr-only");
  form.appendChild(liveRegion);

  fields.forEach((field) => {
    const element = document.getElementById(field);

    element.addEventListener("blur", () => {
      validateField(field);
    });

    element.addEventListener("input", () => {
      showError(field, false);
    });

    element.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && field !== "message") {
        e.preventDefault();
        const currentIndex = fields.indexOf(field);
        const nextField = fields[currentIndex + 1];
        if (nextField) {
          document.getElementById(nextField).focus();
        }
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = fields.every((field) => validateField(field));

    if (isValid) {
      liveRegion.textContent = "Message envoyé avec succès!";

      setTimeout(() => {
        form.reset();
        liveRegion.textContent = "";
        fields.forEach((field) => {
          showError(field, false);
        });
      }, 3000);
    } else {
      const firstInvalidField = fields.find((field) => !validateField(field));
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        element.focus();

        liveRegion.textContent = `Il y a des erreurs dans le formulaire. ${getErrorMessage(
          firstInvalidField
        )}`;
      }
    }
  });
});
