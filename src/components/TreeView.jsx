import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { items as initialItems } from "../items"; // Import initial items data
import { data as locationsData } from "../locations"; // Import locations data
import { IoIosArrowDropdownCircle, IoIosArrowDropright } from "react-icons/io";
import "./TreeView.css";

const ITEM_TYPE = "ITEM"; // Define a type for draggable items

const TreeView = ({ onItemSelected }) => {
    const [items, setItems] = useState(initialItems); // State to manage items
    const [expandedNodes, setExpandedNodes] = useState([]);

    // Update the item's godown_id when dragged to a new location
    const updateItemGodown = (itemId, newGodownId) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.item_id === itemId
                    ? { ...item, godown_id: newGodownId } // Update the parent godown ID
                    : item
            )
        );
    };

    const handleToggle = (nodeId) => {
        setExpandedNodes((prev) =>
            prev.includes(nodeId)
                ? prev.filter((id) => id !== nodeId)
                : [...prev, nodeId]
        );
    };

    const renderItems = (godownId) => {
        return items
            .filter((item) => item.godown_id === godownId)
            .map((item) => (
                <DraggableItem
                    key={item.item_id}
                    item={item}
                    onItemSelected={onItemSelected}
                />
            ));
    };

    const renderLocations = (parentId, level = 0) => {
        return locationsData
            .filter((location) => location.parent_godown === parentId)
            .map((location) => {
                const isExpanded = expandedNodes.includes(location.id);

                return (
                    <DropTargetLocation
                        key={location.id}
                        location={location}
                        level={level}
                        isExpanded={isExpanded}
                        handleToggle={handleToggle}
                        renderItems={renderItems}
                        renderLocations={renderLocations}
                        updateItemGodown={updateItemGodown}
                    />
                );
            });
    };

    return <div className="tree-view">{renderLocations(null)}</div>;
};

export default TreeView;

// Draggable item component
const DraggableItem = ({ item, onItemSelected }) => {
    const [, drag] = useDrag({
        type: ITEM_TYPE,
        item: { ...item }, // Pass the item data during drag
    });

    return (
        <div
            ref={drag}
            className="tree-item"
            onClick={() => onItemSelected(item)}
            style={{ paddingLeft: "20px", cursor: "grab" }}
        >
            {item.name}
        </div>
    );
};

// Drop target location component
const DropTargetLocation = ({
    location,
    level,
    isExpanded,
    handleToggle,
    renderItems,
    renderLocations,
    updateItemGodown,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ITEM_TYPE,
        drop: (draggedItem, monitor) => {
            // Ensure the draggedItem is assigned the correct godown_id based on drop target
            if (monitor.didDrop()) {
                // If a drop already occurred within a child, don't proceed
                return;
            }
            // Update the item’s godown ID to match the new child location
            if (draggedItem.godown_id !== location.id) {
                updateItemGodown(draggedItem.item_id, location.id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        dropEffect: "move", // Indicate move action for the item being dragged
    });

    return (
        <div
            ref={drop}
            className="tree-node"
            style={{
                paddingLeft: `${level * 20}px`,
                backgroundColor: isOver
                    ? `rgba(144, 238, 144, 0.5)` // Light green with opacity when hovered
                    : `rgb(${240 - level * 10}, ${240 - level * 10}, ${240 - level * 10})`,
                borderLeft: isOver ? "3px solid green" : "none", // Add a left border for hover indication
                transition: "background-color 0.2s ease", // Smooth background color change
            }}
        >
            <div
                className="tree-location"
                onClick={() => handleToggle(location.id)}
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
                <span style={{ marginRight: "5px" }}>
                    {isExpanded ? (
                        <IoIosArrowDropdownCircle />
                    ) : (
                        <IoIosArrowDropright />
                    )}
                </span>
                {location.name}
            </div>
            {isExpanded && (
                <div className="tree-children">
                    {/* Render child locations first */}
                    {renderLocations(location.id, level + 1)}
                    {/* Render items specific to this location */}
                    {renderItems(location.id)}
                </div>
            )}
        </div>
    );
};
