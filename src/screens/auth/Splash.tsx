import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import { PHOTOS } from "../../data/demo";
import { useNav } from "../../navigation/Navigation";

export default function Splash() {
  const { push } = useNav();

  return (
    <main className="splash" style={{ backgroundImage: `url(${PHOTOS.rider})` }}>
      <div className="splash-shade" />
      <section className="splash-content">
        <div>
          <Logo light />
          <p className="tagline">MOVE · EAT · SHOP · DELIVER</p>
        </div>
        <div className="splash-main">
          <p className="eyebrow">ONE APP. EVERYDAY POSSIBILITIES.</p>
          <h1>
            Everything <em>you need</em>
            <br />
            in one app.
          </h1>
          <p>From your morning commute to dinner at your door, RoadRider keeps life moving.</p>
          <div className="service-row">
            {[
              ["food", "Food"],
              ["car", "Rides"],
              ["bag", "Grocery"],
              ["box", "Courier"],
            ].map(([icon, label]) => (
              <div key={label}>
                <span>
                  <Icon name={icon} />
                </span>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => push({ name: "phone" })}>
          Get started <Icon name="arrow" size={20} />
        </Button>
        <p className="photo-credit">Photo by Cemrecan Yurtman on Unsplash</p>
      </section>
    </main>
  );
}
