import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import TagManageConstants from "constants/item/TagManageConstants";

let TagManageAction = {
  
  /**
   * Adds a new tag with given name.
   *
   * @param {String} name the name for the tag.
   * 
   * @return {Promise}
   */
  addTag: function(name) {
    
    invariant(_.isString(name), `addTag(name) expects 'name' as 'string', but gets '${typeof name}'.`);
    
    return new Promise((resolve, reject) => {

      let tag = {
        name: name
      };
      
      request.post("/api/tags")
        .send({ data: JSON.stringify(tag) })
        .then((res) => {
          let tagAdded = res.body;
          
          invariant(_.isObject(tagAdded), `addTag(name) expects response.body to be 'object', but gets '${typeof tagAdded}'.`);
          
          AppDispatcher.handleAction({
            actionType: TagManageConstants.RECEIVED_TAG,
            tag: tagAdded
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addTag(name) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });

    });
  },
  
  /**
   * Gets all the tags.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   * 
   * @return {Promise}
   */
  getTags: function(setIsLoading) {
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: TagManageConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }
    
    return new Promise((resolve, reject) => {
      
      request.get("/api/tags")
        .then((res) => {
          let tags = res.body;
          
          invariant(_.isArray(tags), `getTags() expects response.body to be an array, but gets '${typeof tags}'.`);
          
          AppDispatcher.handleAction({
            actionType: TagManageConstants.RECEIVED_TAGS,
            tags: tags
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        })
        .finally(() => {
          
          if (setIsLoading) {
            AppDispatcher.handleAction({
              actionType: TagManageConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }
          
        });

    });
  },
  
  /**
   * Removes tag specified by given id.
   *
   * @param  {String} id the id for this tag.
   *
   * @return {Promise}
   */
  removeTag: function(id) {
    
    invariant(_.isString(id), `removeTag(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.del("/api/tags")
        .query({ id: id })
        .then((res) => {
          
          AppDispatcher.handleAction({
            actionType: TagManageConstants.RECEIVED_REMOVED_TAG_ID,
            id: id
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `removeTag(id) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
    });
  }

};

export default TagManageAction;
