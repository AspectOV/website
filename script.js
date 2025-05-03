// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Simple theme toggle with localStorage
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check if user has a saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.textContent = 'Switch to Light Mode';
        }
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            // Update button text
            themeToggle.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            
            // Save preference to localStorage
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Get the current year for the footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});