function toggleMobileMenu() {
    var mobileMenu = document.getElementById('primary-nav');
    mobileMenu.classList.toggle('mobile-nav--active');
}

const trigger = document.querySelector('#header .header__container__inner--mobile-nav-toggle');
// function for onkeypress - barrier free design
trigger.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
       toggleMobileMenu();
    }
});

window.addEventListener('load', function() {
    var triggerButton = document.getElementById('search-string-from-home');
    if(triggerButton){
    triggerButton.addEventListener('click', function() {
        storeSearchString();
    });
}
});

function storeSearchString() {
        var storedSearchString = document.getElementById("searchinput");
        localStorage.setItem("searchString", storedSearchString.value);
        window.location.href = "/archivalien-suche";
}

window.addEventListener('load', function() {
    getSearchString();
});

function getSearchString() {
        var searchInputField = document.getElementById("edit-portal-view-anonymus-rendered-item");
        var searchString = localStorage.getItem("searchString");

        if (searchString != "alreadySearchedThis" && searchString) {
            searchInputField.value = searchString;

            localStorage.setItem("searchString", "alreadySearchedThis");

            var submitBtn = document.getElementById('edit-submit-archivalien-suche-frei-ii');
            submitBtn.click();
        } else if (!searchString) {
            searchInputField.value = "";
        }
}

window.addEventListener('load', function() {
    var filterButton = document.querySelector('.sidebar--content__open');
    if(filterButton){
        var beforeFilter = document.querySelector('.view-filters');
        beforeFilter.appendChild(filterButton);
    }
});

function toggleSidebar() {
    var filter = document.querySelector('.sidebar--content');
    filter.classList.toggle('filter--active');
}