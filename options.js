var botao = document.getElementById("save_button");
botao.addEventListener('click', save_options);

function enableSave() {
  $("#save_button").attr("disabled", false);
  $("#save_button").text("Save");
}

$('input[name=filterModes]').click(enableSave);
$('#blacklist').change(enableSave);
$('input[type=checkbox]').change(enableSave);

function save_options() {
  var filterMode = $('input[name=filterModes]:radio:checked').val();
  var blackList = $('#blacklist').val();
  var memorySize = $('input[name=memorySize]:radio:checked').val();

  var stor = new Storage();
  stor.getIdDict('0', function(userData){
    var bl = blackList.split(',');
    userData.blacklist = [];
    for (var word in bl){
      userData.addToBlacklist(bl[word]);
    }

    userData.filterMode = filterMode;
    userData.memorySize = memorySize;

    var show = $('input[type=checkbox]').is(':checked');
    userData.show = show;
    stor.saveIdDict(userData);

    $("#save_button").attr("disabled", true);
    $("#save_button").text("Saved");
    
    chrome.tabs.reload();

  });
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var stor = new Storage(); //new storage and get data
  stor.getIdDict('0', function(userData){
    $('#blacklist').val(userData.blacklist); 
    var filterMode = $('#' + userData.filterMode);
    filterMode.attr('checked', true);
    var memorySize = $('#memorySize' + userData.memorySize);
    var show = $('#showJunk');
    if (userData.show)
    show.attr('checked', true);
    stor.saveIdDict(userData);

  });

}

restore_options();

