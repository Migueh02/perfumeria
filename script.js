// Initialize all carousels when the document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize circular carousel
    initCircularCarousel();
    
    // Initialize Novedades carousel
    initNovedadesCarousel();

    // Initialize Best Seller tabs
    initBestSellerTabs();
});

// Circular Carousel
function initCircularCarousel() {
    const track = document.querySelector('.use-products .carousel-track');
    const items = track.querySelectorAll('.icon-item');
    const prevButton = document.querySelector('.use-products .carousel-arrow.prev');
    const nextButton = document.querySelector('.use-products .carousel-arrow.next');
    
    if (!track || !items.length || !prevButton || !nextButton) return;

    let currentIndex = 0;
    let itemsPerView = 3;

    function updateItemsPerView() {
        if (window.innerWidth <= 768) {
            itemsPerView = 1;
        } else if (window.innerWidth <= 992) {
            itemsPerView = 2;
        } else {
            itemsPerView = 3;
        }
    }

    function updateCarousel() {
        const slideAmount = -(currentIndex * (100 / itemsPerView));
        track.style.transform = `translateX(${slideAmount}%)`;
        
        // Actualizar estado de los botones
        prevButton.classList.toggle('disabled', currentIndex <= 0);
        nextButton.classList.toggle('disabled', currentIndex >= items.length - itemsPerView);
    }

    function moveCarousel(direction) {
        if (direction === 'next' && currentIndex < items.length - itemsPerView) {
            currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        }
        updateCarousel();
    }

    // Event Listeners
    prevButton.addEventListener('click', () => {
        if (!prevButton.classList.contains('disabled')) {
            moveCarousel('prev');
        }
    });

    nextButton.addEventListener('click', () => {
        if (!nextButton.classList.contains('disabled')) {
            moveCarousel('next');
        }
    });

    // Resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateItemsPerView();
            // Ajustar el índice actual si es necesario
            currentIndex = Math.min(currentIndex, items.length - itemsPerView);
            updateCarousel();
        }, 250);
    });

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // Mínimo desplazamiento para considerar como swipe
            if (diff > 0 && currentIndex < items.length - itemsPerView) {
                moveCarousel('next');
            } else if (diff < 0 && currentIndex > 0) {
                moveCarousel('prev');
            }
        }
    }, { passive: true });

    // Inicialización
    updateItemsPerView();
    updateCarousel();
}

// Novedades Carousel
function initNovedadesCarousel() {
    const track = document.querySelector('.novedades .carousel-track');
    const prevButton = document.querySelector('.novedades .carousel-arrow.prev');
    const nextButton = document.querySelector('.novedades .carousel-arrow.next');
    const items = track.querySelectorAll('.product-card');

    if (!track || !prevButton || !nextButton || items.length === 0) return;

    let currentIndex = 0;
    let itemsPerView = getItemsPerView();

    function getItemsPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1200) return 4;
        return 3;
    }

    function updateCarousel() {
        const translateX = -(currentIndex * (103 / itemsPerView));
        track.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar estado de los botones
        prevButton.classList.toggle('disabled', currentIndex <= 0);
        nextButton.classList.toggle('disabled', currentIndex >= items.length - itemsPerView);
    }

    function moveCarousel(direction) {
        const maxIndex = Math.max(0, items.length - itemsPerView);
        
        if (direction === 'next' && currentIndex < maxIndex) {
            currentIndex = Math.min(maxIndex, currentIndex + itemsPerView);
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - itemsPerView);
        }
        
        updateCarousel();
    }

    // Event Listeners
    prevButton.addEventListener('click', () => {
        if (!prevButton.classList.contains('disabled')) {
            moveCarousel('prev');
        }
    });

    nextButton.addEventListener('click', () => {
        if (!nextButton.classList.contains('disabled')) {
            moveCarousel('next');
        }
    });

    // Responsive handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newItemsPerView = getItemsPerView();
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                currentIndex = 0;
                updateCarousel();
            }
        }, 250);
    });

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                moveCarousel('next');
            } else {
                moveCarousel('prev');
            }
        }
    }, { passive: true });

    // Inicialización
    updateCarousel();
}

// Best Seller Tabs
function initBestSellerTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Here you would typically handle showing/hiding products
            // based on the selected category (hombre/mujer)
            const category = button.dataset.category;
            // For now, we'll just log the category
            console.log('Selected category:', category);
        });
    });
}

// Product filter and sort functionality
document.addEventListener('DOMContentLoaded', function() {
    // View switching
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productsGrid = document.querySelector('.products-grid');

    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            productsGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function() {
            productsGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }

    // Filter functionality
    const filters = document.querySelectorAll('.filter-dropdown select');
    const sortSelect = document.querySelector('#sort');
    const productCards = document.querySelectorAll('.product-card');

    function applyFilters() {
        const category = document.querySelector('#category').value;
        const price = document.querySelector('#price').value;
        const brand = document.querySelector('#brand').value;
        const sort = sortSelect.value;

        productCards.forEach(card => {
            const cardBrand = card.querySelector('.product-brand').textContent.toLowerCase();
            const cardPrice = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
            let isVisible = true;

            // Apply category filter
            if (category && !card.classList.contains(category)) {
                isVisible = false;
            }

            // Apply brand filter
            if (brand && cardBrand !== brand.toLowerCase()) {
                isVisible = false;
            }

            // Apply price filter
            if (price) {
                const [min, max] = price.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
                if (cardPrice < min || cardPrice > max) {
                    isVisible = false;
                }
            }

            card.style.display = isVisible ? '' : 'none';
        });

        // Apply sorting
        const sortedCards = Array.from(productCards);
        sortedCards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));

            switch (sort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return a.querySelector('.product-tag')?.textContent === 'Nuevo' ? -1 : 1;
                default: // featured
                    return 0;
            }
        });

        // Reorder cards in the grid
        const grid = document.querySelector('.products-grid');
        sortedCards.forEach(card => grid.appendChild(card));
    }

    // Add event listeners to filters and sort
    filters.forEach(filter => filter.addEventListener('change', applyFilters));
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Quick view functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const productName = card.querySelector('.product-name').textContent;
            const productBrand = card.querySelector('.product-brand').textContent;
            const productPrice = card.querySelector('.product-price').textContent;
            const productImage = card.querySelector('.product-image img').src;
            
            // Here you would typically open a modal with the product details
            // For now, we'll redirect to the product detail page
            window.location.href = `detalle-producto.html?product=${encodeURIComponent(productName)}`;
        });
    });
});

// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Category switching
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqContents = document.querySelectorAll('.faq-content');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected category content
            faqContents.forEach(content => {
                if (content.id === category) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const wasActive = faqItem.classList.contains('active');
            
            // Close all other items
            const siblingItems = faqItem.parentElement.children;
            Array.from(siblingItems).forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!wasActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    // Add overlay div if it doesn't exist
    let menuOverlay = document.querySelector('.menu-overlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    // Hamburger menu toggle
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Handle mobile dropdown
    const contactDropdown = document.querySelector('.contact-dropdown');
    const contactLink = contactDropdown.querySelector('a');

    if (window.innerWidth <= 768) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            contactDropdown.classList.toggle('show');
            contactDropdown.classList.toggle('active');
        });
    }

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function() {
        closeMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Function to close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        mainNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        // Close any open dropdowns
        const dropdowns = document.querySelectorAll('.contact-dropdown');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Prevent clicks inside mobile menu from closing it
    mainNav.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});
