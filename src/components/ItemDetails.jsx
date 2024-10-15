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

    return (
        <motion.div
            className="item-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="item-image-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <img className="item-image" src={item.image_url} alt={item.name} />
                <motion.div
                    className="item-category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {item.category}
                </motion.div>
            </motion.div>

            <div className="item-info">
                <motion.h2
                    className="item-name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {item.name}
                </motion.h2>
                <motion.div
                    className="item-specifics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <div className="spec-item">
                        <span className="label">Quantity:</span>
                        <span className="value">{item.quantity}</span>
                    </div>
                    <div className="spec-item">
                        <span className="label">Price:</span>
                        <span className="value highlight">${item.price.toFixed(2)}</span>
                    </div>
                    {/* <div className="spec-item">
            <span className="label">SKU:</span>
            <span className="value">{item.sku || "N/A"}</span>
          </div>
          <div className="spec-item">
            <span className="label">Location:</span>
            <span className="value">{item.location || "Warehouse A"}</span>
          </div> */}
                </motion.div>
                <motion.p
                    className="item-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {item.description || "No description available for this item."}
                </motion.p>
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
