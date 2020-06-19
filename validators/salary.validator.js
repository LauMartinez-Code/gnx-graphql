const gnx = require("@simtlix/gnx");
const GNXError = gnx.GNXError;
const SalaryModel = require("../models/salary").Salary;

//5 - The same employee cannot have 2 salaries in the same portion of time
const VerifyDatesOverlap = {
    validate: async function (typeName, originalObject, materializedObject) {

        const EmployeeFinded = await SalaryModel.find( {EmployeeID: materializedObject.EmployeeID} );

        if (EmployeeFinded) {
            for (const dept of EmployeeFinded) {
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
        `Dates overlap! The same employee cannot have 2 salaries in the same time slice`, 
        "DatesOverlaptedException"
        );
    }
}

module.exports = { VerifyDatesOverlap };