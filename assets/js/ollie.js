/*!
=========================================================
* Ollie Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// portfolio carousel
$('#owl-portfolio').owlCarousel({
    margin:30,
    dots: false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:4,
            nav:false,
            loop:false
        }
    }
});

// testmonial carousel
$('#owl-testmonial').owlCarousel({
    center: true,
    items:1,
    loop:true,
    nav: true,
    dots: false
})


// Function to toggle the card's expanded state
function toggleCard(event, card) {
    // Check if the clicked element is a link or a tab
    if (event.target.tagName === 'A' || event.target.classList.contains('tab-link')) {
        return; // Prevent collapsing when interacting with links or tabs
    }

    card.classList.toggle('expanded');
}

// Function to show the corresponding tab content
function showTab(event, tabElement, tabId) {
    // Prevent the card from collapsing when clicking a tab
    event.stopPropagation();

    const cardContent = tabElement.closest('.card-content');

    // Get all tab links and tab content elements
    var tabs = cardContent.getElementsByClassName('tab-link');
    var contents = cardContent.getElementsByClassName('tab-content');

    // Remove the 'active' class from all tab links and hide all tab content
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
        contents[i].style.display = 'none';
    }

    // Add 'active' class to the clicked tab and show the corresponding content
    tabElement.classList.add('active');
    const targetContent = cardContent.querySelector(`#${tabId}`);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}
