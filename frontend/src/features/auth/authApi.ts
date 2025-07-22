import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: any }> {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data as { token: string; user: any };
}

export async function signup(
  name: string,
  email: string,
  password: string,
  bio: string,
  contactInfo: string,
  role: string
): Promise<{
  message: string;
  speaker: { id: string; name: string; email: string; role: string };
  token: string;
}> {
  const response = await axios.post(`${API_URL}/signup`, {
    name,
    email,
    password,
    bio,
    contactInfo,
    role,
  });
  return response.data as {
    message: string;
    speaker: { id: string; name: string; email: string; role: string };
    token: string;
  };
}
