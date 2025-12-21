import { useMutation } from "@tanstack/react-query";
import { api, type ContactInput } from "@shared/routes";

export function useCreateContact() {
  return useMutation({
    mutationFn: async (data: ContactInput) => {
      const validated = api.contact.submit.input.parse(data);
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contact.submit.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
          const error = api.contact.submit.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit contact form");
      }
      
      return api.contact.submit.responses[201].parse(await res.json());
    },
  });
}
