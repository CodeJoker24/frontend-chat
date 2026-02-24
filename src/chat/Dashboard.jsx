import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";


export const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [getMessage, setGetMessage] = useState(null);
    const [editInfo, setEditInfo] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [replyInfo, setReplyInfo] = useState(null);
    const [replyMessage, setReplyMessage] = useState("")


    const [loading, setLoading] = useState(false);
    const bottom = useRef();
   



    const sendMessage = async(e, id, name)=>{
       e.preventDefault();
       setLoading(true);
        try{
           const response = await API.post("/api/messages/", {user_id:id, name, message});
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
           const response = await API.put(`/api/messages/${id}`, {newMessage});
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
    };


    const handleReply=(id)=>{
        setReplyInfo(id)
    };


    const saveReplyMessage = async(id, user_id, name, reply_old_msg)=>{
        try{
            const response = await API.post(`/api/messages/reply/${id}`, {user_id, name, reply_old_msg, replyMessage} )

            fetchData();
            bottom.current?.scrollIntoView();
            setReplyInfo(null);
            // alert(response.data.message)
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
          const response = await API.delete(`/api/messages/${id}`);
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
        const response = await API.get("/api/messages/");
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
                 {getMessage?.map((msg, key) => {
                    const replyId = getMessage.find(m => m.id === msg.reply_msg_id);
                return(
                    <div  key={key} className={`d-flex ${user?.id === msg.user_id ? "justify-content-end":"justify-content-start"}`}>
                    <div className={`text-white p-2 mt-2 border rounded-4 ${user?.id === msg.user_id ? "bg-primary":"bg-secondary"}`}>
                        {replyId && (<div><i>{msg.name} : {msg.reply_old_msg}</i></div>)}
                        {msg.user_id  == user?.id ? <b>You</b> : <b >{msg.name}</b>} : {msg.message}       
                        {user?.id === msg.user_id ? (
                            <button className="btn btn-info ms-3 py-0"  onClick={()=>editMessage(msg.id, msg.message)}>Edit</button>
                        ):(
                             <button className="btn btn-success ms-3 py-0" onClick={()=>handleReply(msg.id)} >Reply</button>
                        )}
                        <button className="btn btn-danger ms-3 py-0"  onClick={()=>deleteMessage(msg.id)}>Delete</button>


                        {/* Edit */}
                       {editInfo === msg.id && (
                           <div className="mt-3">
                            <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} />
                            <div >
                                <button  className="btn alert alert-primary py-0 mt-2" onClick={()=>saveMessage(msg.id)}>Save</button>
                            <button className="btn alert alert-danger py-0 mt-2 mx-2" onClick={()=>setEditInfo(null)} >Cancel</button>
                            </div>
                           </div>
                       )}


                       {/* Reply */}
                       {replyInfo === msg.id && (
                           <div className="mt-3">
                            <input  onChange={(e)=>setReplyMessage(e.target.value)} />
                            <div >
                                <button  className="btn alert alert-primary py-0 mt-2" onClick={()=>saveReplyMessage(msg.id, user.id, user.name, msg.message)}>Save</button>
                            <button className="btn alert alert-danger py-0 mt-2 mx-2" onClick={()=>setReplyInfo(null)} >Cancel</button>
                            </div>
                           </div>
                       )}
                    </div>
                </div>
                )

            })}
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
