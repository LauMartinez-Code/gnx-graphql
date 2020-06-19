const gnx = require("@simtlix/gnx");
const GNXError = gnx.GNXError;
const DepartmentModel = require("../models/department").Department;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;
const DeptManagerModel = require("../models/dept_manager").DeptManager;

//7 - Cant't be 2 departments with the same dept_name
const CantRepeatDepartmentName = {
  validate: async function (typeName, originalObject, materializedObject) {
    const DeptFinded = await DepartmentModel.findOne({
      name: materializedObject.name,
    });

    if (DeptFinded && DeptFinded._id != materializedObject.id) {
      throw new CantRepeatDepartmentNameException(typeName);
    }
  }
};

class CantRepeatDepartmentNameException extends GNXError {
  constructor(typeName) {
    super(
      typeName, 
      "Department Name can\'t be repeated", 
      "CantRepeatDepartmentNameException"
    );
  }
}

//8 & 9 - Can't be 2 employees/managers assigned to the same department in the same portion of time
const VerifyDatesOverlap = {
  validate: async function (typeName, originalObject, materializedObject) {

    let DeptFinded;
    
    if ( typeName == 'DeptEmployeesType') {
      DeptFinded = await DeptEmployeesModel.find( {DepartmentID: materializedObject.DepartmentID} );   
    }
    else{
      DeptFinded = await DeptManagerModel.find( {DepartmentID: materializedObject.DepartmentID} );   
    }
    
    if (DeptFinded) {
      for (const dept of DeptFinded) {
        if ( !(dept.to_date < materializedObject.from_date || materializedObject.to_date < dept.from_date) )  {
          throw new DatesOverlaptedException(typeName);
        }
      }
    }
  }
};

class DatesOverlaptedException extends GNXError {
  constructor(typeName) {
    super(
      typeName,
      `Dates overlap! 2 ${typeName.substring(4, typeName.length-4)} cannot be assigned to the same department in the same time slice`, 
      "DatesOverlaptedException"
    );
  }
}


module.exports = { CantRepeatDepartmentName, VerifyDatesOverlap  };