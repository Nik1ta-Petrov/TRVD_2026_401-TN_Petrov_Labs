import { apiRequest } from './apiService';

export interface SubscriptionDTO {
  id?: string;
  telegramId: string;
  groupNumber: number;
  subscribeOutage: boolean;
  subscribeAlert: boolean;
}

export const SubscriptionService = {
  async getAll(): Promise<SubscriptionDTO[]> {
    const res = await apiRequest('/subscriptions');
    if (!res.ok) throw new Error('Не вдалося завантажити підписки');
    return res.json();
  },

  async save(data: SubscriptionDTO): Promise<SubscriptionDTO> {
    const res = await apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Помилка при збереженні підписки');
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await apiRequest(`/subscriptions?id=${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  }
};