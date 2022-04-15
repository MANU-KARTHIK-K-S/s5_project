import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, use } from "react-router-dom";
import Home from "./Pages/Home";
import PatientHome from "./Pages/PatientHome";
import LogIn from "./Pages/logIn.js";
import CreateAccount from "./Pages/CreateAccount.js";
import SchedulingAppt from "./Pages/schedulingAppt.js";
import ViewMedHist from "./Pages/ViewMedHist.js";
import DocHome from "./Pages/DocHome.js";
import ViewOneHistory from "./Pages/ViewOneHistory.js";
import Settings from "./Pages/Settings.js";
import DocSettings from "./Pages/DocSettings.js";
import PatientsViewAppt from "./Pages/PatientsViewAppt.js";
import NoMedHistFound from "./Pages/NoMedHistFound.js";
import DocViewAppt from "./Pages/DocViewAppt.js";
import MakeDoc from "./Pages/MakeDoc.js";
import Diagnose from "./Pages/Diagnose.js";
import ShowDiagnoses from "./Pages/ShowDiagnoses.js";

export default function App() {
  let [component, setComponent] = useState(<Home />);
  useEffect(() => {
    fetch("http://localhost:3001/userInSession")
      .then((res) => res.json())
      .then((res) => {
        let string_json = JSON.stringify(res);
        let email_json = JSON.parse(string_json);
        let email = email_json.email;
        let who = email_json.who;
        if (email === "") {
          setComponent(<Home />);
        } else {
          if (who === "pat") {
            setComponent(<Redirect to="/PatientHome" />);
          } else {
            setComponent(<Redirect to="DocHome" />);
          }
        }
      });
  }, []);
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/Home"></Route>
          <Route path="/NoMedHistFound">
            <NoMedHistFound />
          </Route>
          <Route path="/MakeDoc">
            <MakeDoc />
          </Route>
          <Route path="/Settings">
            <Settings />
          </Route>
          <Route path="/MedHistView">
            <ViewMedHist />
          </Route>
          <Route path="/scheduleAppt">
            <SchedulingAppt />
          </Route>
          <Route
            path="/showDiagnoses/:id"
            render={(props) => <ShowDiagnoses {...props} />}
          />
          <Route
            path="/Diagnose/:id"
            render={(props) => <Diagnose {...props} />}
          />
          <Route
            name="onehist"
            path="/ViewOneHistory/:email"
            render={(props) => <ViewOneHistory {...props} />}
          />
          <Route path="/PatientHome">
            <PatientHome />
          </Route>
          <Route path="/createAcc">
            <CreateAccount />
          </Route>
          <Route path="/DocHome">
            <DocHome />
          </Route>
          <Route path="/PatientsViewAppt">
            <PatientsViewAppt />
          </Route>
          <Route path="/DocSettings">
            <DocSettings />
          </Route>
          <Route path="/ApptList">
            <DocViewAppt />
          </Route>
          <Route path="/">{component}</Route>
        </Switch>
      </div>
    </Router>
  );
}
