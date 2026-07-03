// Smart Food & Diet Assistant - JavaScript

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
    initCharts();
    loadTheme();
    setActiveNavItem('dashboard');
});

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }

    // Update active nav link
    setActiveNavItem(pageId);
    
    // Close mobile menu
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }

    // Scroll to top
    document.querySelector('.pages-container').scrollTop = 0;
}

function setActiveNavItem(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
}

// ===== THEME TOGGLE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// ===== FOOD SCANNER =====
function analyzeFood() {
    const fileInput = document.getElementById('foodImage');
    const file = fileInput.files[0];

    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'flex';

        // Simulate AI analysis
        simulateFoodAnalysis();
    };
    reader.readAsDataURL(file);
}

function simulateFoodAnalysis() {
    // Mock food database
    const foodDatabase = [
        {
            name: 'Grilled Chicken & Rice',
            confidence: 96,
            servingSize: '240g',
            calories: 680,
            protein: 25,
            carbs: 72,
            fat: 30,
            healthScore: 7.5,
            recommendation: 'Excellent choice! High in protein and balanced macronutrients.'
        },
        {
            name: 'Greek Salad',
            confidence: 94,
            servingSize: '320g',
            calories: 320,
            protein: 12,
            carbs: 25,
            fat: 18,
            healthScore: 8.5,
            recommendation: 'Very healthy! Rich in vitamins and minerals.'
        },
        {
            name: 'Cheese Pizza',
            confidence: 98,
            servingSize: '240g',
            calories: 680,
            protein: 25,
            carbs: 72,
            fat: 30,
            healthScore: 5.5,
            recommendation: 'Moderate. Consider adding vegetables for more nutrients.'
        }
    ];

    // Pick random food for demo
    const food = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];

    // Update results
    document.getElementById('foodName').textContent = food.name;
    document.getElementById('confidence').textContent = `Confidence: ${food.confidence}%`;
    document.getElementById('calories').textContent = food.calories;
    document.getElementById('protein').textContent = food.protein + 'g';
    document.getElementById('carbs').textContent = food.carbs + 'g';
    document.getElementById('fat').textContent = food.fat + 'g';

    // Show results
    document.getElementById('analysisResult').style.display = 'block';

    // Save to history
    saveFoodAnalysis(food);
}

function saveFoodAnalysis(food) {
    let history = JSON.parse(localStorage.getItem('foodHistory') || '[]');
    history.unshift({
        ...food,
        date: new Date().toLocaleString()
    });
    history = history.slice(0, 50);
    localStorage.setItem('foodHistory', JSON.stringify(history));
}

function addToMeal() {
    const foodName = document.getElementById('foodName').textContent;
    const calories = document.getElementById('calories').textContent;
    alert(`✓ Added "${foodName}" (${calories} cal) to today's meals!`);
}

function saveFoodHistory() {
    const foodName = document.getElementById('foodName').textContent;
    alert(`✓ Saved "${foodName}" to favorites!`);
}

// ===== BMI CALCULATOR =====
function calculateBMI(event) {
    event.preventDefault();
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }

    const bmi = weight / ((height / 100) ** 2);
    let category = '';
    let advice = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        advice = 'Consider eating more nutritious, calorie-rich foods.';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        advice = 'You are at a healthy weight. Maintain with balanced diet and exercise.';
    } else if (bmi < 30) {
        category = 'Overweight';
        advice = 'Aim for gradual weight loss through balanced diet and regular exercise.';
    } else {
        category = 'Obese';
        advice = 'Consult a healthcare provider for personalized advice.';
    }

    document.getElementById('bmiResult').style.display = 'block';
    document.getElementById('bmiResultValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiResultCategory').textContent = category;
    document.getElementById('bmiAdvice').textContent = advice;

    localStorage.setItem('userBMI', JSON.stringify({ bmi: bmi.toFixed(1), category }));
}

// ===== CALORIE CALCULATOR =====
function calculateCalories(event) {
    event.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('calorieWeight').value);
    const height = parseFloat(document.getElementById('calorieHeight').value);
    const gender = document.getElementById('gender').value;
    const activity = document.getElementById('activity').value;

    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryactive: 1.9
    };

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityMultipliers[activity];
    const lossCalories = tdee - 500;
    const gainCalories = tdee + 300;

    document.getElementById('calorieResult').style.display = 'block';
    document.getElementById('tdeeValue').textContent = Math.round(tdee);
    document.getElementById('lossValue').textContent = Math.round(lossCalories);
    document.getElementById('gainValue').textContent = Math.round(gainCalories);
}

// ===== PROFILE =====
function editProfile() {
    alert('Edit profile feature - Coming soon!');
}

function downloadData() {
    const data = {
        profile: localStorage.getItem('userProfile'),
        bmi: localStorage.getItem('userBMI'),
        foodHistory: localStorage.getItem('foodHistory'),
        downloadDate: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health-data.json';
    link.click();
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        localStorage.clear();
        alert('Account deleted. Redirecting...');
        window.location.href = '/';
    }
}

// ===== CHARTS =====
function initCharts() {
    drawWeeklyCalorieChart();
}

function drawWeeklyCalorieChart() {
    const canvas = document.getElementById('weeklyCalorieChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = [1800, 2000, 1950, 1850, 1900, 2100, 1750];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxCalories = 2200;
    const minCalories = 1500;
    const range = maxCalories - minCalories;

    // Draw background
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * height;
        ctx.strokeStyle = '#eee';
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        const value = Math.round(maxCalories - (i / 5) * range);
        ctx.fillText(value, padding - 10, y + 4);
    }

    // Draw bars
    const barWidth = width / data.length * 0.6;
    const barSpacing = width / data.length;

    data.forEach((calories, index) => {
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const barHeight = ((calories - minCalories) / range) * height;
        const y = canvas.height - padding - barHeight;

        // Bar gradient
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
        gradient.addColorStop(0, '#51cf66');
        gradient.addColorStop(1, '#45b85c');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 20);

        // Value on bar
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(calories, x + barWidth / 2, y + 15);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile hamburger
    const hamburger = document.querySelector('.hamburger-mobile');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
        });
    }

    // Drag and drop for file upload
    const uploadLabel = document.querySelector('.upload-label');
    if (uploadLabel) {
        uploadLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadLabel.style.background = 'rgba(81, 207, 102, 0.15)';
        });

        uploadLabel.addEventListener('dragleave', () => {
            uploadLabel.style.background = '';
        });

        uploadLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('foodImage').files = e.dataTransfer.files;
                analyzeFood();
            }
        });
    }
}

// ===== LOCAL STORAGE =====
function loadUserData() {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
        const defaultProfile = {
            name: 'Sushant Kumar',
            email: 'sushant@example.com',
            age: 25,
            gender: 'Male',
            height: "5'10\"",
            weight: '165 lbs'
        };
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    }
}

console.log('✓ Nutriscan AI loaded successfully!');


// ===== THEME TOGGLE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// ===== FOOD SCANNER =====
function analyzeFood() {
    const fileInput = document.getElementById('foodImage');
    const file = fileInput.files[0];

    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'flex';

        // Simulate AI analysis
        simulateFoodAnalysis();
    };
    reader.readAsDataURL(file);
}

function simulateFoodAnalysis() {
    // Mock food database
    const foodDatabase = [
        {
            name: 'Grilled Chicken & Rice',
            confidence: 96,
            servingSize: '240g',
            calories: 680,
            protein: 25,
            carbs: 72,
            fat: 30,
            fiber: 4,
            sugar: 5,
            sodium: 920,
            potassium: 400,
            healthScore: 7.5,
            recommendation: 'Excellent choice! High in protein and balanced macronutrients.'
        },
        {
            name: 'Greek Salad',
            confidence: 94,
            servingSize: '320g',
            calories: 320,
            protein: 12,
            carbs: 25,
            fat: 18,
            fiber: 6,
            sugar: 8,
            sodium: 450,
            potassium: 380,
            healthScore: 8.5,
            recommendation: 'Very healthy! Rich in vitamins and minerals.'
        },
        {
            name: 'Cheese Pizza',
            confidence: 98,
            servingSize: '240g',
            calories: 680,
            protein: 25,
            carbs: 72,
            fat: 30,
            fiber: 4,
            sugar: 5,
            sodium: 920,
            potassium: 400,
            healthScore: 5.5,
            recommendation: 'Moderate. Consider adding vegetables for more nutrients.'
        }
    ];

    // Pick random food for demo
    const food = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];

    // Update results
    document.getElementById('foodName').textContent = food.name;
    document.getElementById('confidence').textContent = `Confidence: ${food.confidence}%`;
    document.getElementById('calories').textContent = food.calories;
    document.getElementById('protein').textContent = food.protein + 'g';
    document.getElementById('carbs').textContent = food.carbs + 'g';
    document.getElementById('fat').textContent = food.fat + 'g';
    document.getElementById('fiber').textContent = food.fiber + 'g';
    document.getElementById('sugar').textContent = food.sugar + 'g';
    document.getElementById('sodium').textContent = food.sodium + 'mg';
    document.getElementById('potassium').textContent = food.potassium + 'mg';
    document.getElementById('scoreCircle').textContent = food.healthScore.toFixed(1) + '/10';
    document.getElementById('healthRecommendation').textContent = food.recommendation;

    // Show results
    document.getElementById('analysisResult').style.display = 'block';

    // Save to history
    saveFoodAnalysis(food);
}

function saveFoodAnalysis(food) {
    let history = JSON.parse(localStorage.getItem('foodHistory') || '[]');
    history.unshift({
        ...food,
        date: new Date().toLocaleString()
    });
    history = history.slice(0, 50); // Keep last 50
    localStorage.setItem('foodHistory', JSON.stringify(history));
}

function addToMeal() {
    const foodName = document.getElementById('foodName').textContent;
    const calories = document.getElementById('calories').textContent;
    alert(`✓ Added "${foodName}" (${calories} cal) to today's meals!`);
}

function saveFoodHistory() {
    const foodName = document.getElementById('foodName').textContent;
    alert(`✓ Saved "${foodName}" to favorites!`);
}

// ===== BMI CALCULATOR =====
function calculateBMI(event) {
    event.preventDefault();
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }

    const bmi = weight / ((height / 100) ** 2);
    let category = '';
    let advice = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        advice = 'Consider eating more nutritious, calorie-rich foods.';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        advice = 'You are at a healthy weight. Maintain with balanced diet and exercise.';
    } else if (bmi < 30) {
        category = 'Overweight';
        advice = 'Aim for gradual weight loss through balanced diet and regular exercise.';
    } else {
        category = 'Obese';
        advice = 'Consult a healthcare provider for personalized advice.';
    }

    document.getElementById('bmiResult').style.display = 'block';
    document.getElementById('bmiResultValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiResultCategory').textContent = category;
    document.getElementById('bmiAdvice').textContent = advice;

    // Update dashboard
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiCategory').textContent = category;

    // Save to localStorage
    localStorage.setItem('userBMI', JSON.stringify({ bmi: bmi.toFixed(1), category }));
}

// ===== CALORIE CALCULATOR =====
function calculateCalories(event) {
    event.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('calorieWeight').value);
    const height = parseFloat(document.getElementById('calorieHeight').value);
    const gender = document.getElementById('gender').value;
    const activity = document.getElementById('activity').value;

    // Activity multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryactive: 1.9
    };

    // Mifflin-St Jeor formula for BMR
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityMultipliers[activity];
    const lossCalories = tdee - 500; // 500 cal deficit for ~0.5 lb per week loss
    const gainCalories = tdee + 300; // 300 cal surplus for ~0.6 lb per week gain

    document.getElementById('calorieResult').style.display = 'block';
    document.getElementById('bmrValue').textContent = Math.round(bmr);
    document.getElementById('tdeeValue').textContent = Math.round(tdee);
    document.getElementById('lossValue').textContent = Math.round(lossCalories);
    document.getElementById('gainValue').textContent = Math.round(gainCalories);
}

// ===== WATER INTAKE CALCULATOR =====
function calculateWaterIntake(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('waterWeight').value);
    const activity = document.getElementById('waterActivity').value;
    const climate = document.getElementById('climate').value;

    // Base calculation (half body weight in oz, convert to liters)
    let water = weight / 2 * 0.0295735; // oz to liters

    // Activity adjustment
    if (activity === 'moderate') water *= 1.2;
    if (activity === 'high') water *= 1.5;

    // Climate adjustment
    if (climate === 'hot') water *= 1.25;
    if (climate === 'cold') water *= 0.8;

    const cups = Math.round(water * 4.227); // liters to cups

    document.getElementById('waterResult').style.display = 'block';
    document.getElementById('waterValue').textContent = water.toFixed(1);
    document.getElementById('waterCups').textContent = cups;
}

// ===== MACRONUTRIENT CALCULATOR =====
function updateMacroRatios() {
    // Update ratios based on diet type
    const dietType = document.getElementById('dietType').value;
    // Ratios are applied in calculateMacros
}

function calculateMacros(event) {
    event.preventDefault();

    const calories = parseInt(document.getElementById('dailyCalories').value);
    const dietType = document.getElementById('dietType').value;

    let carbRatio, proteinRatio, fatRatio;

    switch(dietType) {
        case 'balanced':
            carbRatio = 0.5; proteinRatio = 0.3; fatRatio = 0.2;
            break;
        case 'highprotein':
            carbRatio = 0.4; proteinRatio = 0.4; fatRatio = 0.2;
            break;
        case 'keto':
            carbRatio = 0.05; proteinRatio = 0.25; fatRatio = 0.7;
            break;
        case 'lowcarb':
            carbRatio = 0.4; proteinRatio = 0.35; fatRatio = 0.25;
            break;
        default:
            carbRatio = 0.5; proteinRatio = 0.3; fatRatio = 0.2;
    }

    const carbCals = calories * carbRatio;
    const proteinCals = calories * proteinRatio;
    const fatCals = calories * fatRatio;

    // 4 calories per gram for carbs and protein, 9 for fat
    const carbsG = Math.round(carbCals / 4);
    const proteinG = Math.round(proteinCals / 4);
    const fatG = Math.round(fatCals / 9);

    document.getElementById('macroResult').style.display = 'block';
    document.getElementById('carbsValue').textContent = carbsG;
    document.getElementById('carbsCals').textContent = Math.round(carbCals);
    document.getElementById('proteinValue').textContent = proteinG;
    document.getElementById('proteinCals').textContent = Math.round(proteinCals);
    document.getElementById('fatValue').textContent = fatG;
    document.getElementById('fatCals').textContent = Math.round(fatCals);
}

// ===== WATER TRACKING =====
function addWater() {
    let waterIntake = parseInt(localStorage.getItem('waterIntake') || '0');
    waterIntake += 1; // Add 1 cup
    localStorage.setItem('waterIntake', waterIntake);
    
    const maxWater = 8;
    document.querySelector('.water-amount').textContent = Math.min(waterIntake, maxWater);
    
    alert(`✓ Added 1 cup! ${waterIntake}/${maxWater} cups completed`);
}

// ===== CHATBOT =====
function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 500);
}

function addChatMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function generateBotResponse(message) {
    const lower = message.toLowerCase();

    const responses = {
        'banana': 'Yes! Bananas are excellent for diabetics in moderation. They have a medium glycemic index (51-68) and are rich in potassium, vitamin B6, and fiber. Consume 1 banana per day or pair with protein to slow glucose absorption.',
        'breakfast': 'Great breakfast ideas under 300 calories:\n• Oatmeal with berries (250 cal)\n• Egg whites with toast (280 cal)\n• Greek yogurt with granola (290 cal)\n• Protein smoothie (280 cal)',
        'protein': `Daily protein needs depend on your activity level:
        • Sedentary: 0.8g per kg body weight
        • Moderate activity: 1.2-1.6g per kg
        • Athletes: 1.6-2.2g per kg
        For example, a 70kg person should eat 56-112g protein daily.`,
        'vegetarian': `Vegetarian meals for weight loss (under 400 cal):
        • Chickpea salad (350 cal)
        • Lentil soup (280 cal)
        • Tofu stir-fry (320 cal)
        • Bean chili (300 cal)`,
        'water': 'The general rule is half your body weight in ounces. For a 150lb person, that\'s 75oz (~2.2 liters) daily. Adjust for activity level and climate.',
        'calorie': 'To lose weight: eat 300-500 calories below your TDEE. To gain: eat 300-500 above. To maintain: eat at your TDEE.',
        'exercise': 'Aim for 150 minutes of moderate cardio + 2 days of strength training weekly for optimal health.',
        'default': 'I\'m here to help with nutrition and health questions! Ask me about calorie counting, macronutrients, specific foods, exercise, or weight goals.'
    };

    for (const [key, value] of Object.entries(responses)) {
        if (lower.includes(key)) {
            return value;
        }
    }

    return responses.default;
}

function toggleVoiceInput() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert('Speech Recognition not supported in your browser');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.onstart = () => {
        document.getElementById('voiceBtn').style.background = '#FF6B6B';
        document.getElementById('voiceBtn').style.color = 'white';
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('chatInput').value = transcript;
    };

    recognition.onend = () => {
        document.getElementById('voiceBtn').style.background = '';
        document.getElementById('voiceBtn').style.color = '';
    };

    recognition.start();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== MEAL PLANNING =====
function generateShoppingList() {
    alert('✓ Shopping list generated and saved to your profile!');
}

// ===== PROFILE =====
function editProfile() {
    alert('Edit profile feature - Coming soon!');
}

function downloadData() {
    const data = {
        profile: localStorage.getItem('userProfile'),
        bmi: localStorage.getItem('userBMI'),
        foodHistory: localStorage.getItem('foodHistory'),
        downloadDate: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'health-data.json';
    link.click();
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        localStorage.clear();
        alert('Account deleted. Redirecting...');
        window.location.href = '/';
    }
}

// ===== CHARTS =====
function initCharts() {
    drawWeightChart();
}

function drawWeightChart() {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = [168, 167.5, 167, 166.5, 166, 165.5, 165];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const padding = 20;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxWeight = Math.max(...data);
    const minWeight = Math.min(...data);
    const range = maxWeight - minWeight;

    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((weight, index) => {
        const x = padding + (index / (data.length - 1)) * width;
        const y = canvas.height - padding - ((weight - minWeight) / range) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#FF6B6B';
    data.forEach((weight, index) => {
        const x = padding + (index / (data.length - 1)) * width;
        const y = canvas.height - padding - ((weight - minWeight) / range) * height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (index / (data.length - 1)) * width;
        ctx.fillText(label, x, canvas.height - 5);
    });
}

// ===== LOCAL STORAGE =====
function loadUserData() {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
        const defaultProfile = {
            name: 'John Doe',
            email: 'john@example.com',
            age: 25,
            gender: 'Male',
            height: "5'10\"",
            weight: '165 lbs'
        };
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const menu = document.querySelector('.nav-menu');
            menu.classList.toggle('active');
        });
    }

    // Drag and drop for file upload
    const uploadLabel = document.querySelector('.upload-label');
    if (uploadLabel) {
        uploadLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadLabel.style.background = 'rgba(255, 107, 107, 0.2)';
        });

        uploadLabel.addEventListener('dragleave', () => {
            uploadLabel.style.background = '';
        });

        uploadLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('foodImage').files = e.dataTransfer.files;
                analyzeFood();
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Initialize on load
console.log('✓ Smart Food & Diet Assistant loaded successfully!');
