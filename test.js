// Modal functionality
        const modal = document.getElementById("appointmentModal");
        const openModalBtn = document.getElementById("openModalBtn");
        const closeModalBtn = document.querySelector(".close-modal");
        const closeModalBtnFooter = document.querySelector(".close-modal-btn");
        
        openModalBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
        
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
        
        closeModalBtnFooter.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
        
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
        
        // Form submission
        document.getElementById("appointmentForm").addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Here you would typically send the data to a server
            alert("Agendamento realizado com sucesso!");
            modal.style.display = "none";
            document.body.style.overflow = "auto";
            
            // Reset form
            e.target.reset();
        });
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("appointmentDate").min = today;
