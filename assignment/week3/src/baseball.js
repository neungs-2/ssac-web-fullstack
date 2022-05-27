const $inputNumber = document.querySelector('.game__input');
const $checkBtn = document.querySelector('.game__check');
const $restartBtn = document.querySelector('.game__restart');
const $tableStrike = document.querySelector('.table__strike');
const $tableBall = document.querySelector('.table__ball');

const NUM_LENGTH = 3;
let inning = 0;
let arrAnswer;

const initGame = () => {
  removeCell($tableStrike, inning);
  removeCell($tableBall, inning);
  inning = 0;
};

// input 길이 제한
const handleInput = (obj, maxLength) => {
  if (obj.value.length > maxLength) {
    obj.value = obj.value.substr(0, maxLength);
  }
};

// input 확인
const makeSureInput = (inputArray) => {
  const inputSet = new Set(inputArray);
  if (
    $inputNumber.value == '' ||
    inputSet.size < NUM_LENGTH ||
    inputArray[0] == 0
  ) {
    alert('규칙에 맞는 숫자를 입력해주세요.');
    return true;
  }
};

// 정답 생성
const createAnswer = () => {
  const answerList = new Array();
  let count = 0;

  while (count < NUM_LENGTH) {
    let answerNum = Math.floor(Math.random() * 10);
    if (count == 0 && answerNum == 0) continue;
    if (!answerList.includes(answerNum)) {
      answerList.push(answerNum);
      count++;
    }
  }
  return answerList;
};

// table 성적 추가
const insertCell = (score, rowObj) => {
  const newCell = rowObj.insertCell(-1);
  const newScore = document.createTextNode('' + score);
  newCell.appendChild(newScore);
};

// table 성적 제거
const removeCell = (rowObj, iteration) => {
  for (i = 0; i < iteration; i++) {
    rowObj.deleteCell(1);
  }
};

// Alert & 초기화
const slowAlert = (message) => {
  window.setTimeout(() => {
    alert(message);
    initGame();
  }, 100);
};

// check 버튼 클릭 시
$checkBtn.addEventListener('click', () => {
  const arrInput = ('' + $inputNumber.value).split('');
  if (makeSureInput(arrInput)) return;

  let strikeCount = 0;
  let ballCount = 0;
  inning++;

  if (inning === 1) arrAnswer = createAnswer();

  for (let i = 0; i < NUM_LENGTH; i++) {
    if (arrAnswer[i] == arrInput[i]) {
      strikeCount++;
    } else if (arrAnswer.includes(+arrInput[i])) {
      ballCount++;
    }
  }

  insertCell(String(strikeCount), $tableStrike);
  insertCell(String(ballCount), $tableBall);

  if (strikeCount === 3) {
    slowAlert('승리하셨습니다!!');
  }

  if (inning === 9) {
    slowAlert('패배하셨습니다.\n정답:' + arrAnswer.join(''));
  }
});

// restart 버튼 클릭 시
$restartBtn.addEventListener('click', initGame);
