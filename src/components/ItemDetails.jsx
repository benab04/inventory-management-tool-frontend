import React from "react";
import { motion } from "framer-motion";
import "./ItemDetails.css";

function ItemDetails({ item }) {
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

    const renderAttributes = (attributes) => {
        if (!attributes) return null;
        return Object.entries(attributes).map(([key, value]) => (
            <div className="attribute-item" key={key}>
                <span className="attribute-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className="attribute-value">{value}</span>
            </div>
        ));
    };

    return (
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
                {/* Category Tag */}
                <div className="item-category-tag">{item.category}</div>

                {/* Item Name */}
                <motion.h1
                    className="item-name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {item.name}
                </motion.h1>

                {/* Stock Status and Brand */}
                <div className="stock-and-brand">
                    <span className={`stock-status ${item.status === "in_stock" ? "in-stock" : "out-of-stock"}`}>
                        {item.status === "in_stock" ? "In Stock" : "Out of Stock"}
                    </span>
                    <span className="item-brand">Brand: {item.brand}</span>
                </div>

                {/* Quantity and Price */}
                <div className="price-quantity">
                    <div className="item-quantity">
                        Quantity: <span className="quantity-value">{item.quantity}</span>
                    </div>
                    <div className="item-price">
                        Price: <span className="price-value">${item.price.toFixed(2)}</span>
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

                {/* Description */}
                <motion.p
                    className="item-description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {item.description || "No description available for this item."}
                </motion.p>

                {/* Update Inventory Button */}
                <motion.button
                    className="update-button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Inventory
                </motion.button>
            </div>
        </motion.div>
    );
}

export default ItemDetails;
