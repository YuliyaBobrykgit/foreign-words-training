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
const btnShuffle = document.querySelector('#shuffle-words');

const currentWordNumber = document.querySelector('#current-word');
const examCardsContainer = document.querySelector('#exam-cards');
const studyProgress = document.querySelector('#words-progress');

 

let cardFrontDisplayed = true;
let cardNumber = 0;
let cardNumbers = [];
let studyProgressValue = 0;

let examArray = [];
let indexArray = [];
let examClickCounter = 0;

let selectedCardIndexNumber1 = null;
let selectedCardIndexNumber2 = null;
let selectedPairArr = [];
let succedPairs = [];
let congratsIsShown = false; // чтобы поздравление не показалось несколько раз, если пройти экзамен очень быстро

// RENDERING THE STUDY PART

function regulateWordsProgressBar() {
    if (!cardNumbers.includes(cardNumber)) {
        cardNumbers.push(cardNumber);
        studyProgressValue += calculateWordProgressValue();
        studyProgress.setAttribute('value', studyProgressValue)
    } 
}

function calculateWordProgressValue() {
    const wordProgressStep = 100 / words.length;
    return wordProgressStep;
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
        if (cardFrontDisplayed === true) {
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
    if (cardFrontDisplayed === false) {
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

btnNext.addEventListener('click', () => changeWord('next'));
btnBack.addEventListener('click', () => changeWord('back'));

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

function renderExamCards() {// добавить штуку для того, чтобы заполнялись все вместе карточки, и только потом вставлялись на страницу
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
    if (oddClick === true) {
        selectedCardIndexNumber1 = words.findIndex((wordObject) => wordObject.id === selectedCardValue ||  wordObject.translation === selectedCardValue);
        event.currentTarget.classList.add('not-clickable');
        return selectedCardIndexNumber1;
    } 
    if (oddClick === false) { 
        selectedCardIndexNumber2 = words.findIndex((wordObject) => wordObject.id === selectedCardValue ||  wordObject.translation === selectedCardValue);
        return selectedCardIndexNumber2;
    }
}

function compareExamCards(event) { 
    getSelectedPairIds(event);
    // console.log(`selectedCardIndexNumber1 - ${selectedCardIndexNumber1}`)
    // console.log(`selectedCardIndexNumber2 - ${selectedCardIndexNumber2}`)
    if (selectedCardIndexNumber2 === null) {
        event.currentTarget.classList.add('correct');
    } else if (selectedCardIndexNumber2 == selectedCardIndexNumber1) {
        event.currentTarget.classList.add('correct');
        selectedPairArr.forEach((item) => {
            item.classList.add('fade-out');
            setTimeout(() => item.classList.add('not-visible'), 1000)
            succedPairs.push(item);
        });
    // console.log(succedPairs)
    } else {
        event.currentTarget.classList.add('wrong');
        setTimeout (removeCorrectAndWrongClasses, 500);
    }
    setTimeout(renderSuccessMsg, 1000)
}

btnExam.addEventListener('click', renderExamCards)

// SUCCESS MSG LOGIC

function renderSuccessMsg() { 
    if (congratsIsShown === false && succedPairs.length === examArray.length) {
        alert('Congrats');
        congratsIsShown = true;
        return;
    }
}


// btnShuffle.addEventListener('click', renderShuffledWords)

// const shuffleWords = (array) => { 
//     for (let i = array.length - 1; i > 0; i--) { 
//       const j = Math.floor(Math.random() * (i + 1)); 
//       [array[i], array[j]] = [array[j], array[i]]; 
//     } 
//     const shuffledArray = array;
//     return shuffledArray; 
// };

// function renderShuffledWords() {
//     shuffleWords(words);
//     renderCardFront(cardNumber);
//     console.log(shuffleWords(words))
// }




  // придумать, на что завязать
