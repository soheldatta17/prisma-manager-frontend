// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already authenticated
    const userCookie = getCookie('user_data');
    if (userCookie) {
        // User is already logged in, redirect to main page
        window.location.href = '/main.html';
    }
});

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Cookie handling functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Form validation and API integration
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

// Helper function to show loading state
const setLoading = (form, isLoading) => {
    const submitBtn = form.querySelector('input[type="submit"]');
    if (isLoading) {
        submitBtn.value = "Loading...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
    } else {
        submitBtn.value = form.classList.contains("sign-up-form") ? "Join Team" : "Get in the Game";
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
    }
};

// Helper function to show error message
const showError = (message) => {
    alert(`�� ${message}`);
};

// Handle successful authentication
function handleAuthSuccess(data, isSignUp = true) {
    const userData = {
        userId: data.content.data.id,
        name: data.content.data.name,
        email: data.content.data.email,
        createdAt: data.content.data.created_at,
        token: data.content.meta.access_token
    };

    // Set cookie with user data (expires in 7 days)
    setCookie('user_data', userData, 7);
    
    console.log(`✅ ${isSignUp ? 'Registration' : 'Login'} successful:`, {
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        tokenReceived: true
    });
    
    // Show success message
    alert(`⚽ ${isSignUp ? 'Goal! Welcome to the team' : 'Welcome back'}, ${userData.name}! 🎉`);
    
    // Redirect to main page
    window.location.href = 'main.html';
}

signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = signUpForm.querySelector('input[type="password"]');
    const confirmPassword = signUpForm.querySelectorAll('input[type="password"]')[1];
    const name = signUpForm.querySelector('input[type="text"]').value;
    const email = signUpForm.querySelector('input[type="email"]').value;
    
    if (password.value !== confirmPassword.value) {
        showError("Own Goal! Passwords don't match. Try again!");
        return;
    }

    setLoading(signUpForm, true);
    
    console.log('📤 Signup Request:', {
        name,
        email,
        password: '********'
    });
    
    try {
        const response = await fetch('http://localhost:3000/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password: password.value
            })
        });

        const data = await response.json();
        
        console.log('📥 API Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: data
        });

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }

        if (data.status && data.content.meta.access_token) {
            handleAuthSuccess(data, true);
            signUpForm.reset();
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('❌ Error during signup:', error);
        showError(`Registration failed: ${error.message}`);
    } finally {
        setLoading(signUpForm, false);
    }
});

signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    setLoading(signInForm, true);
    
    console.log('📤 Signin Request:', {
        email,
        password: '********'
    });
    
    try {
        const response = await fetch('http://localhost:3000/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        
        console.log('📥 API Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: data
        });

        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }

        if (data.status && data.content.meta.access_token) {
            handleAuthSuccess(data, false);
            signInForm.reset();
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('❌ Error during signin:', error);
        showError(`Login failed: ${error.message}`);
    } finally {
        setLoading(signInForm, false);
    }
});

// Add some nice animations for input fields
const inputs = document.querySelectorAll(".input-field input");

inputs.forEach(input => {
    input.addEventListener("focus", () => {
        input.parentNode.classList.add("active");
        // Add a subtle ball animation
        input.style.transform = "translateX(5px)";
        setTimeout(() => {
            input.style.transform = "translateX(0)";
        }, 150);
    });
    
    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.parentNode.classList.remove("active");
        }
    });

    // Add validation styles
    input.addEventListener("input", () => {
        if (input.type === "email") {
            const isValid = input.checkValidity();
            input.parentNode.style.borderColor = isValid ? "#4481eb" : "#ff3860";
        }
    });
}); 