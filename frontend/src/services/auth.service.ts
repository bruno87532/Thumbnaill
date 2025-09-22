import axios from "axios"

export class AuthService { 
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async login(data: {
    email: string,
    password: string
  }) {
    await axios.post(this.pathBackend + "/auth/login", {
      ...data
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}