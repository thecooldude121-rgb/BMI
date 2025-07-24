import React from 'react';
import { Switch, Route } from 'wouter';
import MeetingsPage from './MeetingsPage';

const MeetingModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
        <Route path="/meetings" component={MeetingsPage} />
        <Route path="/meetings/:id" component={MeetingsPage} />
      </Switch>
    </div>
  );
};

export default MeetingModule;