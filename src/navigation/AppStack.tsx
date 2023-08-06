import { Redirect, Switch } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../pages/Home";
import { SubjectDetails } from "../pages/SubjectDetails";
import { ReviewSettings } from "../pages/ReviewSettings";
import { ReviewSessionQueue } from "../pages/ReviewSessionQueue";
import { Subjects } from "../pages/Subjects";
import { Search } from "../pages/Search";
import ReviewSummary from "../pages/ReviewSummary";

export const AppStack = () => {
  return (
    <Router>
      <Switch>
        <Route
          path="/review/settings"
          component={ReviewSettings}
          exact={true}
        />
        <Route
          path="/review/session"
          component={ReviewSessionQueue}
          exact={true}
        />
        <Route path="/review/summary" component={ReviewSummary} exact={true} />
        <Route path="/subjects" component={Subjects} exact={true} />
        <Route path="/search" component={Search} exact={true} />
        <Route path="/subjects/:id" component={SubjectDetails} />
        <Route path="/home" component={Home} exact={true} />
        <Route exact={true} path="/" render={() => <Redirect to="/home" />} />
        <Redirect from="/authenticate" to="/home" exact={true} />
      </Switch>
    </Router>
  );
};
