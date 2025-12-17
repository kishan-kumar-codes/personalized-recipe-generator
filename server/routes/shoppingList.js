const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Assuming Recipe model is defined in models/Recipe.js
const ShoppingList = require('../models/ShoppingList'); // Assuming ShoppingList model is defined in models/ShoppingList.js

// Generate shopping list based on selected recipes
router.post('/generate', async (req, res) => {
    const { recipeIds } = req.body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
        return res.status(400).json({ error: 'Invalid recipe IDs' });
    }

    try {
        const recipes = await Recipe.find({ _id: { $in: recipeIds } });

        if (recipes.length === 0) {
            return res.status(404).json({ error: 'No recipes found for the provided IDs' });
        }

        const shoppingList = {};

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                const { name, quantity, unit } = ingredient;
                const key = `${name}-${unit}`;

                if (!shoppingList[key]) {
                    shoppingList[key] = { name, quantity: 0, unit };
                }
                shoppingList[key].quantity += quantity;
            });
        });

        const shoppingListItems = Object.values(shoppingList);
        const newShoppingList = new ShoppingList({ items: shoppingListItems });
        await newShoppingList.save();

        return res.status(201).json(newShoppingList);
    } catch (error) {
        console.error('Error generating shopping list:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;