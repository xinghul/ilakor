import React from "react";
import Promise from "bluebird";

import ItemDisplayStore from "stores/ItemDisplayStore";
import ItemDisplayAction from "actions/ItemDisplayAction";
import ShoppingCartAction from "actions/ShoppingCartAction";

import LoadSpinner from "lib/LoadSpinner";

import ItemDisplayGrid from "./ItemDisplayApp/ItemDisplayGrid";
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal";
import ItemFilterApp from "./ItemDisplayApp/ItemFilterApp";

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
    hasMoreItems: ItemDisplayStore.hasMoreItems(),
    filterCollapsed: ItemDisplayStore.getFilterCollapsed(),
    isLoading: ItemDisplayStore.getIsLoading()
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
      filterCollapsed: ItemDisplayStore.getFilterCollapsed(),
      isLoading: ItemDisplayStore.getIsLoading(),
      
      selectedItem: {},
      isItemsAdded: true
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ItemDisplayStore.subscribe(this._onChange);
    
    ItemDisplayAction.getItems(true);
    
    // window.addEventListener("scroll", this._checkReachBottom);
    // 
    // this._gridContainer = document.getElementById(ITEM_DISPLAY_APP_ID);
    // 
    // this._checkReachBottom();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ItemDisplayStore.unsubscribe(this._onChange);
    
    // window.removeEventListener("scroll", this._checkReachBottom); 
    // 
    // if (_getItemPromise && _getItemPromise.isCancellable()) {
    //   _getItemPromise.cancel();
    // }
    // 
    // if (_addItemPromise && _addItemPromise.isCancellable()) {
    //   _addItemPromise.cancel();
    // }
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
  
  /**
   * @private
   * Handler for when item is clicked.
   * 
   * @param  {Object} item the clicked item.
   */
  _onItemClick = (item) => {
    this.setState({
      selectedItem: item
    });
    
    this.refs["detailModal"].showModal();
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
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { items, filterCollapsed, selectedItem, isLoading } = this.state;
    
    let style = {
      top: filterCollapsed ? "" : "216px"
    };
    
    return (
      <div className={styles.itemDisplayApp} id={ITEM_DISPLAY_APP_ID}>
        <ItemDetailModal 
          ref="detailModal"
          item={selectedItem}
        />
        <ItemFilterApp />
        <div style={style} className={styles.itemDisplaySection}>
          <ItemDisplayGrid
            items={items} 
            handleItemClick={this._onItemClick}
          />
          <LoadSpinner hidden={!isLoading} />
        </div>
      </div>
    );
  }
  
}
