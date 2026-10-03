
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `/api${endpoint}`;
  
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error: any = new Error(data?.message || "??? ??? ??? ?????");
    error.status = response.status;
    throw error;
  }

  return data;
};

