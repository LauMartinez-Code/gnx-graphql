const gnx = require("@simtlix/gnx");
const GNXError = gnx.GNXError;
const DepartmentModel = require("../models/department").Department;
const DeptEmployeesModel = require("../models/dept_employees").DeptEmployees;

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

//7 - Can't be 2 employees assigned to the same department in the same portion of time
/* const deptEmployeesFields = {
  EmployeeID: Schema.Types.ObjectId,  //existe el id
  DepartmentID: Schema.Types.ObjectId,  //x2
  from_date: Date,
  to_date: Date
};
const CantRepeatDepartmentName = {
  validate: async function (typeName, originalObject, materializedObject) {
    const DeptFinded = await DeptEmployeesModel.find({
      id: materializedObject.id,
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
} */


module.exports = { CantRepeatDepartmentName };