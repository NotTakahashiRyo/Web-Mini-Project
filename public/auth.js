// Handle registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        aadharNumber: e.target.aadharNumber.value
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred');
    }
});

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred');
    }
});