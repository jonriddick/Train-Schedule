/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train schedules - then update the html + update the database
// 3. Create a way to retrieve train schedules from the train schedule database.
// 4. Create a way to calculate the next arrival. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate minutes away

// 1. Initialize Firebase

   var config = {
    apiKey: "AIzaSyAw9Gwn0hPSxzBxL52MiAm_Ra8CsAG2nJY",
    authDomain: "train-schedule-3.firebaseapp.com",
    databaseURL: "https://train-schedule-3.firebaseio.com",
    projectId: "train-schedule-3",
    storageBucket: "",
    messagingSenderId: "878019646738"
  };
  firebase.initializeApp(config);



var database = firebase.database();

  
// 2. Button for adding Employees
$("#add-train-btn").on("click", function() {
  
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirst = moment($("#first-train-input").val().trim(), "hh:mm").format("hh:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    first: trainFirst,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  //return false;

});



// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var first = childSnapshot.val().first;
  var frequency = childSnapshot.val().frequency;

  // Train Info
  console.log(name);
  console.log(destination);
  console.log(first);
  console.log(frequency);

  //Calculate next arrival

    // variables
    var tFrequency = frequency;
    var firstTime = first;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log("First Time: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
  tFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

