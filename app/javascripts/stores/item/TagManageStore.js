import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import TagManageConstants from "constants/item/TagManageConstants";

const CHANGE_EVENT = "change";

let _tags = []
,   _isLoading = false;

let TagManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the tags.
   * 
   * @param  {Array} newTags the new tags.
   */
  setTags: function(newTags) {
    invariant(_.isArray(newTags), `setTags(newTags) expects an 'array' as 'newTags', but gets '${typeof newTags}'.`);
    
    _tags = newTags;
  },

  /**
   * Returns the tags.
   *
   * @return {Array}
   */
  getTags: function() {
    return _tags;
  },
  
  /**
   * Adds a new tag to the front of the list.
   * 
   * @param  {Object} newTag the new tag.
   */
  addTag: function(newTag) {
    invariant(_.isObject(newTag), `addTag(newTag) expects an 'object' as 'newTag', but gets '${typeof newTag}'.`);

    _tags.unshift(newTag);
  },
  
  /**
   * Removes the tag by id.
   * 
   * @param  {String} id the id for the tag.
   */
  removeTag: function(id) {
    invariant(_.isString(id), `removeTag(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    
    for (let index = 0; index < _tags.length; index++)
    {
      if (_tags[index]._id === id)
      {
        _tags.splice(index, 1);
        
        break;
      }
    }
  },
  
  /**
   * Sets the isLoading flag.
   * 
   * @param  {Boolean} isLoading the new isLoading value.
   */
  setIsLoading: function(isLoading) {
    invariant(_.isBoolean(isLoading), `setIsLoading(isLoading) expects a 'boolean' as 'isLoading', but gets '${typeof isLoading}'.`);
    
    invariant(_isLoading !== isLoading, `setIsLoading(isLoading) can't be called with same value.`);
    
    _isLoading = isLoading;
  },

  /**
   * Returns the isLoading flag.
   * 
   * @return {Boolean}
   */
  getIsLoading: function() {
    return _isLoading;
  },  
  
  /**
   * Emits the 'change' event.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Subscribes a callback to the 'change' event.
   * 
   * @param  {Function} callback the callback to add.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

TagManageStore.dispatchToken = AppDispatcher.register((payload) => {
  let action = payload.action;

  switch(action.actionType) {

    case TagManageConstants.RECEIVED_TAGS:
      TagManageStore.setTags(action.tags);
      TagManageStore.emitChange();
      break;
      
    case TagManageConstants.RECEIVED_TAG:
      TagManageStore.addTag(action.tag);
      TagManageStore.emitChange();
      break;
      
    case TagManageConstants.RECEIVED_REMOVED_TAG_ID:
      TagManageStore.removeTag(action.id);
      TagManageStore.emitChange();
      break;
      
    case TagManageConstants.SETS_IS_LOADING:
      TagManageStore.setIsLoading(action.isLoading);
      TagManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default TagManageStore;