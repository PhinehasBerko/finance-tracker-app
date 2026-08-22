import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../lib/utils";

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

interface ButtonProps extends Omit<ComponentPropsWithoutRef<"button">,"children">{
    kind: ButtonTypes;   
    isLoading?: boolean
}

const Button = ({kind, type,  isLoading, ...rest}: ButtonProps) =>  (
        <button 
            type= {type}
            disabled= {isLoading || rest.disabled}
            className ={cn(
                "rounded-xl px-4 py-2 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
                CONFIG[kind].cls,
                {"animate-pulse cursor-wait": isLoading}
            )}
            {...rest}
        >  
            {isLoading && (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) }
        {CONFIG[kind].label}
             
        </button>
    )


export default Button;