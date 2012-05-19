document.body.addEventListener("DOMNodeInserted", doit, false);
var nodeList = new Array();
var blackList = getBlackList();
var deletedNodes;

var globalContainer = $("div[id='globalContainer']")[0];

if (localStorage.deletedNodes == null) {
  deletedNodes = new Array();
  localStorage.deletedNodes = JSON.stringify(deletedNodes);
}
else {
  deletedNodes = JSON.parse(localStorage.deletedNodes);
}

function getBlackList() {
  // if (localStorage == null)
  //   return new Array();
  // if (localStorage.blackList == null) {
  //   bl = new Array("whoa", "Brondi");
  //   localStorage.blackList = JSON.stringify(bl);
  //   return bl;
  // }
  var bl = JSON.parse(localStorage.blackList);
  return bl;
}

function $(selector, rootNode) {
  var root = rootNode || document;
  var nodeList = root.querySelectorAll(selector);
  if (nodeList.length) {
    return Array.prototype.slice.call(nodeList);
  }
  return [];
};

function print(stuff) {
  console.info(stuff);
}

function looseMatch(a, b) {
  return a.toLowerCase().match(b.toLowerCase());
}

function modifyLike(cloned, pai) {
  cloned.title = "Marcar como lixo";
  cloned.name = "set_junk";
  cloned.setAttribute("class", "as_link");
  cloned.setAttribute("data-ft", "");
  cloned.firstChild.innerText = "Junk";
  cloned.lastChild.innerText = "Unjunk";
  cloned.pai = pai;
  cloned.addEventListener("click", function saveToDeletedNodes(event) {
    alert("Adicionado na categoria Lixo.");
    markAsJunk(this.pai);
  });
  cloned.setAttribute("onclick", "");
  return cloned;
}

function actOnJunk(node) {
  print(node.innerText);
  node.style.backgroundColor="#FFCCCC";
  // node.parentNode.removeChild(node);
}

function markAsJunk(node) {
  deletedNodes.push({"id": JSON.parse(node.getAttribute("data-ft"))["mf_story_key"], "content": node.innerText});
  localStorage.deletedNodes = JSON.stringify(deletedNodes);
  actOnJunk(node);
}

function makeJunkButton(node) {
  var like_links = $("span[class*='uiStreamFooter'] button[class*='like_link']", node);  
  for (var i = 0; i < like_links.length; i++) {
    var cloned = like_links[i].cloneNode(true);
    cloned = modifyLike(cloned, node);
    like_links[i].parentNode.appendChild(cloned);
    like_links[i].parentNode.appendChild(like_links[i].nextSibling.cloneNode());
  }
}

function parse(node) {
  var node_id = JSON.parse(node.getAttribute("data-ft"))["mf_story_key"];
  //makeJunkButton(node);
  for (var deleted in deletedNodes) {
    if (deletedNodes[deleted]["id"] == node_id) {
      actOnJunk(node);
      return;
    }
  }
  for (var word in blackList) {
    if (looseMatch(node.innerText, blackList[word])) {
      markAsJunk(node);
      print(blackList[word]);
    }
  }
}

function addToList(node) {
  for (var i = 0; i < nodeList.length; i++) {
    if (nodeList[i].isEqualNode(node))
      return 0;
  }
  nodeList.push(node);
}

function doit() {
  var story_links = $("li[class*='uiUnifiedStory']");
  var lastNode = nodeList.length;
  story_links.forEach(addToList);
  for (var i = lastNode; i < nodeList.length; i++) {
    parse(nodeList[i]);
    addListenerMenu(nodeList[i]);
  }
}

function achaPai(node) {
  if (!node) {
    console.info("Problema com o nó.");
    return null;
  }
  
  var pai = node.parentNode;
  while (pai.tagName != 'LI') {
    pai = pai.parentNode;
  }
  return pai;
}

function addListenerMenu(node) {
  var botaoMenu = $("a[class*='highlightSelectorButton uiStreamContextButton']", node)[0];
  if (!botaoMenu) {
    console.log("botaoMenu nao encontrado.");
    return;
  }
  var postPai = achaPai(botaoMenu);
  // var postPai_id = JSON.parse(postPai.getAttribute("data-ft"))["mf_story_key"];
  // console.info(postPai_id);
  botaoMenu.pai = postPai;
  botaoMenu.addEventListener("click", function (event) {
    sometimeWhen(existeMenuzinho, mudaMenu, this.pai);
  });
}

function existeMenuzinho() {
  var menuzinho = $("div[class='uiContextualLayerPositioner uiLayer']", globalContainer);
  if (menuzinho.length > 0) {
    if ($("li[class='uiMenuXItem primaryOption __MenuXItem']", menuzinho[0]).length > 0) {
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

function modifySpamMenuItem(cloned, postPai) {
  cloned.title = "Marcar como lixo";
  cloned.name = "set_junk";
  cloned.setAttribute('id', 'set_junk');
  cloned.setAttribute("data-ft", "");
  cloned.firstChild.innerText = "Junk";
  cloned.firstChild.setAttribute("ajaxify", "");
  cloned.pai = postPai;
  cloned.addEventListener("click", function saveToDeletedNodes(event) {
    markAsJunk(this.pai);
  });
  cloned.addEventListener("mouseover", function (event) {
    this.setAttribute('class', 'uiMenuXItem primaryOption __MenuXItem selected');
    this.firstChild.setAttribute('class', 'itemAnchor highlighted');
  });
  cloned.addEventListener("mouseout", function (event) {
    this.setAttribute('class', 'uiMenuXItem primaryOption __MenuXItem');
    this.firstChild.setAttribute('class', 'itemAnchor');
  });
  cloned.setAttribute("onclick", "");
  return cloned;
}

function mudaMenu(postPai) {
  var menuzinho = $("div[class='uiContextualLayerPositioner uiLayer']", globalContainer)[0];
  var menuItem = $("li[class='uiMenuXItem primaryOption __MenuXItem']", menuzinho)[0];
  var set_junk_itens = $("li[id='set_junk']", menuzinho);
  if (set_junk_itens.length == 0) {
    var cloned = menuItem.cloneNode(true);
    cloned = modifySpamMenuItem(cloned, postPai);
    menuItem.parentNode.appendChild(cloned);
  }
}
