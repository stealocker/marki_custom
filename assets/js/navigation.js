/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu and enables TAB key navigation support.
 */
(function ($, Drupal, drupalSettings, once) {

    Drupal.behaviors.menuToggle = {

        attach: function (context, settings) {

            // Only <button> triggers: same class on <a> (e.g. projects page-title link) must navigate.

            once('menuToggle', 'html', context).forEach(function () {
                console.log('menuToggle behavior attached');

                const siteNavigation = document.getElementById('site-header');

                // Return early if the navigation doesn't exist.
                if (!siteNavigation) {
                    return;
                }

                const button = document.getElementById('menu-toggle');
                const button_img = button ? button.querySelector('img') : null;
                const menu_overlay = document.querySelector('.navigation-overlay');

                // Return early if the button or overlay doesn't exist.
                if (!button || !button_img || !menu_overlay) {
                    return;
                }

                function toggleMenu() {
                    const isOpen = button.getAttribute('aria-expanded') === 'true';

                    siteNavigation.classList.toggle('toggled');
                    button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
                    menu_overlay.classList.toggle('navigation-overlay--hidden', isOpen);
                    menu_overlay.classList.toggle('navigation-overlay--open', !isOpen);
                    button_img.src = drupalSettings.marki_custom.theme_path + (isOpen ? '/assets/img/menu-hamburger.svg' : '/assets/img/menu-close.svg');
                }

                button.addEventListener('click', toggleMenu);

                button.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        toggleMenu();
                    }
                });
            });

        }

    };

})(jQuery, Drupal, drupalSettings, once);