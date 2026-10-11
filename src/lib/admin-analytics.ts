import "server-only";
import { prisma } from "@/lib/prisma";

const marketplaceEvents = [
  "click_shopee",
  "click_tiktok_shop",
  "click_tokopedia",
];

export async function getMarketplaceActivityForLastSevenDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      date,
      dateKey: date.toDateString(),
      label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(
        date,
      ),
    };
  });

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 1);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      eventName: { in: marketplaceEvents },
      createdAt: { gte: days[0].date, lt: endDate },
    },
    select: { createdAt: true },
  });

  return days.map(({ dateKey, label }) => ({
    label,
    count: events.filter((event) => event.createdAt.toDateString() === dateKey)
      .length,
  }));
}
