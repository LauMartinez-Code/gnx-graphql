# gnx-graphql

# About the App
This Node application solves the following problem

*Requisites
1 - Create collections employees, salaries, titles, departments, dept_manager, dept_employees
2 - Employee must have dni, birth_date, firsta_name, last_name, gender, hire_date
3 - Salaries must have empId, salary, from_date, to_date
4 - Titles(role in the company) must have empId, title, from_date, to_date
5 - Departments must have dept_name
6 - Dept_manager must have empId, deptId, from_date, to_date
7 - Dept_employee must have empId, deptId, from_date, to_date

*Restrictions
1 - Can't exist more than one employee with the same dni
2 - Employee must have more than 18 years old
3 - In all the collections from_date must be smaller than to_date
4 - The same employee cannot have 2 titles with the same dept_name in the same portion of time
5 - Gender must be implemented as Enum
6 - Cant't be 2 departments with the same dept_name
7 - Can't be 2 employees assigned to the same department in the same portion of time
8 - Can't be 2 managers assigned to the same department in the same portion of time
9 - Can't delete a child from a relation 

Keep in mind
1 - All the collections are independent
2 - All the collections can be query with the proper relations
3 - All the mutations have to implement the restrictions specified


To run this app:
# Install
## nvm (Node Version Manager)
[nvm](https://github.com/nvm-sh/nvm)
## run-rs
[run-rs](https://www.npmjs.com/package/run-rs)
```bash
npm install run-rs -g
```
## mongo-express
[mongo-express](https://www.npmjs.com/package/mongo-express)
```bash
npm install -g mongo-express
```
## Download npm dependencies
At the project root folder run
```bash
npm install
```
# Run
Start mongodb with replica sets
```bash
run-rs
```

Start node app
```bash
npm run dev
```

To test the GraphQL queries through GraphiQL access to
localhost:3000/graphql

# Extras
To interact with mongodb you can use mongo-express
```bash
mongo-express -U "mongodb://localhost:27017,localhost:27018,localhost:27019/example?replicaSet=rs"
```
or 
```bash
mongo-express -U "mongodb://YourIP:27017,YourIP:27018,YourIP:27019/example?replicaSet=rs"
```
