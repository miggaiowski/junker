var botao = document.getElementById("save_button");
botao.addEventListener('click', save_options);

// Saves options to localStorage.
function save_options() {
  var filterMode = $('input[name=filterModes]:radio:checked').val();
  console.info(filterMode);
  var blackList = $('#blacklist').val();
  console.info(blackList);
  var memorySize = $('input[name=memorySize]:radio:checked').val();
  console.info(memorySize);
  var userData = {
    'filterMode': filterMode,
    'blackList': blackList,
    'memorySize': memorySize
  };
  localStorage['junker'] = JSON.stringify({'0': userData});
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var userData = JSON.parse(localStorage['junker'])['0'];
  var blackList = $('#blacklist').val(userData['blackList']);
  var filterMode = $('#' + userData['filterMode']);
  filterMode.attr('checked', true);
  console.info(filterMode);
}

restore_options();

