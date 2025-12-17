// src/services/authService.ts
import usersData from '../data/users.json';
import { hashPassword } from '../utils/security';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

// Backend cevabı simülasyonu
interface LoginResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export const authService = {
  login: async (email: string, rawPassword: string): Promise<LoginResponse> => {
    // Backend gecikmesi simülasyonu (0.3 saniye bekle)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Şifreyi hashleme
    const hashedPassword = await hashPassword(rawPassword);
    
    console.log("hash", hashedPassword)
    
    // Veritabanından (yani JSON'dan) kullanıcıyı ara bul
    // Not: Gerçek projede veritabanı sorgusu burada yapılır
    const user = usersData.find(
      (u) => u.email === email && u.password === hashedPassword
    );

    if (!user) {
      return { success: false, message: 'auth.loginError' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'auth.passiveError' };
    }

    // Başarılı ise kullanıcı bilgilerini (şifre hariç) döndür
    const { password, ...userWithoutPassword } = user;
    
    return { success: true, data: userWithoutPassword };
  }
};