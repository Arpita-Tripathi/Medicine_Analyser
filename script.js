// Drug Database
const drugDatabase = [
    { name: "Aspirin", type: "Pain Reliever" },
    { name: "Amoxicillin", type: "Antibiotic" },
    { name: "Atorvastatin", type: "Cholesterol" },
    { name: "Azithromycin", type: "Antibiotic" },
    { name: "Acetaminophen", type: "Pain Reliever" },
    { name: "Albuterol", type: "Asthma" },
    { name: "Benzonatate", type: "Cough" },
    { name: "Bisoprolol", type: "Blood Pressure" },
    { name: "Bupropion", type: "Antidepressant" },
    { name: "Cephalexin", type: "Antibiotic" },
    { name: "Ciprofloxacin", type: "Antibiotic" },
    { name: "Diazepam", type: "Anxiety" },
    { name: "Doxycycline", type: "Antibiotic" },
    { name: "Escitalopram", type: "Antidepressant" },
    { name: "Fluoxetine", type: "Antidepressant" },
    { name: "Gabapentin", type: "Nerve Pain" },
    { name: "Hydrochlorothiazide", type: "Diuretic" },
    { name: "Ibuprofen", type: "NSAID" },
    { name: "Levothyroxine", type: "Thyroid" },
    { name: "Lisinopril", type: "Blood Pressure" },
    { name: "Losartan", type: "Blood Pressure" },
    { name: "Meloxicam", type: "NSAID" },
    { name: "Metformin", type: "Diabetes" },
    { name: "Omeprazole", type: "Acid Reducer" },
    { name: "Pantoprazole", type: "Acid Reducer" },
    { name: "Prednisone", type: "Steroid" },
    { name: "Sertraline", type: "Antidepressant" },
    { name: "Simvastatin", type: "Cholesterol" },
    { name: "Tramadol", type: "Pain Reliever" },
    { name: "Trazodone", type: "Antidepressant" },
    { name: "Venlafaxine", type: "Antidepressant" },
    { name: "Warfarin", type: "Blood Thinner" }
  ];
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initSearch();
  });
  
  // Faster particle background (2x speed)
  function initParticles() {
    const canvas = document.getElementById('particle-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const particles = [];
    const colors = ['#00f7ff', '#ff00e4', '#ffffff'];
    const particleCount = Math.min(150, Math.floor(window.innerWidth / 5));
    const speedMultiplier = 2; // 2x faster particles
  
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() * 1 - 0.5) * speedMultiplier,
        speedY: (Math.random() * 1 - 0.5) * speedMultiplier
      });
    }
  
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
  
      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 247, 255, ${1 - dist/150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
  
    animate();
  
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  // Enhanced search functionality with suggestions
  function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.querySelector('.search-results');
    const searchSuggestions = document.querySelector('.search-suggestions');
  
    // Show search suggestions
    function showSuggestions(query) {
      searchSuggestions.innerHTML = '';
      
      if (query.length === 0) {
        searchSuggestions.style.display = 'none';
        return;
      }
  
      const matchedDrugs = drugDatabase.filter(drug => 
        drug.name.toLowerCase().includes(query) || 
        drug.type.toLowerCase().includes(query)
      ).slice(0, 5); // Limit to 5 suggestions
  
      if (matchedDrugs.length > 0) {
        matchedDrugs.forEach(drug => {
          const suggestionItem = document.createElement('div');
          suggestionItem.className = 'suggestion-item';
          
          // Highlight matching parts
          const nameIndex = drug.name.toLowerCase().indexOf(query);
          const typeIndex = drug.type.toLowerCase().indexOf(query);
          
          if (nameIndex >= 0) {
            suggestionItem.innerHTML = `
              <strong>${drug.name.substring(0, nameIndex)}</strong>${drug.name.substring(nameIndex, nameIndex + query.length)}<strong>${drug.name.substring(nameIndex + query.length)}</strong>
              <span class="drug-type"> - ${drug.type}</span>
            `;
          } else {
            suggestionItem.innerHTML = `
              ${drug.name}
              <span class="drug-type"> - <strong>${drug.type.substring(0, typeIndex)}</strong>${drug.type.substring(typeIndex, typeIndex + query.length)}<strong>${drug.type.substring(typeIndex + query.length)}</strong></span>
            `;
          }
          
          suggestionItem.addEventListener('click', () => {
            searchInput.value = drug.name;
            searchSuggestions.style.display = 'none';
            performSearch();
          });
          
          searchSuggestions.appendChild(suggestionItem);
        });
        searchSuggestions.style.display = 'block';
      } else {
        searchSuggestions.style.display = 'none';
      }
    }
  
    // Perform actual search
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      
      if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
      }
  
      const filteredDrugs = drugDatabase.filter(drug => 
        drug.name.toLowerCase().includes(query) || 
        drug.type.toLowerCase().includes(query)
      );
  
      if (filteredDrugs.length > 0) {
        filteredDrugs.forEach(drug => {
          const resultItem = document.createElement('div');
          resultItem.className = 'result-item';
          resultItem.innerHTML = `
            <strong>${drug.name}</strong> - ${drug.type}
          `;
          searchResults.appendChild(resultItem);
        });
        searchResults.style.display = 'block';
      } else {
        searchResults.innerHTML = '<div class="no-results">No medications found</div>';
        searchResults.style.display = 'block';
      }
    }
  
    // Event listeners
    searchInput.addEventListener('input', () => {
      showSuggestions(searchInput.value.trim().toLowerCase());
    });
  
    searchButton.addEventListener('click', () => {
      searchSuggestions.style.display = 'none';
      performSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchSuggestions.style.display = 'none';
        performSearch();
      }
    });
  
    // Hide suggestions when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchSuggestions.style.display = 'none';
      }
    });
  }