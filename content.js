var stor = new Storage();
var userData;
var nodeList = new Array();

var globalContainer = $("#globalContainer").first();
var classifier = new Classifier();

chrome.extension.sendRequest({method: "get"}, function(response){
  if(!response.userData)
    userData = new JunkDic('0');
  else
    userData = new JunkDic('0', response.userData);
  
  document.body.addEventListener("DOMNodeInserted", newElement, false);
  $('li.uiUnifiedStory').each(newElement);
});

function newElement(el) {
  // console.info(userData.filterMode);
  var story = $(".uiUnifiedStory").not(".junker_known").first();
  if(!story.size()) return;
  
  // Tag the story as known
  story.addClass("junker_known");
  addListenerMenu(story);
  
  // Get story ID
  var story_id = getStoryId(story);
  
  if(userData.ratings[story_id]){ 
    doTheHide(story);
    return;
  }
  
  // Extract the post's data
  var post = parsePost(story);  
  if (!post)
    return;
  
  if(post.author_id == getUid())
    return;

  userData.posts[story_id] = post;
  stor.saveIdDict(userData);

  if (userData.inBlacklist(post.raw_text) || classifier.isSpam(post)){
    setStoryRating(story_id, true);
    doTheHide(story);
    return;
  } else {
//    if (Math.random() > 0.75)
//      classifier.trainWith(post, "notjunk");
  }

  if (userData.filterMode == "bl_only") {
    if (userData.inBlacklist(post.raw_text)){
      setStoryRating(story_id, true);
      doTheHide(story);
      return;
    }
  }
  else if (userData.filterMode == "bayes") {
    if (classifier.isSpam(post)){
      setStoryRating(story_id, true);
      doTheHide(story);
//      classifier.trainWith(post, "junk");
      return;
    }
    else {
//      if (Math.random() > 0.9)
//        classifier.trainWith(post, "notjunk");
    }
  }
  else {
    if (userData.inBlacklist(post.raw_text) || classifier.isSpam(post)){
      setStoryRating(story_id, true);
      doTheHide(story);
//      classifier.trainWith(post, "junk");
      return;
    }
    else {
//      if (Math.random() > 0.9)
//        classifier.trainWith(post, "notjunk");
    }
  }
}

function getUid(){
  return $('.uiMorePagerPrimary[ajaxify*="notifications"]').attr("ajaxify").match(/[0-9]+/)[0];
}

function doTheHide(node) {
  var mostraSpam = userData.show;
  if (!mostraSpam) 
    node.hide("slow");
  else {
//    node.css("opacity", 0.5);
    node.fadeTo("slow", 0.3, null);
    node.addClass("faded");
  }
}

function doTheShow(node) {
  node.removeClass("faded");
  node.fadeTo("slow", 1, null);
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

function toggleJunk(node){
  var story_id = getStoryId(node);
  
  if(userData.ratings[ story_id ]){
    setStoryRating(story_id, false);
    if (userData.filterMode == "both" || userData.filterMode == "bayes") {
  //    classifier.trainWith(userData.posts[story_id], "notjunk");
  //    classifier.trainWith(userData.posts[story_id], "notjunk");
    }
    doTheShow(node);
    
    return false;   
  } else {
    setStoryRating(story_id, true);
  //  classifier.trainWith(userData.posts[story_id], "junk");
    
    doTheHide(node);

    var tokens = tokenize(userData.posts[story_id].text_content);
    var sugDiv = "<div class='term-offer'><h1>This story has been marked as junk.</h1><p>";
    if(tokens.length) sugdiv +="<b>Click any of the following terms to add them to the blacklist, or click outside to dismiss this message.</b><br/><br/>" +
    "<span class='term-click'>" + tokens.sort().join("</span> <span class='term-click'>") + "</span>";
    sugDiv +="</p></div>";
    
    $(node).before(sugDiv);
    
    $(document).mouseup(function(e){
        var container = $(".term-offer");

        if (container.has(e.target).length === 0)
            container.slideUp(500);
    });
    
    $('.term-click').click(function(){
      userData.addToBlacklist($(this).text());
      $(this).hide("slow");
      
      chrome.extension.sendRequest({method: "set", userData: userData.getJSON()});
      stor.saveIdDict(userData);
      
    });
    
    $(".term-offer").blur(function(){ this.slideUp(500); });
    

  //  if (userData.filterMode == "both" || userData.filterMode == "bayes")
  //    classifier.trainWith(userData.posts[story_id], "junk");

    return true;
  }
}

function setStoryRating(story_id, rating){
  userData.ratings[ story_id ] = rating;
  chrome.extension.sendRequest({method: "set", userData: userData.getJSON()});
  
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
  var bla = $(node).parentsUntil("li").parent().first();
  return bla;
}

function existeMenuzinho() {
  var menuzinho = $(".uiContextualLayer").first();
  
  if (menuzinho.length) {
    if ( $(".uiMenuXSeparator", menuzinho).length ) {
      return true;
    }
  }
  return false;
}

function async(fn) {
  setTimeout(fn, 50);
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
      
    $(this).children().first().removeClass('highlighted');
    
    async(function(){ 
      $('#FB_HiddenContainer').trigger('click'); 
      });
      
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
