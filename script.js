document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const fields = ['name', 'email', 'subject', 'message'];

    const showError = (fieldId, show) => {
        const errorElement = document.getElementById(`${fieldId}Error`);
        const inputElement = document.getElementById(fieldId);

        errorElement.style.display = show ? 'block' : 'none';

        if (show) {
            inputElement.setAttribute('aria-invalid', 'true');
        } else {
            inputElement.removeAttribute('aria-invalid');
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (field) => {
        const element = document.getElementById(field);
        const value = element.value.trim();
        let isValid = true;

        switch (field) {
            case 'email':
                isValid = validateEmail(value);
                break;
            default:
                isValid = value !== '';
        }

        showError(field, !isValid);
        return isValid;
    };

    fields.forEach(field => {
        const element = document.getElementById(field);

        element.addEventListener('blur', () => validateField(field));
        element.addEventListener('input', () => showError(field, false));

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && field !== 'message') {
                e.preventDefault();
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = fields.every(field => validateField(field));

        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.setAttribute('role', 'alert');
            successMessage.setAttribute('aria-live', 'polite');
            successMessage.textContent = 'Message envoyé avec succès!';
            form.appendChild(successMessage);

            setTimeout(() => {
                form.reset();
                successMessage.remove();

                fields.forEach(field => {
                    const element = document.getElementById(field);
                    element.removeAttribute('aria-invalid');
                });
            }, 3000);
        } else {
            const firstInvalidField = fields.find(field => !validateField(field));
            if (firstInvalidField) {
                document.getElementById(firstInvalidField).focus();
            }
        }
    });
});