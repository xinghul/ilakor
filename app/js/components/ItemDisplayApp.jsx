"use strict"

import React from "react"

import BaseGrid from "../lib/BaseGrid.jsx"

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
  }
  
  render() {
    var itemsConfig;
    
    itemsConfig = [
      {
        type: "carousel",
        items: [
          {
            src: "/images/room_sample.jpg",
            label: "Design sample1",
            content: "description1"
          },
          {
            src: "/images/room_sample.jpg",
            label: "Design sample2",
            content: "description2"        
          },
          {
            src: "/images/room_sample.jpg",
            label: "Design sample3",
            content: "description3"
          }
        ]
      },
      {
        type: "item",
        src: "/images/table_1.jpg",
        href: "#",
        alt: "Furniture sample",
        label: "Label",
        description: "Description"
      },
      {
        type: "item",
        href: "#",
        alt: "Furniture sample",
        src: "/images/table_2.jpg",
        label: "Label",
        description: "Description"
      },
      {
        type: "item",
        href: "#",
        src: "/images/chair_1.jpg",
        alt: "Furniture sample",
        label: "Label",
        description: "Description"
      },
      {
        type: "item",
        href: "#",
        src: "/images/chair_2.jpg",
        alt: "Furniture sample",
        label: "Label",
        description: "Description"
      }
    ];
    
    return (
      <BaseGrid itemsConfig={itemsConfig} />
    )
  }
  
}
