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
        tabs[i].setAttribute('aria-selected', 'false');
        tabs[i].tabIndex = -1;
        contents[i].style.display = 'none';
    }

    // Add 'active' class to the clicked tab and show the corresponding content
    tabElement.classList.add('active');
    tabElement.setAttribute('aria-selected', 'true');
    tabElement.tabIndex = 0;
    const targetContent = cardContent.querySelector(`#${tabId}`);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

document.querySelectorAll('[role="tablist"]').forEach(function(tabList) {
    tabList.addEventListener('keydown', function(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            return;
        }

        var tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
        var currentIndex = tabs.indexOf(document.activeElement);
        if (currentIndex < 0) {
            return;
        }

        event.preventDefault();
        var nextIndex = event.key === 'Home' ? 0 :
            event.key === 'End' ? tabs.length - 1 :
            (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
    });
});
