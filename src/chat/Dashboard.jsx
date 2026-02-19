import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";



export const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [getMessage, setGetMessage] = useState(null);
    const [editInfo, setEditInfo] = useState(null);
    const [newMessage, setNewMessage] = useState("");


    const [loading, setLoading] = useState(false);
    const bottom = useRef();
   



    const sendMessage = async(e, id, name)=>{
       e.preventDefault();
       setLoading(true);
        try{
           const response = await axios.post("http://127.0.0.1:4000/api/messages/", {user_id:id, name, message});
            // alert(response.data.message);
            setMessage("");
            fetchData();  
            bottom.current?.scrollIntoView();
            setLoading(false);
        }catch(error){
            let err = "Error connecting to the server!";

            if(error.response?.data?.error){
                alert(error.response?.data?.error)
                setLoading(false);
                return;
            }

            alert(err);
            setLoading(false);
            return;
        }
        
    };


    const editMessage =(id, msg)=>{
        setEditInfo(id);
        setNewMessage(msg)
    }

    const saveMessage = async(id)=>{
        //  setLoading(true);
        try{
           const response = await axios.put(`http://127.0.0.1:4000/api/messages/${id}`, {newMessage});
            // alert(response.data.message)
            fetchData();
            setEditInfo(null);
            
        }catch(error){
            let err = "Error connecting to the server!";

            if(error.response?.data?.error){
                alert(error.response?.data?.error)
                // setLoading(false);
                return;
            }

            alert(err);
            // setLoading(false);
            return;
        }
    }



    const deleteMessage = async(id)=>{
        try{
          const response = await axios.delete(`http://127.0.0.1:4000/api/messages/${id}`);
        //   alert(response.data.message);
        fetchData();
        
        }catch(error){
            let err = "Error connecting to the server!";

            if(error.response?.data?.error){
                alert(error.response?.data?.error)
                return;
            }

            alert(err);
            return;
        }
    }

    const fetchData = async()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        // const session = JSON.parse(localStorage.getItem('session'));
        // console.log(user)
        const response = await axios.get("http://127.0.0.1:4000/api/messages/");
        // res.data(response)
        // console.log( res.data(response));
        console.log(response.data)
        setGetMessage(response.data);
        setUser(user)
    }

    

    useEffect(()=>{
        fetchData();
    }, [])


    const logout = ()=>{
        localStorage.removeItem("user")
         localStorage.removeItem("session")
         navigate("/")
    }


  return (
    <div className="container pb-5">
        <div className="d-flex justify-content-between my-2">
            <h1>Hello {user?.name} </h1>
             <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
            <div className="rounded rounded-4"  style={{boxShadow:"0 0 50px 10px grey", height:"400px", overflowY:"auto", padding:"0 10px 60px 10px"}}>
                 {getMessage?.map((msg, key) => (
                <div  key={key} className={`d-flex ${user?.name === msg.name ? "justify-content-end":"justify-content-start"}`}>
                    <div className={`text-white p-2 mt-2 border rounded-4 ${user?.name === msg.name ? "bg-primary":"bg-secondary"}`}>
                        {msg.name  == user?.name ? <b>You</b>:<b >{msg.name}</b>}:{msg.message}       
                        {user?.name === msg.name ? (
                            <button className="btn btn-info ms-3 py-0"  onClick={()=>editMessage(msg.id, msg.message)}>Edit</button>
                        ):(
                             <button className="btn btn-info ms-3 py-0" >Reply</button>
                        )}
                        <button className="btn btn-danger ms-3 py-0"  onClick={()=>deleteMessage(msg.id)}>Delete</button>
                       {editInfo === msg.id && (
                           <div className="mt-3">
                            <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} />
                            <div >
                                <button  className="btn alert alert-primary py-0 mt-2" onClick={()=>saveMessage(msg.id)}>Save</button>
                            <button className="btn alert alert-danger py-0 mt-2 mx-2" onClick={()=>setEditInfo(null)} >Cancel</button>
                            </div>
                           </div>
                       )}
                    </div>
                </div>

        ))}
        <div ref={bottom}></div>
            </div>
        <form onSubmit={(e)=>{
            sendMessage(e, user.id, user.name);
        }} className="fixed-bottom d-flex mb-5 mx-5 gap-2">
            Message <input type="text" placeholder="Enter Message" className="form-control" value={message} onChange={(e)=> setMessage(e.target.value)} />
            <button className="btn btn-success px-4 py-2" disabled={!message || loading} >{loading ? "Sending...": "Send"}</button>
        </form>
    </div>
  )
}
