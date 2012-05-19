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
  var stor = new Storage();
  var userData = stor.getIdDict('0');
  var bl = blackList.split(',');
  for (var word in bl){
    userData.addToBlacklist(bl[word]);
  }
  //userData.setFilterMode(filterMode);
  //userData.setMemorySize(memorySize);
  userData.filterMode = filterMode;
  userData.memorySize = memorySize;
  stor.saveIdDict(userData);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var stor = new Storage();
  var userData = stor.getIdDict('0');
  console.info(userData);
  //var blackList = userData.blacklist;
  $('#blacklist').val(userData.blacklist);
  var filterMode = $('#' + userData.filterMode);
  filterMode.attr('checked', true);
  var memorySize = $('#memorySize' + userData.memorySize);
  console.info(memorySize);
  memorySize.attr('checked', true);
  stor.saveIdDict(userData);
  console.info(filterMode);
}

restore_options();

