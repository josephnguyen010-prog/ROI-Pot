export default function PlateZone({ plateZoneRef, plateAreaRef }) {
  return (
    <div className="plate-zone" ref={plateZoneRef}>
      <div className="plate-label">Your Plate</div>
      <div className="plate-area" ref={plateAreaRef}>
        <div className="plate-disc" />
      </div>
    </div>
  );
}
