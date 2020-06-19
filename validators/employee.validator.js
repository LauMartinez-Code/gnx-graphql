const gnx = require("@simtlix/gnx");
const GNXError = gnx.GNXError;
const EmployeeModel = require("../models/employee").Employee;

//1 - Can't exist more than one employee with the same dni
const CantRepeatDNI = {
  
  validate: async function (typeName, originalObject, materializedObject) {
    const EmployeeFinded = await EmployeeModel.findOne({
      dni: materializedObject.dni,
    });

    if (EmployeeFinded && EmployeeFinded._id != materializedObject.id) {
      throw new EmployeeWithDniRepeatedException(typeName);
    }
  },
};

class EmployeeWithDniRepeatedException extends GNXError {
  constructor(typeName) {
    super(
      typeName,
      "DNI can't be repeated! The DNI of the employee you are trying to create already exists.",
      "EmployeeWithDniRepeatedException"
    );
  }
}

//2 - Employee must have more than 18 years old
const BeOfAge = {
  validate: async function (typeName, originalObject, materializedObject) {
    let today = new Date();
    let birth = materializedObject.birth_date;
    let age = today.getFullYear() - birth.getFullYear();

    if (age < 19) { // are at least 18 years old
      if (age === 18) { //It verifies if it's really 18 years old
        let MonthsDiff = today.getMonth() - birth.getMonth();

        if ( MonthsDiff > 0 || (MonthsDiff === 0 && today.getDate() < birth.getDate()) ) { //not yet birthday || but it's this month
          throw new EmployeeIsUnderAgeOf18Exception(typeName);
        }
      } else {  //if it's less than 19 and it's not 18...
        throw new EmployeeIsUnderAgeOf18Exception(typeName);
      }
    }

    /*
      this other solution works but it is less precise although simpler

      today.setUTCHours(0,0,0,0);
      let age = today - materializedObject.birth_date; //the result is in milliseconds
      age /= 60044;   //convert milliseconds to minutes
      age /= 525604;  //convert to years
      console.log('Age: ', age);
      if(age < 18){
          throw new EmployeeIsUnderAgeOf18Exception(typeName);
      }
    */
  },
};

class EmployeeIsUnderAgeOf18Exception extends GNXError {
  constructor(typeName) {
    super(
      typeName,
      "The age of the employee must be at least 18 years old",
      "EmployeeIsUnderAgeOf18Exception"
    );
  }
}

module.exports = { CantRepeatDNI, BeOfAge };