import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlaggedListings from "@/components/admin/FlaggedListings";
import AdManagement from "@/components/admin/AdManagement";
import USAListings from "@/components/admin/USAListings";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.type !== "admin" && user.type !== "co_admin") ) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue={user.type === 'admin'? 'ads': 'flagged'} >
        <TabsList className={`grid w-full ${user.type === 'admin'? 'grid-cols-3': 'grid-cols-2'} mb-8`}>
          <TabsTrigger value="flagged">Flagged Listings</TabsTrigger>
          {
            user.type === "admin" && (
              <TabsTrigger value="ads">Ad Management</TabsTrigger>
            )}
          {/* <TabsTrigger value="ads">Ad Management</TabsTrigger> */}
          <TabsTrigger value="usa">USA Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged">
          <FlaggedListings />
        </TabsContent>

        {
          user.type === "admin" && (
            <TabsContent value="ads">
              <AdManagement />
            </TabsContent>
          )
        }

        {/* <TabsContent value="ads">
          <AdManagement />
        </TabsContent> */}

        <TabsContent value="usa">
          <USAListings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
