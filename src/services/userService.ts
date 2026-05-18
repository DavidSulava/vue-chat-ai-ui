import { api } from '../api/config';
import type { RegisterUserRequest, RegisterUserResponse } from '../types';

export const userService = {
  async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const { data } = await api.post<RegisterUserResponse>('/register-user', request);
    return data;
  },
};