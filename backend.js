



///Junk Dictionary Class
var  JunkDic = function (id,dictionary) {
  this.id = id;
  if (dictionary == null){
     var b = new Array();
     var j = new Array();
     var n = new Array();
     this.blacklist = b;
     this.junk_posts = j;
     this.notjunk_posts = n;
  }
  else{

    this.blacklist = dictionary['blacklist'];
    this.junk_posts = dictionary['junk_posts'];
    this.notjunk_posts = dictionary['notjunk_posts'];
  }//

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
 addToBlacklist: function(word,callback){
  //print("Comparing the word " + word + " with " + this.blacklist);
  for (var w in this.blacklist){
    if (word == this.blacklist[w]){
     return false;
    }
  }
  this.blacklist.push(word);
  return true;
 },

 //Return the Object JSON to store on the Storage.
 getJSON : function(callback){
  var r = {};
  r[this.id] = {};
  r[this.id]['blacklist'] = this.blacklist;
  r[this.id]['junk_posts'] = this.junk_posts;
  r[this.id]['notjunk_posts'] = this.notjunk_posts;
  r[this.id]['id'] = this.id
  return r;
 }
}




//=================Storage Main Function ==============
var  Storage = function () {
}

Storage.prototype = {
  saveIdDict : function (userDic){
   if (localStorage.perf == null){   //Don't have any dic
      var a = {};
      var idSon =  userDic.getJSON();
      a[idSon['id']] = idSon;
      localStorage.perf = JSON.stringify(a);
   } 
   else{
    var aux = JSON.parse(localStorage.perf);
    //var result = this.drill(id,aux) 
    var idSon = userDic.getJSON();
    aux[idSon['id']] = idSon;
    localStorage.perf = JSON.stringify(aux);
   }
  
  },
  getIdDict : function (id,callback){
    if (localStorage.perf == null){
      var a = {};
      localStorage.perf = JSON.stringify(a);
    }
    var aux = JSON.parse(localStorage.perf);
    var result = aux[id];  
    if (result == null){
      return new JunkDic(id);
    }
    else{
      return new JunkDic(id,result);
    }
  },
}

//=========================


//USAGE



//var sto = new Storage();
//var userDict = sto.getIdDict('00001');
//userDict.addToBlacklist('merdinha');
//userDict.addToBlacklist('bostinha')

