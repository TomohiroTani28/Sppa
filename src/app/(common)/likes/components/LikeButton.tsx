// src/app/tourist/likes/components/LikeButton.tsx
import { useState } from "react";
import { useLikeTherapist } from "@/app/hooks/api/useLikeTherapist";
import { Button } from "@/app/components/ui/Button"; // Fixed import: Default import

interface LikeButtonProps {
  therapistId: string;
  liked: boolean;
  guestId: string; // Added guestId prop
}

const LikeButton: React.FC<LikeButtonProps> = ({
  therapistId,
  liked,
  guestId,
}) => {
  // Destructure guestId from props
  const [isLiked, setIsLiked] = useState(liked);
  const { likeTherapist, unlikeTherapist } = useLikeTherapist(); // Assuming useLikeTherapist returns unlikeTherapist now

  const handleLike = async () => {
    if (isLiked) {
      // Assuming unlikeTherapist is now available and takes guestId and therapistId
      if (unlikeTherapist) {
        // Check if unlikeTherapist exists to avoid runtime error if hook is not correctly updated yet
        await unlikeTherapist(guestId, therapistId);
      } else {
        console.error(
          "unlikeTherapist is not available from useLikeTherapist hook. Please check the hook implementation.",
        );
        return; // Exit handler to prevent further actions if unlikeTherapist is missing
      }
    } else {
      await likeTherapist(guestId, therapistId); // Pass guestId and therapistId
    }
    setIsLiked(!isLiked);
  };

  return (
    <Button
      onClick={handleLike}
      className={`w-full ${isLiked ? "bg-red-500" : "bg-gray-500"}`}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
};

export default LikeButton;
