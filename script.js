// VARIABLES

let words = [
    {
        id: 'apple',
        translation: 'яблоко',
        example: 'The apple is red and juicy',
        img: './img/apple.jpg'
    }, 
    {
        id: 'cat',
        translation: 'кот',
        example: 'The cat is sleeping on the couch',
        img: './img/cat.jpg'
    }, 
    {
        id: 'home',
        translation: 'дом',
        example: 'Family decorated their home for the holidays',
        img: './img/home.jpeg'
    }, 
    {
        id: 'popcorn',
        translation: 'попкорн',
        example: 'I love eating popcorn during movies',
        img: './img/popcorn.jpeg'
    }, 
    {
        id: 'street',
        translation: 'улица',
        example: 'The children are playing on the street',
        img: './img/street.jpg'
    }, 

]

const flipCard = document.querySelector('.flip-card');
const studyCards = document.querySelector('.study-cards'); 
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back div');
const headerFront = document.querySelector('#card-front h1');
const imgBack = document.querySelector('#card-back img');
const headerBack = document.querySelector('#card-back h1');
const paragraphBack = document.querySelector('#card-back span');

const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#back');
const btnExam = document.querySelector('#exam');
const sliderControls = document.querySelector('.slider-controls');
const btnShuffle = document.querySelector('#shuffle-words');

const currentWordNumber = document.querySelector('#current-word');
const examCardsContainer = document.querySelector('#exam-cards');

const studyProgress = document.querySelector('#words-progress');
const examProgress = document.querySelector('#exam-progress');
const examCorrectPercentage = document.querySelector('#correct-percent');
const timer = document.querySelector('#time');


const studyMode = document.querySelector('#study-mode');
const examMode = document.querySelector('#exam-mode');

const resultsModal = document.querySelector('.results-modal');
const statsTime = document.querySelector('#timer');
const statsItemTemplate = document.querySelector('#word-stats');
const resultsContent = document.querySelector('.results-content');

let cardFrontDisplayed = true;
let cardNumber = 0;
let cardNumbers = [];
let studyProgressValue = 0;
let examProgressValue = 0;

let examArray = [];
let indexArray = [];
let examClickCounter = 0;
let examWordsAttemptsArray = [];

let selectedCardIndexNumber1 = null;
let selectedCardIndexNumber2 = null;
let selectedPairArr = [];
let succeedPairs = [];
let congratsIsShown = false; // чтобы поздравление не показалось несколько раз, если пройти экзамен очень быстро

// RENDERING THE STUDY PART

function regulateWordsProgressBar() {
    if (!cardNumbers.includes(cardNumber)) {
        cardNumbers.push(cardNumber);
        studyProgressValue += calculateProgressValue(words);
        studyProgress.setAttribute('value', studyProgressValue)
    } 
}

function calculateProgressValue(arr) {
    return wordProgressStep = 100 / arr.length;
}

function renderCardFront(cardNumber = 0) {
    headerFront.textContent = words[cardNumber].id;
    cardFrontDisplayed = true;
    regulateWordsProgressBar();
}
renderCardFront();

function renderCardBack(cardNumber = 0) {
    headerBack.textContent = words[cardNumber].translation;
    paragraphBack.textContent = words[cardNumber].example;
    imgBack.src = words[cardNumber].img;
    cardFrontDisplayed = false;
}

flipCard.addEventListener('click', function flipTheCard(event) {
    if (event.currentTarget.classList.contains('flip-card')) {
        flipCard.classList.toggle('active');        
        if (cardFrontDisplayed) {
            renderCardBack(cardNumber);
        } else {
            renderCardFront(cardNumber);
        }
    } 
})

function regulateSliderBtns () {
    if (cardNumber === 0) {
        btnBack.setAttribute('disabled', '');
    }
    if (cardNumber > 0 && cardNumber < (words.length - 1)) {
        btnBack.removeAttribute('disabled');
        btnNext.removeAttribute('disabled');
    }
    if (cardNumber === (words.length - 1)) {
        btnNext.setAttribute('disabled', '');
    }
}

function setCurrentWordNumber() {
    currentWordNumber.textContent = cardNumber + 1;
}

function changeWord (backOrNext) {
    if (!cardFrontDisplayed) {
        flipCard.classList.toggle('active');
    } // правило, если переворачиваешь, находясь на обратной (back) стороне
    if (backOrNext === 'back') {
        cardNumber -= 1; 
        renderCardFront(cardNumber);
    } else {
        cardNumber += 1;
        renderCardFront(cardNumber);
    }
    regulateSliderBtns();
    setCurrentWordNumber()
}

// RENDERING EXAM CARDS

function getRandomNumber(arr) {
    return randomIndex = Math.floor(Math.random() * arr.length);
}

function getBrandNewNumber(arr) {
    const index = getRandomNumber(arr);
    if (indexArray.includes(index)) {
        return getBrandNewNumber(arr);
    } else {
        indexArray.push(index);
        return index;
    }
}

function collectAllExamCards(englishOrTranslation) {
    for (let i = 0; i < words.length; i++) {
        if (englishOrTranslation === 'english') {
            examArray.push(words[i].id);
        } else {
            examArray.push(words[i].translation);
        }
    }
}

function renderExamCards() {// добавить Fragment (не успела)
    studyCards.classList.add('hidden');
    collectAllExamCards('english');
    collectAllExamCards('translation');
    for (let i = 0; i < examArray.length; i++) {
        const examCard = document.createElement("div");
        examCard.setAttribute('id','exam-card');
        const examCardContent = document.createElement("p");
        examCardContent.textContent = examArray[getBrandNewNumber(examArray)]
        examCard.append(examCardContent);
        examCardsContainer.append(examCard);
        examCard.classList.add('card');
        examCard.addEventListener('click', compareExamCards);
    }
}

function defineOddClicks() {
    examClickCounter += 1;
    if (examClickCounter > 2) {
        removeCorrectAndWrongClasses()// чтобы покрыть кейс, когда юзер тыкает очень быстро, до того, как успеет закончитс анимация, чтобы не оставались цвета на поле
        examClickCounter = 1;
        selectedCardIndexNumber1 = null;
        selectedCardIndexNumber2 = null;
        selectedPairArr = [];
    }
    return examClickCounter % 2 !== 0;
}

function removeCorrectAndWrongClasses() {
    selectedPairArr.forEach((item) => {
    item.classList.remove('not-clickable');
    item.classList.remove('correct');
    item.classList.remove('wrong');
    })
}

function getSelectedPairIds(event) {
    const oddClick = defineOddClicks();
    const selectedCardValue = event.currentTarget.innerText;
    const selectedCardItem = event.currentTarget.closest('#exam-card');
    selectedPairArr.push(selectedCardItem);
    if (oddClick) {
        selectedCardIndexNumber1 = words.findIndex((wordObject) => wordObject.id === selectedCardValue ||  wordObject.translation === selectedCardValue);
        event.currentTarget.classList.add('not-clickable');
        return selectedCardIndexNumber1;
    } 
    if (!oddClick) { 
        selectedCardIndexNumber2 = words.findIndex((wordObject) => wordObject.id === selectedCardValue ||  wordObject.translation === selectedCardValue);
        return selectedCardIndexNumber2;
    }
}

function createArrayOfEnglishWordAttempts(event) {
    const key = words.findIndex((element) => element.id === event.currentTarget.innerText);
    const existingEntry = examWordsAttemptsArray.find(obj => obj.hasOwnProperty(key)); // проверка, есть ли в массиве уже объект с таким ключом
        if (key == -1) {
            return;
        } else if (!existingEntry) {
            const examWordsAttemptsObject = {};
            examWordsAttemptsObject[key] = 1;
            examWordsAttemptsArray.push(examWordsAttemptsObject);
        } else if (existingEntry) {
            const indexInArray = examWordsAttemptsArray.indexOf(existingEntry); // ищем, какому именно объекту увеличить счетчик
            examWordsAttemptsArray[indexInArray][key] += 1;
        }
        console.log(examWordsAttemptsArray)
    return examWordsAttemptsArray;
}

function compareExamCards(event) { 
    getSelectedPairIds(event);
    if (!selectedCardIndexNumber2 && selectedCardIndexNumber2 !== 0) {
        event.currentTarget.classList.add('correct');
    } else if (selectedCardIndexNumber2 === selectedCardIndexNumber1) {
        event.currentTarget.classList.add('correct');
        selectedPairArr.forEach((item) => {
            item.classList.add('fade-out');
            setTimeout(() => item.classList.add('not-visible'), 1000)
            succeedPairs.push(item);
            manageExamProgressBar();
        });
    } else {
        event.currentTarget.classList.add('wrong');
        setTimeout (removeCorrectAndWrongClasses, 500);
    }
    createArrayOfEnglishWordAttempts(event);
    setTimeout(renderStats, 1000)
}


function manageExamProgressBar() {
    examProgressValue += calculateProgressValue(examArray);
    examProgress.value = examProgressValue;
    examCorrectPercentage.textContent = `${examProgressValue}%`;
}

function formatTimer(value) {
    if (value < 10) {
        return `0${value}`
    }        
    return value;
}

let timerId

function setTimer() {
    let ss = 0;
    timerId = setInterval(() => {
        ss++;
        renderTime(ss)
    }, 1000);
}

function renderTime(totalSs) {
    const mm = Math.trunc(totalSs / 60);
    const ss = totalSs % 60;
    timer.textContent = `${formatTimer(mm)}:${formatTimer(ss)}`;
}

function takeExam() {
    renderExamCards();
    setTimer ();
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
}


sliderControls.addEventListener('click', function(event) {
    const targetId = event.target.id;
    switch(targetId) {
        case 'exam': takeExam();
            break;
        case 'next': changeWord('next');
            break;
        case 'back': changeWord('back');
        break;
    }
    })

// SUCCESS MSG LOGIC

function renderStats() { 
    if (!congratsIsShown && succeedPairs.length === examArray.length) {
        clearInterval(timerId);
        congratsIsShown = true;
        setInterval(() => {resultsModal.classList.remove('hidden')}, 500);
        renderStatsItems();
        statsTime.textContent = timer.textContent;
        return;
    }
}

function renderStatsItems() {
    for (let i = 0; i < words.length; i++) { // добавить Fragment (не успела)
        const clone = statsItemTemplate.content.cloneNode(true);
        const statsWord = clone.querySelector('.word span');
        statsWord.textContent = words[i].id;
        const statsAttempts = clone.querySelector('.attempts span');
        console.log(`i - ${i}`)
        for (let j = 0; j < examWordsAttemptsArray.length; j++) {
            const key = +Object.keys(examWordsAttemptsArray[j])[0]; // Получаем ключ объекта
            console.log(`key - ${key}`)
            if (key === i) { // Если ключ совпадает с текущим индексом в words
                console.log('aaaa')
                statsAttempts.textContent = examWordsAttemptsArray[j][key];
                break;
            }
        }
        resultsContent.append(clone);
    }
}
