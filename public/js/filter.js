$(document).ready(function(){
  var fController = new Filter.Controller(Filter.View);
  fController.bindListeners();
});

Filter = {}

Filter.Controller = function(view){
  this.view = new view;
}
 
Filter.Controller.prototype = {
  bindListeners: function(){
    this.filterBtnListener();
  },

  filterBtnListener: function(){
    var self = this;
    $('#filter-btn').on('click', function(e){
      e.preventDefault();      
      self.filterTweets($(this));
    })     
  },

  filterTweets: function(button){
    this.view.clearRiver();
    var filterName = button.siblings().first().val()
      , filterLocation = button.siblings().last().val()
      , self = this;
    $.ajax({
      url: '/filter',
      type: 'GET',
      data: {filterName: filterName, filterLocation: filterLocation}
    }).done(function(tweetObjects){
      for(i in tweetObjects){
        var tweet      = tweetObjects[i], 
            tweetText  = tweet.tweetText, 
            screenName = tweet.screenName, 
            date       = self.formatDate(tweet.date), 
            pic        = tweet.pic, 
            loc        = tweet.loc,
            url        = "https://www.twitter.com/"+ screenName
        $('#tweet-river').prepend("<a href='"+url+"'><div class = 'row tweet-container'><img class ='col-md-2 img-circle img-responsive center-block inline-block' src=" + pic + "><div class='username col-md-7 inline-block'>" + screenName +"</div>"+"<div class='time col-md-3 inline-block'>"+ date+"</div><div class = 'tweet col-md-10 inline-block'>"+tweetText+"</div></div></a>")
      }
    })
      var r = new River.Controller(River.View);
      r.bindListeners(); 
  },

  formatDate: function(utc){
    var dateAndTime = new Date(utc).toString(),
        date        = dateAndTime.split(' '),
        month       = date[1].toString(),
        day         = date[2].toString(),
        year        = date [3].toString()
    return month+" "+day+", "+ year
  }

}

Filter.View = function(){}

Filter.View.prototype = {
  clearRiver: function(){
    $('#tweet-river').children().remove()
  }
}