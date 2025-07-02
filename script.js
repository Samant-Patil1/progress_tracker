// Subject data with all chapters - arranged in exam order
const subjects = {
    physics: {
        name: "⚛️ Physics",
        examDate: "Monday, 7 July 2025",
        chapters: [
            "Measurement and Experimentation",
            "Motion in One Dimension",
            "Laws of Motion (Contact & Non-contact forces)"
        ]
    },
    english_lit: {
        name: "📚 English Literature", 
        examDate: "Monday, 7 July 2025",
        chapters: [
            "Prose: Bonku Babu's Friend",
            "Poem: The Night Mail",
            "Drama: Julius Caesar (Act 1, Scene 1 & 2)"
        ]
    },
    history: {
        name: "🏛️ History/Civics",
        examDate: "Tuesday, 8 July 2025",
        chapters: [
            "The Harappan Civilisation",
            "The Vedic Period",
            "Jainism and Buddhism",
            "Our Constitution",
            "Salient Features of the Constitution - I",
            "Salient Features of the Constitution - II"
        ]
    },
    chemistry: {
        name: "🧪 Chemistry",
        examDate: "Wednesday, 9 July 2025",
        chapters: [
            "The Language of Chemistry",
            "Chemical Changes and Reactions",
            "Water (excluded topics noted)"
        ]
    },
    english_lang: {
        name: "📝 English Language",
        examDate: "Wednesday, 9 July 2025",
        chapters: [
            "Grammar: Tenses",
            "Grammar: Prepositions",
            "Grammar: Synthesis of Sentences",
            "Grammar: Transformation of Sentences",
            "Composition: Essays & Stories"
        ]
    },
    computers: {
        name: "💻 Computer Applications",
        examDate: "Thursday, 10 July 2025",
        chapters: [
            "Values and Data Types",
            "Operators in Java",
            "Input in Java"
        ]
    },
    biology: {
        name: "🧬 Biology",
        examDate: "Friday, 11 July 2025",
        chapters: [
            "Cell: The Unit of Life",
            "Plant and Animal Tissue",
            "Flower"
        ]
    },
    kannada: {
        name: "🇮🇳 Kannada",
        examDate: "Friday, 11 July 2025",
        chapters: [
            "ಸಾಹಿತ್ಯ ಸಂಗಮ - ಶಿವರತ್ನಾತ್ರಯ ಕಥೆ",
            "ಸಾಟಿಮೀಯೊದು - ಅಧ್ಯಾಯ 1",
            "ಪತ್ರವೆಂಬನೆ"
        ]
    },
    math: {
        name: "🔢 Mathematics",
        examDate: "Monday, 14 July 2025",
        chapters: [
            "Rational and Irrational Numbers",
            "Compound Interest",
            "Expansions",
            "Circumference and Area of a Circle",
            "Pythagoras Theorem"
        ]
    },
    geography: {
        name: "🌍 Geography",
        examDate: "Monday, 14 July 2025",
        chapters: [
            "Earth as a Planet",
            "Geographic Grid - Latitudes & Longitudes",
            "Rotation and Revolution"
        ]
    }
};

// Progress tracking
let progressData = JSON.parse(localStorage.getItem('examProgress')) || {};

// Exam completion tracking
let examCompletionData = JSON.parse(localStorage.getItem('examCompletion')) || {};

// Initialize progress data structure
function initializeProgress() {
    Object.keys(subjects).forEach(subjectKey => {
        if (!progressData[subjectKey]) {
            progressData[subjectKey] = {};
        }
        subjects[subjectKey].chapters.forEach((chapter, index) => {
            const chapterKey = `chapter_${index}`;
            if (!progressData[subjectKey][chapterKey]) {
                progressData[subjectKey][chapterKey] = {
                    name: chapter,
                    ticks: Array(11).fill(false)
                };
            }
        });
        
        // Initialize exam completion status
        if (!examCompletionData[subjectKey]) {
            examCompletionData[subjectKey] = false;
        }
    });
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('examProgress', JSON.stringify(progressData));
    localStorage.setItem('examCompletion', JSON.stringify(examCompletionData));
}

// Create tick boxes for a chapter
function createTickBoxes(subjectKey, chapterIndex) {
    const tickBoxes = document.createElement('div');
    tickBoxes.className = 'tick-boxes';
    
    for (let i = 0; i < 11; i++) {
        const tickBox = document.createElement('div');
        tickBox.className = 'tick-box';
        tickBox.dataset.tick = i + 1;
        
        // Add special classes for different phases
        if (i >= 5 && i <= 9) {
            tickBox.classList.add('revision');
        } else if (i === 10) {
            tickBox.classList.add('final');
            tickBox.textContent = '🎯';
        }
        
        // Set tooltip
        const tooltips = [
            '1st study', '2nd study', '3rd study', '4th study', '5th study',
            '1st revision', '2nd revision', '3rd revision', '4th revision', '5th revision',
            'Final review - EXAM DAY!'
        ];
        tickBox.title = tooltips[i];
        
        // Check if already completed
        const chapterKey = `chapter_${chapterIndex}`;
        if (progressData[subjectKey] && progressData[subjectKey][chapterKey] && 
            progressData[subjectKey][chapterKey].ticks[i]) {
            tickBox.classList.add('checked');
        }
        
        // Add click event
        tickBox.addEventListener('click', () => {
            handleTickClick(subjectKey, chapterIndex, i, tickBox);
        });
        
        tickBoxes.appendChild(tickBox);
    }
    
    return tickBoxes;
}

// Handle tick box click
function handleTickClick(subjectKey, chapterIndex, tickIndex, tickBox) {
    const chapterKey = `chapter_${chapterIndex}`;
    
    // Toggle the tick
    progressData[subjectKey][chapterKey].ticks[tickIndex] = !progressData[subjectKey][chapterKey].ticks[tickIndex];
    
    // Update visual state
    if (progressData[subjectKey][chapterKey].ticks[tickIndex]) {
        tickBox.classList.add('checked');
        
        // Check if this is the final tick (11th)
        if (tickIndex === 10) {
            triggerConfetti();
            showCelebrationMessage();
        }
    } else {
        tickBox.classList.remove('checked');
    }
    
    // Update progress displays
    updateSubjectProgress(subjectKey);
    updateOverallProgress();
    checkChapterCompletion(subjectKey, chapterIndex);
    
    // Save progress
    saveProgress();
}

// Check if chapter is completed (all 11 ticks)
function checkChapterCompletion(subjectKey, chapterIndex) {
    const chapterKey = `chapter_${chapterIndex}`;
    const ticks = progressData[subjectKey][chapterKey].ticks;
    const isCompleted = ticks.every(tick => tick === true);
    
    const chapterElement = document.querySelector(`[data-subject="${subjectKey}"][data-chapter="${chapterIndex}"]`);
    if (chapterElement) {
        if (isCompleted) {
            chapterElement.classList.add('completed');
        } else {
            chapterElement.classList.remove('completed');
        }
    }
}

// Update subject progress
function updateSubjectProgress(subjectKey) {
    const subject = subjects[subjectKey];
    const completedChapters = subject.chapters.filter((_, index) => {
        const chapterKey = `chapter_${index}`;
        return progressData[subjectKey][chapterKey].ticks.every(tick => tick === true);
    }).length;
    
    const progressElement = document.querySelector(`[data-subject="${subjectKey}"]`);
    if (progressElement) {
        progressElement.textContent = `${completedChapters}/${subject.chapters.length} chapters`;
    }
}

// Toggle exam completion
function toggleExamCompletion(subjectKey) {
    examCompletionData[subjectKey] = !examCompletionData[subjectKey];
    saveProgress();
    updateOverallProgress();
    
    // Update the visual state of the exam completion button
    const button = document.querySelector(`[data-exam-toggle="${subjectKey}"]`);
    if (button) {
        if (examCompletionData[subjectKey]) {
            button.classList.add('completed');
            button.textContent = '✅ Exam Done!';
        } else {
            button.classList.remove('completed');
            button.textContent = '⏳ Mark as Done';
        }
    }
}

// Update overall progress statistics
function updateOverallProgress() {
    let totalChapters = 0;
    let completedChapters = 0;
    let readyForExam = 0;
    let examsCompleted = 0;
    
    Object.keys(subjects).forEach(subjectKey => {
        const subject = subjects[subjectKey];
        totalChapters += subject.chapters.length;
        
        // Count exam completion
        if (examCompletionData[subjectKey]) {
            examsCompleted++;
        }
        
        subject.chapters.forEach((_, index) => {
            const chapterKey = `chapter_${index}`;
            const ticks = progressData[subjectKey][chapterKey].ticks;
            
            // Count as completed if all 11 ticks are done
            if (ticks.every(tick => tick === true)) {
                completedChapters++;
            }
            
            // Count as ready for exam if at least 5 ticks are done
            if (ticks.slice(0, 5).every(tick => tick === true)) {
                readyForExam++;
            }
        });
    });
    
    // Update DOM elements
    document.getElementById('totalCompleted').textContent = completedChapters;
    document.getElementById('totalProgress').textContent = Math.round((completedChapters / totalChapters) * 100) + '%';
    document.getElementById('readyForExam').textContent = readyForExam;
    document.getElementById('examsCompleted').textContent = examsCompleted;
}

// Create subject card HTML
function createSubjectCard(subjectKey, subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    
    const examCompletionButton = `
        <button class="exam-completion-btn ${examCompletionData[subjectKey] ? 'completed' : ''}" 
                data-exam-toggle="${subjectKey}" 
                onclick="toggleExamCompletion('${subjectKey}')">
            ${examCompletionData[subjectKey] ? '✅ Exam Done!' : '⏳ Mark as Done'}
        </button>
    `;
    
    card.innerHTML = `
        <div class="subject-header">
            <div class="subject-info">
                <h3>${subject.name}</h3>
                <small class="exam-date">${subject.examDate}</small>
            </div>
            <div class="subject-controls">
                <span class="subject-progress" data-subject="${subjectKey}">0/${subject.chapters.length} chapters</span>
                ${examCompletionButton}
            </div>
        </div>
        <div class="chapters">
            ${subject.chapters.map((chapter, index) => `
                <div class="chapter" data-subject="${subjectKey}" data-chapter="${index}">
                    <span class="chapter-name">${chapter}</span>
                    <div class="tick-boxes-placeholder" data-subject="${subjectKey}" data-chapter="${index}"></div>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

// Confetti animation
function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    
    // Clear existing confetti
    container.innerHTML = '';
    
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}

// Show celebration message
function showCelebrationMessage() {
    // Create celebration modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.5s ease-out;
    `;
    
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        animation: bounceIn 0.6s ease-out;
    `;
    
    celebration.innerHTML = `
        <h2 style="color: #28a745; font-size: 2rem; margin-bottom: 20px;">🎉 Congratulations! 🎉</h2>
        <p style="font-size: 1.2rem; margin-bottom: 20px;">You've completed a chapter fully!</p>
        <p style="color: #666; margin-bottom: 30px;">Ready for the exam! Keep up the great work!</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Awesome! 🚀
        </button>
    `;
    
    modal.appendChild(celebration);
    document.body.appendChild(modal);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.remove();
        }
    }, 5000);
}

// Initialize the application
function initializeApp() {
    initializeProgress();
    
    const container = document.getElementById('subjectsContainer');
    
    // Create subject cards in exam order
    Object.keys(subjects).forEach(subjectKey => {
        const subject = subjects[subjectKey];
        const card = createSubjectCard(subjectKey, subject);
        container.appendChild(card);
        
        // Add tick boxes to each chapter
        subject.chapters.forEach((_, index) => {
            const placeholder = card.querySelector(`[data-subject="${subjectKey}"][data-chapter="${index}"]`);
            const tickBoxes = createTickBoxes(subjectKey, index);
            placeholder.appendChild(tickBoxes);
            
            // Check initial completion status
            checkChapterCompletion(subjectKey, index);
        });
        
        // Update subject progress
        updateSubjectProgress(subjectKey);
    });
    
    // Update overall progress
    updateOverallProgress();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);