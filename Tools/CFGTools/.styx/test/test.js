
  var userInput = "";



  function getUserInput(){
    return userInput;
  }

  function sanitizeUserInput(ui){
    //it sanitizes it
    return ui;
  }

  function evaluateUserInput(){
    var ui = getUserInput();
    var sanitized = false;

    if (!sanitized) {
      ui = sanitizeUserInput(ui); //sanitize here, or call sanitization function
    }

    return eval(ui);
  }

  evaluateUserInput();
