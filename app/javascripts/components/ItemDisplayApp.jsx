import React from "react";
import Promise from "bluebird";

import ItemDisplayStore from "stores/ItemDisplayStore";
import ItemDisplayAction from "actions/ItemDisplayAction";
import ShoppingCartAction from "actions/ShoppingCartAction";

import SonicLoader from "lib/SonicLoader";

import ItemDisplayGrid from "./ItemDisplayApp/ItemDisplayGrid";
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal";
import ItemFilterApp from "./ItemDisplayApp/ItemFilterApp";
import FilterDisplayApp from "./ItemDisplayApp/FilterDisplayApp";

import styles from "components/ItemDisplayApp.scss";

Promise.config({ cancellation: true });

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    filters: ItemDisplayStore.getFilters(),
    hasMoreItems: ItemDisplayStore.hasMoreItems()
  };
}

const ITEM_DISPLAY_APP_ID = "itemDisplayApp";

let _getItemPromise = null
,   _addItemPromise = null;

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemDisplayApp extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      items: ItemDisplayStore.getItems(),
      filters: ItemDisplayStore.getFilters(),
      hasMoreItems: ItemDisplayStore.hasMoreItems(), 
      
      selectedItem: {},
      showItemDetailModal: false,
      isLoading: false,
      isItemsAdded: true
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ItemDisplayStore.subscribe(this._onChange);
    
    window.addEventListener("scroll", this._checkReachBottom);
    
    this._gridContainer = document.getElementById(ITEM_DISPLAY_APP_ID);
    
    this._checkReachBottom();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ItemDisplayStore.unsubscribe(this._onChange);
    
    window.removeEventListener("scroll", this._checkReachBottom); 

    if (_getItemPromise && _getItemPromise.isCancellable()) {
      _getItemPromise.cancel();
    }

    if (_addItemPromise && _addItemPromise.isCancellable()) {
      _addItemPromise.cancel();
    }
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
    
    // if (_addItemPromise && _addItemPromise.isCancellable())
    // {
    //   _addItemPromise.cancel();
    // }
    // 
    // let newState = getStateFromStores()
    // ,   items = this.state.items;
    // 
    // let newItems = newState.items.slice(items.length);
    // 
    // this.setState({
    //   hasMoreItems: newState.hasMoreItems,
    //   isItemsAdded: false
    // });
    // 
    // _addItemPromise = Promise.resolve(null);
    // 
    // for (let item of newItems)
    // {
    //   _addItemPromise = _addItemPromise.delay(200).then(() => {
    //     return new Promise((resolve, reject) => {
    //       items.push(item);
    // 
    //       this.setState({
    //         items: items
    //       });
    //       
    //       resolve();
    //     });
    //   });
    // }
    // 
    // _addItemPromise.then(() => {
    //   this.setState({
    //     isItemsAdded: true
    //   });
    // }).catch((err) => {
    //   console.log(err, err.stack);
    // });
  };
  
  handleRemoveFilter = (filterType, filterValue) => {
    ItemDisplayAction.removeFilter(filterType, filterValue).then(function() {
      
      console.log("removed " + filterType + ": " + filterValue);

    }).catch(function(err) {
      console.log(err);
    })
  };
  
  _onItemClick = (item) => {
    this.setState({
      selectedItem: item,
      showItemDetailModal: true
    });
  };
  
  /**
   * @private
   * Loads more item.
   */
  _doInfiniteLoad = () => {
    // do nothing when it's already in the loading process
    // or when there's no more items 
    // or when new items are not fully added to the grid
    if (this.state.isLoading || 
       !this.state.hasMoreItems || 
       !this.state.isItemsAdded) {
      return;
    }
    
    this.setState({
      isLoading: true
    });

    _getItemPromise = ItemDisplayAction
    .getItems()
    .then(() => {
      this.setState({
        isLoading: false
      });
    });
  };
  
  _onItemDetailModalClose = () => {
    this.setState({
      showItemDetailModal: false
    });
  };
  
  /**
   * @private
   * Checks if it has scrolled to bottom.
   * Load more items if it does.
   */
  _checkReachBottom = () => {

    let scrollTop = this._gridContainer.scrollTop
    ,   scrollHeight = this._gridContainer.scrollHeight; 

    if ((scrollTop + window.innerHeight) >= scrollHeight) {
      this._doInfiniteLoad();
    }
  };
  
  render() {
    return (
      <div className={styles.itemDisplayApp} id={ITEM_DISPLAY_APP_ID}>
        <ItemDetailModal 
          showModal={this.state.showItemDetailModal} 
          item={this.state.selectedItem}
          onClose={this._onItemDetailModalClose}
        />
        <div className={styles.mainContent}>
          <div className={styles.filterDisplaySection}>
            <ItemFilterApp />
          </div>
          <div className={styles.itemDisplaySection}>
            {/*
              <FilterDisplayApp handleRemoveFilter={this.handleRemoveFilter} filters={this.state.filters}/>              
            */}
            <ItemDisplayGrid
              items={this.state.items} 
              handleItemClick={this._onItemClick}
            />
          <SonicLoader hidden={!this.state.isLoading} />
          </div>
        </div>
      </div>
    );
  }
  
}
