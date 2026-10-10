export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span>Road</span>
      <b>Rider</b>
    </div>
  );
}
