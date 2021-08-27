const $inputNumber = document.querySelector('.game__input');
const $checkBtn = document.querySelector('.game__check');
const $restartBtn = document.querySelector('.game__restart');
const $tableStrike = document.querySelector('.table__strike');
const $tableBall = document.querySelector('.table__ball');

const numLength = 3;
let inning = 0;
let arrAnswer;

const init = () => window.location.reload();
// removeTD($tableStrike, inning);
// removeTD($tableBall, inning);
// inning = 0;

// input 길이 제한
const handleInput = (obj, maxLength) => {
  if (obj.value.length > maxLength) {
    obj.value = obj.value.substr(0, maxLength);
  }
};

// input 확인
const makeSureInput = (inputArray) => {
  const inputSet = new Set(inputArray);
  if ($inputNumber.value == '' || inputSet.size < numLength) {
    alert('규칙에 맞는 숫자를 입력해주세요.');
    return true;
  }
};

// 정답 생성
const createAnswer = () => {
  const answerList = new Array();
  let cnt = 0;

  while (cnt < numLength) {
    let answerNum = Math.floor(Math.random() * 10);
    if (answerList.includes(answerNum)) {
      continue;
    } else {
      answerList.push(answerNum);
      cnt++;
    }
  }
  return answerList;
};

// table 성적 추가
const insertTD = (score, parent) => {
  let newTD = document.createElement('td');
  newTD.innerHTML = '' + score;
  parent.appendChild(newTD);
};

// check 버튼 클릭 시
$checkBtn.addEventListener('click', function () {
  const arrInput = ('' + $inputNumber.value).split('');
  if (makeSureInput(arrInput)) return;

  let strikeCnt = 0;
  let ballCnt = 0;
  inning++;

  if (inning === 1) arrAnswer = createAnswer();

  for (let i = 0; i < numLength; i++) {
    if (arrAnswer[i] == arrInput[i]) {
      strikeCnt++;
    } else if (arrAnswer.includes(+arrInput[i])) {
      ballCnt++;
    }
  }

  insertTD(String(strikeCnt), $tableStrike);
  insertTD(String(ballCnt), $tableBall);

  if (strikeCnt === 3) {
    alert('승리하셨습니다!!');
    init();
  } else if (inning === 9) {
    alert('패배하셨습니다.\n정답:' + arrAnswer.join(''));
    init();
  }
});

// restart 버튼 클릭 시
$restartBtn.addEventListener('click', function () {
  init();
});

// // table 성적 제거
// const removeTD = function (parent, iteration) {
//   for (i = 0; i < iteration; i++) {
//     parent.removeChild(parent.childNodes[2]);
//   }
// };
