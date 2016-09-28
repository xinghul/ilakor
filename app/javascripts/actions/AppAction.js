import invariant from "invariant";
import _ from "lodash";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import AppConstants from "constants/AppConstants";

let AppAction = {
  
  /**
   * Updates the current route.
   * 
   * @return {Promise}
   */
  updateRoute: function(route) {
    
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: AppConstants.ROUTE_CHANGE,
        route: route
      });
    
      resolve();
    });
  }

};

export default AppAction;
