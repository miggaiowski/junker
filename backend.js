//alert = function(s){WScript.Echo(s)}



var  JunkDic = function (blacklist,junk_posts, notjunk_post) {
  this.blacklist = blacklist;
  this.junk_posts = junk_posts;
  this.notjunk_posts = notjunk_post;
  //

}

JunkDic.prototype = {
  //Simple blackList testing 
  testBlacklist: function (callback){
    print(this.blacklist);
  
  },
 //is in the blacklist??
 //Idea: return a JSON with {'word':1.0,'word2':0.9} Jaccard Similarities
 //words: Array of words,
 //Behavior: Return true in the first ocurrency of a word in the blacklist
 inBlacklist: function (words,callback){
    //print (words);
    for (var word in words){
        //print("Running " + word);
        if (words[word] in this.blacklist){
          return true;
        }
      }
    return false;
 
  
  },
 //Push a word to the blacklist;
 //Return true if the word successfull inserted
 //False in case of word was already in the blacklist
 addBlacklist: function(word,callback){
  //print("Comparing the word " + word + " with " + this.blacklist);
  for (var w in this.blacklist){
    if (word == this.blacklist[w]){
     return false;
    }
  }
  this.blacklist.push(word);
  return true;
 }
 

}



var arg = arguments[0];

var blackl = new Array("santos", "spfc", "neymar");
for (var word in blackl){
  print(blackl[word]);
}

var userDic = new JunkDic(blackl,'','');
userDic.testBlacklist();




