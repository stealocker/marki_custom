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

    Drupal.behaviors.setSearchUrlParamFromHome = {

        attach: function (context, settings) {

            once('setSearchUrlParamFromHome', '#block-marki-custom-sucheinstieghome', context).forEach(function (sucheinstieghome) {
                const searchinput = sucheinstieghome.querySelector('input');
                const searchbutton = sucheinstieghome.querySelector('.button--search');
                const camerabutton = sucheinstieghome.querySelector('.button--camera');

                // SEARCHBUTTON
                function addSearchStringToUrl() {
                    var params = new URLSearchParams({ rendered_item: searchinput.value.trim() });
                    var searchUrl = 'https://marki.gnm.de/search/all?' + params.toString();
                    window.location.href = searchUrl;
                }

                searchbutton.addEventListener('click', function () {
                    addSearchStringToUrl();
                });

                searchbutton.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        addSearchStringToUrl();
                    }
                });

                // CAMERABUTTON
                function addCameraStringToUrl() {
                    var searchUrl = 'https://marki.gnm.de/search' + '?searchmethod=' + 'img';
                    window.location.href = searchUrl;
                }

                camerabutton.addEventListener('click', function () {
                    addCameraStringToUrl();
                });

                camerabutton.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        addCameraStringToUrl();
                    }
                });

                // OBACHT PFUSCH!!
                searchinput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        searchbutton.click();
                    }
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
                        cameraButton.className = 'button--camera button--camera--searchpage';

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

    Drupal.behaviors.addLinkToSearchHelp = {
        attach: function (context, settings) {
            once('addLinkToSearchHelp', '.search__help', context).forEach(function (searchHelp) {
                var overlayLink = document.createElement('a');
                overlayLink.classList.add('link--overlay');
                overlayLink.innerHTML = "";
                overlayLink.href = "https://marki.gnm.de/how-to-marki";

                searchHelp.insertBefore(overlayLink, searchHelp.children[0]);
            });
        }
    };

    Drupal.behaviors.toggleImgSearchFromButtonAndUrl = {

        attach: function (context, settings) {

            once('toggleImgSearchFromButtonAndUrl', '.views-exposed-form', context).forEach(function (viewExposedForm) {
                const params = new URLSearchParams(window.location.search);
                const paramSearchmethod = params.get('searchmethod');

                const searchHeader = document.querySelector('.header-wrapper--search');
                const cameraButton = viewExposedForm.querySelector('.button--camera');
                const fileInput = document.querySelector('#edit-query-image-upload');

                function toggleImgSearch(forceClose = false) {
                    const closeButton = document.querySelector('.button--close-imagesearchform');
                    const isInactive = searchHeader.classList.contains('search-header--inactive');
                    const shouldOpen = !forceClose && isInactive;

                    // Toggle visibility
                    searchHeader.classList.toggle('search-header--inactive', !shouldOpen);


                    // Move focus
                    if (shouldOpen) {
                        fileInput?.focus();
                    } else {
                        cameraButton?.focus(); // return focus to trigger
                    }

                    // Update trigger button state
                    cameraButton?.setAttribute('aria-expanded', String(shouldOpen));
                    cameraButton?.setAttribute('aria-controls', 'block-marki-custom-markisearchform');

                    setTimeout(() => {
                        closeButton?.addEventListener('click', () => toggleImgSearch(true));
                    }, 300);
                }

                // Hook up buttons
                cameraButton?.addEventListener('click', () => toggleImgSearch());
                setTimeout(() => {
                    const closeButton = document.querySelector('.button--close-imagesearchform');
                    closeButton?.addEventListener('click', () => toggleImgSearch(true));
                }, 300);


                if (paramSearchmethod == 'img') {
                    toggleImgSearch();
                }
            });
        }
    };

    Drupal.behaviors.addUploadedImageToSearch = {

        attach: function (context, settings) {

            once('addUploadedImageToSearch', 'html', context).forEach(function (html) {
                const url = new URL(window.location.href);
                const imagePath = url.searchParams.get('fs');

                const domain = 'https://marki.gnm.de';
                const cleanPath = imagePath.replace('/opt/drupal/web', '');


                const bodyWrapper = html.querySelector('.main-wrapper--body .content--aside-content');
                if (bodyWrapper && imagePath) {
                    var imageWrapper = document.createElement('div');
                    var imageDraggableWrapper = document.createElement('div');
                    var img = document.createElement('img');
                    var imgdescription = document.createElement('p');

                    var spacer = document.createElement('div');
                    spacer.classList.add('searched-img-spacer');

                    imageWrapper.classList.add('searched-img-wrapper');
                    imageDraggableWrapper.classList.add('searched-img-wrapper--draggable');
                    imgdescription.innerHTML = 'Ihr Bild';

                    img.src = domain + cleanPath;
                    imageWrapper.appendChild(imageDraggableWrapper);
                    imageDraggableWrapper.appendChild(imgdescription);
                    imageDraggableWrapper.appendChild(img);

                    bodyWrapper.insertBefore(imageWrapper, bodyWrapper.firstChild);

                    // Measure AFTER it's in the DOM
                    img.onload = () => {
                        const height = imageDraggableWrapper.getBoundingClientRect().height + 80;
                        spacer.style.height = `${height}px`;
                        bodyWrapper.insertBefore(spacer, imageWrapper.nextSibling);
                    };
                }
            });
        }
    };

    Drupal.behaviors.makeSearchedImgDraggable = {

        attach: function (context, settings) {

            once('makeSearchedImgDraggable', '.searched-img-wrapper', context).forEach(function (searchedImgWrapper) {
                // Make the DIV element draggable:
                dragElement(searchedImgWrapper);

                function dragElement(elmnt) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    if (elmnt.querySelector('searched-img-wrapper--draggable')) {
                        // if present, the header is where you move the DIV from:
                        elmnt.querySelector('searched-img-wrapper--draggable').onmousedown = dragMouseDown;
                    } else {
                        // otherwise, move the DIV from anywhere inside the DIV:
                        elmnt.onmousedown = dragMouseDown;
                    }

                    function dragMouseDown(e) {
                        e = e || window.event;
                        e.preventDefault();
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        document.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();

                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;

                        // Use getBoundingClientRect for fixed positioning
                        const rect = elmnt.getBoundingClientRect();
                        elmnt.style.top = (rect.top - pos2) + "px";
                        elmnt.style.left = (rect.left - pos1) + "px";
                    }

                    function closeDragElement() {
                        // stop moving when mouse button is released:
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }
                }
            });
        }
    };

    Drupal.behaviors.hideEmptyAccordions = {
        attach: function (context, settings) {
            once('hideEmptyAccordions', '.accordion-item', context).forEach(function (accordionItem) {
                const content = accordionItem.querySelector('.accordion-item__content');
                if (content && content.innerHTML.trim() === '') {
                    accordionItem.style.display = 'none';
                }
            });
        }

    };

    Drupal.behaviors.rearrangeMiradorOnEntityPage = {
        attach: function (context, settings) {
            once('rearrangeMiradorOnEntityPage', '.view-entity-content', context).forEach(function (entity) {
                const viewMirador = entity.querySelector('.views-field-view');
                const viewContent = entity.querySelector('.views-field-rendered-solr-external-display');

                const miradorContainer = viewContent.querySelector('.entity__img');

                if (viewMirador) {
                    miradorContainer.appendChild(viewMirador);
                }
            });
        }
    };

    Drupal.behaviors.sidebarToggle = {
        attach: function (context, settings) {
            once('sidebarToggle', '.main-wrapper__container--sidebar', context).forEach(function (container) {

                const sidebar = container.querySelector('.sidebar--content');

                if (!sidebar) return;

                const btn = document.createElement('button');
                btn.classList.add('sidebar-toggle-btn');
                btn.setAttribute('aria-expanded', 'false');
                btn.setAttribute('aria-controls', 'sidebar-content');
                btn.textContent = Drupal.t('Filter ausklappen');

                sidebar.setAttribute('id', 'sidebar-content');
                document.body.appendChild(btn);

                btn.addEventListener('click', function () {
                    const isOpen = sidebar.classList.toggle('is-open');
                    btn.classList.toggle('is-active', isOpen);
                    btn.setAttribute('aria-expanded', String(isOpen));
                    btn.textContent = isOpen ? Drupal.t('Filter einklappen') : Drupal.t('Filter ausklappen');
                });

                document.addEventListener('click', function (e) {
                    if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
                        sidebar.classList.remove('is-open');
                        btn.classList.remove('is-active');
                        btn.setAttribute('aria-expanded', 'false');
                        btn.textContent = Drupal.t('Show info');
                    }
                });
            });
        }
    };

})(jQuery, Drupal, drupalSettings, once);
