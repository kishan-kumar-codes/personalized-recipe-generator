const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

exports.generateRecipe = async (req, res) => {
    const { ingredients, dietaryRestrictions } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients are required and must be an array.' });
    }

    try {
        const availableIngredients = await Ingredient.find({ name: { $in: ingredients } });

        if (availableIngredients.length === 0) {
            return res.status(404).json({ error: 'No matching ingredients found.' });
        }

        const recipe = createRecipe(availableIngredients, dietaryRestrictions);
        
        if (!recipe) {
            return res.status(500).json({ error: 'Failed to generate recipe.' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const createRecipe = (availableIngredients, dietaryRestrictions) => {
    // Logic to create a recipe based on available ingredients and dietary restrictions
    // This is a placeholder for the actual recipe generation logic
    const recipe = {
        title: 'Generated Recipe',
        ingredients: availableIngredients.map(ingredient => ingredient.name),
        instructions: 'Mix all ingredients and cook for 20 minutes.',
        dietaryRestrictions: dietaryRestrictions || [],
    };

    // Implement dietary restriction checks here
    if (dietaryRestrictions.includes('vegan')) {
        // Modify recipe for vegan requirements
    }

    return recipe;
};