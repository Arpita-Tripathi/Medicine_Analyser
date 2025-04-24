let btn = document.querySelector("#btn")
    let sidebar = document.querySelector(".sidebar")
    let navItems = document.querySelectorAll(".nav-item")
    btn.onclick = function () {
        sidebar.classList.toggle("active")
        navItems.forEach(item => {
            item.classList.toggle("active");
        });
    }
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const content = document.getElementById('main-content');

        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            content.style.display = 'block';
        }, 500); // match transition duration
    });
    document.getElementById("btn-search").addEventListener("click", () => {
        const medName = document.getElementById("med-input").value;
        const resultsDiv = document.getElementById("results");

        if (!medName) {
            resultsDiv.innerHTML = "<p>Please enter a medicine name.</p>";
            return;
        }

        fetch(`http://127.0.0.1:8000/get_similar?name=${encodeURIComponent(medName)}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultsDiv.innerHTML = `<p>${data.error}</p>`;
                } else {
                    const meds = data.similar_medicines;
                    resultsDiv.innerHTML = meds.map(med => `
                        <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                            <strong>Name:</strong> ${med.name}<br>
                            <strong>Generic Name:</strong> ${med.generic_name}<br>
                            <strong>Indication:</strong> ${med.indication}
                        </div>
                    `).join('');
                }
            })
            .catch(err => {
                resultsDiv.innerHTML = `<p>Something went wrong: ${err}</p>`;
            });
    });
