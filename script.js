class ClickEvolution {
    constructor() {
        // Game state
        this.totalClicks = 0;
        this.currentMode = 1;
        this.startTime = Date.now();
        this.achievements = [];
        this.clickTimes = [];
        this.developerMode = false;
        this.certificateUnlocked = false;
        
        // Performance optimization
        this.activeParticles = [];
        this.maxParticles = 200; // Limit total particles
        this.lastClickTime = 0;
        this.clickThrottle = 50; // Minimum ms between effect processing
        
        // DOM elements
        this.elements = {
            totalClicks: document.getElementById('totalClicks'),
            clickCounter: document.getElementById('clickCounter'),
            clickButton: document.getElementById('clickButton'),
            clicksPerSecond: document.getElementById('clicksPerSecond'),
            playTime: document.getElementById('playTime'),
            currentMode: document.getElementById('currentMode'),
            modeName: document.getElementById('modeName'),
            modeDescription: document.getElementById('modeDescription'),
            progressNumbers: document.getElementById('progressNumbers'),
            progressFill: document.getElementById('progressFill'),
            goalText: document.getElementById('goalText'),
            milestoneMessage: document.getElementById('milestoneMessage'),
            achievementsList: document.getElementById('achievementsList'),
            gameFooter: document.getElementById('gameFooter'),
            effectsContainer: document.getElementById('effectsContainer')
        };
        
        // Mode definitions with goals and themes
        this.modes = [
            {
                id: 1,
                name: "NORMAL MODE",
                description: "Basic clicking experience",
                goal: 100,
                theme: "normal",
                buttonGradient: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                backgroundClass: "",
                effects: { sparkles: 3, confetti: 0, screenShake: false, pulse: false, rotation: false },
                drama: "Basic click effects",
                message: "Welcome to Click Evolution! Keep clicking to unlock new modes!"
            },
            {
                id: 2,
                name: "EPIC MODE",
                description: "Enhanced visual effects",
                goal: 150,
                theme: "epic",
                buttonGradient: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClass: "mode-epic",
                effects: { sparkles: 5, confetti: 2, screenShake: false, pulse: true, rotation: false },
                drama: "Button pulsing effects added",
                message: "🎉 EPIC MODE UNLOCKED! The button pulses with power!"
            },
            {
                id: 3,
                name: "LEGENDARY MODE",
                description: "Legendary power awakened",
                goal: 250,
                theme: "legendary",
                buttonGradient: "linear-gradient(45deg, #f093fb, #f5576c)",
                backgroundClass: "mode-legendary",
                effects: { sparkles: 8, confetti: 4, screenShake: true, pulse: true, rotation: false },
                drama: "Screen shake on every click!",
                message: "⚡ LEGENDARY MODE ACHIEVED! Reality shakes with each click!"
            },
            {
                id: 4,
                name: "COSMIC MODE",
                description: "Stellar clicking power",
                goal: 400,
                theme: "cosmic",
                buttonGradient: "linear-gradient(45deg, #4facfe, #00f2fe)",
                backgroundClass: "mode-cosmic",
                effects: { sparkles: 12, confetti: 6, screenShake: true, pulse: true, rotation: true },
                drama: "Button rotates and background shifts!",
                message: "🌌 COSMIC MODE UNLOCKED! The universe spins around you!"
            },
            {
                id: 5,
                name: "DIVINE MODE",
                description: "Heavenly clicking mastery",
                goal: 600,
                theme: "divine",
                buttonGradient: "linear-gradient(45deg, #43e97b, #38f9d7)",
                backgroundClass: "mode-divine",
                effects: { sparkles: 18, confetti: 10, screenShake: true, pulse: true, rotation: true },
                drama: "Divine light rays and halos!",
                message: "✨ DIVINE MODE ASCENDED! Holy light emanates from your clicks!"
            },
            {
                id: 6,
                name: "SUPREME MODE",
                description: "Ultimate clicking authority",
                goal: 800,
                theme: "supreme",
                buttonGradient: "linear-gradient(45deg, #fa709a, #fee140)",
                backgroundClass: "mode-infinite",
                effects: { sparkles: 25, confetti: 15, screenShake: true, pulse: true, rotation: true },
                drama: "Screen warping and reality distortion!",
                message: "👑 SUPREME MODE CONQUERED! Reality bends to your supreme will!"
            },
            {
                id: 7,
                name: "INFINITE MODE",
                description: "Limitless clicking perfection",
                goal: 1000,
                theme: "infinite",
                buttonGradient: "linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)",
                backgroundClass: "mode-infinite",
                effects: { sparkles: 60, confetti: 40, screenShake: true, pulse: true, rotation: true },
                drama: "INFINITE MASTERY - Certificate Available!",
                message: "🚀 INFINITE MODE ACHIEVED! You have mastered the art of clicking!"
            }
        ];
        
        // Achievement templates
        this.achievementMessages = [
            "🎯 First Click Master!",
            "🔥 Speed Demon - 10 CPS achieved!",
            "⏰ Time Warrior - 5 minutes played!",
            "💯 Century Club - 100 clicks!",
            "🚀 Rocket Clicker - 1000 clicks!",
            "⚡ Lightning Fast - 15 CPS!",
            "🏆 Click Champion - 2500 clicks!",
            "🌟 Super Clicker - 20 CPS!",
            "💎 Diamond Clicker - 5000 clicks!",
            "🔮 Mystic Clicker - 10000 clicks!"
        ];
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.elements.clickButton.addEventListener('click', () => this.handleClick());
        
        // Update stats every 100ms
        setInterval(() => this.updateStats(), 100);
        
        // Check for random achievements
        setInterval(() => this.checkRandomAchievements(), 5000);
        
        // Performance cleanup - remove old particles every 2 seconds
        setInterval(() => this.cleanupParticles(), 2000);
        
        // Add developer mode toggle (Ctrl + Shift + D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDeveloperMode();
            }
        });
        
        // Create developer panel
        this.createDeveloperPanel();
    }
    
    cleanupParticles() {
        // Remove particles that are no longer animating or have been around too long
        const now = Date.now();
        this.activeParticles = this.activeParticles.filter(particle => {
            if (now - particle.createdAt > 5000 || !document.body.contains(particle.element)) {
                if (particle.element && particle.element.parentNode) {
                    particle.element.remove();
                }
                return false;
            }
            return true;
        });
        
        // If we still have too many particles, remove the oldest ones
        if (this.activeParticles.length > this.maxParticles) {
            const toRemove = this.activeParticles.splice(0, this.activeParticles.length - this.maxParticles);
            toRemove.forEach(particle => {
                if (particle.element && particle.element.parentNode) {
                    particle.element.remove();
                }
            });
        }
    }
    
    handleClick() {
        this.totalClicks++;
        this.clickTimes.push(Date.now());
        
        // Keep only last 10 seconds of clicks for CPS calculation
        const now = Date.now();
        this.clickTimes = this.clickTimes.filter(time => now - time < 10000);
        
        this.updateDisplay();
        this.checkModeProgression();
        
        // Throttle effects to prevent performance issues
        if (now - this.lastClickTime > this.clickThrottle) {
            this.createClickEffects();
            this.applyDramaticEffects();
            this.lastClickTime = now;
        }
        
        this.animateCounter();
    }
    
    updateDisplay() {
        const currentModeData = this.getCurrentModeData();
        const progress = this.getProgressToNextMode();
        
        // Update counters
        this.elements.totalClicks.textContent = this.totalClicks.toLocaleString();
        this.elements.clickCounter.textContent = this.totalClicks.toLocaleString();
        this.elements.currentMode.textContent = this.currentMode;
        
        // Update mode info
        this.elements.modeName.textContent = currentModeData.name;
        this.elements.modeDescription.textContent = currentModeData.description;
        
        // Update progress
        if (this.currentMode < this.modes.length) {
            const nextModeData = this.modes[this.currentMode];
            const clicksNeeded = nextModeData.goal - this.totalClicks;
            this.elements.progressNumbers.textContent = 
                `${this.totalClicks.toLocaleString()} / ${nextModeData.goal.toLocaleString()}`;
            this.elements.progressFill.style.width = `${progress}%`;
            this.elements.goalText.textContent = 
                `${clicksNeeded.toLocaleString()} clicks to unlock ${nextModeData.name}!`;
        } else {
            this.elements.progressNumbers.textContent = "INFINITE MODE ACHIEVED!";
            this.elements.progressFill.style.width = "100%";
            this.elements.goalText.textContent = "🏆 You have mastered the ultimate clicking challenge!";
        }
    }
    
    updateStats() {
        // Calculate clicks per second
        const now = Date.now();
        const recentClicks = this.clickTimes.filter(time => now - time < 1000);
        this.elements.clicksPerSecond.textContent = recentClicks.length.toFixed(1);
        
        // Update play time
        const totalSeconds = Math.floor((now - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.elements.playTime.textContent = 
            minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }
    
    checkModeProgression() {
        if (this.currentMode < this.modes.length) {
            const nextModeData = this.modes[this.currentMode];
            if (this.totalClicks >= nextModeData.goal) {
                this.unlockNextMode();
            }
        }
    }
    
    unlockNextMode() {
        this.currentMode++;
        const newModeData = this.getCurrentModeData();
        
        // Apply new mode theme
        this.applyModeTheme(newModeData);
        
        // Show unlock message
        this.elements.milestoneMessage.textContent = newModeData.message;
        
        // Add achievement
        this.addAchievement(`🎊 ${newModeData.name} UNLOCKED!`);
        
        // Show share buttons after Epic mode
        if (this.currentMode >= 2) {
            this.elements.gameFooter.style.display = 'block';
            this.updateShareLinks();
        }
        
        // Handle INFINITE MODE completion
        if (this.currentMode === 7) {
            this.certificateUnlocked = true;
            setTimeout(() => {
                this.showGameCompletionDialog();
            }, 2000); // Show after celebration
        }
        
        // Screen shake for dramatic effect
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 500);
        
        // Create celebration effects
        this.createCelebrationEffects();
    }
    
    showGameCompletionDialog() {
        const completionModal = document.createElement('div');
        completionModal.className = 'completion-modal';
        completionModal.innerHTML = `
            <div class="completion-content">
                <h2>🎉 CONGRATULATIONS! 🎉</h2>
                <p class="completion-text">You have achieved <strong>INFINITE MODE</strong> and mastered the art of clicking!</p>
                <p class="completion-subtitle">What would you like to do now?</p>
                <div class="completion-buttons">
                    <button onclick="game.generateCertificateFromCompletion()" class="completion-btn certificate-btn">
                        🏆 Generate Certificate
                    </button>
                    <button onclick="game.restartFromCompletion()" class="completion-btn restart-btn">
                        🔄 Start New Journey
                    </button>
                </div>
                <p class="completion-note">You can always access your certificate later through developer tools (Ctrl+Shift+D)</p>
            </div>
        `;
        
        document.body.appendChild(completionModal);
        this.completionModal = completionModal;
    }
    
    generateCertificateFromCompletion() {
        this.closeCompletionModal();
        this.showCertificateGenerator();
    }
    
    restartFromCompletion() {
        this.closeCompletionModal();
        this.resetGame();
    }
    
    closeCompletionModal() {
        if (this.completionModal) {
            this.completionModal.remove();
        }
    }
    
    applyDramaticEffects() {
        const currentModeData = this.getCurrentModeData();
        const effects = currentModeData.effects;
        
        // Limit screen shake to prevent accumulation
        if (effects.screenShake && !document.body.classList.contains('screen-shake')) {
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 200);
        }
        
        // Button pulse effect
        if (effects.pulse) {
            this.elements.clickButton.style.animation = 'buttonPulse 0.3s ease';
            setTimeout(() => {
                this.elements.clickButton.style.animation = '';
            }, 300);
        }
        
        // Button rotation effect (optimized)
        if (effects.rotation) {
            this.elements.clickButton.style.transform += ' rotate(15deg)';
            setTimeout(() => {
                this.elements.clickButton.style.transform = this.elements.clickButton.style.transform.replace(' rotate(15deg)', '');
            }, 200);
        }
        
        // Advanced mode effects (throttled)
        if (this.currentMode >= 5 && Math.random() < 0.3) { // 30% chance to reduce frequency
            this.createDivineRays();
        }
        
        if (this.currentMode >= 7 && Math.random() < 0.2) { // 20% chance to reduce frequency
            this.createDimensionalRift();
        }
        
        if (this.currentMode >= 9 && Math.random() < 0.1) { // 10% chance to reduce frequency
            this.createRealityGlitch();
        }
    }
    
    createDivineRays() {
        // Limit to 4 rays instead of 8 for better performance
        for (let i = 0; i < 4; i++) {
            const ray = document.createElement('div');
            ray.style.cssText = `
                position: fixed;
                width: 2px;
                height: 80px;
                background: linear-gradient(transparent, #FFD700, transparent);
                pointer-events: none;
                opacity: 0.6;
                animation: fadeOut 0.8s ease-out forwards;
                z-index: 50;
            `;
            
            const buttonRect = this.elements.clickButton.getBoundingClientRect();
            ray.style.left = buttonRect.left + buttonRect.width / 2 + 'px';
            ray.style.top = buttonRect.top + buttonRect.height / 2 + 'px';
            ray.style.transform = `translate(-50%, -50%) rotate(${i * 90}deg)`;
            
            this.elements.effectsContainer.appendChild(ray);
            this.activeParticles.push({
                element: ray,
                createdAt: Date.now()
            });
            
            setTimeout(() => {
                if (ray.parentNode) ray.remove();
            }, 800);
        }
    }
    
    createDimensionalRift() {
        // Create a single, efficient rift
        const rift = document.createElement('div');
        rift.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: 1px;
            height: 60vh;
            background: linear-gradient(#FF00FF, #00FFFF);
            transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
            opacity: 0.4;
            animation: dimensionalPulse 0.4s ease-out forwards;
            pointer-events: none;
            z-index: 40;
        `;
        
        this.elements.effectsContainer.appendChild(rift);
        this.activeParticles.push({
            element: rift,
            createdAt: Date.now()
        });
        
        setTimeout(() => {
            if (rift.parentNode) rift.remove();
        }, 400);
    }
    
    createRealityGlitch() {
        // Lightweight glitch effect
        const glitch = document.createElement('div');
        glitch.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(90deg, transparent, rgba(255,0,0,0.05) 2px, transparent 4px);
            animation: glitchEffect 0.15s ease-out forwards;
            pointer-events: none;
            z-index: 30;
        `;
        
        this.elements.effectsContainer.appendChild(glitch);
        this.activeParticles.push({
            element: glitch,
            createdAt: Date.now()
        });
        
        setTimeout(() => {
            if (glitch.parentNode) glitch.remove();
        }, 150);
    }
    
    showCertificateGenerator() {
        const certificateModal = document.createElement('div');
        certificateModal.className = 'certificate-modal';
        certificateModal.innerHTML = `
            <div class="certificate-content">
                <h2>🏆 INFINITE MASTER CERTIFICATE 🏆</h2>
                <p>Congratulations! You have achieved the ultimate clicking mastery!</p>
                <div class="name-input-section">
                    <label for="playerName">Enter your full name for the certificate:</label>
                    <input type="text" id="playerName" placeholder="Your Full Name" maxlength="50">
                </div>
                <div class="certificate-buttons">
                    <button onclick="game.generateCertificate()" class="cert-btn generate-btn">Generate Certificate</button>
                    <button onclick="game.closeCertificateModal()" class="cert-btn close-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(certificateModal);
        this.certificateModal = certificateModal;
    }
    
    generateCertificate() {
        const playerName = document.getElementById('playerName').value.trim() || 'Anonymous Master';
        const date = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const certificate = document.createElement('div');
        certificate.className = 'certificate';
        certificate.innerHTML = `
            <div class="certificate-border">
                <div class="certificate-header">
                    <div class="certificate-logo">🏆</div>
                    <h1>CERTIFICATE OF MASTERY</h1>
                    <div class="certificate-subtitle">Click Evolution Academy</div>
                </div>
                <div class="certificate-body">
                    <p class="award-text">This is to certify that</p>
                    <h2 class="player-name">${playerName}</h2>
                    <p class="achievement-text">has successfully demonstrated exceptional skill and dedication in achieving</p>
                    <h2 class="rank-title">INFINITE CLICKING MASTERY</h2>
                    <p class="stats-text">
                        Completion Achievement: <strong>${this.totalClicks.toLocaleString()} Total Clicks</strong><br>
                        Demonstrating perseverance, focus, and clicking excellence
                    </p>
                    <div class="certificate-footer">
                        <div class="signature-section">
                            <div class="signature-line"></div>
                            <p class="signature-title">Director of Click Evolution</p>
                            <p class="date">Awarded on ${date}</p>
                        </div>
                        <div class="official-seal">
                            <div class="seal-outer">
                                <div class="seal-inner">
                                    <div class="seal-text">OFFICIAL</div>
                                    <div class="seal-year">${new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show certificate in modal
        const existingCert = document.querySelector('.certificate-display');
        if (existingCert) existingCert.remove();
        
        const certDisplay = document.createElement('div');
        certDisplay.className = 'certificate-display';
        certDisplay.innerHTML = `
            <div class="cert-modal-content">
                ${certificate.outerHTML}
                <div class="cert-actions">
                    <button onclick="game.downloadCertificate()" class="cert-btn download-btn">Download Certificate</button>
                    <button onclick="game.closeCertificateDisplay()" class="cert-btn close-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(certDisplay);
        this.currentCertificate = certificate;
    }
    
    downloadCertificate() {
        // Create a temporary canvas to convert certificate to image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 700;
        
        // Professional certificate background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, 1000, 700);
        
        // Outer border
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, 940, 640);
        
        // Inner decorative border
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, 900, 600);
        
        // Header section
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF MASTERY', 500, 130);
        
        // Subtitle
        ctx.font = '20px serif';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText('Click Evolution Academy', 500, 160);
        
        // Award text
        ctx.font = '22px serif';
        ctx.fillStyle = '#34495e';
        ctx.fillText('This is to certify that', 500, 220);
        
        // Player name
        const playerName = document.getElementById('playerName').value.trim() || 'Anonymous Master';
        ctx.font = 'bold 42px serif';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(playerName, 500, 280);
        
        // Achievement text
        ctx.font = '22px serif';
        ctx.fillStyle = '#34495e';
        ctx.fillText('has successfully demonstrated exceptional skill in achieving', 500, 330);
        
        // Rank title
        ctx.font = 'bold 32px serif';
        ctx.fillStyle = '#3498db';
        ctx.fillText('INFINITE CLICKING MASTERY', 500, 380);
        
        // Stats
        ctx.font = '18px serif';
        ctx.fillStyle = '#34495e';
        ctx.fillText(`Completion Achievement: ${this.totalClicks.toLocaleString()} Total Clicks`, 500, 430);
        ctx.fillText('Demonstrating perseverance, focus, and clicking excellence', 500, 455);
        
        // Signature section
        ctx.textAlign = 'left';
        ctx.font = '16px serif';
        ctx.fillText('Director of Click Evolution', 100, 570);
        
        // Signature line
        ctx.beginPath();
        ctx.moveTo(100, 550);
        ctx.lineTo(300, 550);
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Date
        ctx.fillText(`Awarded on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}`, 100, 590);
        
        // Official seal
        ctx.beginPath();
        ctx.arc(800, 550, 60, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(800, 550, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.textAlign = 'center';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.fillText('OFFICIAL', 800, 540);
        ctx.fillText(new Date().getFullYear().toString(), 800, 560);
        
        // Download
        const link = document.createElement('a');
        link.download = `${playerName.replace(/\s+/g, '_')}_Infinite_Master_Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
    
    closeCertificateModal() {
        if (this.certificateModal) {
            this.certificateModal.remove();
        }
    }
    
    closeCertificateDisplay() {
        const certDisplay = document.querySelector('.certificate-display');
        if (certDisplay) certDisplay.remove();
    }
    
    createDeveloperPanel() {
        const devPanel = document.createElement('div');
        devPanel.className = 'developer-panel';
        devPanel.style.display = 'none';
        devPanel.innerHTML = `
            <div class="dev-panel-content">
                <h3>🛠️ Developer Tools</h3>
                <div class="dev-controls">
                    <div class="dev-section">
                        <h4>Mode Testing:</h4>
                        <select id="modeSelector">
                            ${this.modes.map(mode => 
                                `<option value="${mode.id}">${mode.name}</option>`
                            ).join('')}
                        </select>
                        <button onclick="game.setMode()" class="dev-btn">Set Mode</button>
                    </div>
                    <div class="dev-section">
                        <h4>Quick Actions:</h4>
                        <button onclick="game.addClicks(100)" class="dev-btn">+100 Clicks</button>
                        <button onclick="game.addClicks(1000)" class="dev-btn">+1000 Clicks</button>
                        <button onclick="game.resetGame()" class="dev-btn reset-btn">Reset Game</button>
                    </div>
                    <div class="dev-section">
                        <h4>Certificate:</h4>
                        <button onclick="game.showCertificateGenerator()" class="dev-btn">Show Certificate</button>
                    </div>
                </div>
                <button onclick="game.toggleDeveloperMode()" class="dev-btn close-dev">Close Dev Panel</button>
            </div>
        `;
        
        document.body.appendChild(devPanel);
        this.developerPanel = devPanel;
    }
    
    toggleDeveloperMode() {
        this.developerMode = !this.developerMode;
        this.developerPanel.style.display = this.developerMode ? 'block' : 'none';
        
        if (this.developerMode) {
            this.addAchievement('🛠️ Developer Mode Activated!');
        }
    }
    
    setMode() {
        const selectedMode = parseInt(document.getElementById('modeSelector').value);
        const modeData = this.modes[selectedMode - 1];
        
        this.currentMode = selectedMode;
        this.totalClicks = Math.max(this.totalClicks, modeData.goal);
        
        this.applyModeTheme(modeData);
        this.updateDisplay();
        
        if (selectedMode === 7) {
            this.certificateUnlocked = true;
        }
        
        this.addAchievement(`🔧 Dev: Jumped to ${modeData.name}!`);
    }
    
    addClicks(amount) {
        this.totalClicks += amount;
        this.updateDisplay();
        this.checkModeProgression();
        this.addAchievement(`🔧 Dev: Added ${amount} clicks!`);
    }
    
    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            this.totalClicks = 0;
            this.currentMode = 1;
            this.achievements = [];
            this.certificateUnlocked = false;
            this.startTime = Date.now();
            this.lastClickTime = 0;
            
            // Clear all particles and effects
            this.activeParticles.forEach(particle => {
                if (particle.element && particle.element.parentNode) {
                    particle.element.remove();
                }
            });
            this.activeParticles = [];
            this.elements.effectsContainer.innerHTML = '';
            
            // Reset UI
            document.body.className = '';
            this.elements.achievementsList.innerHTML = '<div class="no-achievements">Start clicking to earn achievements!</div>';
            this.elements.gameFooter.style.display = 'none';
            
            this.applyModeTheme(this.modes[0]);
            this.updateDisplay();
            this.addAchievement('🔧 Dev: Game Reset!');
        }
    }
    
    applyModeTheme(modeData) {
        // Remove all mode classes
        document.body.className = '';
        
        // Apply new mode class
        if (modeData.backgroundClass) {
            document.body.classList.add(modeData.backgroundClass);
        }
        
        // Update button gradient
        this.elements.clickButton.style.background = modeData.buttonGradient;
        
        // Scale button size based on mode (more gradual progression)
        const baseSize = 200;
        const newSize = baseSize + (this.currentMode - 1) * 10; // Smaller increments
        this.elements.clickButton.style.width = `${newSize}px`;
        this.elements.clickButton.style.height = `${newSize}px`;
        
        // Update button text based on mode
        const buttonText = this.elements.clickButton.querySelector('.button-text');
        const modeTexts = ['CLICK', 'EPIC', 'LEGEND', 'COSMIC', 'DIVINE', 'SUPREME', 'INFINITE'];
        buttonText.textContent = modeTexts[this.currentMode - 1] || 'ULTIMATE';
    }
    
    createClickEffects() {
        const currentModeData = this.getCurrentModeData();
        const effects = currentModeData.effects;
        
        // Limit particles based on performance
        const maxSparkles = Math.min(effects.sparkles, 15);
        const maxConfetti = Math.min(effects.confetti, 8);
        
        // Create sparkles (optimized)
        this.createSparkles(maxSparkles);
        
        // Create confetti (optimized)
        if (maxConfetti > 0) {
            this.createConfetti(maxConfetti);
        }
    }
    
    createSparkles(count) {
        const buttonRect = this.elements.clickButton.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            // Check particle limit
            if (this.activeParticles.length >= this.maxParticles) break;
            
            const sparkle = document.createElement('div');
            sparkle.className = 'particle sparkle';
            
            const x = buttonRect.left + buttonRect.width / 2 + (Math.random() - 0.5) * buttonRect.width * 0.8;
            const y = buttonRect.top + buttonRect.height / 2 + (Math.random() - 0.5) * buttonRect.height * 0.8;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            this.elements.effectsContainer.appendChild(sparkle);
            
            // Track particle for cleanup
            this.activeParticles.push({
                element: sparkle,
                createdAt: Date.now()
            });
            
            setTimeout(() => {
                if (sparkle.parentNode) sparkle.remove();
            }, 2000);
        }
    }
    
    createConfetti(count) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#6c5ce7'];
        
        for (let i = 0; i < count; i++) {
            // Check particle limit
            if (this.activeParticles.length >= this.maxParticles) break;
            
            const confetti = document.createElement('div');
            confetti.className = 'particle confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            
            this.elements.effectsContainer.appendChild(confetti);
            
            // Track particle for cleanup
            this.activeParticles.push({
                element: confetti,
                createdAt: Date.now()
            });
            
            setTimeout(() => {
                if (confetti.parentNode) confetti.remove();
            }, 3000);
        }
    }
    
    createCelebrationEffects() {
        // Limited celebration effects to prevent lag
        this.createConfetti(20);
        this.createSparkles(30);
        
        // Rainbow effect for high modes (optimized)
        if (this.currentMode >= 4) {
            this.createOptimizedRainbowExplosion();
        }
    }
    
    createOptimizedRainbowExplosion() {
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff'];
        
        // Reduced from 30 to 12 particles for better performance
        for (let i = 0; i < 12; i++) {
            if (this.activeParticles.length >= this.maxParticles) break;
            
            const explosion = document.createElement('div');
            explosion.className = 'particle sparkle';
            explosion.style.background = colors[i % colors.length];
            explosion.style.width = '8px';
            explosion.style.height = '8px';
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            explosion.style.left = centerX + 'px';
            explosion.style.top = centerY + 'px';
            
            const angle = (i / 12) * 2 * Math.PI;
            const distance = 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            explosion.style.transform = `translate(${x}px, ${y}px)`;
            explosion.style.transition = 'all 1s ease-out';
            explosion.style.opacity = '0';
            
            this.elements.effectsContainer.appendChild(explosion);
            
            this.activeParticles.push({
                element: explosion,
                createdAt: Date.now()
            });
            
            setTimeout(() => {
                if (explosion.parentNode) explosion.remove();
            }, 1000);
        }
    }
    
    animateCounter() {
        this.elements.clickCounter.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.elements.clickCounter.style.transform = 'scale(1)';
        }, 150);
    }
    
    addAchievement(message) {
        // Remove "no achievements" message
        const noAchievements = this.elements.achievementsList.querySelector('.no-achievements');
        if (noAchievements) {
            noAchievements.remove();
        }
        
        const achievement = document.createElement('div');
        achievement.className = 'achievement-item';
        achievement.textContent = message;
        
        this.elements.achievementsList.appendChild(achievement);
        this.achievements.push(message);
        
        // Keep only last 5 achievements
        if (this.achievements.length > 5) {
            this.elements.achievementsList.removeChild(this.elements.achievementsList.firstChild);
            this.achievements.shift();
        }
    }
    
    checkRandomAchievements() {
        const cps = this.clickTimes.filter(time => Date.now() - time < 1000).length;
        const playTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // CPS achievements
        if (cps >= 10 && !this.achievements.includes('🔥 Speed Demon - 10 CPS achieved!')) {
            this.addAchievement('🔥 Speed Demon - 10 CPS achieved!');
        }
        if (cps >= 15 && !this.achievements.includes('⚡ Lightning Fast - 15 CPS!')) {
            this.addAchievement('⚡ Lightning Fast - 15 CPS!');
        }
        if (cps >= 20 && !this.achievements.includes('🌟 Super Clicker - 20 CPS!')) {
            this.addAchievement('🌟 Super Clicker - 20 CPS!');
        }
        
        // Time achievements (adjusted for faster progression)
        if (playTime >= 120 && !this.achievements.includes('⏰ Time Warrior - 2 minutes played!')) {
            this.addAchievement('⏰ Time Warrior - 2 minutes played!');
        }
        if (playTime >= 300 && !this.achievements.includes('🕐 Clock Master - 5 minutes played!')) {
            this.addAchievement('🕐 Clock Master - 5 minutes played!');
        }
        
        // Click milestone achievements
        const milestones = [50, 100, 150, 250, 400, 600, 800, 1000];
        milestones.forEach(milestone => {
            const achievementText = this.getClickMilestoneAchievement(milestone);
            if (this.totalClicks >= milestone && !this.achievements.includes(achievementText)) {
                this.addAchievement(achievementText);
            }
        });
    }
    
    getClickMilestoneAchievement(clicks) {
        const messages = {
            50: '🌟 Half Century - 50 clicks!',
            100: '💯 Century Club - 100 clicks!',
            150: '🚀 Rocket Starter - 150 clicks!',
            250: '⚡ Quarter Master - 250 clicks!',
            400: '🏆 Click Champion - 400 clicks!',
            600: '💎 Diamond Clicker - 600 clicks!',
            800: '🔥 Elite Clicker - 800 clicks!',
            1000: '👑 INFINITE MASTER - 1000 clicks!'
        };
        return messages[clicks] || `🎉 ${clicks} clicks achieved!`;
    }
    
    getCurrentModeData() {
        return this.modes[this.currentMode - 1];
    }
    
    getProgressToNextMode() {
        if (this.currentMode >= this.modes.length) return 100;
        
        const currentModeData = this.modes[this.currentMode - 1];
        const nextModeData = this.modes[this.currentMode];
        const progressFromCurrent = this.totalClicks - currentModeData.goal;
        const totalNeeded = nextModeData.goal - currentModeData.goal;
        
        return Math.min((progressFromCurrent / totalNeeded) * 100, 100);
    }
    
    updateShareLinks() {
        const modeData = this.getCurrentModeData();
        const message = `I just reached ${modeData.name} with ${this.totalClicks.toLocaleString()} clicks in Click Evolution! 🎮✨ Can you beat my score?`;
        const url = window.location.href;
        
        const twitterBtn = document.getElementById('shareTwitter');
        const facebookBtn = document.getElementById('shareFacebook');
        const redditBtn = document.getElementById('shareReddit');
        
        if (twitterBtn) {
            twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
        }
        if (facebookBtn) {
            facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
        }
        if (redditBtn) {
            redditBtn.href = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(message)}`;
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    window.game = new ClickEvolution();
});