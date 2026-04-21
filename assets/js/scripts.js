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

    Drupal.behaviors.rearrangeContactPage = {
        attach: function (context, settings) {
            once('rearrangeContactPage', '.layout--contactpage', context).forEach(function (section) {
                const form = section.closest('.contact-form');
                if (!form) return;

                // Move the h1 before the form if it's inside
                const h1 = form.querySelector('.contactpage__title');
                if (h1) {
                    form.parentNode.insertBefore(h1, form);
                }

                const contactFormDiv = section.querySelector('.contactpage__form');
                const contentDiv = section.querySelector('.contactpage__content');
                const nameWrapper = form.querySelector('#edit-name-wrapper');
                const mailWrapper = form.querySelector('#edit-mail-wrapper');
                const actionsDiv = form.querySelector('#edit-actions');

                // Detach the section from the form
                form.removeChild(section);

                // Move the section after the form
                form.parentNode.insertBefore(section, form.nextSibling);

                // Wrap the form in a .contactpage__form div
                const formWrapper = document.createElement('div');
                formWrapper.className = 'contactpage__form';

                // Move non-field content from contactFormDiv to formWrapper
                const children = Array.from(contactFormDiv.children);
                children.forEach(child => {
                    if (!child.classList.contains('js-form-wrapper')) {
                        formWrapper.appendChild(child);
                    }
                });

                // Append the form to formWrapper
                formWrapper.appendChild(form);

                // Insert formWrapper into section before contentDiv
                section.insertBefore(formWrapper, contentDiv);

                // Move the field wrappers from contactFormDiv to the form
                const fields = contactFormDiv.querySelectorAll('.js-form-wrapper');
                fields.forEach(field => form.appendChild(field));

                // Remove the empty contactFormDiv
                contactFormDiv.remove();

                // Reorder the form items: name, mail, subject, message, dsgvo+actions
                const subjectWrapper = form.querySelector('#edit-subject-wrapper');
                const messageWrapper = form.querySelector('#edit-message-wrapper');
                const dsgvoWrapper = form.querySelector('#edit-field-contactform-dsgvo-wrapper');

                // Create a wrapper for dsgvo and actions
                const submitWrapper = document.createElement('div');
                submitWrapper.className = 'contactpage__dsgvo-submit-wrapper';

                // Move dsgvo and actions into the wrapper
                if (dsgvoWrapper) {
                    submitWrapper.appendChild(dsgvoWrapper);
                }
                if (actionsDiv) {
                    submitWrapper.appendChild(actionsDiv);
                }

                const order = [nameWrapper, mailWrapper, subjectWrapper, messageWrapper, submitWrapper];
                order.forEach(el => {
                    if (el) form.appendChild(el);
                });
            });
        }
    };

    Drupal.behaviors.rearrangeViewsForm = {
        attach: function (context, settings) {
            once('rearrangeViewsForm', '.views-exposed-form', context).forEach(function (viewsForm) {
                const targetContainer = context.querySelector('.region--page-header .block__content');
                if (!targetContainer) {
                    return;
                }

                if (targetContainer.querySelector('.search__form .views-exposed-form')) {
                    return;
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'search__form content-container';

                const textInput = viewsForm.querySelector('.form-text');
                if (textInput) {
                    textInput.placeholder = 'Suchbegriff hier eingeben';
                }

                const actionsDiv = viewsForm.querySelector('#edit-actions--2');
                if (actionsDiv) {

                    const input = actionsDiv.querySelector('input[type="submit"]');
                    if (input && !input.classList.contains('button--search')) {
                        input.classList.add('button--search');
                    }

                    const existingCameraButton = viewsForm.querySelector('.button--camera');
                    if (!existingCameraButton) {
                        const cameraButton = document.createElement('button');
                        cameraButton.type = 'button';
                        cameraButton.className = 'button--camera';

                        const cameraIcon = document.createElement('img');
                        cameraIcon.src = drupalSettings.marki_custom.theme_path + '/assets/img/camera.svg';
                        cameraIcon.alt = 'icon camera';

                        cameraButton.appendChild(cameraIcon);
                        actionsDiv.parentNode.insertBefore(cameraButton, actionsDiv.nextSibling);
                    }
                }

                wrapper.appendChild(viewsForm);
                targetContainer.appendChild(wrapper);
            });
        }
    };

})(jQuery, Drupal, drupalSettings, once);


