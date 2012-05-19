function getStoryId(story){
  return JSON.parse(story.attr("data-ft")).mf_story_key;
}

function getAuthorId(story){
  var node = $(".actorName", story).first().children("a").first().attr("data-hovercard");
  if(node) return node.match(/[0-9]+/)[0];

  node = $(".actorName", story).first().attr("data-hovercard");
  if(node) return node.match(/[0-9]+/)[0];
  
  node = $(".passiveName", story).first().attr("data-hovercard");
  if(node) return node.match(/[0-9]+/)[0];
}

function getAuthorName(story){
  var node = $(".actorName", story).first().children("a").first();
  if(node.size()) return node.text();
  
  node = $(".passiveName", story).first();
  if(node.size()) return node.text();

  node = $(".actorName", story).first();
  if(node.size()) return node.text();
}

function getTextContent(story){
  return $(".messageBody", story).first().text();
}

function getApplication(story){
  var data = $('a[data-hovercard*="application"]', story).first().text();
  if(data) return data;
  
  data = $('a[data-appname]', story).first().attr("data-appname");
  if(data) return data;
}

function getOriginalAuthor(story){
  return $('.uiAttachmentDetails[data-ft*=":12}"]>a[data-hovercard*="user"]', story).text();
}

function getRawText(story){  
  var text_elements = $( "*", story ).contents();
  var texts = [];
  
  for (var i = 0; i < text_elements.length; i++) {
    if(text_elements[i].nodeType === 3)
      texts.push($(text_elements[i]).text());
  }
    
  return texts.join(' ');
}

function parsePost(story){
  var post = {
    story_id: getStoryId(story),
    author_id: getAuthorId(story),
    author_name: getAuthorName(story),
    text_content: getTextContent(story),
    application: getApplication(story),
    original_author: getOriginalAuthor(story),
    raw_text: getRawText(story)
  }
  
  if(!post.story_id || !post.author_id || !post.author_name || !post.text_content.toLowerCase)
    return null;
  
  //console.log(post);
  return post;
}
