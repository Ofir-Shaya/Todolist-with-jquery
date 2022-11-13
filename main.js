var currentInput = '';
var myList = [];
// .match(/\d/g).join('');

function ready() {
  $('.todo-input').on('input', function () {
    currentInput = this.value;
  });

  $('.todo-input').keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13) {
      handleAdd();
    }
  });

  $(document).on('keypress', '.edit-task-input', function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13) {
      var newThis = $(this).siblings('div').children('.finish-btn');
      handleFinishEdit(newThis);
    }
  });

  $('.addBtn').on('click', handleAdd);
}

function handleAdd() {
  if (currentInput.trim().length < 2) {
    throw new Error('Must enter a valid input');
  }

  myList.push({
    key: $('.ul-tasks li').length,
    text: currentInput,
    isComplete: false,
    createdAt: new Date(),
  });

  $('.ul-tasks').html('');

  myList.map(function (element) {
    handleNewLi(element);
  });

  $('.todo-input').focus();
  $('.todo-input')[0].value = '';
  assignBtnFunctions();
  currentInput = '';
}

function handleNewLi(element) {
  var html = `
        <li id="${element.key}" class="todo-item ${
    element.isComplete ? 'todo-complete' : ''
  }">
            <input id="${
              element.key
            }itemCheckBox" type="checkbox" class="control" ${
    element.isComplete ? 'checked' : ''
  }></input>
            <p>${element.text}</p>
            <div class="btn-group">
              <a id="${element.key}itemEdit" href="#" class="edit-btn">✏️</a>
              <a id="${
                element.key
              }itemFinish" href="#" class="finish-btn">✅</a>
              <a href="#" class="delete-btn">❌</a>
            </div>
        </li>
    `;

  $('ul.ul-tasks').append(html);
}

function assignBtnFunctions() {
  $('.control').on('change', changeIsComplete);
  $('.edit-btn').on('click', handleStartEdit);
  $('.finish-btn').on('click', handleFinishEdit);
  $('.delete-btn').on('click', handleDeleteItem);
}

function changeIsComplete(e, newIsComplete) {
  var id = Number($(this)[0].id.match(/\d/g).join(''));
  var item = myList.find((element) => element.key === id);

  handleComplete($(this).parent('li'));
  item.isComplete =
    typeof newIsComplete === 'boolean' ? newIsComplete : !item.isComplete;
  myList[id] = item;
}

function handleComplete(liElement) {
  $(liElement).hasClass('todo-complete')
    ? $(liElement).removeClass('todo-complete')
    : $(liElement).addClass('todo-complete');
}

function handleStartEdit(e) {
  var id = Number($(this)[0].id.match(/\d/g).join(''));
  var editItem = myList[id];

  $(this).parent().children('.edit-btn, .delete-btn').toggle();
  $(this).siblings('.finish-btn').toggle();
  $(this)
    .parent()
    .siblings('p:first')
    .replaceWith(
      $(`<input id="editTxt" value=${editItem.text} class="edit-task-input">`)
    );
}

function handleFinishEdit(newThis, text) {
  let fakeThis = $(this);
  if ($.isWindow($(this)[0])) {
    fakeThis = newThis;
  }

  if (typeof text === 'string' && !text.trim().length < 2) {
    console.log('a');
    var newText = text;
  } else if (
    !(fakeThis.parent().siblings('#editTxt')[0].value.trim().length < 2)
  ) {
    var newText = fakeThis.parent().siblings('#editTxt')[0].value;
  } else {
    throw new Error('Must enter a valid input');
  }

  var id = Number(fakeThis[0].id.match(/\d/g).join(''));
  myList[id].text = newText;

  fakeThis
    .parent()
    .siblings('#editTxt')
    .replaceWith($(`<p>${newText}</p>`));
  fakeThis.toggle();
  fakeThis.siblings('a').toggle();
}

function handleDeleteItem() {
  var deleteItem = $(this).closest('li.todo-item')[0];

  if (!myList[deleteItem.id].isComplete)
    if (confirm("Are you sure? you haven't finished the task yet")) {
    } else return;

  var id = Number(deleteItem.id.match(/\d/g).join(''));
  myList = $.grep(myList, function (element) {
    return element.key !== id;
  });

  $('.ul-tasks').html('');
  updateId();
  myList.map(function (element) {
    handleNewLi(element);
  });
  assignBtnFunctions();
}

function updateId() {
  $(myList).each(function (i) {
    this.key = i;
  });
}

$(window).on('load', ready());
