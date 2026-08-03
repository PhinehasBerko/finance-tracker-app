import React from "react";

export type ButtonTypes = 
    "displayToggle" 
    | "saveExpense"
    | "addExpense" 
    | "saveIncome" 
    | "saveShopping" 
    | "addShopping" ;

const CONFIG: Record<ButtonTypes, {label: string; cls: string}> = {
    displayToggle: {label: "+", cls:"w-fit text-white bg-blue-600 hover:bg-blue-700"},
    saveIncome: { label: "Save income", cls: "text-white bg-green-600 hover:bg-green-700"},
    saveExpense: {label: "Save expenses", cls:"text-white bg-red-400 hover:bg-red-600"},
    addExpense: {label: "+ Add expense", cls:"border-2 border-dashed border-red-400 text-red-400 hover:bg-red-600 hover:text-white"},
    saveShopping: {label: "Save shopping list", cls: "text-white bg-blue-600 hover:bg-blue-700"},
    addShopping: {label: "+ Add shopping item", cls: "text-blue-600 border-2 border-dashed border-blue-600 hover:bg-blue-600 hover:text-white"},

}

interface ButtonProps {
    kind: ButtonTypes;
    onClick: () => void;
    pressed?: boolean;
}
const Button = ({kind, onClick, pressed}: ButtonProps) => {
    
    return (
        <button 
            type="button"
            onClick={onClick}
            aria-pressed={pressed}
            className = {` rounded-xl px-4 py-2 font-semibold ${CONFIG[kind].cls}
                        ${pressed ? "ring-2 ring-offset-2 ring-gray-900":""}`}
            >
             {CONFIG[kind].label}
        </button>
    )
}

export default Button;