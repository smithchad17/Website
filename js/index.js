const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
})