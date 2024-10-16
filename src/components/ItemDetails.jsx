import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./ItemDetails.css";

// Error Boundary to catch any rendering errors in the child components
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong. Please try again.</h2>;
        }

        return this.props.children;
    }
}

function ItemDetails(props) {
    const [item, setItem] = useState(props.item)
    useEffect(() => {
        setItem(props.item);
    }, [props.item]);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item || {
        name: "",
        quantity: 0,
        category: "",
        price: 0,
        status: "in_stock",
        brand: "",
        attributes: {},
    });

    const [error, setError] = useState(null);
    useEffect(() => {
        setUpdatedItem(item)
    }, [item])
    if (!item) {
        return (
            <motion.div
                className="item-details-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2>Select an item to view details</h2>
                <p>Click on any item in the inventory to see its information here.</p>
            </motion.div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleUpdateInventory = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUpdatedItem({ ...item }); // Reset the changes if editing is canceled
    };
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    // const BACKEND_URL = "http://localhost:8000";

    const handleConfirmUpdate = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/item/${item.item_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUpdatedItem(updatedData); // Update with backend response
                setItem(updatedData)
                setIsEditing(false);
                setError(null);
            } else {
                setError("Failed to update item. Please try again.");
            }
        } catch (err) {
            setError("Error updating item. Please check your connection.");
        }
    };

    const renderAttributes = (attributes) => {
        if (!attributes) return null;
        return Object.entries(attributes).map(([key, value]) => (
            <div className="attribute-item" key={key}>
                <span className="attribute-label">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                {isEditing ? (
                    <input
                        className="attribute-value-input"
                        type="text"
                        name={`attributes.${key}`}
                        value={updatedItem.attributes[key] || ""}
                        onChange={handleInputChange}
                    />
                ) : (
                    <span className="attribute-value">{value}</span>
                )}
            </div>
        ));
    };

    return (
        <ErrorBoundary>
            <motion.div
                className="item-details-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Side: Image Section */}
                <motion.div
                    className="item-image-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img className="item-image" src={item.image_url} alt={item.name} />
                </motion.div>

                {/* Right Side: Info Section */}
                <div className="item-info-section">
                    {/* Error Message */}
                    {error && <p className="error-message">{error}</p>}

                    {/* Category Tag */}
                    <div className="item-category-tag">
                        {isEditing ? (
                            <input
                                type="text"
                                name="category"
                                value={updatedItem.category}
                                onChange={handleInputChange}
                            />
                        ) : (
                            item.category
                        )}
                    </div>

                    {/* Item Name */}
                    <motion.h1
                        className="item-name"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={updatedItem.name}
                                onChange={handleInputChange}
                            />
                        ) : (
                            item.name
                        )}
                    </motion.h1>

                    {/* Stock Status and Brand */}
                    <div className="stock-and-brand">
                        <span
                            className={`stock-status ${item.status === "in_stock" ? "in-stock" : "out-of-stock"
                                }`}
                        >
                            {isEditing ? (
                                <select
                                    name="status"
                                    value={updatedItem.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            ) : item.status === "in_stock" ? (
                                "In Stock"
                            ) : (
                                "Out of Stock"
                            )}
                        </span>
                        <span className="item-brand">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="brand"
                                    value={updatedItem.brand}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `Brand: ${item.brand}`
                            )}
                        </span>
                    </div>

                    {/* Quantity and Price */}
                    <div className="price-quantity">
                        <div className="item-quantity">
                            Quantity:{" "}
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="quantity"
                                    value={updatedItem.quantity}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span className="quantity-value">{item.quantity}</span>
                            )}
                        </div>
                        <div className="item-price">
                            Price:{" "}
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={updatedItem.price}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span className="price-value">${item.price.toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    {/* Attributes */}
                    <motion.div
                        className="item-attributes"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {renderAttributes(item.attributes)}
                    </motion.div>

                    {/* Update/Confirm Buttons */}
                    {isEditing ? (
                        <>
                            <motion.button
                                className="confirm-button"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleConfirmUpdate}
                            >
                                Confirm
                            </motion.button>
                            <motion.button
                                className="cancel-button"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            className="update-button"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpdateInventory}
                        >
                            Update Inventory
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </ErrorBoundary>
    );
}

export default ItemDetails;
