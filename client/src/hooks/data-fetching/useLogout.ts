import { useMutation } from "@tanstack/react-query";

const useLogout = () => {
  return useMutation({
    mutationFn: async (authToken: string) => {
      const response = await fetch(
        "http://localhost:8000/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Add the Authorization header
          },
        }
      );
      if (!response.ok) throw new Error("USER LOG OUT FAILED");
      const result = await response.json();
      return result.data;
    },
  });
};
export default useLogout;

/*
Cache invalidation:

After a mutation, you can tell React Query to refetch queries (e.g., refresh user profile after login).

Example:

const queryClient = useQueryClient();

const loginMutation = useMutation({
  mutationFn: loginUser,
  onSuccess: () => {
    // Refetch user profile after login
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  },
});
 */
