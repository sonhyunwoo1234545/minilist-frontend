// 1. 요소 선택
const itemInput = document.querySelector('#itemInput');
const addButton = document.querySelector('#addButton');
const itemList = document.querySelector('#itemList');
const filterArea = document.querySelector('#filterArea');

// 2. 데이터 상태 관리 (배열)
let todos = []; 
let currentFilter = 'all';

// 입력값 가져오기 및 공백 검증
function getInputValue() {
    return itemInput.value.trim();
}

// Promise를 활용한 지연 함수
function delayRender(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

// 필터링 로직 (배열 메서드 filter 활용)
function filterItems() {
    if (currentFilter === 'done') {
        return todos.filter(function(todo) { return todo.done === true; });
    }
    if (currentFilter === 'active') {
        return todos.filter(function(todo) { return todo.done === false; });
    }
    return todos;
}

// 요소 생성 및 추가 (innerHTML 금지)
function createListItem(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id; // 이벤트 식별을 위한 고유 ID 부여
    
    if (todo.done) {
        li.classList.add('done');
    }
    
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.className = 'item-text';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    return li;
}

// 화면 렌더링 (데이터 기반 렌더링)
function renderList() {
    // innerHTML = '' 대신 while문으로 기존 노드 안전하게 삭제
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    
    const filteredTodos = filterItems();
    
    filteredTodos.forEach(function(todo) {
        const newItem = createListItem(todo);
        itemList.appendChild(newItem);
    });
}

// 비동기 흐름이 적용된 항목 추가 (async/await)
async function addItem() {
    const text = getInputValue();
    
    if (text === '') {
        alert('할 일을 입력해주세요.');
        return;
    }
    
    // 버튼 비활성화 (UX 개선)
    addButton.disabled = true;
    addButton.textContent = '처리 중...';
    
    // Promise 지연 대기 (0.5초)
    await delayRender(500); 
    
    const newTodo = {
        id: Date.now(),
        text: text,
        done: false
    };
    
    todos.push(newTodo);
    renderList();
    
    // 입력창 초기화
    itemInput.value = '';
    itemInput.focus();
    addButton.disabled = false;
    addButton.textContent = '추가';
}

// 리스트 클릭 이벤트 처리 (이벤트 위임)
function handleListClick(event) {
    const target = event.target;
    const li = target.parentElement;
    
    if (!li.dataset.id) return;
    const id = Number(li.dataset.id); 
    
    if (target.classList.contains('delete-btn')) {
        // filter를 통해 삭제할 항목 제외
        todos = todos.filter(function(todo) { return todo.id !== id; });
        renderList();
    } 
    else if (target.classList.contains('item-text')) {
        // find를 통해 상태 변경할 항목 검색
        const todo = todos.find(function(t) { return t.id === id; });
        if (todo) {
            todo.done = !todo.done;
        }
        renderList();
    }
}

// 필터 버튼 클릭 이벤트 처리 (이벤트 위임)
function handleFilterClick(event) {
    const target = event.target;
    
    if (!target.classList.contains('filter-btn')) return;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    target.classList.add('active');
    
    currentFilter = target.dataset.filter;
    renderList();
}

// 이벤트 리스너 등록
addButton.addEventListener('click', addItem);
itemList.addEventListener('click', handleListClick);
filterArea.addEventListener('click', handleFilterClick);

itemInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});