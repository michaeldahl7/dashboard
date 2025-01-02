import { createFileRoute } from "@tanstack/react-router";
import { useHouseMembers, useInviteMember } from "~/lib/services/house.query";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { useState } from "react";
import type { Member } from '~/lib/types/house'

export const Route = createFileRoute("/$userId/$houseId/members")({
  component: HouseMembers,
});

function HouseMembers() {
  const { houseId } = Route.useParams();
  const { data: members, isLoading } = useHouseMembers(houseId) as { 
    data: Member[], 
    isLoading: boolean 
  };
  const inviteMember = useInviteMember();
  const [email, setEmail] = useState("");

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Members</h2>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-xl">Current Members</h3>
        <ul className="space-y-2">
          {members?.map((member) => (
            <li key={member.id} className="flex items-center gap-2">
              <span>{member.user.name}</span>
              <span className="text-sm text-muted-foreground">
                ({member.role})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl">Invite Member</h3>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={() => {
              inviteMember.mutate(
                { 
                  houseId, 
                  userId: "user-id-from-email" 
                },
                {
                  onSuccess: () => setEmail(""),
                }
              );
            }}
          >
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
} 