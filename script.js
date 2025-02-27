document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const fields = ['name', 'email', 'subject', 'message'];

    const showError = (fieldId, show, message = '') => {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const inputElement = document.getElementById(fieldId);

        if (show) {
            errorElement.classList.remove('hidden');
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', `${fieldId}-error`);
            if (message) {
                errorElement.textContent = message;
            }
        } else {
            errorElement.classList.add('hidden');
            inputElement.removeAttribute('aria-invalid');
            inputElement.removeAttribute('aria-describedby');
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const getErrorMessage = (field, value) => {
        switch (field) {
            case 'name':
                return 'Veuillez entrer votre nom';
            case 'email':
                return value === '' ? 'Veuillez entrer votre email' : 'Veuillez entrer une adresse email valide';
            case 'subject':
                return 'Veuillez sélectionner un sujet';
            case 'message':
                return 'Veuillez entrer votre message';
            default:
                return 'Ce champ est requis';
        }
    };

    const validateField = (field) => {
        const element = document.getElementById(field);
        const value = element.value.trim();
        let isValid = true;

        switch (field) {
            case 'email':
                isValid = value !== '' && validateEmail(value);
                break;
            default:
                isValid = value !== '';
        }

        const errorMessage = getErrorMessage(field, value);
        showError(field, !isValid, errorMessage);
        return isValid;
    };

    // Add live region for form-level messages
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.classList.add('sr-only');
    form.appendChild(liveRegion);

    fields.forEach(field => {
        const element = document.getElementById(field);

        // Validate on blur
        element.addEventListener('blur', () => {
            validateField(field);
        });

        // Clear error on input
        element.addEventListener('input', () => {
            showError(field, false);
        });

        // Handle keyboard navigation
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && field !== 'message') {
                e.preventDefault();
                const currentIndex = fields.indexOf(field);
                const nextField = fields[currentIndex + 1];
                if (nextField) {
                    document.getElementById(nextField).focus();
                }
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = fields.every(field => validateField(field));

        if (isValid) {
            // Update live region with success message
            liveRegion.textContent = 'Message envoyé avec succès!';

            // Reset form after delay
            setTimeout(() => {
                form.reset();
                liveRegion.textContent = '';
                fields.forEach(field => {
                    showError(field, false);
                });
            }, 3000);
        } else {
            // Focus first invalid field
            const firstInvalidField = fields.find(field => !validateField(field));
            if (firstInvalidField) {
                const element = document.getElementById(firstInvalidField);
                element.focus();

                // Update live region with error message
                liveRegion.textContent = `Il y a des erreurs dans le formulaire. ${getErrorMessage(firstInvalidField)}`;
            }
        }
    });
});