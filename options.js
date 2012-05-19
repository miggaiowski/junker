var botao = document.getElementById("save_button");
botao.addEventListener('click', save_options);


// Saves options to localStorage.
function save_options() {
  var filterMode = $('input[name=filterModes]:radio:checked').val();
  //console.info(filterMode);
  var blackList = $('#blacklist').val();
  //console.info(blackList);
  var memorySize = $('input[name=memorySize]:radio:checked').val();
  //console.info(memorySize);
  var stor = new Storage();
  var userData = stor.getIdDict('0');
  var bl = blackList.split(',');
  userData.blacklist = [];
  for (var word in bl){
    userData.addToBlacklist(bl[word]);
  }
  //userData.setFilterMode(filterMode);
  //userData.setMemorySize(memorySize);
  userData.filterMode = filterMode;
  userData.memorySize = memorySize;
  //var show = $('input[name=showhidejunk]:checkbox:checked').val();
  var show = $('input[type=checkbox]').is(':checked');
  userData.show = show;
  stor.saveIdDict(userData);

/*  chrome.extension.sendRequest({method: "getStatus"}, function(response) {

    if (response!=null){
      var bl = response.status[0]['blacklist'];
      var show = response.status[0]['show'];
      var filterMode = response.status[0]['filterMode'];
      userData.blacklist = bl;
      userData.show = show;
      userData.filterMode = filterMode;
      stor.saveIdDict(userData);
      userData = stor.getIdDict('0');
    }*/

    }); //Send the new class 
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var stor = new Storage(); //new storage and get data
  var userData = stor.getIdDict('0');
  $('#blacklist').val(userData.blacklist); 
  var filterMode = $('#' + userData.filterMode);
  filterMode.attr('checked', true);
  var memorySize = $('#memorySize' + userData.memorySize);
  var show = $('#showJunk');
  if (userData.show)
    show.attr('checked', true);
  stor.saveIdDict(userData);
}

restore_options();

