
import React, { useState } from "react";
import ExpenseCard, { ExpenseItem } from "./ExpenseCard";
import { money, amount } from "../lib/money";
import Button from "./Button";
import { InsertExpenses } from "../api/expenses/methods";

interface FormState extends ExpenseItem {
    id: string;
}

const newEntry = (): FormState => ({
    id: crypto.randomUUID(),
    name: "",
    category: "",
    quantity: 1,
    unitPrice: 0.00,
});

const ExpenseList = () => {
  const [entries, setEntries] = useState<FormState[]>(() => [newEntry()]);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID())
  const [isLoading, setIsLoading] =  useState(false);
  const [error, setError] = useState<string | null>(null);  
  
  const addEntry    = () => setEntries(prev => [...prev, newEntry()]);

  const updateEntry = (id: string, next: ExpenseItem) =>
    setEntries(prev => prev.map(e => (e.id === id ? { ...next, id } : e)));

  const deleteEntry = (id: string) =>
    setEntries(prev => prev.filter(e => e.id !== id));
 
  const totalAmount = entries.reduce(
    (sum, e) => sum + amount(e.quantity, e.unitPrice), 0);
  
  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    
    try {
        await InsertExpenses.callAsync({
          idempotencyKey,
            items: entries.map(({ name, category, quantity, unitPrice}) => ({
              itemName: name.trim(),
              category: category.trim(),
              quantity,
              unitPrice
            })),    
        });
        console.log(entries.map(({ name, category, quantity, unitPrice}) => ({
              itemName: name.trim(),
              category: category.trim(),
              quantity,
              unitPrice
            })))
        setEntries([newEntry()]);
        setIdempotencyKey(crypto.randomUUID());
    } catch (err) {
       setError(err instanceof Error ? err.message : "Couldn't save your expenses") 
    } finally {
        setIsLoading(false)
    }
  }; 
  return (
    <form
        onSubmit={handleSubmit}
        aria-labelledby="expenses-heading"
        className="mx-auto max-w-xl rounded-xl border border-gray-300 p-3 sm:p-4"
    >
        <h2 id="expenses-heading" className="mb-1 text-lg font-bold text-gray-900">
            Expenses
        </h2>
      {entries.map(entry => (
        <ExpenseCard
          key={entry.id}
          item={entry}                                 // data down
          onChange={next => updateEntry(entry.id, next)} // events up
          onDelete={() => deleteEntry(entry.id)}         // events up
        />
      ))}

      <div className="flex my-3 justify-center">
        <Button type="button" kind="addExpense" onClick={addEntry}/>
      </div>
    <p className="text-right text-lg font-bold text-gray-900">
        Total expenses: {money.format(totalAmount / 100)}
       </p>
        { error && (
            <p role="alert" className="mt-2 text-right text-sm text-red-700">
                {error}
            </p>
        )}
      <div className="mt-3 flex justify-end">
        <Button 
            type="submit" 
            kind="saveExpense" 
            disabled ={isLoading || entries.length === 0}
        />
      </div>
    </form>
  )
}

export default ExpenseList