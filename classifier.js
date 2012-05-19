// Classifier!!!
var Classifier = function () {
    this.initBayes();

    this.storage = new Storage();

    // TODO: change this to real user ID.
    this.userData = this.storage.getIdDict('0');

    if(this.userData.bayes_data != null) {
        this.bayes.fromJSON(this.userData.bayes_data);
    }
}

Classifier.prototype = {
    // Return true if spam!
    isSpam: function(post, callback) {
        var text = tokenize(post.author_name).concat(tokenize(post.text_content));
        return (this.bayes.classify(text) == "junk");
    },

    // Train the naive-bayes
    // post: a parsed post
    // type: "junk" or "notjunk"
    trainWith: function(post, type, callback) {
        var text = tokenize(post.author_name).concat(tokenize(post.text_content));
        this.bayes.train(text, type);

        if(type == "junk")
            this.userData.junk_posts.push(text);
        else
            this.userData.notjunk_posts.push(text);

        this.userData.bayes_data = this.bayes.toJSON();
        this.storage.saveIdDict(this.userData);
    },

    initBayes: function() {
        this.bayes = new Bayesian({
            thresholds:{
                junk: 3,
                notjunk: 1
            }
        });
    }
}


//        var retrain = false;
//
//        if(type == "junk") {
//            if(this.userData.junk_posts.length == this.userData.memorySize) {
//                console.info(this.userData.junk_posts);
//                this.userData.junk_posts.shift();
//                console.info(this.userData.junk_posts);
//                retrain = true;
//            }
//        }
//        else {
//            if(this.userData.notjunk_posts.length == this.userData.memorySize) {
//                this.userData.notjunk_posts.shift();
//                retrain = true;
//            }
//        }
//
//        if(retrain) {
//            this.initBayes();
//
//            for(var i = 0; i < this.userData.junk_posts.length; i++)
//                this.bayes.train(this.userData.junk_posts[i], "junk");
//
//            for(var i = 0; i < this.userData.notjunk_posts.length; i++)
//                this.bayes.train(this.userData.notjunk_posts[i], "notjunk");
//        }