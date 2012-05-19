// restore_options();


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
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  return;
}