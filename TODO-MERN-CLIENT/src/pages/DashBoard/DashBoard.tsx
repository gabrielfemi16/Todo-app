import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./dashBoard.css";

const DashBoard = ({ children }: {children: React.ReactNode}) => {
  useEffect(()=>{
    document.body.classList.add("DashboardPage");
    //cleanup function
    return () =>{
      document.body.classList.remove("DashboardPage")
    }
  }, [])

  const [isOpen, setIsOpen] = useState(true)

  const toggleNavbar = ()=>{
    setIsOpen(!isOpen);
  };

  return (
    <div className={`homePage ${isOpen ? "open" : "closed"}`}>
      <Sidebar isOpen ={isOpen} toggleNavbar={toggleNavbar}/>
      <div className="mainPage darkestBlue_bg">
        <Navbar toggleNavbar={toggleNavbar}/>
        {children}
      </div>
    </div>
  )
}

export default DashBoard