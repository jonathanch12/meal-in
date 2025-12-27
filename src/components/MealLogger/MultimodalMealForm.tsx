import React, { useState, useRef } from "react";
import type { MealInput } from "../../types/meal.types";

interface MultimodalMealFormProps {
    onSubmit: (input: MealInput) => Promise<void>;
    isLoading: boolean;
}

export const MultimodalMealForm: React.FC<MultimodalMealFormProps> = ({
    onSubmit,
    isLoading
}) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImage(file);
        }
    };

    const processImage = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (cameraInputRef.current) {
            cameraInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Must have either text or image
        if (!text.trim() && !image) {
            alert('Please add text or upload an image');
            return;
        }

        const input: MealInput = {};
        if (text.trim()) input.text = text;
        if (image) input.image = image;

        await onSubmit(input);

        // Clear form after successful submission
        setText("");
        handleRemoveImage();
    };

    return (
        <form onSubmit={handleSubmit} className="mb-10">
            <div className="relative p-[2px] rounded-2xl animate-border">
                <div className="relative bg-white rounded-2xl overflow-hidden">

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative m-4 mb-0">
                            <img
                                src={imagePreview}
                                alt="Meal preview"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="flex gap-2 p-4">
                        {/* Hidden file inputs */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isLoading}
                        />

                        {/* Image Upload Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Upload image from device"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>

                        {/* Camera Button */}
                        <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={isLoading}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Take a photo"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>

                        {/* Text Input */}
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={image ? "Add extra details (optional)" : "Describe your meal or upload a photo"}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || (!text.trim() && !image)}
                            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                "Analyze"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 text-center mt-3">
                Upload a photo or take one with your camera. Add text for extra details like ingredients or preparation.
            </p>
        </form>
    );
};