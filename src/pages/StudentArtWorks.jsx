import Drawer_PopUp from "../components/Drawer_PopUp";
import KonvaReview from "../components/KonvaReview"
import FeedBackBox from "../components/FeedBack_Box";


export default function StudentArtWorks() {

  return (
    <>
      <KonvaReview />
      <div className="feedback-container">
        <FeedBackBox />
      </div>
      <Drawer_PopUp />
    </>
  );
}
