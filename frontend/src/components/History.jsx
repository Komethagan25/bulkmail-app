import { useEffect, useState } from "react";
import axios from "axios";

function History() {

  const [mails, setMails] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/history")
      .then(res => {
        setMails(res.data.data);
      });
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">Email History</h2>

      {mails.length === 0 && <p>No emails sent yet.</p>}

      {mails.map((mail, index) => (
        <div key={index} className="border p-4 mb-3 rounded shadow bg-white">
          <p><b>Subject:</b> {mail.subject}</p>
          <p><b>Status:</b> {mail.status}</p>
          <p><b>Total Recipients:</b> {mail.recipients.length}</p>
          <p><b>Date:</b> {new Date(mail.sentAt).toLocaleString()}</p>
        </div>
      ))}

    </div>
  );
}

export default History;
