//Imports the exported Twitter keys from keys.js
var twitKeys = require("./keys.js");

//Assigns the Twitter keys that were exported from keys.js to variables for use in this file	
var cKey = twitKeys.twitterKeys.consumerkey;
var cSecret = twitKeys.twitterKeys.consumersecret;
var aTokenKey = twitKeys.twitterKeys.accesstokenkey;
var aTokenSecret = twitKeys.twitterKeys.accesstokensecret;

//Outputs to make sure the Twitter keys imported correctly
/*
console.log("Consumer Key: " + cKey);
console.log("Consumer Secret: " + cSecret);
console.log("Access Token Key: " + aTokenKey);
console.log("Access Token Secret: " + aTokenSecret);
*/
//----------------------------------------------------------------------------------------------
//Require.js


var requirejs = require('requirejs');

requirejs.config({
	//Pass the top-level main.js/index.js require
	//function to requirejs so that node modules
	//are loaded relative to the top-level JS file.
	nodeRequire: require
});
	
//---------------------------------------------
//Twitter Section

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: cKey,
  consumer_secret: cSecret,
  access_token_key: aTokenKey,
  access_token_secret: aTokenSecret
});


//---------------------------------
//Spotify Section

var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: "76c3fbed757d4b94b2d6464638f60d50",
  secret: "12149a994d0f4c61bb93d6e11ed351e2"
});



//---------------------------------
//For OMDb
var request = require('request');


//For do-what-it-says
var fs = require('fs');



//------------------------------------------------------------------------------
//Gets the user command
var userCommand = process.argv.slice(2);
var userCMDString = userCommand[0];


//Checks to see if the user wanted Tweets
if(userCMDString == "my-tweets")
{
	checkTweets();
}

//------

//Checks to see if the user wanted a song
else if(userCMDString == "spotify-this-song")
{
	var userSong = "";
	//If the user inputed a song name, use that
	if(userCommand.length > 1)
	{
		userSong = userCommand[1];
		//console.log(userSong);
	}
	//If the user didn't give a song name, use The Sign
	else
	{
		userSong = "The Sign";
		//console.log(userSong);
	}

	checkSpoofy(userSong);
	
}

//-----

//Checks to see if the user wanted a movie
else if(userCMDString == "movie-this")
{
	var userMovie = "";
	//If the user inputed a movie name, use that
	if(userCommand.length > 1)
	{
		userMovie = userCommand[1];
		//console.log(userMovie);
	}
	//If the user didn't give a movie name, use Mr. Nobody
	else
	{
		userMovie = "Mr. Nobody";
		//console.log(userMovie);
	}

	checkMovie(userMovie);

}

//-----

//Checks to see if the user wanted to read the command from the text file
else if(userCMDString == "do-what-it-says")
{
	//Reads in the file and then checks what's requested and executes it
	fs.readFile("random.txt", "utf8", function(error, data) {

		//Splits the read in text into an array, using a comma to indicate that the following text is a new array item
		var splitUserRequest = data.split(",");
		var userRequest = "";
		userCMDString = splitUserRequest[0];

		//If there is more than one array item, the second item is the requested song or movie
		if(splitUserRequest.length > 1)
		{
			userRequest = splitUserRequest[1];
			//Takes all of the quotes off of the request
			userRequest = userRequest.replace(/"/g, "");
		}


		//Executes the appropriate function based on what the requested action was
		if(userCMDString == "my-tweets")
		{
			checkTweets();
		}

		else if(userCMDString == "spotify-this-song")
		{
			checkSpoofy(userRequest);
		}

		else if(userCMDString == "movie-this")
		{
			checkMovie(userRequest);
		}



		
		console.log("Requested Action: "+userCMDString);
		console.log("");
		//Troubleshooting
		/*console.log(splitUserRequest);
		//console.log(userRequest);*/
		

	});



}

//------------------------------------------------------------------------------
//Functions

//Pulls in the last 20 tweets
function checkTweets()
{
	//This'll grab the user's last 20 tweets and output the tweet text
	client.get('statuses/user_timeline', function(error, tweets, response) {

		if(error) throw error;
		//console.log(tweets[0].user.created_at);
		//console.log(response);

		//Append to log file
		fs.appendFile("log.txt", "\r\nRequest: My Tweets"+"\r\n-----", function(error) {
		  if(error) throw error;
		});

		for(i = 0; i < tweets.length; i++)
		{
			console.log(tweets[i].text+" (Created at - "+tweets[i].user.created_at+")");

			//Append to log file
			fs.appendFile("log.txt", "\r\n"+tweets[i].text+" (Created at - "+tweets[i].user.created_at+")\r\n", function(error) {
		  		if(error) throw error;
			});
		}

		//Append to log file
		fs.appendFile("log.txt", "-----", function(error) {
		  if(error) throw error;
		});


	});
	


}

//Checks Spotify for the requested song
function checkSpoofy(uSong)
{
	var userSong = "";
	//If the user inputed a song name, use that
	if(uSong != "")
	{
		userSong = uSong;
		//console.log(userSong);
	}
	//If the user didn't give a song name, use The Sign
	else
	{
		userSong = "The Sign";
		//console.log(userSong);
	}



	//Searches for the song
	spotify.search({ type: 'track', query: userSong, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 
	//Use to look at the data 
	//console.log(data.tracks.items[0]);

	var songArtist = data.tracks.items[0].artists[0].name;
	var songName = data.tracks.items[0].name;
	var songPreview = data.tracks.items[0].preview_url;
	var songAlbum = data.tracks.items[0].album.name;
	var songAlbumURL = data.tracks.items[0].album.external_urls.spotify;
	var songURL = data.tracks.items[0].external_urls.spotify;

	//Checks if a song preview wasn't found
	if(songPreview == null)
	{
		songPreview = "No preview available!";
	}

	console.log("Artist: "+songArtist);
	console.log("Album: "+songAlbum);
	console.log("Song Name: "+songName);
	console.log("Song Preview: "+songPreview);
	console.log("Album URL: "+songAlbumURL);
	console.log("Track URL: "+songURL);

	//Append to log file
	fs.appendFile("log.txt", "\r\nRequest: Spotify This"+"\r\n-----"+"\r\nSA: "+songArtist+"\r\nSN: "+songName+"\r\nSP: "+songPreview+"SA: "+songAlbum+"\r\nSAurl: "+songAlbumURL+"\r\nsURL: "+songURL+"\r\n------", function(error) {
	  if(error) throw error;
	});


	});

}

//Checks the OMDb for the requested movie
function checkMovie(uMovie)
{

	var userMovie = "";
	//If the user inputed a movie name, use that
	if(uMovie != "")
	{
		userMovie = uMovie;
		//console.log(userMovie);
	}
	//If the user didn't give a movie name, use Mr. Nobody
	else
	{
		userMovie = "Mr. Nobody";
		//console.log(userMovie);
	}


	//Searches the OMDb API for the movie requested
	request('http://www.omdbapi.com/?apikey=40e9cece&t='+userMovie+'&r=json', function (error, response, data) {
	  //console.log('error:', error); // Print the error if one occurred 
	  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
	  //console.log(data);

	  //Makes the returned data more accessable
	  var jDataConverted = JSON.parse(data);

	  var movieTitle = jDataConverted["Title"];
	  var movieYear = jDataConverted["Year"];
	  var movieIMDBRating = jDataConverted["Ratings"][0].Value;
	  if(jDataConverted["Ratings"].length > 1)
	  {
	  	var movieRTRating = jDataConverted["Ratings"][1].Value;
	  }
	  else
	  {
	  	var movieRTRating = "No Rating";
	  }
	  var movieCountry = jDataConverted["Country"];
	  var movieLanguage = jDataConverted["Language"];
	  var moviePlot = jDataConverted["Plot"];
	  var movieActors = jDataConverted["Actors"];
	  


	  console.log("Movie Title: "+movieTitle);
	  console.log("Year of Release: "+movieYear);
	  console.log("IMDB Rating: "+movieIMDBRating);
	  console.log("Rotten Tomatoes Rating: "+movieRTRating);
	  console.log("Country of Release: "+movieCountry);
	  console.log("Language(s): "+movieLanguage);
	  console.log("Actors: "+movieActors);
	  //Puts the plot on the next line, since it's long-ish
	  console.log("Plot: \n"+moviePlot);

	  //Append to log file
	  fs.appendFile("log.txt", "\r\nRequest: Movie-this"+"\r\n-----"+"\r\nMT: "+movieTitle+"\r\nMY: "+movieYear+"\r\nmIMDB: "+movieIMDBRating+"\r\nmRT: "+movieRTRating+"\r\nMC: "+movieCountry+"\r\nML: "+movieLanguage+"\r\nMP: "+moviePlot+"\r\nMA: "+movieActors+"\r\n------", function(error) {
	  	if(error) throw error;
	  });



	});

}





//For Troubleshooting
//console.log(process.argv);
//console.log(userCommand);
//console.log(userCMDString);
//console.log(userCMDStringCombined);