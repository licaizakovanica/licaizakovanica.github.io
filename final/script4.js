document.addEventListener('DOMContentLoaded', () => {
  // Select all the elements we want to animate
  const animatedElements = document.querySelectorAll('.overlay-text, .standard-section-content');

  if (!animatedElements.length) {
    return;
  }

  // Set up the Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const element = entry.target;
      // Check if the animated element is the one in our title section
      const isTitleOverlay = element.closest('#title-section');

      // If the element is on screen
      if (entry.isIntersecting) {
        element.classList.add('is-visible');
        
        // If it's the title, stop observing it so it stays visible forever
        if (isTitleOverlay) {
          observer.unobserve(element);
        }
      } else {
        // If it's NOT the title and it's scrolled out of view, make it disappear again
        if (!isTitleOverlay) {
          element.classList.remove('is-visible');
        }
      }
    });
  }, {
    // Trigger when 40% of the element is visible for a smoother feel
    threshold: 0.4 
  });

  // Tell the observer to watch each of our animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
});

document.addEventListener('DOMContentLoaded', () => {
    const desktopSource = 'images/zvjezdana720.mp4';
    const mobileSource = 'images/zvjezdana11low.mp4';
    const mobileBreakpoint = 768;
    const videoElement = document.getElementById('background-video');

    // Create the source element once and append it
    const sourceElement = document.createElement('source');
    sourceElement.type = 'video/mp4';
    videoElement.appendChild(sourceElement);

    let currentSourceIsMobile = window.innerWidth < mobileBreakpoint;

    // --- Main function to set the video source and attempt to play ---
    const setVideoSource = () => {
        const isMobile = window.innerWidth < mobileBreakpoint;

        // Only switch the source if the viewport has crossed the breakpoint
        if (sourceElement.src.includes(isMobile ? desktopSource : mobileSource) || sourceElement.src === "") {
            const newSrc = isMobile ? mobileSource : desktopSource;
            sourceElement.src = newSrc;
            videoElement.load(); // Tell the video element to load the new source
            currentSourceIsMobile = isMobile;
        }

        // Always attempt to play, especially after a source change or on initial load
        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Autoplay was prevented. This is common on mobile.
                // The user interaction fallback will handle this.
                console.warn('Autoplay was prevented by the browser.', error);
            });
        }
    };

    // --- Initial Load ---
    setVideoSource();

    // --- Fallback for Mobile Autoplay Restrictions ---
    // If autoplay fails, this will play the video on the first user interaction.
    const playOnFirstInteraction = () => {
        if (videoElement.paused) {
            videoElement.play().catch(error => {
                // This might still fail if there are other issues, but it's our best shot.
                console.warn('Fallback play attempt failed.', error);
            });
        }
        // Remove the event listener so it only runs once
        document.body.removeEventListener('touchstart', playOnFirstInteraction);
        document.body.removeEventListener('scroll', playOnFirstInteraction);
    };
    document.body.addEventListener('touchstart', playOnFirstInteraction);
    document.body.addEventListener('scroll', playOnFirstInteraction);


    // --- Debounced Resize Logic ---
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setVideoSource, 250); // Debounce for performance
    });

});

