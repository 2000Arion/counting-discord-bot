import prisma from '../prisma/client';

import { generateTarget } from './gameModes';

async function getLatestCount(channelId: string) {
    const latestCount = await prisma.currentCount.findFirst({
        where: {
            id: channelId
        }
    });
    return latestCount?.number ?? 0;
}

async function getGameData(channelId: string) {
    const gameData = await prisma.currentCount.findUnique({
        where: {
            id: channelId
        }
    });
    return gameData;
}

async function updateCount(newCount: number, senderId: string, channelId: string) {
    const count = await prisma.currentCount.findUnique({
        where: {
            id: channelId
        }
    });

    if (count) { // Wenn ein Zählstand für diesen Kanal existiert
        await prisma.currentCount.update({
            where: {
                id: channelId
            },
            data: {
                number: newCount,
                senderId: senderId
            }
        });
    } else { // Wenn kein Zählstand für diesen Kanal existiert
        await prisma.currentCount.create({
            data: {
                id: channelId,
                number: newCount,
                senderId: senderId,
                mode: 'all',
                target: generateTarget('all')
            }
        });
    }
}

async function getMode(channelId: string) {
    const gameMode = await prisma.currentCount.findUnique({
        where: {
            id: channelId
        }
    });
    return gameMode?.mode ?? 'all';
}

async function resetCount(mode: string, channelId: string) {
    // Generiere das Ziel basierend auf dem Modus
    const target = generateTarget(mode);

    await prisma.currentCount.update({
        where: {
            id: 1
        },
        data: {
            target: target,
            number: 0,
            senderId: null,
            mode: mode
        }
    });

}

async function getTarget(channelId: string) {

    const target = await prisma.currentCount.findUnique({
        where: {
            id: channelId
        }
    });

    return target?.target ?? null;
}

export {
    getLatestCount,
    updateCount,
    getMode,
    resetCount,
    getGameData,
    getTarget
};
