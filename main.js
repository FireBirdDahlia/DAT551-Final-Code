
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-------Important note: if background music doesn't immediately start playing when you run the server, delete either the function to play page sound or the function for the mute button. Hit CTRL-S, and then CTRL-Z to undo the changes. This will restart the the background music and make it play again.  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.addEventListener('DOMContentLoaded', function() {
    var flipbook = $('#flipbook');
    var pageTurnSound = document.getElementById('page-turn-sound'); // Reference to the audio element
    var backgroundMusic = document.getElementById('background-music');
    var muteToggle = document.getElementById('mute-toggle');


    // Check if Turn.js is loaded
    if (!flipbook.turn) {
        console.error("Turn.js is not loaded properly.");
        return;
    }

    // Initialize Turn.js
    flipbook.turn({
        width: 1500,
        height: 1000,
        autoCenter: true,
        when: {
            turning: function (event, page) {
                playPageTurnSound(); // Play sound when the page is turning
            }
        }
        
    });

    ////////////////////////////////// Navbar /////////////////////////////////

    // Navigation bar click event
    document.querySelectorAll('.navbar a').forEach(function(navItem) {
        navItem.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            var logicalPage = parseInt(this.getAttribute('data-page')); // Logical page number
            if (!isNaN(logicalPage)) {
                var turnPage = (logicalPage * 2) - 1; // Convert logical page to Turn.js page index
                console.log(`Navigating to logical page ${logicalPage}, Turn.js page ${turnPage}`);
                flipbook.turn('page', turnPage); // Navigate to the correct Turn.js page
                playPageTurnSound(); // Play sound on navbar navigation
            } else {
                console.error('Invalid page number:', logicalPage);
            }
        });
    });

    // Navigate to the back cover
    document.getElementById('back-cover').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        var totalPages = flipbook.turn('pages'); // Get total number of pages
        flipbook.turn('page', totalPages); // Navigate to the last page
    });
    
    
    ////////////////////////// Previous/Next Buttons //////////////////////////

    // Previous button functionality
    document.getElementById('prev-btn').addEventListener('click', function () {
        var currentPage = flipbook.turn('page'); // Get current page
        if (currentPage > 1) {
            flipbook.turn('previous'); // Go to the previous page
            updateNavbarHighlight(currentPage - 1); // Update navbar for the previous page
            playPageTurnSound(); // Play sound on previous button
        }
    });

    // Next button functionality
    document.getElementById('next-btn').addEventListener('click', function () {
        var currentPage = flipbook.turn('page'); // Get current page
        var totalPages = flipbook.turn('pages'); // Get total number of pages
        if (currentPage < totalPages) {
            flipbook.turn('next'); // Go to the next page
            updateNavbarHighlight(currentPage + 1); // Update navbar for the next page
            playPageTurnSound(); // Play sound on next button
        }
    });

    //////////////////// Utility to Play the Page Turn Sound /////////////////////

    function playPageTurnSound() {
        if (pageTurnSound) {
            pageTurnSound.currentTime = 0; // Rewind the audio to the start
            pageTurnSound.play().catch((error) => {
                console.error("Failed to play page turn sound:", error);
            });
        }
    }
    /////////////////////// Highlighting Navbar Buttons ////////////////////////

    // Highlight the active navbar link dynamically
    flipbook.bind('turning', function (event, page) {
        var totalPages = flipbook.turn('pages'); // Total number of pages
        var logicalPage = Math.ceil(page / 2); // Calculate the logical page number

        // Special case for the front cover (first page)
        if (page === 1) {
            highlightNavbar('front-page'); // Highlight the "Front Page" button
        } 
        // Special case for the back cover (last page)
        else if (page === totalPages) {
            highlightNavbar('back-cover'); // Highlight the "Back Cover" button
        } 
        // For all other pages
        else {
            highlightNavbar(logicalPage); // Highlight the corresponding logical page
        }
    });

    // Utility to highlight the active navbar link
    function highlightNavbar(activeId) {
        // Remove active class from all navbar links
        document.querySelectorAll('.navbar a').forEach(function (navItem) {
            navItem.classList.remove('active');
        });

        // Highlight the currently active navbar link
        var activeNavItem = typeof activeId === 'number' // If activeId is a number, find by logical page
            ? document.querySelector(`.navbar a[data-page="${activeId}"]`)
            : document.getElementById(activeId); // Otherwise, use the ID (e.g., "front-page" or "back-cover")

        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    ////////////////////////// Mute Button ///////////////////////////
    
    // Mute toggle button functionality
    muteToggle.addEventListener('click', function () {
        if (backgroundMusic.muted) {
            backgroundMusic.muted = false; // Unmute the music
            muteToggle.textContent = '🔊 Mute'; // Update button label
        } else {
            backgroundMusic.muted = true; // Mute the music
            muteToggle.textContent = '🔇 Unmute'; // Update button label
        }
    });
   

});
