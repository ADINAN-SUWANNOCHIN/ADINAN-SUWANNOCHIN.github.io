document.addEventListener('DOMContentLoaded', function () {

    // --- Page Navigation Logic ---
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const pages = document.querySelectorAll('[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const clickedPage = this.textContent.toLowerCase().trim();
            pages.forEach(page => {
                page.classList.toggle('active', page.dataset.page === clickedPage);
            });
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            window.scrollTo(0, 0);
        });
    });

    // --- Portfolio Filter Logic ---
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    const projectItems = document.querySelectorAll('[data-filter-item]');
    let lastClickedFilterBtn = filterBtns[0];

    if (lastClickedFilterBtn) {
        const filterProjects = () => {
            const selectedCategory = lastClickedFilterBtn.textContent.toLowerCase().trim();
            projectItems.forEach(item => {
                const isVisible = selectedCategory === 'all' || item.dataset.category.toLowerCase().trim() === selectedCategory;
                item.classList.toggle('active', isVisible);
            });
        };
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                lastClickedFilterBtn.classList.remove('active');
                this.classList.add('active');
                lastClickedFilterBtn = this;
                filterProjects();
            });
        });
    }

    // --- Typing Animation Logic ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const words = ["Developer", "Problem Solver", "Creative Thinker"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        const type = () => {
            const currentWord = words[wordIndex];
            let typeSpeed = isDeleting ? 100 : 150;
            typingText.innerHTML = currentWord.substring(0, charIndex += isDeleting ? -1 : 1);
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, typeSpeed);
        };
        type();
    }

    // --- Accordion Logic for Education ---
    const accordionBtns = document.querySelectorAll('[data-accordion-btn]');
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            const details = this.closest('.timeline-item').querySelector('[data-accordion]');
            details?.classList.toggle('active');
        });
    });

    // --- Modal & Slideshow Logic (Updated) ---
    const modalBtns = document.querySelectorAll('[data-modal-btn]');
    const modalCloseBtns = document.querySelectorAll('[data-modal-close-btn]');
    const overlay = document.querySelector('[data-modal-overlay]');
    let activeSlideshowInterval = null;

    const startSlideshow = (modal) => {
        stopSlideshow(); // Clear any existing interval first
        const slideshow = modal.querySelector('.modal-slideshow');
        if (!slideshow) return;
        const images = slideshow.querySelectorAll('img');
        if (images.length <= 1) return;

        let currentIndex = Math.floor(slideshow.scrollLeft / slideshow.offsetWidth);
        activeSlideshowInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            slideshow.scrollTo({
                left: slideshow.offsetWidth * currentIndex,
                behavior: 'smooth'
            });
        }, 3000); // Change image every 3 seconds
    };

    const stopSlideshow = () => {
        clearInterval(activeSlideshowInterval);
    };

    const openModal = (modalId) => {
        const modal = document.querySelector(`[data-modal="${modalId}"]`);
        if (modal) {
            overlay.classList.add('active');
            modal.classList.add('active');
            startSlideshow(modal);
        }
    };

    const closeModal = () => {
        stopSlideshow();
        overlay.classList.remove('active');
        document.querySelectorAll('.modal-container.active').forEach(modal => {
            modal.classList.remove('active');
        });
    };

    modalBtns.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.modalBtn)));
    modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

    // Add pause/play on hover for all slideshows
    document.querySelectorAll('.modal-slideshow').forEach(slideshow => {
        slideshow.addEventListener('mouseenter', stopSlideshow);
        slideshow.addEventListener('mouseleave', () => {
            const modal = slideshow.closest('.modal-container');
            if (modal && modal.classList.contains('active')) {
                startSlideshow(modal);
            }
        });
    });

    // --- Manual Slideshow for Activity Page ---
    const activitySlideshows = document.querySelectorAll('.activity-item .activity-img');

    activitySlideshows.forEach(slideshowContainer => {
        const wrapper = slideshowContainer.querySelector('.slideshow-wrapper');
        const prevBtn = slideshowContainer.querySelector('[data-slide-btn="prev"]');
        const nextBtn = slideshowContainer.querySelector('[data-slide-btn="next"]');
        
        // ตรวจสอบว่ามี element ครบหรือไม่
        if (!wrapper || !prevBtn || !nextBtn) return;

        const images = wrapper.querySelectorAll('img');
        if (images.length <= 1) {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
            return;
        }

        const updateButtons = () => {
            const slideWidth = wrapper.clientWidth;
            // การคำนวณตำแหน่ง scroll ที่แม่นยำขึ้น
            const scrollLeft = Math.round(wrapper.scrollLeft);
            const scrollWidth = wrapper.scrollWidth;

            prevBtn.disabled = scrollLeft < 1;
            nextBtn.disabled = (scrollLeft + slideWidth) >= scrollWidth - 1;
        };
        
        nextBtn.addEventListener('click', () => {
            const slideWidth = wrapper.clientWidth;
            wrapper.scrollLeft += slideWidth;
        });

        prevBtn.addEventListener('click', () => {
            const slideWidth = wrapper.clientWidth;
            wrapper.scrollLeft -= slideWidth;
        });

        // ใช้ Intersection Observer เพื่ออัปเดตปุ่มเมื่อเลื่อนเจอเท่านั้น
        const observer = new IntersectionObserver(() => {
            updateButtons();
        }, { threshold: 0.5 });
        
        // ใช้ scroll event เพื่ออัปเดตปุ่มเมื่อผู้ใช้เลื่อนเอง
        wrapper.addEventListener('scroll', updateButtons);

        // เริ่มสังเกตการณ์
        observer.observe(wrapper);
    });
});