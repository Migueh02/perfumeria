// Initialize all carousels when the document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Initialize circular carousel
    initCircularCarousel();
    
    // Initialize Novedades carousel
    initNovedadesCarousel();

    // Initialize Best Seller tabs
    initBestSellerTabs();
});

// Circular Carousel
function initCircularCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.icon-item');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    let currentIndex = 0;
    const itemWidth = 230; // 200px del item + 30px de gap
    const visibleItems = Math.floor(track.offsetWidth / itemWidth);
    const maxIndex = items.length - visibleItems;

    function updateCarousel() {
        track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
    }

    prevButton.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateCarousel();
    });

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        const newVisibleItems = Math.floor(track.offsetWidth / itemWidth);
        const newMaxIndex = items.length - newVisibleItems;
        currentIndex = Math.min(currentIndex, newMaxIndex);
        updateCarousel();
    });
}

// Novedades Carousel
function initNovedadesCarousel() {
    const track = document.querySelector('.novedades .carousel-track');
    const prevButton = document.querySelector('.novedades .carousel-arrow.prev');
    const nextButton = document.querySelector('.novedades .carousel-arrow.next');
    const items = track.querySelectorAll('.product-card');

    if (!track || !prevButton || !nextButton || items.length === 0) return;

    let currentPosition = 0;
    const itemWidth = items[0].offsetWidth + 20; // Include margin
    const totalItems = items.length;
    let itemsPerView = calculateItemsPerView();

    function calculateItemsPerView() {
        if (window.innerWidth > 1200) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    function updateCarouselPosition() {
        track.style.transform = `translateX(${currentPosition}px)`;
    }

    function moveCarousel(direction) {
        const maxPosition = -(Math.max(0, totalItems - itemsPerView) * itemWidth);
        
        if (direction === 'next') {
            currentPosition = Math.max(maxPosition, currentPosition - (itemWidth * itemsPerView));
        } else {
            currentPosition = Math.min(0, currentPosition + (itemWidth * itemsPerView));
        }
        
        updateCarouselPosition();
        updateButtonStates();
    }

    function updateButtonStates() {
        const maxPosition = -(Math.max(0, totalItems - itemsPerView) * itemWidth);
        prevButton.style.opacity = currentPosition < 0 ? '1' : '0.5';
        nextButton.style.opacity = currentPosition > maxPosition ? '1' : '0.5';
    }

    // Event Listeners
    nextButton.addEventListener('click', () => moveCarousel('next'));
    prevButton.addEventListener('click', () => moveCarousel('prev'));

    window.addEventListener('resize', () => {
        itemsPerView = calculateItemsPerView();
        currentPosition = 0;
        updateCarouselPosition();
        updateButtonStates();
    });

    // Initial setup
    updateButtonStates();
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
