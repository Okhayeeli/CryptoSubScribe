export type SubscriptionType =
  | "Rent"
  | "Utilities"
  | "Internet"
  | "Streaming"
  | "Gym"
  | "Food Delivery"
  | "Mobile Plan";

export const SubscriptionIcon = ({ type }: { type: SubscriptionType }) => {
  const iconMap = {
    Rent: "🏠",
    Utilities: "💡",
    Internet: "🌐",
    Streaming: "📺",
    Gym: "🏋️",
    "Food Delivery": "🍔",
    "Mobile Plan": "📱",
  };

  return <span className="text-2xl mr-2">{iconMap[type] || "📦"}</span>;
};
