"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/
//format data from assignRequestFamily, pass to displayRequest
function formatIntermediate(input) {
  input[0] = `Descendants of ${input[0].firstName} ${input[0].lastName}\n`
  for(let i = 1; i < input.length; i++) {
    input[i] = `${input[i].firstName} ${input[i].lastName}\n`
  }
  return input;
}
//alerts user with information they requested
function displayRequest(request) {
  alert(request.toString().replaceAll(",",""));
}

//Assigns "info" to array to display to user
function assignRequestInfo(person) {
  let info = [];

  info[0] = `First Name: ${person.firstName}\n`;
  info[1] = `Last Name: ${person.lastName}\n`;
  info[2] = `Gender: ${person.gender}\n`;
  info[3] = `DoB: ${person.dob}\n`;
  info[4] = `Height: ${person.height}"\n`;
  info[5] = `Weight: ${person.weight} lbs\n`;
  info[6] = `Eye Color: ${person.eyeColor}\n`;
  info[7] = `Occupation: ${person.occupation}\n`;

  return info;
}

//Assigns "family" to array to display to user
function assignRequestFamily(person, people) {
  let family = [];
  let parentID = person.parents;
  let spouseID = person.currentSpouse;
  let personID = person.id;

  let spouse = [];
  if(spouseID !== null) {
    spouse = people.filter(function(person) {
      if(person.id === spouseID) {
        return true;
      }
      else {
        return false;
      }
    })
    spouse = spouse[0];
  }
  else {
    spouse = {
      firstName: "None",
      lastName: "Found"
    }
  }
  
  let siblings = people.filter(function(person) {
    if(person.parents[0] !== undefined && person.parents[1] !== undefined) {
      if((person.parents[0] === parentID[0] || person.parents[0] === parentID[1]) && person.id !== personID) {
        return true;
      }
      else if((person.parents[0] === parentID[0] || person.parents[0] === parentID[1]) && person.id !== personID) {
        return true;
      }
      else {
        return false;
      }
    }
    else if(person.parents[0] !== undefined) {
      if((person.parents[0] === parentID[0] || person.parents[0] === parentID[1]) && person.id !== personID) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  })

  let parents = people.filter(function(person) {
    if(person.id === parentID[0] || person.id === parentID[1]) {
      return true;
    }
    else {
       return false;
    }
  })

  //format data
  family.push(`Spouse: ${spouse.firstName} ${spouse.lastName}\n`);

  for(let i = 0; i < siblings.length; i ++) {
    family.push(`Sibling: ${siblings[i].firstName} ${siblings[i].lastName}\n`);
  }

  for(let i = 0; i < parents.length; i ++) {
    family.push(`Parent: ${parents[i].firstName} ${parents[i].lastName}\n`);
  }

  return family;
}

//Assigns "family" to array to display to user
function assignRequestDescedants(person, people) {
  //let descendantsArr = [];
  let descendants = [person];

  for(let i = 0; i < descendants.length; i++) {
    for(let j = 0; j < people.length; j++) {
      for(let k = 0; k < people[j].parents.length; k++) {
        if(descendants[i].id === people[j].parents[k]) {
          //descendants.push(people[j]);
          descendants.push(assignRequestDescedants(people[j], people));

          descendants[descendants.length - 1] = descendants[descendants.length - 1][0];

        }
      }
    }
  }
  
  return descendants;

}

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      searchResults = gatherTraits(people);
      break;
    default:
      app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  
  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
  

  switch(displayOption){
    case "info":
      displayRequest(assignRequestInfo(person));
      mainMenu(person, people);
      break;
    case "family":
      displayRequest(assignRequestFamily(person, people));
      mainMenu(person, people);
      break;
    case "descendants":
      displayRequest(formatIntermediate(assignRequestDescedants(person, people)));
      mainMenu(person, people);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function gatherTraits(people) {
  let traits = [];
  let category;
  let description;
  for(let i = 0; i < 5; i++) {
    category = promptFor("Enter a trait category\nOr enter 'search', 'restart', or 'quit'", chars);

    switch (category.toLowerCase()) {
      case "restart":
        return app(people);
      case "quit":
        return;
      case "search":
        return searchByTraits(traits, people);
      default:
        description = promptFor("Enter a trait description", chars);
        traits[i] = [category.toLowerCase(), description.toString().toLowerCase()]
    }
  }
  return searchByTraits(traits, people);
}

function searchByTraits(traits, people) {
  let list = [];
  
  for(let i = 0; i < traits.length; i++) {
    switch(traits[i][0]) {
      case "gender":
        list = people.filter(function(person) {
          if(person.gender === traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        }) 
        break;
      case "dob":
        list = people.filter(function(person) {
          if(person.dob === traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        })
        break;
      case "height":
        list = people.filter(function(person) {
          if(person.height == traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        })
        break;
      case "weight":
        list = people.filter(function(person) {
          if(person.weight == traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        })
        break;
      case "eye color":
        list = people.filter(function(person) {
          if(person.eyeColor === traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        })
        break;
      case "occupation":
        list = people.filter(function(person) {
          if(person.occupation === traits[i][1]){
            return true;
          }
          else{
            return false;
          }
        })
        break;
      default:
        break;
    }

    people = list;
  }
  if(list.length > 1) {
    list = trimResults(list);
    return list;
  }
  else {
    list = list[0];
    return list;
  }
}

//needed to ensure a singular person is passed to mainMenu
function trimResults(people) { //WIP
  
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  foundPerson = foundPerson[0];
  return foundPerson;
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
