import { redirect } from "@tanstack/react-router";

export type KitchenErrorCode =
   | "HOUSE_CREATION_FAILED"
   | "LOCATION_CREATION_FAILED"
   | "UNAUTHORIZED"
   | "NOT_FOUND"
   | "VALIDATION_ERROR"
   | "NO_CURRENT_HOUSE"
   | "HOUSE_NOT_FOUND"
   | "HOUSE_INVITE_NOT_FOUND"
   | "HOUSE_INVITE_EXPIRED"
   | "HOUSE_INVITE_ALREADY_ACCEPTED"
   | "HOUSE_INVITE_ALREADY_ACCEPTED_BY_OTHER_USER"
   | "INVALID_LOCATION";

export class KitchenError extends Error {
   constructor(
      message: string,
      public code:
         | "HOUSE_CREATION_FAILED"
         | "LOCATION_CREATION_FAILED"
         | "UNAUTHORIZED"
         | "INVALID_LOCATION"
         | "NOT_FOUND"
         | "VALIDATION_ERROR"
         | "NO_CURRENT_HOUSE"
         | "HOUSE_NOT_FOUND"
         | "HOUSE_INVITE_NOT_FOUND"
         | "HOUSE_INVITE_EXPIRED"
         | "HOUSE_INVITE_ALREADY_ACCEPTED"
         | "HOUSE_INVITE_ALREADY_REJECTED"
         | "HOUSE_INVITE_ALREADY_SENT"
         | "HOUSE_INVITE_ALREADY_RECEIVED"
         | "HOUSE_INVITE_ALREADY_ACCEPTED_BY_OTHER_USER",
   ) {
      super(message);
      this.name = "KitchenError";
   }
}

export function handleAuthError() {
   throw redirect({
      to: "/login",
      search: {
         redirect: window.location.pathname,
      },
   });
}
