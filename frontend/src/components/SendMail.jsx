import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx"

function SendMail() {

    const [msg, setmsg] = useState("")
    const [status, setstatus] = useState(false)
    const [emailList, setEmailList] = useState([])
    const [subject, setSubject] = useState("")


    function handlemsg(evt) {
        setmsg(evt.target.value)
    }

    function handlefile(event) {
        const file = event.target.files[0]
        console.log(file)

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
            const totalemail = emailList.map(function (item) { return item.A })
            console.log(totalemail)
            setEmailList(totalemail)

        }

        reader.readAsBinaryString(file);
    }

    function send() {

        if (!subject || !msg || emailList.length === 0) {
            alert("All fields are required!");
            return;
        }

        setstatus(true)
        axios.post("https://bulkmail-app-dw3a.onrender.com/sendmail", { subject: subject, msg: msg, emailList: emailList })
            .then(function (res) {

                if (res.data.success === true) {
                    alert(res.data.message)

                    setSubject("");
                    setmsg("");
                    setEmailList([]);
                } else {
                    alert("Failed")
                }

                setstatus(false)

            })
            .catch(function (err) {
                console.log(err)
                alert("Server Error")
                setstatus(false)
            })
    }

    return (
        <div>
            <div className="bg-blue-950 text-white text-center">
            </div>

            <div className="bg-blue-800 text-white text-center">
                <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
            </div>

            <div className="bg-blue-600 text-white text-center">
                <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
            </div>

            <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">

                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter Subject"
                    className="bg-white w-[80%] py-2 outline-none px-2 border border-black rounded-md mb-3"
                />



                <textarea onChange={handlemsg} value={msg} className=" bg-white w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text ...."></textarea>

                <div className="">
                    <input type="file" onChange={handlefile} className="border-white border-4 border-dashed py-4 px-4 mt-5 mb-5" />
                </div>

                <p>Total Emails in the file: {emailList.length}</p>



                <button onClick={send} className="mt-2 bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit">{status ? "Sending..." : "Send"}</button>




            </div>



            <div className="bg-blue-300 text-white text-center p-8">

            </div>

            <div className="bg-blue-200 text-white text-center p-8">

            </div>

        </div>
    );
}

export default SendMail;

