import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
    children: ReactNode;
  }
  
  
const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
    const navigate = useNavigate()
  
    useEffect(() => {
      const userDataString = localStorage.getItem('userInfo') ;
  
      let userData = null
      if(userDataString){
        userData = JSON.parse(userDataString)
      }
    
      if (!userData) {
        navigate('/start');
        return
      }
    }, []);
    return children
}
  

export default ProtectedRoute