// 1. 요소 선택
const itemInput = document.querySelector('#itemInput');
const addButton = document.querySelector('#addButton');
const itemList = document.querySelector('#itemList');

// 2. 입력값 가져오기 함수
function getInputValue() {
    return itemInput.value.trim();
}

// 3. 리스트 항목 생성 함수
function createListItem(text) {
    const li = document.createElement('li');
    
    // 텍스트를 담을 span 요소
    const span = document.createElement('span');
    span.textContent = text;
    span.className = 'item-text';
    
    // 삭제 버튼 생성
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    
    // li 요소에 자식으로 추가
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
}

// 4. 항목 추가 함수
function addItem() {
    const text = getInputValue();
    
    // 공백만 입력된 경우 방지
    if (text === '') {
        alert('할 일을 입력해주세요.');
        return;
    }
    
    // 새로운 항목 생성 및 리스트에 추가
    const newItem = createListItem(text);
    itemList.appendChild(newItem);
    
    // 입력창 초기화
    itemInput.value = '';
    itemInput.focus();
}

// 5. 클릭 이벤트 처리 함수 (이벤트 위임 활용)
function handleListClick(event) {
    const target = event.target;
    
    // 클릭된 요소가 삭제 버튼일 경우
    if (target.classList.contains('delete-btn')) {
        const li = target.parentElement;
        itemList.removeChild(li);
    } 
    // 클릭된 요소가 할 일 텍스트일 경우 (상태 변경)
    else if (target.classList.contains('item-text')) {
        const li = target.parentElement;
        li.classList.toggle('done');
    }
}

// 6. 이벤트 리스너 등록
addButton.addEventListener('click', addItem);

// 엔터 키 이벤트 (선택 사항)
itemInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// 이벤트 위임
itemList.addEventListener('click', handleListClick);