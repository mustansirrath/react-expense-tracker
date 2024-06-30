import "../index.css";
import { useRef, useState, useEffect } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Expensescreen() {
  const [exporting, setExporting] = useState(false);
  const [expense, setExpense] = useState("No Expense Here");
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState();
  const [expenseList, setExpenseList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const expenseVal = useRef(null);
  const amountVal = useRef(null);
  const categoryVal = useRef(null);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenseList'));
    if (storedExpenses) {
      setExpenseList(storedExpenses);
      const total = storedExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setTotalAmount(total);
    }
  }, []);

  function clearAllData() {
    localStorage.clear()
    setExpenseList([])
    setTotalAmount(0)
  }

  useEffect(() => {
    if (expenseList.length > 0) {
      localStorage.setItem('expenseList', JSON.stringify(expenseList));
    }
    const total = expenseList.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    setTotalAmount(total);
  }, [expenseList]);

  const generatePDF = () => {
    setExporting(true);
    const input = document.getElementById('expense-data');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm');
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('expenses.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF', error);
      });
  };

  function AddTask() {
    let expenseValue = expenseVal.current.value;
    let categoryValue = categoryVal.current.value;
    let amountValue = parseFloat(amountVal.current.value);
    setExpenseList((previousExpense) => [
      ...previousExpense,
      { expense: expenseValue, amount: amountValue.toString(), category: categoryValue },
    ]);
    expenseVal.current.value = "";
    amountVal.current.value = "";
    categoryVal.current.value = "";
  }

  return (
    <>
      <div className="mainContainer">
        <div className="inputAndTotal">
          <div className="inputBox">
            <input
              type="text"
              ref={expenseVal}
              placeholder="Enter Your Expense"
              className="expenseInput"
            />
            <input
              type="number"
              ref={amountVal}
              placeholder="Enter Expense Amount"
              className="amountInput"
            />
            <input
              type="text"
              ref={categoryVal}
              placeholder="Enter Category"
              className="categoryInput"
            />
            <button className="addBtn" onClick={AddTask}>
              Add Expense
            </button>
          </div>
          <hr className="vHr" />
          <div className="totalBox">
            <div className="totalAmount">
              <p>Total:</p>
              <h3>{totalAmount}</h3>
            </div>
          </div>
        </div>
        
        <div className="expenseList" id="expense-data">
          <div className="indicate">
            <div><h3>Expenses</h3></div>
            <div><h3>Amount</h3></div>
          </div>
          <hr className="listHr" />
          <div className="lists" >
            {expenseList.length > 0 ? (
              expenseList.map((item, index) => (
                <div key={index} className="list">
                  <div className="expense">
                    <h3>{item.expense}</h3><span>{item.category}</span>
                  </div>
                  <div className="amount">
                    <p>{item.amount}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="showText">
                <p>{expense}</p>
              </div>
            )}
          </div>
          <hr className="listHr" />
          <div className="totalSection">
            <div><h3>Total:</h3></div>
            <div><h3>{totalAmount}</h3></div>
          </div>
          
        </div>
        <div className="export">
            <button className="exportBtn" onClick={generatePDF}>Export</button>
            <button className="exportBtn" onClick={clearAllData}>Clear All</button>
          </div>
      </div>
    </>
  );
}

export default Expensescreen;
