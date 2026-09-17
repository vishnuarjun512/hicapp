"use client";

import { useState } from "react";
import { toast } from "sonner";
import { handleLogOut } from "./auth/auth";

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const execute = async <T>(
    apiFunction: () => Promise<T>,
  ): Promise<T | null> => {
    try {
      setLoading(true);

      const result = await apiFunction();

      return result;
    } catch (error) {
      console.error("API ERROR:", error);
      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired");

        setTimeout(() => {
          handleLogOut();
        }, 1000);

        return null;
      }

      toast.error("Something went wrong");
      console.log("Error -> ", error);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
  };
};
