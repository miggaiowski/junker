var Classifier = function () {
    this.initBayes();

    if(localStorage["bayes_data"] != null)
        this.bayes.fromJSON(localStorage["bayes_data"]);

    if(localStorage["junk_posts"] != null)
        this.junk_posts = JSON.parse(localStorage["junk_posts"]);
    else
        this.junk_posts = new Array();

    if(localStorage["notjunk_posts"] != null)
        this.notjunk_posts = JSON.parse(localStorage["notjunk_posts"]);
    else
        this.notjunk_posts = new Array();
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
        if(type == "junk") {
            var index;
            for(index = 0; index < this.notjunk_posts.length; index++)
                if(this.notjunk_posts[index]["story_id"] == post.story_id)
                    break;

            // Pop from notjunk and retrain
            if(index < this.notjunk_posts.length) {
                this.junk_posts.push(this.notjunk_posts.splice(index, 1)[0]);

                this.initBayes();

                for(var i = 0; i < this.junk_posts.length; i++)
                    this.bayes.train(this.junk_posts[i].content, "junk");

                for(var i = 0; i < this.notjunk_posts.length; i++)
                    this.bayes.train(this.notjunk_posts[i].content, "notjunk");

                this.saveData();
                return;
            }
        }

        var text = tokenize(post.author_name).concat(tokenize(post.text_content));
        this.bayes.train(text, type);

        var parsed_post = {story_id : post.story_id,
                           content : text};

        if(type == "junk")
            this.junk_posts.push(parsed_post);
        else
            this.notjunk_posts.push(parsed_post);

        this.saveData();
    },

    initBayes: function() {
        this.bayes = new Bayesian({
            thresholds: {
                junk: 3,
                notjunk: 1
            }
        });
    },

    saveData: function() {
        localStorage.bayes_data  = this.bayes.toJSON();
        localStorage.junk_posts  = JSON.stringify(this.junk_posts);
        localStorage.notjunk_posts  = JSON.stringify(this.notjunk_posts);
    }
}
