import { redirect } from "@tanstack/react-router";

export class KitchenError extends Error {
   constructor(
      message: string,
      public code:
         | "HOUSE_CREATION_FAILED"
         | "LOCATION_CREATION_FAILED"
         | "UNAUTHORIZED"
         | "NOT_FOUND"
         | "VALIDATION_ERROR",
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
