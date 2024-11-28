// Create an initial mock "database" for users and roles (username, password, role)
const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'manager', password: 'manager123', role: 'manager' },
    { username: 'user', password: 'user123', role: 'user' }
];

// Simulate storing user data (for user name and role)
let usersData = JSON.parse(localStorage.getItem('usersData')) || [];

// Show the signup form
function showSignupForm() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('signupSection').classList.remove('hidden');
}

// Hide the signup form and return to login
function cancelSignup() {
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// Create a new account
function createAccount() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    // Check if the user already exists in the usersDatabase
    const userExists = usersDatabase.find(user => user.username === username);

    if (userExists) {
        document.getElementById('signupError').style.display = 'block';
        return;
    }

    // Create new user
    const newUser = { username: username, password: password, role: role };
    usersDatabase.push(newUser); // Add new user to the database
    localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase)); // Save to localStorage

    // Return to the login section
    cancelSignup();
    alert("Account created successfully! Please log in.");
}

// Login function that checks credentials
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Check if the user exists in the "database"
    const user = usersDatabase.find(user => user.username === username && user.password === password && user.role === role);

    // If no matching user found, show error message
    if (!user) {
        document.getElementById('loginError').style.display = 'block';
        return;
    }

    // Hide login section and show the respective portal
    document.getElementById('loginSection').classList.add('hidden');
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('role', role);
    showPortal(role);
}

// Show the portal based on the logged-in user's role
function showPortal(role) {
    // Hide all portals
    document.getElementById('adminPortal').classList.add('hidden');
    document.getElementById('managerPortal').classList.add('hidden');
    document.getElementById('userPortal').classList.add('hidden');

    // Show the portal based on the role
    if (role === 'admin') {
        document.getElementById('adminPortal').classList.remove('hidden');
    } else if (role === 'manager') {
        document.getElementById('managerPortal').classList.remove('hidden');
        showUserList();
    } else if (role === 'user') {
        document.getElementById('userPortal').classList.remove('hidden');
        showUserInfo();
    }
}

// Admin functionality to update user roles
function updateUserRole() {
    const username = document.getElementById('updateUsername').value;
    const newRole = document.getElementById('updateRole').value;

    if (!username || !newRole) {
        alert("Please enter a valid username and select a role.");
        return;
    }

    // Find the user to update
    const userIndex = usersDatabase.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        alert("User not found.");
        return;
    }

    // Update user role
    usersDatabase[userIndex].role = newRole;
    localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase)); // Save to localStorage

    alert("User role updated successfully!");
}

// Manager functionality to view users' information
function showUserList() {
    let userListHtml = '';
    usersDatabase.forEach(user => {
        userListHtml += `<p>User: ${user.username}, Role: ${user.role}</p>`;
    });
    document.getElementById('userListManager').innerHTML = userListHtml;
}

// User functionality to view and update own information
function updateOwnData() {
    const username = sessionStorage.getItem('username');
    const newUserInfo = document.getElementById('newUserInfo').value;

    if (!newUserInfo) {
        alert("Please enter a valid new data.");
        return;
    }

    const user = usersDatabase.find(u => u.username === username);
    
    if (user) {
        user.username = newUserInfo;

        // Save the updated data to localStorage
        localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
        alert("Your data has been updated!");
        showUserInfo();  // Refresh the user info
    }
}

// Show user info for users
function showUserInfo() {
    const username = sessionStorage.getItem('username');
    const user = usersDatabase.find(u => u.username === username);

    if (user) {
        document.getElementById('userInfo').innerHTML = `
            <p>Your Username: ${user.username}</p>
            <p>Your Role: ${user.role}</p>
        `;
    } else {
        document.getElementById('userInfo').innerHTML = "<p>No data found for this user.</p>";
    }
}

// Logout function
function logout() {
    // Clear sessionStorage
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');

    // Hide portals and show the login section
    document.getElementById('adminPortal').classList.add('hidden');
    document.getElementById('managerPortal').classList.add('hidden');
    document.getElementById('userPortal').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}
