// This function is triggered when the form is submitted
function onFormSubmit(e) {
  var form = FormApp.getActiveForm();
  var response = e.response;
  var itemResponses = response.getItemResponses();
  var choiceResponse = itemResponses[itemResponses.length - 1]; // Last question

  var selectedOption = choiceResponse.getResponse();

  // Define constant option names
  var optionNames = ["100", "200", "300"]; // Add your actual option names here

  var optionLimits = {
    "100": 1,
    "200": 2,
    "300": 1
  }; // Adjust the limits for each option as needed

  var optionCounts = {};
  optionNames.forEach(function(name) {
    optionCounts[name] = 0;
  });

  // Count the number of times each option has been selected
  var responses = form.getResponses();
  for (var i = 0; i < responses.length; i++) {
    var itemResponses = responses[i].getItemResponses();
    var currentChoiceResponse = itemResponses[itemResponses.length - 1]; // Last question

    var selectedChoice = currentChoiceResponse.getResponse();
    optionCounts[selectedChoice]++;
  }

  // Check if all options have reached their limits
  var allOptionsReachedLimit = optionNames.every(function(name) {
    return optionCounts[name] >= optionLimits[name];
  });

  form.getItems(FormApp.ItemType.MULTIPLE_CHOICE).forEach(function(item) {
    var itemAsMCQ = item.asMultipleChoiceItem();
    if (itemAsMCQ.getTitle() == "Donation") {
      var availableChoices = [];

      optionNames.forEach(function(name) {
        if (optionCounts[name] < optionLimits[name]) {
          availableChoices.push(name);
        }
      });

      if (availableChoices.length > 0) {
        itemAsMCQ.setChoiceValues(availableChoices);
      } else {
        form.setAcceptingResponses(false); // Disable the form
        form.setDescription("This form is no longer accepting responses. The seats are filled."); // Add a message
      }
    }
  });
}
