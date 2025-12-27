import React, { useState, useEffect } from "react";
import type { FoodItem, PendingMeal } from "../../types/meal.types";

interface EditMealModalProps {
    pendingMeal: PendingMeal | null;
    onSave: (items: FoodItem[]) => void;
    onCancel: () => void;
}

export const EditMealModal: React.FC<EditMealModalProps> = ({
    pendingMeal,
    onSave,
    onCancel,
}) => {
    const [items, setItems] = useState<FoodItem[]>([]);

    useEffect(() => {
        if (pendingMeal) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setItems([...pendingMeal.items]);
        }
    }, [pendingMeal]);

    if (!pendingMeal) return null;

    const handleItemChange = (index: number, field: keyof FoodItem, value: string | number) => {
        const newItems = [...items];
        if (field === 'item') {
            newItems[index][field] = value as string;
        } else {
            newItems[index][field] = Number(value) || 0;
        }
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleAddItem = () => {
        setItems([...items, { item: "", calories: 0, protein: 0 }]);
    };

    const handleSave = () => {
        // Filter out empty items
        const validItems = items.filter(item => item.item.trim() !== "");
        if (validItems.length === 0) {
            alert("Please add at least one food item");
            return;
        }
        onSave(validItems);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Review & Edit Meal</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        AI detected these items. Edit quantities before saving.
                    </p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Image Preview */}
                    {pendingMeal.imagePreview && (
                        <div className="mb-6">
                            <img
                                src={pendingMeal.imagePreview}
                                alt="Meal"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                        </div>
                    )}

                    {/* Original Text */}
                    {pendingMeal.input.text && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Your note:</span> "{pendingMeal.input.text}"
                            </p>
                        </div>
                    )}

                    {/* Food Items */}
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-3">
                                        <input
                                            type="text"
                                            value={item.item}
                                            onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                                            placeholder="Food item name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Calories</label>
                                                <input
                                                    type="number"
                                                    value={item.calories}
                                                    onChange={(e) => handleItemChange(index, 'calories', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Protein (g)</label>
                                                <input
                                                    type="number"
                                                    value={item.protein}
                                                    onChange={(e) => handleItemChange(index, 'protein', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                                                    min="0"
                                                    step="0.1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(index)}
                                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Item Button */}
                        <button
                            onClick={handleAddItem}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Save to Log
                    </button>
                </div>
            </div>
        </div>
    );
};