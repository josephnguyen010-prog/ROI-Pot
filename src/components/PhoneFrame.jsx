export default function PhoneFrame({ children }) {
  return (
    <div className="rig">
      <div className="phone">
        <div className="screen">
          <div className="notch" />
          <div id="app-root">{children}</div>
        </div>
      </div>
    </div>
  );
}
