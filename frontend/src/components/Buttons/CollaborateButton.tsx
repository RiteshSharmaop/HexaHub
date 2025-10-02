import { useState } from "react";
import { Users } from "lucide-react";
import { useRoom } from "../../context/RoomContext";

const CollaborateButton = () => {
  const { roomId } = useRoom();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate link dynamically using roomId
  const shareLink = `${window.location.origin}/room/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
      >
        <Users className="w-4 h-4" />
        <span>Collaborate</span>
      </button>

      {/* Dropdown Box */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            Share this link with collaborators:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-2 py-1 border rounded text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborateButton;
