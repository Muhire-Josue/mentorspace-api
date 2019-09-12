function setSectionHeight() {
    document.querySelector('section').style.height = `${window.innerHeight}px`;
};

window.addEventListener('DOMContentLoaded', function() {
    setSectionHeight();
});

window.addEventListener('resize', function() {
    setSectionHeight();
})
window.addEventListener('scroll', function() {
    setSectionHeight();
})