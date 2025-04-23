const API_BASE = "http://localhost:3001";

export async function registerUser(data: {
  email: string;
  fullname: string;
  birthday: string;
  gender: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log("Gửi đăng ký:", data);

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Đăng ký thất bại");
  return json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Đăng nhập thất bại");
  return json.token;
}
