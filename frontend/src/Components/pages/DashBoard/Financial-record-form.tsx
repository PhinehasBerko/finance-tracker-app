import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
const FinancialRecordForm = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.id;
    console.log({ userId, description, amount, category, date, paymentMethod });

    const newRecord = {
      userId,
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      paymentMethod,
    };
    console.log(newRecord);
    setAmount("0");
    setDescription("");
    setCategory("");
    setDate("");
    setPaymentMethod("");
  };
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Description:</label>
          <input
            type="text"
            required
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Amount:</label>
          <input
            type="number"
            required
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Category</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Investment">Investment</option>
            <option value="Gift">Gift</option>
            <option value="Education">Education</option>
            <option value="Insurance">Insurance</option>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Date:</label>
          <input
            type="date"
            required
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Payment Method:</label>
          <select
            className="input"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Tranfer</option>
          </select>
        </div>
        <button type="submit" className="button border text-sm">
          Add Record
        </button>
      </form>
    </div>
  );
};

export default FinancialRecordForm;
