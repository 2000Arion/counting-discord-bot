import prisma from "../prisma/client";

import { generateTarget } from "./gameModes";

async function getLatestCount(channelId: string) {
  const latestCount = await prisma.currentCount.findFirst({
    where: {
      id: channelId,
    },
  });
  return latestCount?.number ?? 0;
}

async function getGameData(channelId: string) {
  const gameData = await prisma.currentCount.findUnique({
    where: {
      id: channelId,
    },
  });
  return gameData;
}

async function addCountingStats(channelId: string, senderId: string) {
    const count = await prisma.currentCount.findUnique({
        where: {
            id: channelId
        }
    });

    const countStat = await prisma.countStat.findUnique({
        where: {
            id: channelId
        },
        include: {
            userCountStat: {
                where: {
                    userId: senderId
                }
            }
        }
    })

    if (!countStat) {
        const countIncrease = count?.mode === "positive_odd" ?
            { positiveOdd: 1 } : count?.mode === "positive_even" ?
                { positiveEven: 1 } : count?.mode === "negative" ?
                    { negative: 1 } : { all: 1 };
        await prisma.countStat.create({
            data: {
                id: channelId,
                ...countIncrease,
                userCountStat: {
                    create: {
                        userId: senderId,
                        ...countIncrease
                    }
                }
            }
        })
    } else {

        if (!countStat.userCountStat[0]) {
            countStat.userCountStat[0] = await prisma.userCountStat.create({
                data: {
                    userId: senderId,
                    id: channelId,
                    positiveOdd: 0,
                    positiveEven: 0,
                    negative: 0,
                    all: 0,
                    countStat: {
                        connect: {
                            id: channelId
                        }
                    }
                }
            })
        }

        const countIncrease = count?.mode === "positive_odd" ?
            { positiveOdd: countStat.positiveOdd + 1 } : count?.mode === "positive_even" ?
                { positiveEven: countStat.positiveEven + 1 } : count?.mode === "negative" ?
                    { negative: countStat.negative + 1 } : { all: countStat.all + 1 };

        const countIncreaseUser = count?.mode === "positive_odd" ?
            { positiveOdd: countStat.userCountStat[0].positiveOdd + 1 } : count?.mode === "positive_even" ?
                { positiveEven: countStat.userCountStat[0].positiveEven + 1 } : count?.mode === "negative" ?
                    { negative: countStat.userCountStat[0].negative + 1 } : { all: countStat.userCountStat[0].all + 1 };

        await prisma.countStat.update({
            where: {
                id: channelId
            },
            data: {
                ...countIncrease,
            }
        })

        await prisma.userCountStat.update({
            where: {
                id: countStat.userCountStat[0].id,
            },
            data: {
                ...countIncreaseUser
            }
        })
    }
}

async function updateCount(
  newCount: number,
  senderId: string,
  channelId: string
) {
  const count = await prisma.currentCount.findUnique({
    where: {
      id: channelId,
    },
  });

  if (count) {
    // Wenn ein Zählstand für diesen Kanal existiert
    await prisma.currentCount.update({
      where: {
        id: channelId,
      },
      data: {
        number: newCount,
        senderId: senderId,
      },
    });
    return count.target;
  } else {
    // Wenn kein Zählstand für diesen Kanal existiert
    const target = generateTarget("all");
    await prisma.currentCount.create({
      data: {
        id: channelId,
        number: newCount,
        senderId: senderId,
        mode: "all",
        target: target,
      },
    });
    return target;
  }
}

async function getLatestSender(channelId: string) {
  const latestSender = await prisma.currentCount.findFirst({
    where: {
      id: channelId,
    },
  });
  return latestSender?.senderId ?? "";
}

async function getMode(channelId: string) {
  const gameMode = await prisma.currentCount.findUnique({
    where: {
      id: channelId,
    },
  });
  return gameMode?.mode ?? "all";
}

async function resetCount(mode: string, channelId: string) {
  // Generiere das Ziel basierend auf dem Modus
  const target = generateTarget(mode);

  await prisma.currentCount.update({
    where: {
      id: channelId,
    },
    data: {
      target: target,
      number: 0,
      senderId: undefined,
      mode: mode,
    },
  });
}

async function getTarget(channelId: string) {
  const target = await prisma.currentCount.findUnique({
    where: {
      id: channelId,
    },
  });

  return target?.target ?? null;
}

export {
  getLatestCount,
  updateCount,
  getMode,
  resetCount,
  getGameData,
  getTarget,
  getLatestSender,
    addCountingStats,
};
