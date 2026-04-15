/**
 * File scripts.js.
 *
 * Handles toggling the accordions and enables TAB key navigation support.
 */
(function ($, Drupal, drupalSettings, once) {

    Drupal.behaviors.accordionToggle = {

        attach: function (context, settings) {

            once('accordionToggle', '.accordion-item', context).forEach(function (accordionItem) {
                const trigger = accordionItem.querySelector('.accordion__trigger');
                const content = accordionItem.querySelector('.accordion-item__content');
                const titleElement = accordionItem.querySelector('.accordion-item__title');
                const titleText = titleElement ? titleElement.textContent.trim() : '';

                if (!trigger || !content) {
                    return;
                }

                if (!trigger.id) {
                    trigger.id = 'accordion__trigger-' + Math.random().toString(36).slice(2, 10);
                }

                if (!content.id) {
                    content.id = 'accordion__content-' + Math.random().toString(36).slice(2, 10);
                }

                const icon = trigger.querySelector('img');
                const plusIcon = drupalSettings.marki_custom.theme_path + '/assets/img/accordion-plus.svg';
                const minusIcon = drupalSettings.marki_custom.theme_path + '/assets/img/accordion-minus.svg';
                const isClosed = accordionItem.classList.contains('accordion--closed');

                trigger.type = 'button';
                trigger.setAttribute('aria-controls', content.id);
                trigger.setAttribute('aria-label', titleText ? 'Toggle accordion section: ' + titleText : 'Toggle accordion section');
                accordionItem.setAttribute('aria-expanded', isClosed ? 'false' : 'true');
                trigger.setAttribute('aria-expanded', accordionItem.getAttribute('aria-expanded'));
                content.setAttribute('aria-labelledby', trigger.id);
                content.setAttribute('role', 'region');
                content.hidden = isClosed;

                function updateAccordionState(isOpen) {
                    accordionItem.classList.toggle('accordion--closed', !isOpen);
                    accordionItem.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    content.hidden = !isOpen;

                    if (icon) {
                        icon.src = isOpen ? minusIcon : plusIcon;
                    }
                }

                trigger.addEventListener('click', function () {
                    updateAccordionState(trigger.getAttribute('aria-expanded') !== 'true');
                });

                trigger.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        updateAccordionState(trigger.getAttribute('aria-expanded') !== 'true');
                    }
                });
            });

        }

    };

})(jQuery, Drupal, drupalSettings, once);