import React from "react";
import { Button, Glyphicon, Accordion, Panel } from "react-bootstrap";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import Select from "lib/Select";
import Icon from "lib/Icon";

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
 * Creates the options for Select component.
 * 
 * @param {Array} options the raw options.
 * 
 * @return {Array}
 */
function createSelectOptions(options) {
  
  return _.map(options, (option) => {
    
    let name = option.name;
    
    return {
      label: _.capitalize(_.words(name).join(' ')),
      value: name
    };
    
  });
  
}

/**
 * Creates a string decribing the current applied filters.
 * 
 * @param  {Object} filters current applied filters.
 * 
 * @return {String}
 */
function createFilterDescription(filters) {
  
  // display names for filter types
  const filterTypeDisplayName = {
    'brand': 'brands',
    'category': 'categories',
    'tag': 'goals'
  };
  
  /**
   * Connects filter values and form a sentence.
   * 
   * @param  {String[]} values filter values.
   * 
   * @return {String}
   */
  function connectfilterValuess(values) {
    if (values.length === 1) {
      return values[0];
    }
    
    let sentence = "";
    
    for (let index = 0; index < values.length; index++)
    {
      if (index === values.length - 1) {
        sentence += " and ";
      } else if (index > 0) {
        sentence += ", "
      }

      sentence += "<b>" + _.capitalize(values[index]) + "</b>";
    }
    
    return sentence;
  }
  
  /**
   * Generates description for given filter type and filter values.
   * 
   * @param  {String} filterType   filter type.
   * @param  {String[]} filterValues filter values.
   * 
   * @return {String}
   */
  function generateDescriptionForType(filterType, filterValues) {
    if (_.isEmpty(filterValues)) {
      return `all ${filterTypeDisplayName[filterType]}`;
    }
    
    return `${filterTypeDisplayName[filterType]} ${connectfilterValuess(filterValues)}`;
  }
  
  return `Displaying items for ${generateDescriptionForType("brand", filters.brand)}, ${generateDescriptionForType("category", filters.category)} and ${generateDescriptionForType("tag", filters.tag)}.`;
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
   * @param  {Array} brands the selected brands.
   */
  _onBrandChange = (brands) => {
    
    let filter = {
      type: "brand",
      value: brands
    };
    
    ItemDisplayAction.setFilter(filter);
  };
  
  /**
   * @private
   * Handler for when a category is checked/unchecked.
   * Updates the filter accordingly.
   * 
   * @param  {Array} categories the selected categories.
   */
  _onCategoryChange = (categories) => {
    
    let filter = {
      type: "category",
      value: categories
    };
    
    ItemDisplayAction.setFilter(filter);
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
      <div className={styles.filterItem}>
        <div className={styles.filterInfo}>
          <Icon name="square" className={styles.filterIcon} />
          <h5 className={styles.filterName}>Brands</h5>
        </div>
        <div className={styles.filterSelect}>
          <Select 
            placeholder="Specify brands..."
            defaultValue={filters.brand}
            options={createSelectOptions(brands)}
            onChange={this._onBrandChange}
          />
        </div>
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
      <div className={styles.filterItem}>
        <div className={styles.filterInfo}>
          <Icon name="tags" className={styles.filterIcon} />
          <h5 className={styles.filterName}>Categories</h5>
        </div>
        <div className={styles.filterSelect}>
          <Select 
            placeholder="Specify categories..."
            defaultValue={filters.category}
            options={createSelectOptions(categories)}
            onChange={this._onCategoryChange}
          />
        </div>
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
      <div className={styles.filterItem}>
        <div className={styles.filterInfo}>
          <Icon name="dot-circle-o" className={styles.filterIcon} />
          <h5 className={styles.filterName}>Goals</h5>
        </div>
        <div className={styles.filterSelect}>
          <Select 
            placeholder="Specify goals..."
            defaultValue={filters.tag}
            options={createSelectOptions(tags)}
            onChange={this._onTagChange}
          />
        </div>
      </div>
    );
    
  }
  
  /**
   * @private
   * Creates the header for the filter section.
   * 
   * @return {JSX} 
   */
  _createFilterSectionHeaderJsx() {
    
    const { filters, collapsed } = this.state;
    let text = collapsed ? `+ ${createFilterDescription(filters)}` : "- Hide filters";
    
    text = _.truncate(text, { length: 120, separator: ' ' });
    
    return (
      <div className={styles.filterSectionHeader} onClick={this._onCollapseToggleClick} dangerouslySetInnerHTML={{__html: text}} />
    );
  }
  
  /**
   * @private
   * Creates the body for the filter section.
   * 
   * @return {JSX}
   */
  _createFilterSectionBodyJsx() {
    
    const { collapsed } = this.state;
    
    if (collapsed) {
      return null;
    } else {
      return (
        <div>
          {this._createBrandFilterJsx()}
          {this._createCategoryFilterJsx()}
          {this._createTagFilterJsx()}
        </div>
      );
    }
  }
  
  /**
   * @private
   * Creates the JSX for the filters section.
   * 
   * @return {JSX}
   */
  _createFilterSectionJsx() {
    
    const { collapsed } = this.state;
      
    let style = { 
      maxHeight: collapsed ? "" : "300px"
    };
    
    return (
      <ReactCSSTransitionGroup 
        component="div"
        className={styles.filterSection} 
        transitionName="filter-section"
        transitionEnterTimeout={200} 
        transitionLeaveTimeout={200}
        style={style}
      >
        {this._createFilterSectionHeaderJsx()}
        {this._createFilterSectionBodyJsx()}
      </ReactCSSTransitionGroup>
    );
    
  }
  
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.itemFilterApp}>
        {this._createFilterSectionJsx()}
      </div>
    );
    
  }
}
