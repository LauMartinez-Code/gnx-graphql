const gnx = require("@simtlix/gnx");
const { employeeFields } = require("../models/employee");
const GNXError = gnx.GNXError;
const EmployeeModel = require("../models/employee").Employee;
//const {Salary} = require("../models/salary");
//const TitleModel = require("../models/title").Title;
const DepartmentModel = require("../models/department").Department;
//const DeptManagerModel = require("../models/dept_manager").DeptManager;
//const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;


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
  }//substring(0,typeName.length-4)
}

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

module.exports = { DateValidation, ValidID: ValidateRelatedID };
