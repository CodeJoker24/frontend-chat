import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async(x)=>{
        x.preventDefault();
        setLoading(true);

        if( !email || !password){
            alert("Field cannot be empty!");
            setLoading(false);
            return;
        }

       


        try{
            const response = await axios.post("https://backend-chat-1-msok.onrender.com/api/auth_routes/login", {email, password})
        
            // console.log(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user))
            localStorage.setItem("session", JSON.stringify(response.data.session))
            setLoading(false);
            navigate("/dashboard")
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

       
    }

  return (
    <div className="m-auto mt-5 p-5 border rounded-4" style={styles.my_container}>
        <form onSubmit={handleLogin}>
           <div className="d-flex flex-column gap-2 mb-2">
            <h3 className="text-center text-white">Welcome Back</h3>     
                <input type="email" placeholder="Enter email" className="form-control" onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="Enter password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
           </div>
            <button className="btn btn-primary" disabled={loading}>{loading ? "Loading...":"Login"}</button>
        </form>
        <p className="text-white"> Don't have an account? <Link to="/signup">Signup</Link> </p>
       
    </div>
  )
}

const styles = {
    my_container:{
        maxWidth:"600px",
        backgroundColor:"coral"
    }
}
