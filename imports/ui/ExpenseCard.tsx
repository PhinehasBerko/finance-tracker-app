import React, { useId } from 'react'
import { money } from '../lib/money';
export interface ExpenseItem {
    name: string;
    category: string;
    unitPrice: number;
    quantity: number;
};

export interface ExpenseCardProps {
    item: ExpenseItem;
    onChange: (item: ExpenseItem) => void;
    onDelete?: () => void;
};

const labelCls = `text-sm sm:text-base`;
const inputCls = `text-sm sm:text-base font-bold w-full rounded border border-gray-300 p-2 text-gray-900 
                focus:outline-none focus:ring-2 focus:ring-black-500`;

const ExpenseCard = ({ item, onChange, onDelete }: ExpenseCardProps) => {
    const id = useId();

    const subTotal = Math.round(item.quantity * item.unitPrice * 100) / 100;

    const update = <K extends keyof ExpenseItem>(key: K, value: ExpenseItem[K]) =>
        onChange({ ...item, [key]: value });

    return (
        <article className='mx-auto max-w-lg my-2 flex flex-col border border-gray-300 rounded-xl 
                            p-3 gap-2 text-sm sm:text-base relative'>
            <div className='flex flex-row-reverse  gap-2'>

            <div className='flex flex-col flex-1'>
                <label htmlFor={`${id}-name`} className={labelCls}> Name </label>
                <div className='flex gap-2'>

                <input
                    id={`${id}-name`}
                    type="text"
                    required
                    placeholder="e.g. Rice (5kg)"
                    value={item.name}
                    onChange={(e) => update('name', e.target.value)}
                    className={inputCls}
                /> 
                <button
                type='button'
                onClick={onDelete}
                aria-label='delete expense'
                className='border rounded text-gray-500 border-gray-300 px-2 hover:text-red-600 hover:cursor-pointer'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trash preview-icon "
                >
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            </button>
                </div>
            </div>
            </div>

            <div>
                <label htmlFor={`${id}-category`} className={labelCls}> Category</label>
                <input
                    id={`${id}-category`}
                    type="text"
                    value={item.category}
                    onChange={(e) => update("category", e.target.value)}
                    className={inputCls}
                />
            </div>
            <div className='grid grid-cols-[1fr_2fr_2fr] gap-2'>
                <div className='flex flex-col '>
                    <label htmlFor={`${id}-qty`} className={labelCls}>Qty</label>
                    <input
                        id={`${id}-qty`}
                        type="number"
                        inputMode='numeric'
                        required
                        min={1}
                        step={1}
                        onChange={(e) => update("quantity", e.target.valueAsNumber || 0)}
                        value={item.quantity}
                        className={`${inputCls} `}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor={`${id}-price`} className={labelCls}>Unit Price</label>
                    <input
                        id={`${id}-price`}
                        type="number"
                        required
                        min={0}
                        step="0.01"
                        inputMode='decimal'
                        value={item.unitPrice}
                        onChange={(e) => update("unitPrice", e.target.valueAsNumber )}
                        className={`${inputCls} `}
                    />
                </div>
                <div className='flex flex-col'>
                    <span className={labelCls}>Sub Total </span>
                    <output
                        htmlFor={`${id}-qty ${id}-price`}
                        className="w-full rounded border border-gray-200 bg-gray-50 p-2 font-bold"
                    >
                        {money.format(subTotal)}
                    </output>
                </div>
            </div>

        </article>
    )
}

export default ExpenseCard

