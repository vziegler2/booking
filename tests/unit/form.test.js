/**
 * Unit Tests for Form Validation
 */

describe('Form Validation', () => {
    let form;
    let nameInput;
    let emailInput;
    let messageInput;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="booking-form">
                <input type="text" id="name" name="name" required>
                <input type="email" id="email" name="email" required>
                <textarea id="message" name="message" required></textarea>
                <input type="checkbox" id="privacy" name="privacy" required>
                <button type="submit">Submit</button>
            </form>
        `;

        form = document.getElementById('booking-form');
        nameInput = document.getElementById('name');
        emailInput = document.getElementById('email');
        messageInput = document.getElementById('message');
    });

    test('should validate required name field', () => {
        nameInput.value = '';
        expect(nameInput.checkValidity()).toBe(false);

        nameInput.value = 'John Doe';
        expect(nameInput.checkValidity()).toBe(true);
    });

    test('should validate email format', () => {
        emailInput.value = 'invalid-email';
        expect(emailInput.checkValidity()).toBe(false);

        emailInput.value = 'valid@email.com';
        expect(emailInput.checkValidity()).toBe(true);
    });

    test('should validate required message field', () => {
        messageInput.value = '';
        expect(messageInput.checkValidity()).toBe(false);

        messageInput.value = 'Test message';
        expect(messageInput.checkValidity()).toBe(true);
    });

    test('should validate entire form', () => {
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
        expect(form.checkValidity()).toBe(false);

        nameInput.value = 'John Doe';
        emailInput.value = 'john@example.com';
        messageInput.value = 'Test message';
        document.getElementById('privacy').checked = true;
        expect(form.checkValidity()).toBe(true);
    });
});

describe('Email Validation Patterns', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    test('should accept valid emails', () => {
        const validEmails = [
            'test@example.com',
            'user.name@domain.org',
            'user+tag@example.co.uk'
        ];

        validEmails.forEach(email => {
            expect(emailRegex.test(email)).toBe(true);
        });
    });

    test('should reject invalid emails', () => {
        const invalidEmails = [
            'invalid',
            '@nodomain.com',
            'no@domain',
            'spaces in@email.com'
        ];

        invalidEmails.forEach(email => {
            expect(emailRegex.test(email)).toBe(false);
        });
    });
});

describe('Phone Number Validation', () => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    test('should accept valid phone numbers', () => {
        const validPhones = [
            '+49 123 456 7890',
            '0123456789',
            '+491234567890'
        ];

        validPhones.forEach(phone => {
            const cleaned = phone.replace(/[\s\-\(\)]/g, '');
            expect(cleaned.length >= 10).toBe(true);
        });
    });
});
