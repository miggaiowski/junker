document.body.addEventListener("DOMNodeInserted", newElement, false);

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
  if (response!=null){
   localStorage.perf = response.status; 
  }
  
});

var nodeList = new Array();

var globalContainer = $("#globalContainer").first();

var stor = new Storage();
console.info(localStorage.perf);
var userData = stor.getIdDict('0');

// var post_data;
// if (localStorage.post_data == null) {
//   post_data = {
//     posts: {},
//     deleted: {}
//   }
  
//   localStorage.post_data = JSON.stringify(post_data);
// } else {
//   post_data = JSON.parse(localStorage.post_data);
// }

function getBlackList() {
  var bl = JSON.parse(localStorage.blackList);
  return bl;
}

function newElement(el){
  var story = $(".uiUnifiedStory").not(".junker_known").first();
  if(!story.size()) return;
  
  // Tag the story as known
  story.addClass("junker_known");
  addListenerMenu(story);
  
  // Get story ID
  var story_id = getStoryId(story);

  
  if(userData.ratings[story_id]){ 
    actOnJunk(story);
    return;
  }
  
  // Extract the post's data
  var post = parsePost(story);  
  if (!post)
    return;

  userData.posts[story_id] = post;
  stor.saveIdDict(userData);
  
  if (userData.inBlacklist(post.text_content)){
    setStoryRating(story_id, true);
    console.info(story);
    actOnJunk(story);
    return;
  }
}

function addListenerMenu(node) {
  var botaoMenu = $("a[class*='highlightSelectorButton uiStreamContextButton']", node).first();
  if (!botaoMenu) return;

  botaoMenu.data("pai", achaPai(botaoMenu));
  
  botaoMenu.click(function (event) {
    sometimeWhen(existeMenuzinho, mudaMenu, $(this).data("pai"));
  });
}

function looseMatch(a, b) {
  return a.toLowerCase().match(b.toLowerCase());
}

function disactOnJunk(node) {
  node.css("background-color", "#FFFFFF");
}

function actOnJunk(node) {
  node.css("background-color", "#FFCCCC");
}

function toggleJunk(node){
  var story_id = getStoryId(node);
  
  if(userData.ratings[ story_id ]){
    setStoryRating(story_id, false);
    disactOnJunk(node);
    
    return false;   
  } else {
    setStoryRating(story_id, true);
    actOnJunk(node);
    
    return true;
  }
}

function setStoryRating(story_id, rating){
  userData.ratings[ story_id ] = rating;
  stor.saveIdDict(userData);
}

function getStoryId(node){
  var data = node.attr("data-ft");
  if(!data) return;
  
  var node_id = JSON.parse(data)["mf_story_key"];
  return node_id;
}

function addToList(node) {
  nodeList.push(node);
}

function achaPai(node){
  return $(node).parentsUntil("li").parent();
}

function existeMenuzinho() {
  var menuzinho = $(".uiContextualLayer").first();
  
  if (menuzinho) {
    if ( $("li.uiMenuXItem", menuzinho) ) {
      return true;
    }
  }
  return false;
}

function async(fn) {
  setTimeout(fn, 200);
}

function sometimeWhen(existeMenuzinho, mudaMenu, postPai) {
  async(function () {
    if (existeMenuzinho()) {
      mudaMenu(postPai);
    }
    else {
      async(arguments.callee);
    }
  });
}

function mudaMenu(postPai) {
  var story_id = getStoryId(postPai);
  
  var menuzinho = $("div[class='uiContextualLayerPositioner uiLayer']", globalContainer).first();
  var menuItem = $("li[class='uiMenuXItem primaryOption __MenuXItem']", menuzinho).first();
  var set_junk_itens = $("li[id='set_junk']", menuzinho);
  if (set_junk_itens.length == 0) {
    var cloned = menuItem.clone(true);
    cloned = modifySpamMenuItem(cloned, postPai);
    menuItem.parent().append(cloned);
    if (userData.ratings[story_id])
      $(cloned).addClass('checked');
  }
}

function modifySpamMenuItem(cloned, postPai) {
  cloned.name = "set_junk";
  cloned.attr('id', 'set_junk');
  cloned.attr("data-ft", "");
  cloned.children().first().text("Junk");
  cloned.children().first().attr("ajaxify", "");
  
  cloned.click(function (event) {
    
    if( toggleJunk(postPai) )
      $(this).addClass('checked');
    else
      $(this).removeClass('checked');
    
  });
  
  cloned.mouseover(function (event) {
    $(this).addClass('selected');
    $(this).children().first().addClass('highlighted');
  });
  
  cloned.mouseout(function (event) {
    $(this).removeClass("selected");
    $(this).children().first().removeClass('highlighted');
  });
  
  cloned.attr("onclick", "");
  
  return cloned;
}
