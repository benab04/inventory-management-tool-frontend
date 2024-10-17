import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
// import { items as initialItems } from "../items"; // Import initial items data
// import { data as locationsData } from "../locations"; // Import locations data
import { IoIosArrowDropdownCircle, IoIosArrowDropright } from "react-icons/io";
import "./TreeView.css";
import axios from "axios"

const ITEM_TYPE = "ITEM"; // Define a type for draggable items

const TreeView = ({ onItemSelected }) => {

    const [expandedNodes, setExpandedNodes] = useState([]);
    const [initialItems, setInitialItems] = useState([])
    const [locationsData, setLocationsData] = useState([])
    const [items, setItems] = useState(initialItems);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const getAllData = async () => {
            try {
                // Making two requests: one for items, one for locations
                const [itemsResponse, locationsResponse] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/items`),
                    axios.get(`${BACKEND_URL}/api/locations`)
                ]);

                // Storing the response data into state variables
                setInitialItems(itemsResponse.data);
                setItems(itemsResponse.data);
                setLocationsData(locationsResponse.data);
            } catch (err) {
                // Handle error (optional)
                setError(err.message || "Error fetching data");
            } finally {
                // Set loading to false after fetching
                setLoading(false);
            }
        };

        getAllData();
    }, []); // The empty dependency array ensures this runs once on component mount

    if (loading) {
        return <div><LoadingOverlay /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Update the item's godown_id when dragged to a new location
    const updateItemGodown = (itemId, newGodownId) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.item_id === itemId
                    ? { ...item, godown_id: newGodownId } // Update the parent godown ID
                    : item
            )
        );

        // Call the updateLocation function to simulate backend update
        const item = items.find((item) => item.item_id === itemId);
        if (item) {
            updateLocation(item, newGodownId);
        }
    };
    // Function to simulate sending updated location to the backend
    const updateLocation = async (item, newGodownId) => {
        console.log("Updating location...");
        console.log("Item:", item);
        console.log("New Location ID:", newGodownId);

        try {
            const response = await fetch(`${BACKEND_URL}/api/item/update-location`, {
                // const response = await fetch(`http://localhost:8000/api/update-location`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item_id: item.item_id,
                    new_godown_id: newGodownId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Update successful:", result);
        } catch (error) {
            console.error("Failed to update location:", error);
        }
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

const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

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
                    : `rgb(${Math.max(0, 0 + level * 2)}, ${Math.max(0, 21 + level * 1)}, ${Math.max(0, 36 + level * 1.5)})`,
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
