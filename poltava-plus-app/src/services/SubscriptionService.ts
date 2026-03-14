import { prisma } from "../lib/prisma";

export interface CreateSubscriptionDTO {
  telegramId: string;
  username?: string;
  groupNumber?: number;
  subscribeOutage?: boolean;
  subscribeAlert?: boolean;
}

export class SubscriptionService {
  static async subscribe(data: CreateSubscriptionDTO) {
    const user = await prisma.subscription.findUnique({
      where: { telegramId: data.telegramId },
    });

    if (user) {
      return await prisma.subscription.update({
        where: { telegramId: data.telegramId },
        data: {
          username: data.username,
          groupNumber: data.groupNumber ?? user.groupNumber,
          subscribeOutage: data.subscribeOutage ?? user.subscribeOutage,
          subscribeAlert: data.subscribeAlert ?? user.subscribeAlert,
        },
      });
    }

    return await prisma.subscription.create({
      data: {
        telegramId: data.telegramId,
        username: data.username,
        groupNumber: data.groupNumber,
        subscribeOutage: data.subscribeOutage || false,
        subscribeAlert: data.subscribeAlert || false,
      },
    });
  }

  static async getAllSubscriptions() {
    return await prisma.subscription.findMany();
  }
}