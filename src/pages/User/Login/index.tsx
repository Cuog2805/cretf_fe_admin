import { getAllProperties } from "@/services/apis/propertyController";
import { useEffect } from "react";
import axios from "axios";


const Login: React.FC = () => {
  useEffect(() => {
    const body: any = {};
    // getAllProperties(body).then(resp => {
    //   console.log(resp);
    // })

    axios.get("http://localhost:8888/api/property/getAllProperties")
    .then(response => console.log(response.data))
    .catch(error => console.error("Error:", error));
  }, [])
  return (
    <div>
      abc
    </div>
  )

};

export default Login;
