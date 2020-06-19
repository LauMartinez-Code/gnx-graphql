const gnx = require("@simtlix/gnx");
const GNXError = gnx.GNXError;
const EmployeeModel = require("../models/employee").Employee;
const SalaryModel = require("../models/salary").Salary;
const TitleModel = require("../models/title").Title;
const DepartmentModel = require("../models/department").Department;
const DeptManagerModel = require("../models/dept_manager").DeptManager;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;


const ValidateRelatedID = {
  validate: async function (typeName, originalObject, materializedObject) {
    
    await ValidateID(EmployeeModel, materializedObject.EmployeeID, 'EmployeeID');

    if (typeName == 'DeptManagerType' || typeName == 'DeptEmployeesType') {
        await ValidateID(DepartmentModel, materializedObject.DepartmentID, 'DepartmentID');
    }
    
    async function ValidateID(model, field, fieldName){
        const TypeFinded = await model.findById(field);

        if (!TypeFinded) {
            throw new IDRelatedDoNotExistsException(typeName, fieldName);
        }
    }

  }
};

class IDRelatedDoNotExistsException extends GNXError {
  constructor(typeName, fieldName) {
    super(
      typeName,
      `You must specify a valid ${fieldName}. Check the data and try again`,
      "IDRelatedDoNotExistsException"
    );
  }
}

//3 - In all the collections from_date must be smaller than to_date
const DateValidation = {
  validate: async function (typeName, originalObject, materializedObject) {
    if (materializedObject.from_date >= materializedObject.to_date) {
      throw new WrongDateRangeException(typeName);
    }
  },
};

class WrongDateRangeException extends GNXError {
  constructor(typeName) {
    super(
      typeName,
      " 'from_date' field cannot be later or equal than 'to_date' field",
      "WrongDateRangeException"
    );
  }
}

//10 - Can't delete a child from a relation
const CheckForRelatedElements = {
  validate: async function (typeName, originalObject, materializedObject) {

    let SomethingFinded;

    if (typeName == 'EmployeeType') {
      
      SomethingFinded = await SalaryModel.findOne({ EmployeeID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'Salary') }
      
      SomethingFinded = await TitleModel.findOne({ EmployeeID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'Title') }

      SomethingFinded = await DeptManagerModel.findOne({ EmployeeID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'DeptManager') }

      SomethingFinded = await DeptEmployeesModel.findOne({ EmployeeID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'DeptEmployees') }

    } else{ //DepartmentType

      SomethingFinded = await DeptManagerModel.findOne({ DepartmentID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'DeptManager') }

      SomethingFinded = await DeptEmployeesModel.findOne({ DepartmentID: originalObject });
      if (SomethingFinded) { throw new HasRelatedElementsException(typeName, 'DeptEmployees') }
    }
  }
};

class HasRelatedElementsException extends GNXError {
  constructor(typeName, relation) {
    super(
      typeName,
      `${typeName.substring(0, typeName.length-4)} have at least 1 ${relation} related`,
      "HasRelatedElementsException"
    );
  }
}


module.exports = { DateValidation, ValidateRelatedID, CheckForRelatedElements};