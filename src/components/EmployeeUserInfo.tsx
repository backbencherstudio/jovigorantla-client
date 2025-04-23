
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from 'lucide-react';

const EmployeeUserInfo = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get initials for avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    
    // Get first letter of email
    return user.email.charAt(0).toUpperCase();
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Employee Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{user.email?.split('@')[0]}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-1 h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Employee</Badge>
              {user.email?.includes('admin') && <Badge>Admin</Badge>}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Account created: {formatDate(user.created_at || new Date().toISOString())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeUserInfo;
