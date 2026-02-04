export const API_URL = process.env.NEXT_PUBLIC_API_URL!

export const apiFetch = (path: string, options?: RequestInit) => {
  const token = localStorage.getItem("token")

  return fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  })
}