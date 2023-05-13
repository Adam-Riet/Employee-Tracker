USE employee_tracker_db;

INSERT INTO department (name)
VALUES
  ('Marketing'),
  ('Sales'),
  ('Engineering'),
  ('HR');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Marketing Manager', 80000, 1),
  ('Sales Representative', 50000, 2),
  ('Software Engineer', 90000, 3),
  ('HR Specialist', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Jim', 'Carry', 1, NULL),  
  ('Weird', 'Al', 2, 1),  
  ('Robert', 'DeNiro', 3, 1), 
  ('Charles', 'Darwin', 4, 1);

