import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock } from "lucide-react";
import { ProfileSettings } from "./ProfileSettings";
import { EmailSettings } from "./EmailSettings";
import { PasswordSettings } from "./PasswordSettings";
import type { Profile } from "@/hooks/useProfile";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onProfileUpdate: () => void;
}

export function SettingsDialog({ 
  open, 
  onOpenChange, 
  profile,
  onProfileUpdate 
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações da Conta</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Senha</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings 
              profile={profile} 
              onSuccess={() => {
                onProfileUpdate();
              }} 
            />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <EmailSettings profile={profile} />
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <PasswordSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
