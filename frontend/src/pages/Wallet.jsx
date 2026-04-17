import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Wallet() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    const res = await API.get(`/api/wallet/balance/${user.email}`);
    setBalance(res.data);
  };

  const handlePayment = async () => {

    const res = await API.post("/api/payment/create-order", null, {
      params: { amount }
    });

    const order = res.data;

    const options = {
      key: "rzp_test_Sdr6ZGzf8Q4OUr",
      amount: order.amount,
      currency: "INR",
      name: "Marketplace Wallet",
      description: "Add Money",
      order_id: order.id,

      handler: async function () {

        await API.post("/api/payment/success", null, {
          params: {
            email: user.email,
            amount
          }
        });

        alert("Payment Successful 💰");
        loadBalance();
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />

      <div className="p-10">

        <h1 className="text-3xl font-bold mb-6">Wallet</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl">Balance</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹ {balance}
          </p>
        </div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-3 mr-4"
        />

        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Add Money
        </button>

      </div>
    </>
  );
}

export default Wallet;