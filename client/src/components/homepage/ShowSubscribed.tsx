import type { SubscriberType } from "../../constants/dataTypes";

const ShowSubscribed = ({ subscribed }: { subscribed: SubscriberType[] }) => {
  console.log("subscribed", subscribed);
  return <div>Show channel user Subscribed</div>;
};

export default ShowSubscribed;
