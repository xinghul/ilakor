import React from "react";
import { Button, Glyphicon, Accordion, Panel } from "react-bootstrap";

import SidePanel from "lib/SidePanel";
import Checkbox from "lib/Checkbox";
import Select from "lib/Select";

import ItemDisplayAction from "actions/ItemDisplayAction";

import ItemDisplayStore from "stores/ItemDisplayStore";
import TagManageStore from "stores/item/TagManageStore";
import BrandManageStore from "stores/item/BrandManageStore";
import CategoryManageStore from "stores/item/CategoryManageStore";

import styles from "components/ItemDisplayApp/ItemFilterApp.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    filters: ItemDisplayStore.getFilters(),
    tags: TagManageStore.getTags(),
    brands: BrandManageStore.getBrands(),
    categories: CategoryManageStore.getCategories()
  };
}

/**
 * Creates the options for tag Select component.
 * 
 * @param {Array} tags the raw tags.
 * 
 * @return {Array}
 */
function createTagSelectOptions(tags) {
  
  return _.map(tags, (tag) => {
    
    let tagName = tag.name;
    
    return {
      label: _.capitalize(_.words(tagName).join(' ')),
      value: tagName
    };
    
  });
  
}

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemFilterApp extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      filters: ItemDisplayStore.getFilters(),
      tags: TagManageStore.getTags(),
      brands: BrandManageStore.getBrands(),
      categories: CategoryManageStore.getCategories(),
      
      collapsed: false
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ItemDisplayStore.subscribe(this._onChange); 
    TagManageStore.subscribe(this._onChange);
    BrandManageStore.subscribe(this._onChange);
    CategoryManageStore.subscribe(this._onChange);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ItemDisplayStore.unsubscribe(this._onChange);
    TagManageStore.unsubscribe(this._onChange);
    BrandManageStore.unsubscribe(this._onChange);
    CategoryManageStore.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @private
   * Handler for when the collapsed button is clicked.
   */
  _onCollapseToggleClick = () => {
    
    const { collapsed } = this.state;
    
    this.setState({
      collapsed: !collapsed
    });
    
  };
  
  /**
   * @private
   * Handler for when a brand is checked/unchecked.
   * Updates the filter accordingly.
   * 
   * @param  {String} brandName the brand name.
   * @param  {Boolean} checked   whether the brand is checked or not.
   */
  _onBrandChange = (brandName, checked) => {
    
    let filter = {
      type: "brand",
      value: brandName
    };
    
    if (checked) {
      ItemDisplayAction.addFilter(filter);
    } else {
      ItemDisplayAction.removeFilter(filter);
    }
  };
  
  /**
   * @private
   * Handler for when a category is checked/unchecked.
   * Updates the filter accordingly.
   * 
   * @param  {String} categoryName the category name.
   * @param  {Boolean} checked   whether the category is checked or not.
   */
  _onCategoryChange = (categoryName, checked) => {
    
    let filter = {
      type: "category",
      value: categoryName
    };
    
    if (checked) {
      ItemDisplayAction.addFilter(filter);
    } else {
      ItemDisplayAction.removeFilter(filter);
    }
  };
  
  /**
   * @private
   * Handler for when selected tags changes.
   * Sets the tag filter directly.
   * 
   * @param  {Array} tags the selected tags.
   */
  _onTagChange = (tags) => {

    let filter = {
      type: "tag",
      value: tags
    };
    
    ItemDisplayAction.setFilter(filter);
  };
  
  /**
   * @private
   * Creates the JSX for the brand filters.
   * 
   * @return {JSX}
   */
  _createBrandFilterJsx() {
    
    const { filters, brands } = this.state;

    return (
      <div>
        <h5>Select brands</h5>
        {_.map(brands, (brand) => {
          
          let brandName = brand.name;
          
          return (
            <Checkbox
              key={brand._id}
              defaultValue={filters.brand.indexOf(brandName) !== -1}
              label={_.capitalize(brandName)}
              onChange={this._onBrandChange.bind(this, brandName)} 
            />
          );
        })}
      </div>
    );
    
  }
  
  /**
   * @private
   * Creates the JSX for the category filters.
   * 
   * @return {JSX}
   */
  _createCategoryFilterJsx() {
    
    const { filters, categories } = this.state;

    return (
      <div>
        <h5>Select categories</h5>
        {_.map(categories, (category) => {
          
          let categoryName = category.name;
          
          return (
            <Checkbox
              key={category._id}
              defaultValue={filters.category.indexOf(categoryName) !== -1}
              label={_.capitalize(categoryName)}
              onChange={this._onCategoryChange.bind(this, categoryName)} 
            />
          );
        })}
      </div>
    );
    
  }
  
  /**
   * @private
   * Creates the JSX for the tag filters.
   * 
   * @return {JSX}
   */
  _createTagFilterJsx() {
    
    const { filters, tags } = this.state;
    
    return (
      <Select 
        placeholder="Select goals..."
        defaultValue={filters.tag}
        options={createTagSelectOptions(tags)}
        onChange={this._onTagChange}
      />
    );
    
  }
  
  /**
   * @private
   * Creates the JSX for the filters section.
   * 
   * @return {JSX}
   */
  _createFilterSectionJsx() {
    
    const { collapsed } = this.state;
      
    let style = { maxHeight: collapsed ? "" : "300px" };
    
    return (
      <div className={styles.filterSection} style={style}>
        {this._createBrandFilterJsx()}
        {this._createCategoryFilterJsx()}
        {this._createTagFilterJsx()}
      </div>
    );
    
  }
  
  _createCollapseToggleJsx() {
    
    const { collapsed } = this.state;
    let text = collapsed ? "FILTER +" : "FILTER -";
    
    return (
      <div className={styles.collapsedToggle} onClick={this._onCollapseToggleClick}>{text}</div>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.itemFilterApp}>
        {this._createCollapseToggleJsx()}
        {this._createFilterSectionJsx()}
      </div>
    );
    
  }
}
