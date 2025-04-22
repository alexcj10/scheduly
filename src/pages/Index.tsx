import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "./Auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return <Auth />;
};

export default Index;
