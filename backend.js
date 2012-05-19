// Junk Dictionary Class
var  JunkDic = function (id,dictionary) {
  this.id = id;
  if (dictionary == null){
    var b = new Array();
    var j = new Array();
    var n = new Array();
    this.blacklist = b;
    this.junk_posts = j;
    this.notjunk_posts = n;
    this.memorySize = 50;
    this.filterMode = "both";
    this.bayes_data = null;
    this.posts = {};
    this.ratings = {};
    this.show = false;
  }
  else {
    this.blacklist = dictionary['blacklist'];
    this.junk_posts = dictionary['junk_posts'];
    this.notjunk_posts = dictionary['notjunk_posts'];
    this.memorySize = dictionary['memorySize'];
    this.filterMode = dictionary['filterMode'];
    this.bayes_data = dictionary['bayes_data'];
    this.posts = dictionary['posts'];
    this.ratings = dictionary['ratings'];
    this.show = dictionary['show'];
  }
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
  inBlacklist: function (content,callback){
    var tokens = tokenize(content);
    // var tokens = content.toLowerCase().split(" ");
    for (var word in tokens){
      //print("Running " + word);
      for (var bl in this.blacklist) {
        // console.info("Comparing token: " + tokens[word] + " with "+ this.blacklist[bl]);
        if (levenshtein(tokens[word], this.blacklist[bl]) < 3) {
          return true;
        }
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
    r['blacklist'] = this.blacklist;
    r['junk_posts'] = this.junk_posts;
    r['notjunk_posts'] = this.notjunk_posts;
    r['id'] = this.id;
    r['memorySize'] = this.memorySize;
    r['filterMode'] = this.filterMode; 
    r['bayes_data'] = this.bayes_data;
    r['posts'] = this.posts;
    r['ratings'] = this.ratings;
    r['show'] = this.show
    return r;
  },

  //  getBlacklist: function(callback) {
  //      return this.blacklist;
  //  },
  // 
  // 
  //  getJunkPosts: function(callback) {
  //      return this.junk_posts;
  //  },
  // 
  // 
  //  getBlacklist: function(callback) {
  //      return this.blacklist;
  //  },


  //  this.blacklist = dictionary['blacklist'];
  //  this.junk_posts = dictionary['junk_posts'];
  //  this.notjunk_posts = dictionary['notjunk_posts'];
  //  this.memorySize = dictionary['memorySize'];
  //  this.filterMode = dictionary['filterMode'];

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
      var nNode = new JunkDic(id);
      this.saveIdDict(nNode);
      return nNode;
    }
    else{
      return new JunkDic(id,result);
    }
  },
}

function levenshtein (s1, s2) {
    // http://kevin.vanzonneveld.net
    // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +            bugfixed by: Onno Marsman
    // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // + reimplemented by: Alexander M Beedie
    // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    // *                returns 1: 3
    if (s1 == s2) {
        return 0;
    }

    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) {
        return s2_len;
    }
    if (s2_len === 0) {
        return s1_len;
    }

    // BEGIN STATIC
    var split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        split = true; // Earlier IE may not support access by string index
    }
    // END STATIC
    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }

    var v0 = new Array(s1_len + 1);
    var v1 = new Array(s1_len + 1);

    var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
    for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1 = '',
        char_s2 = '';
    for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];

        for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx + 1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b;
            }
            if (c < m_min) {
                m_min = c;
            }
            v1[s1_idx + 1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}
//=========================


//USAGE


//function doit(){
//var sto = new Storage();
//var userDict = sto.getIdDict('00001');
//userDict.addToBlacklist('merdinha');
//userDict.addToBlacklist('bostinha')
//
//console.info(userDict.blacklist);
//}

//doit();
