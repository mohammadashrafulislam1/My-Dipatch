import { FiBell } from "react-icons/fi";
import NotificationComp from "../../../Components/Notifications";

const notifications = [
  { id: 1, text: "You have a new message from Alex.", time: "2 hours ago" },
  { id: 2, text: "New comment on your post.", time: "3 hours ago" },
  { id: 3, text: "System update completed.", time: "6 hours ago" },
  { id: 4, text: "Your password was changed.", time: "Yesterday" },
  { id: 5, text: "Weekly summary is ready.", time: "2 days ago" },
];

const Notification = () => {
  return (
    <div className="p-6">
      
    <NotificationComp/>
    </div>
  );
};

export default Notification;
