const mysql = require("mysql");
const { dbHost, user, password, database } = require("../config");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
const router = Router();

var email_in_use = "";
var password_in_use = "";
var who = "";

const con = mysql.createConnection({
  host: dbHost,
  user,
  password,
  database,
  port: 3306,
  multipleStatements: true,
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

async function hashPwd(password) {
  const salt = await bcrypt.genSalt();
  const psw = await bcrypt.hash(password, salt);
  return psw;
}

//Checks if patient exists in database
router.get("/checkIfPatientExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE email = "${email}"`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Creates User Account
router.get("/makeAccount", async (req, res) => {
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let email = query.email;
  let address = query.address;
  let gender = query.gender;
  let medications = query.medications;
  let conditions = query.conditions;
  let surgeries = query.surgeries;
  if (medications === undefined) {
    medications = "none";
  }
  if (conditions === undefined) {
    conditions = "none";
  }
  if (!surgeries === undefined) {
    surgeries = "none";
  }
  let password = await hashPwd(query.password);
  let sql_statement =
    `INSERT INTO Patient (email, password, name, address, gender) 
                         VALUES ` +
    `("${email}", "${password}", "${name}", "${address}", "${gender}")`;
  console.log(sql_statement);
  try {
    con.query(sql_statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        email_in_use = email;
        password_in_use = password;
        who = "pat";
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  sql_statement = "SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;";
  console.log(sql_statement);
  try {
    con.query(sql_statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        let generated_id = 1000;
        if (results.length > 0) {
          generated_id = results[0].id + 1;
        }
        let sql_statement =
          `INSERT INTO MedicalHistory (id, date, conditions, medication) 
          VALUES ` +
          `("${generated_id}", curdate(), "${conditions}", "${medications}")`;
        console.log(sql_statement);
        con.query(sql_statement, function (error, results, fields) {
          if (error) console.log(error);
          else {
            let sql_statement =
              `INSERT INTO PatientsFillHistory (patient, history) 
              VALUES ` + `("${email}",${generated_id})`;
            console.log(sql_statement);
            con.query(sql_statement, function (error, results, fields) {
              if (error) console.log(error);
              else {
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//Checks If Doctor Exists
router.get("/checkIfDocExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Makes Doctor Account
router.get("/makeDocAccount", (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let sql_statement =
    `INSERT INTO Doctor (email, gender, password, name) 
                         VALUES ` +
    `("${email}", "${gender}", "${password}", "${name}")`;
  console.log(sql_statement);
  try {
    con.query(sql_statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        let sql_statement =
          `INSERT INTO DocsHaveSchedules (sched, doctor) 
                         VALUES ` + `(${schedule}, "${email}")`;
        console.log(sql_statement);
        con.query(sql_statement, function (error) {
          if (error) console.log(error);
        });
        email_in_use = email;
        password_in_use = password;
        who = "doc";
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Checks if patient is logged in
router.get("/checklogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Patient 
                         WHERE email="${email}" 
                         AND password="${password}"`;
  console.log(sql_statement);
  try {
    con.query(sql_statement, function (error, results, fields) {
      if (error) {
        console.log("error");
        return res.status(500).json({ failed: "error ocurred" });
      } else {
        if (results.length === 0) {
        } else {
          var string = JSON.stringify(results);
          var json = JSON.parse(string);
          email_in_use = email;
          password_in_use = password;
          who = "pat";
        }
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Checks if doctor is logged in
router.get("/checkDoclogin", (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * 
                         FROM Doctor
                         WHERE email="${email}" AND password="${password}"`;
  console.log(sql_statement);
  try {
    con.query(sql_statement, function (error, results, fields) {
      if (error) {
        console.log("eror");
        return res.status(500).json({ failed: "error ocurred" });
      } else {
        if (results.length === 0) {
        } else {
          var string = JSON.stringify(results);
          var json = JSON.parse(string);
          email_in_use = json[0].email;
          password_in_use = json[0].password;
          who = "doc";
          console.log(email_in_use);
          console.log(password_in_use);
        }
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Resets Patient Password
router.post("/resetPasswordPatient", (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Patient 
                     SET password = "${newPassword}" 
                     WHERE email = "${email}" 
                     AND password = "${oldPassword}";`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Resets Doctor Password
router.post("/resetPasswordDoctor", (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Doctor
                     SET password = "${newPassword}" 
                     WHERE email = "${email}" 
                     AND password = "${oldPassword}";`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Returns Who is Logged in
router.get("/userInSession", (req, res) => {
  return res.json({ email: `${email_in_use}`, who: `${who}` });
});

//Logs the person out
router.get("/endSession", (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});

//Appointment Related

//Checks If a similar appointment exists to avoid a clash
router.get("/checkIfApptExists", (req, res) => {
  let cond1,
    cond2,
    cond3 = "";
  let params = req.query;
  let email = params.email;
  let doc_email = params.docEmail;
  let startTime = params.startTime;
  let date = params.date;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10);
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${startTime}', TIME)`;
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
    WHERE patient = "${email}" AND
    appt = id AND
    date = ${sql_date} AND
    starttime = ${sql_start}`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        cond1 = results;
        statement = `SELECT * FROM Diagnose d INNER JOIN Appointment a 
        ON d.appt=a.id WHERE doctor="${doc_email}" AND date=${sql_date} AND status="NotDone" 
        AND ${sql_start} >= starttime AND ${sql_start} < endtime`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) console.log(error);
          else {
            cond2 = results;
            statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
            INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
            WHERE doctor="${doc_email}" AND 
            day=DAYNAME(${sql_date}) AND 
            (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`;
            //not in doctor schedule
            console.log(statement);
            con.query(statement, function (error, results, fields) {
              if (error) console.log(error);
              else {
                if (results.length) {
                  results = [];
                } else {
                  results = [1];
                }
                return res.json({
                  data: cond1.concat(cond2, results),
                });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
  //doctor has appointment at the same time - Your start time has to be greater than all prev end times
});

//Returns Date/Time of Appointment
router.get("/getDateTimeOfAppt", (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                            endtime as end, 
                            date as theDate 
                     FROM Appointment 
                     WHERE id = "${id}"`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        console.log(JSON.stringify(results));
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Patient Info Related

//to get all doctor names
router.get("/docInfo", (req, res) => {
  let statement = "SELECT * FROM Doctor";
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To return a particular patient history
router.get("/OneHistory", (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =
    `SELECT gender,name,email,address,conditions,surgeries,medication
                      FROM PatientsFillHistory,Patient,MedicalHistory
                      WHERE PatientsFillHistory.history=id
                      AND patient=email AND email = ` + email;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To show all patients whose medical history can be accessed
router.get("/MedHistView", (req, res) => {
  let params = req.query;
  let patientName = "'%" + params.name + "%'";
  let secondParamTest = "" + params.variable;
  let statement = `SELECT name AS 'Name',
                      PatientsFillHistory.history AS 'ID',
                      email FROM Patient,PatientsFillHistory
                      WHERE Patient.email = PatientsFillHistory.patient
                      AND Patient.email IN (SELECT patient from PatientsAttendAppointments 
                      NATURAL JOIN Diagnose WHERE doctor="${email_in_use}")`;
  if (patientName != "''") statement += " AND Patient.name LIKE " + patientName;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Returns Appointment Info To patient logged In
router.get("/patientViewAppt", (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientsAttendAppointments.appt as ID,
                    PatientsAttendAppointments.patient as user, 
                    PatientsAttendAppointments.concerns as theConcerns, 
                    PatientsAttendAppointments.symptoms as theSymptoms, 
                    Appointment.date as theDate,
                    Appointment.starttime as theStart,
                    Appointment.endtime as theEnd,
                    Appointment.status as status
                    FROM PatientsAttendAppointments, Appointment
                    WHERE PatientsAttendAppointments.patient = "${email}" AND
                    PatientsAttendAppointments.appt = Appointment.id`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Checks if history exists
router.get("/checkIfHistory", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement =
    "SELECT patient FROM PatientsFillHistory WHERE patient = " + email;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Adds to PatientsAttendAppointment Table
router.get("/addToPatientSeeAppt", (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                   VALUES ("${email}", ${appt_id}, "${concerns}", "${symptoms}")`;
  console.log(sql_try);
  try {
    con.query(sql_try, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Schedules Appointment
router.get("/schedule", (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10);
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${time}', TIME)`;
  //sql to turn string to sql time obj
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                   VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  try {
    con.query(sql_try, function (error, results, fields) {
      if (error) console.log(error);
      else {
        let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                   VALUES (${id}, "${doctor}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
        console.log(sql_try);
        con.query(sql_try, function (error, results, fields) {
          if (error) console.log(error);
          else {
            return res.json({
              data: results,
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//Generates ID for appointment
router.get("/genApptUID", (req, res) => {
  let statement = "SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;";
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        let generated_id = results[0].id + 1;
        return res.json({ id: `${generated_id}` });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To fill diagnoses
router.get("/diagnose", (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;
  let statement = `UPDATE Diagnose SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE appt=${id};`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) console.log(error);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To show diagnoses
router.get("/showDiagnoses", (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) console.log(error);
    else {
      return res.json({
        data: results,
      });
    }
  });
});

//To show appointments to doctor
router.get("/doctorViewAppt", (req, res) => {
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
    FROM Appointment a, PatientsAttendAppointments psa, Patient p
    WHERE a.id = psa.appt AND psa.patient = p.email
    AND a.id IN (SELECT appt FROM Diagnose WHERE doctor="${email_in_use}")`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To show diagnoses to patient
router.get("/showDiagnoses", (req, res) => {
  try {
    let id = req.query.id;
    let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
    console.log(statement);
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To Show all diagnosed appointments till now
router.get("/allDiagnoses", (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT date,doctor,concerns,symptoms,diagnosis,prescription FROM 
    Appointment A INNER JOIN (SELECT * from PatientsAttendAppointments NATURAL JOIN Diagnose 
    WHERE patient=${email}) AS B ON A.id = B.appt;`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        return res.json({
          data: results,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To delete appointment
router.get("/deleteAppt", (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
  console.log(statement);
  try {
    con.query(statement, function (error, results, fields) {
      if (error) console.log(error);
      else {
        results = results[0].status;
        if (results == "NotDone") {
          statement = `DELETE FROM Appointment WHERE id=${uid};`;
          console.log(statement);
          con.query(statement, function (error, results, fields) {
            if (error) console.log(error);
          });
        } else {
          if (who == "pat") {
            statement = `DELETE FROM PatientsAttendAppointments p WHERE p.appt = ${uid}`;
            console.log(statement);
            con.query(statement, function (error, results, fields) {
              if (error) console.log(error);
            });
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// If 404, forward to error handler
router.use(function (req, res, next) {
  next(createError(404));
});

module.exports = router;
