import axios from "axios"
import { useState,useEffect } from "react";



function App() {
  const [user, setUser] = useState(null);
  const [First_Name, SetUserName] = useState("");
  const [Email, SetEmail] = useState("");

  const handleMessage = async()=>{
    if(!First_Name || !Email){
      alert("Field cannot be empty")
      return;
    }

    try{
      await axios.post("http://127.0.0.1:5000/", {First_Name, Email})
      fetchData();
      alert("message successfully")
    }catch(error){
      alert(error);
    }
  }

  const fetchData = async() =>{
    const res = await axios.get("http://127.0.0.1:5000/");
    console.log(res.data);
    setUser(res.data);
  };

  useEffect(()=>{
    fetchData();
  }, [])

  return (
    <>
    <h1>My Page</h1>
      <div>
      <div>
      <input type="text" placeholder="enter name" onChange={(e)=>SetUserName(e.target.value)}/>
      <input type="text" placeholder="enter email" onChange={(e)=>SetEmail(e.target.value)}/>
      <button onClick={handleMessage}>Submit</button>
      </div>
      <div>
          {user && user.map(info =>{
          return <h5 key={info.id}>{info.First_Name}: {info.Email}</h5>
        })}
      </div>
      </div>
    </>
  )
}

export default App
