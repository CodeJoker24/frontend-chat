import { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "./api";


export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async(x)=>{
        x.preventDefault();
        setLoading(true);

        if(!name || !email || !password || !confirmPassword){
            alert("Field cannot be empty!");
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            alert("Password does not match!");
            setLoading(false);
            return;
        };


        try{
            const response = await API.post("/api/auth_routes/signup", {name, email, password})
            alert(response.data.message);
            setLoading(false);
            navigate("/");
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
        <form onSubmit={handleSignup}>
           <div className="d-flex flex-column gap-2 mb-2">
            <h3 className="text-center text-white">Create New Account</h3>
                 <input type="text" placeholder="Enter fullname" className="form-control" onChange={(e)=>setName(e.target.value)} />
                <input type="email" placeholder="Enter email" className="form-control" onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="Enter password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm password" className="form-control" onChange={(e)=>setConfirmPassword(e.target.value)} />
           </div>
            <button className="btn btn-primary" disabled={loading}>{loading ? "Loading...":"Signup"}</button>
        </form>
        <p className="text-white"> Already have an account? <Link to="/">Login</Link> </p>
       
    </div>
  )
}

const styles = {
    my_container:{
        maxWidth:"600px",
        backgroundColor:"coral"
    }
}
