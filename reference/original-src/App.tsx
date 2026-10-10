import { useState } from "react";

type Service = "food" | "rides" | "grocery" | "courier";
type Screen = "home" | "detail" | "cart" | "address" | "payment" | "confirmed" | "tracking" | "complete" | "navcart" | "wallet" | "orders" | "account" | "more";

const PHOTOS = {
  rider: "https://images.unsplash.com/photo-1768423083233-b3f696c9b703?auto=format&fit=crop&w=1080&q=85",
  food: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1080&q=85",
  food2: "https://images.unsplash.com/photo-1705174299330-939dd03cc864?auto=format&fit=crop&w=800&q=80",
  grocery: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1080&q=85",
  produce: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80",
  ride: "https://images.unsplash.com/photo-1541702467897-41915a07d3a7?auto=format&fit=crop&w=1080&q=80",
};

const serviceMeta = {
  food: { label: "Food", kicker: "GOOD FOOD · BRIGHTER DAYS", title: "Delicious food,\ndelivered fast.", photo: PHOTOS.food },
  rides: { label: "Rides", kicker: "YOUR CITY, YOUR WAY", title: "Where are you\ngoing today?", photo: PHOTOS.ride },
  grocery: { label: "Grocery", kicker: "FARM FRESH · EVERYDAY", title: "Fresh groceries\nat your doorstep.", photo: PHOTOS.grocery },
  courier: { label: "Courier", kicker: "FAST · SAFE · RELIABLE", title: "Send anything,\nanywhere.", photo: PHOTOS.rider },
};

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    food: <><path d="M6 3v8M10 3v8M6 7h4M8 11v10M16 3v18M16 3c4 3 4 7 0 9"/></>,
    car: <><path d="m5 17-1-1v-5l2-5h12l2 5v5l-1 1"/><path d="M5 12h14M7 17v2M17 17v2"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"/>,
    star: <path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17.3l-6.3 3.2L7 13.7 2 9l7-.9 3-6Z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.7-3.1 19.5 19.5 0 0 1-6-6A20 20 0 0 1 2 4.1 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.9 2.1Z"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-6h6v6"/></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13"/><path d="M16 12h6v4h-6a2 2 0 0 1 0-4Z"/></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,
    cart: <><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.6 11.3a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.6L21 7H6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Logo({ light = false }: { light?: boolean }) {
  return <div className={`logo ${light ? "logo-light" : ""}`}><span>Road</span><b>Rider</b></div>;
}

function Button({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) {
  return <button data-interactive="true" className={`primary-button ${secondary ? "secondary-button" : ""}`} onClick={onClick}>{children}</button>;
}

function Header({ dark = false }: { dark?: boolean }) {
  return <header className={`app-header ${dark ? "dark" : ""}`}>
    <div className="location">
      <span className="location-icon"><Icon name="pin" size={16}/></span>
      <div><small>Delivering to</small><strong>Hazratganj, Lucknow</strong></div>
      <span className="chevron">⌄</span>
    </div>
    <button className="icon-button" aria-label="Notifications"><Icon name="bell" size={20}/><i/></button>
    <div className="avatar">AK</div>
  </header>;
}

function ServiceTabs({ service, onSelect }: { service: Service; onSelect: (value: Service) => void }) {
  const items: [Service, string, string][] = [
    ["food", "food", "Food"], ["rides", "car", "Rides"], ["grocery", "bag", "Grocery"], ["courier", "box", "Courier"],
  ];
  return <nav className="service-tabs">
    {items.map(([id, icon, label]) => <button data-interactive="true" key={id} className={id === service ? "active" : ""} onClick={() => onSelect(id)}>
      <Icon name={icon} size={16}/><span>{label}</span>
    </button>)}
  </nav>;
}

function BottomNav({ active, count, onSelect }: { active: "home" | "navcart" | "wallet" | "orders" | "account"; count: number; onSelect: (value: "navcart" | "wallet" | "orders" | "account") => void }) {
  const items: ["navcart" | "wallet" | "orders" | "account", string, string][] = [
    ["navcart", "cart", "Cart"], ["wallet", "wallet", "Wallet"], ["orders", "list", "Orders"], ["account", "user", "Account"],
  ];
  return <nav className="bottom-nav">
    {items.map(([id, icon, label]) => <button data-interactive="true" key={id} className={id === active ? "active" : ""} onClick={() => onSelect(id)}>
      <span><Icon name={icon} size={21}/>{id === "navcart" && count > 0 && <i>{count}</i>}</span><small>{label}</small>
    </button>)}
  </nav>;
}

function Splash({ onStart }: { onStart: () => void }) {
  return <main className="splash" style={{ backgroundImage: `url(${PHOTOS.rider})` }}>
    <div className="splash-shade"/>
    <section className="splash-content">
      <div><Logo light/><p className="tagline">MOVE · EAT · SHOP · DELIVER</p></div>
      <div className="splash-main">
        <p className="eyebrow">ONE APP. EVERYDAY POSSIBILITIES.</p>
        <h1>Everything <em>you need</em><br/>in one app.</h1>
        <p>From your morning commute to dinner at your door, RoadRider keeps life moving.</p>
        <div className="service-row">
          {[["food","Food"],["car","Rides"],["bag","Grocery"],["box","Courier"]].map(([icon,label]) =>
            <div key={label}><span><Icon name={icon}/></span><small>{label}</small></div>)}
        </div>
      </div>
      <Button onClick={onStart}>Get started <Icon name="arrow" size={20}/></Button>
      <p className="photo-credit">Photo by Cemrecan Yurtman on Unsplash</p>
    </section>
  </main>;
}

function AuthScreen({ step, onBack, onNext }: { step: "phone" | "otp"; onBack: () => void; onNext: () => void }) {
  const [phone, setPhone] = useState("98765 43210");
  const [otp, setOtp] = useState("482");
  const pressKey = (key: number | string) => {
    if (key === "⌫") setOtp((value) => value.slice(0, -1));
    else if (typeof key === "number" && otp.length < 6) setOtp((value) => `${value}${key}`);
  };
  if (step === "otp") return <main className="auth-page otp-page">
    <button className="auth-back" onClick={onBack} aria-label="Go back"><Icon name="back"/></button>
    <Logo/><p className="auth-tag">MOVE · EAT · SHOP · DELIVER</p>
    <section className="auth-copy"><p className="eyebrow">ONE LAST STEP</p><h1>Verify your number</h1><p>We've sent a 6-digit code to <strong>+91 98765 43210</strong></p></section>
    <div className="otp-inputs">{Array.from({ length: 6 }, (_, index) => <span className={index === otp.length ? "focused" : ""} key={index}>{otp[index] || ""}</span>)}</div>
    <button className="resend" onClick={() => setOtp("")}>Resend code</button>
    <Button onClick={onNext}>Verify & continue <Icon name="arrow" size={19}/></Button>
    <div className="keypad">{[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((key,index)=><button disabled={key === ""} onClick={() => pressKey(key)} key={index}>{key}</button>)}</div>
  </main>;
  return <main className="auth-page">
    <Logo/><p className="auth-tag">MOVE · EAT · SHOP · DELIVER</p>
    <div className="auth-illustration">
      <div className="illustration-phone"><Icon name="pin" size={30}/><i/><i/></div>
      <span className="illustration-road"/><span className="illustration-rider"><Icon name="box" size={24}/></span>
    </div>
    <section className="auth-copy"><p className="eyebrow">WELCOME TO ROADRIDER</p><h1>Let's get started</h1><p>Enter your mobile number to continue</p></section>
    <label className="phone-input"><span>+91</span><input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" aria-label="Mobile number"/></label>
    <Button onClick={onNext}>Send OTP <Icon name="arrow" size={19}/></Button>
    <div className="auth-divider"><span/>or continue with<span/></div>
    <div className="social-row"><button onClick={onNext}>G</button><button onClick={onNext}>Apple</button><button onClick={onNext}><span>@</span> Email</button></div>
    <p className="legal">By continuing, you agree to our <b>Terms of Service</b><br/>and <b>Privacy Policy</b>.</p>
  </main>;
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return <div className="search-bar"><Icon name="search" size={20}/><input aria-label={placeholder} placeholder={placeholder}/><button aria-label="Search filters"><Icon name="filter" size={18}/></button></div>;
}

function FoodHome({ onOpen, onService }: { onOpen: () => void; onService: (s: Service) => void }) {
  const categories = [["🍕","Pizza"],["🍔","Burgers"],["🍲","Biryani"],["🥡","Chinese"],["＋","More"]];
  return <>
    <section className="hero food-hero" style={{ backgroundImage: `url(${PHOTOS.food})` }}><Header dark/><ServiceTabs service="food" onSelect={onService}/><div className="hero-copy"><p>{serviceMeta.food.kicker}</p><h1>Delicious food,<br/>delivered fast.</h1></div></section>
    <div className="home-body food-body">
      <SearchBar placeholder="Search dishes or restaurants"/>
      <div className="section-heading"><h2>What are you craving?</h2></div>
      <div className="categories">{categories.map(([icon,label]) => <button key={label}><span>{icon}</span><small>{label}</small></button>)}</div>
      <div className="section-heading"><h2>Popular near you</h2><button>See all</button></div>
      <button data-interactive="true" className="restaurant-card" onClick={onOpen}>
        <div className="restaurant-photo" style={{ backgroundImage: `url(${PHOTOS.food2})` }}><span className="discount">20% OFF</span><span className="heart"><Icon name="heart" size={17}/></span><p>30 min</p></div>
        <div className="restaurant-info"><div><h3>Royal Biryani House</h3><p>Mughlai · North Indian · Biryani</p></div><span className="rating"><Icon name="star" size={11}/> 4.7</span></div>
      </button>
      <div className="section-heading"><h2>Offers for you</h2></div>
      <div className="offers"><article><span>FIRST ORDER</span><strong>Flat 50% off</strong><small>Use WELCOME50</small></article><article><span>FREE DELIVERY</span><strong>Weekend treat</strong><small>On orders over ₹299</small></article></div>
    </div>
  </>;
}

function MapArt() {
  return <div className="map-art">
    <svg viewBox="0 0 340 220" preserveAspectRatio="none">
      <path className="road" d="M-10 45C55 25 80 96 142 70S240 18 355 48M-5 170c70-40 97-6 151-30s90-77 205-55M75-5c5 50-27 102 5 230M255-5c-30 70 20 135-10 230"/>
      <path className="minor" d="M25-5v230M130-5c-10 80 15 135-5 230M310-5v230M-5 110h350M-5 200h350"/>
      <path className="route" d="M65 175c30-30 48-18 70-52 20-31 37-16 62-38 25-21 42-13 73-44"/>
    </svg>
    <span className="map-pin start"><i/></span><span className="map-pin end"><Icon name="pin" size={16}/></span>
    <div className="eta-bubble"><b>5 min</b><small>away</small></div>
  </div>;
}

function LocationRows({ courier = false }: { courier?: boolean }) {
  return <div className="location-rows">
    <button><span className="loc-dot green"/><div><small>{courier ? "PICKUP LOCATION" : "PICKUP"}</small><strong>Hazratganj, Lucknow</strong></div><Icon name="arrow" size={17}/></button>
    <button><span className="loc-dot orange"/><div><small>{courier ? "DELIVERY LOCATION" : "DESTINATION"}</small><strong>{courier ? "Add delivery address" : "Where to?"}</strong></div><Icon name="arrow" size={17}/></button>
  </div>;
}

function RidesHome({ onOpen, onService }: { onOpen: () => void; onService: (s: Service) => void }) {
  return <div className="rides-page"><Header dark/><ServiceTabs service="rides" onSelect={onService}/><div className="segment"><button className="selected">Book a ride</button><button>Hourly rental</button></div>
    <MapArt/><LocationRows/>
    <div className="section-heading"><h2>Choose a ride</h2><span>Fare estimate</span></div>
    <div className="ride-options">
      {[["BIKE","Bike","₹48–62","3 min"],["AUTO","Auto","₹86–102","5 min"],["CAB","Cab","₹148–176","7 min"],["XL","Cab XL","₹218–245","9 min"]].map(([abbr,name,price,time],i) =>
      <button key={name} className={i === 1 ? "selected" : ""}><span className="vehicle">{abbr}</span><strong>{name}</strong><b>{price}</b><small>{time}</small></button>)}
    </div>
    <Button onClick={onOpen}>Book Auto · ₹86–102 <Icon name="arrow" size={19}/></Button>
  </div>;
}

function GroceryHome({ onOpen, onService }: { onOpen: () => void; onService: (s: Service) => void }) {
  const categories = [["FR","Fruits"],["VG","Veggies"],["ML","Dairy"],["SN","Snacks"],["＋","More"]];
  return <div className="grocery-page"><Header/><ServiceTabs service="grocery" onSelect={onService}/><section className="grocery-hero" style={{ backgroundImage: `url(${PHOTOS.grocery})` }}><div><p>FARM FRESH · EVERYDAY</p><h1>Fresh groceries<br/>at your doorstep.</h1><span>Delivery in 15 minutes</span></div></section>
    <SearchBar placeholder="Search 10,000+ products"/>
    <div className="section-heading"><h2>Shop by category</h2><button>See all</button></div>
    <div className="categories grocery-categories">{categories.map(([icon,label]) => <button key={label}><span>{icon}</span><small>{label}</small></button>)}</div>
    <article className="green-banner"><div><small>FRESH & HEALTHY</small><strong>Up to 30% off</strong><button data-interactive="true" onClick={onOpen}>Shop now <Icon name="arrow" size={14}/></button></div><img src={PHOTOS.produce} alt="Fresh vegetables"/></article>
    <div className="section-heading"><h2>Daily essentials</h2><button>See all</button></div>
    <div className="product-grid">{[["Farm fresh tomatoes","500 g","₹32","₹45"],["Organic broccoli","1 piece","₹69","₹89"]].map(([name,unit,price,old],i) => <article key={name}>
      <div className="product-photo" style={{ backgroundImage: `url(${i ? PHOTOS.produce : PHOTOS.grocery})` }}><span>{i ? "22%" : "28%"} OFF</span><button><Icon name="heart" size={16}/></button></div>
      <h3>{name}</h3><small>{unit}</small><div><b>{price}</b><del>{old}</del><button data-interactive="true" aria-label={`Add ${name}`} onClick={onOpen}><Icon name="plus" size={18}/></button></div>
    </article>)}</div>
  </div>;
}

function CourierHome({ onOpen, onService }: { onOpen: () => void; onService: (s: Service) => void }) {
  return <div className="courier-page">
    <section className="courier-hero" style={{ backgroundImage: `url(${PHOTOS.rider})` }}><Header dark/><ServiceTabs service="courier" onSelect={onService}/><div><p>FAST · SAFE · RELIABLE</p><h1>Send anything,<br/>anywhere.</h1><span>Doorstep pickup in minutes</span></div></section>
    <div className="courier-sheet"><div className="segment"><button className="selected">Send package</button><button>Track package</button></div><LocationRows courier/>
      <div className="section-heading"><h2>Package type</h2></div>
      <div className="package-grid">{[["DOC","Document","Up to 500 g"],["S","Small box","Up to 2 kg"],["M","Medium box","Up to 5 kg"],["L","Large box","Up to 10 kg"]].map(([abbr,name,weight],i) => <button key={name} className={i===1?"selected":""}><span>{abbr}</span><strong>{name}</strong><small>{weight}</small></button>)}</div>
      <div className="estimate"><div><small>ESTIMATED PRICE</small><strong>₹129 – ₹149</strong></div><div><small>DELIVERY</small><b>35–45 min</b></div></div>
      <Button onClick={onOpen}>Get quote <Icon name="arrow" size={19}/></Button>
      <div className="trust-row">{[["clock","Live tracking"],["shield","Secure"],["home","Doorstep pickup"]].map(([icon,label])=><div key={label}><span><Icon name={icon} size={18}/></span><small>{label}</small></div>)}</div>
    </div>
  </div>;
}

const flowCopy: Record<Service, { detail: string; subtitle: string; item: string; price: string }> = {
  food: { detail: "Royal Biryani House", subtitle: "Mughlai · North Indian · 30–35 min", item: "Lucknowi Chicken Biryani", price: "₹289" },
  rides: { detail: "Confirm your ride", subtitle: "Hazratganj to Gomti Nagar", item: "Auto · 5 min away", price: "₹96" },
  grocery: { detail: "Your basket", subtitle: "Fresh picks delivered in 15 minutes", item: "Fresh produce basket", price: "₹328" },
  courier: { detail: "Your delivery quote", subtitle: "Hazratganj to Gomti Nagar · 6.2 km", item: "Small box · up to 2 kg", price: "₹139" },
};

function FlowHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="flow-header"><button data-interactive="true" onClick={onBack} aria-label="Go back"><Icon name="back"/></button><h2>{title}</h2><button aria-label="Help">?</button></header>;
}

function ServiceDetail({ service, onBack, onNext }: { service: Service; onBack: () => void; onNext: () => void }) {
  const data = flowCopy[service];
  if (service === "rides") return <div className="flow-page themed"><FlowHeader title="Confirm booking" onBack={onBack}/><MapArt/><div className="driver-preview"><span className="vehicle-icon"><Icon name="car"/></span><div><small>YOUR RIDE</small><h2>Auto</h2><p>Comfortable everyday rides</p></div><strong>₹96</strong></div><LocationRows/><div className="info-strip"><Icon name="clock"/><span>Driver arrives in <strong>5 minutes</strong></span></div><div className="bottom-action"><div className="pay-row"><Icon name="card"/><span>RoadRider Wallet</span><b>₹320</b><Icon name="arrow" size={16}/></div><Button onClick={onNext}>Confirm Auto · ₹96</Button></div></div>;
  return <div className="flow-page"><div className="detail-cover" style={{backgroundImage:`url(${serviceMeta[service].photo})`}}><FlowHeader title="" onBack={onBack}/><span className="detail-badge">{serviceMeta[service].label}</span></div>
    <section className="detail-content"><p className="eyebrow">{serviceMeta[service].kicker}</p><h1>{data.detail}</h1><p>{data.subtitle}</p><div className="stat-row"><span><Icon name="star" size={14}/> 4.8 rating</span><span><Icon name="clock" size={14}/> Fast delivery</span></div>
      <div className="section-heading"><h2>{service === "food" ? "Recommended for you" : service === "courier" ? "Quote breakdown" : "In your basket"}</h2></div>
      <article className="line-item"><div><h3>{data.item}</h3><p>{service === "food" ? "Fragrant basmati rice, tender chicken & house spices" : "Carefully handled and protected throughout the journey."}</p><strong>{data.price}</strong></div><button data-interactive="true" onClick={onNext}>{service === "courier" ? "Select" : "Add +"}</button></article>
    </section><div className="bottom-action"><Button onClick={onNext}>{service === "food" ? `Add to cart · ${data.price}` : service === "grocery" ? "View basket · ₹328" : "Continue to payment"}</Button></div></div>;
}

function CheckoutScreen({ service, screen, onBack, onNext }: { service: Service; screen: Screen; onBack: () => void; onNext: () => void }) {
  const data = flowCopy[service];
  if (screen === "confirmed") return <StatusScreen service={service} stage="confirmed" onNext={onNext}/>;
  if (screen === "tracking") return <StatusScreen service={service} stage="tracking" onNext={onNext}/>;
  if (screen === "complete") return <StatusScreen service={service} stage="complete" onNext={onNext}/>;
  const title = screen === "cart" ? (service === "rides" ? "Finding your driver" : "Your cart") : screen === "address" ? "Delivery details" : "Payment";
  return <div className="flow-page checkout"><FlowHeader title={title} onBack={onBack}/>
    {screen === "cart" && <><article className="cart-item"><div className="item-thumb"><Icon name={service === "food" ? "food" : service === "grocery" ? "bag" : service === "courier" ? "box" : "car"}/></div><div><h3>{data.item}</h3><p>{data.subtitle}</p><strong>{data.price}</strong></div><div className="stepper"><button>−</button><b>1</b><button>+</button></div></article><button className="promo-row"><span>%</span><div><strong>Apply a promo code</strong><small>Save more on this order</small></div><Icon name="arrow" size={18}/></button><BillSummary service={service}/></>}
    {screen === "address" && <><div className="map-mini"><MapArt/></div><div className="section-heading"><h2>Choose an address</h2><button>+ Add new</button></div>{[["home","Home","15, Shahnajaf Road, Hazratganj"],["pin","Work","Vibhuti Khand, Gomti Nagar"]].map(([icon,label,address],i)=><button className={`address-card ${i===0?"selected":""}`} key={label}><span><Icon name={icon}/></span><div><strong>{label}</strong><p>{address}</p></div><i/></button>)}</>}
    {screen === "payment" && <><div className="total-card"><small>TOTAL TO PAY</small><strong>{data.price}</strong><span>Secure checkout</span></div><div className="section-heading"><h2>Payment method</h2></div>{[["card","RoadRider Wallet","Balance ₹320"],["card","UPI","Google Pay, PhonePe and more"],["card","Credit or debit card","Visa, Mastercard, RuPay"]].map(([icon,label,sub],i)=><button className={`payment-card ${i===0?"selected":""}`} key={label}><span><Icon name={icon}/></span><div><strong>{label}</strong><small>{sub}</small></div><i/></button>)}</>}
    <div className="bottom-action"><Button onClick={onNext}>{screen === "cart" ? "Continue" : screen === "address" ? "Deliver here" : `Pay ${data.price}`}</Button></div>
  </div>;
}

function BillSummary({ service }: { service: Service }) {
  return <div className="bill"><h3>Bill details</h3><div><span>Item total</span><b>{service === "grocery" ? "₹328" : flowCopy[service].price}</b></div><div><span>Delivery fee</span><b className="success">FREE</b></div><div><span>Taxes & fees</span><b>₹18</b></div><div className="bill-total"><span>To pay</span><strong>{service === "grocery" ? "₹346" : flowCopy[service].price}</strong></div></div>;
}

function StatusScreen({ service, stage, onNext }: { service: Service; stage: "confirmed" | "tracking" | "complete"; onNext: () => void }) {
  const isRide = service === "rides";
  if (stage === "complete") return <div className="status-page complete-page"><div className="success-mark"><Icon name="check" size={42}/></div><p className="eyebrow">ALL DONE</p><h1>{isRide ? "Hope you enjoyed\nthe ride!" : "Delivered with care."}</h1><p>{isRide ? "You arrived at Gomti Nagar at 4:42 PM." : "Thanks for choosing RoadRider. Your order has been completed."}</p><div className="receipt"><div><span>Total paid</span><strong>{flowCopy[service].price}</strong></div><div><span>Payment</span><b>RoadRider Wallet</b></div></div><h3>How was your experience?</h3><div className="stars">{[1,2,3,4,5].map(i=><button key={i}><Icon name="star" size={28}/></button>)}</div><Button onClick={onNext}>Back to home</Button></div>;
  return <div className="status-page"><div className="status-map"><MapArt/><div className="status-top"><Logo/><button>Help</button></div></div><section className="tracking-sheet"><div className="drag"/><p className="eyebrow">{stage === "confirmed" ? "BOOKING CONFIRMED" : "LIVE UPDATE"}</p><h1>{stage === "confirmed" ? (isRide ? "Meet Arjun, your driver" : "We're on it!") : (isRide ? "You're on your way" : "Arriving in 18 minutes")}</h1><p>{stage === "confirmed" ? "Everything is set. We'll keep you updated." : "Your RoadRider partner is moving smoothly toward the destination."}</p>
    <div className="partner"><div className="partner-avatar">AS</div><div><strong>Arjun Singh</strong><span><Icon name="star" size={12}/> 4.9 · 820 deliveries</span></div><button><Icon name="phone" size={18}/></button></div>
    <div className="status-steps">{["Confirmed","Picked up","On the way","Delivered"].map((label,i)=><div key={label} className={i < (stage==="tracking"?3:1) ? "done" : ""}><i>{i < (stage==="tracking"?3:1) && <Icon name="check" size={11}/>}</i><span>{label}</span></div>)}</div>
    <Button onClick={onNext}>{stage === "confirmed" ? "View live tracking" : isRide ? "Complete trip" : "Mark as delivered"}</Button>
  </section></div>;
}

function UtilityHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="utility-header"><div><p>{subtitle}</p><h1>{title}</h1></div><button className="icon-button" aria-label="Notifications"><Icon name="bell" size={20}/><i/></button></header>;
}

function NavCart({ service, onBrowse, onCheckout }: { service: Service; onBrowse: () => void; onCheckout: () => void }) {
  const content = {
    food: { title: "Your food cart", subtitle: "Royal Biryani House", item: "Lucknowi Chicken Biryani", detail: "1 item · Delivery in 30–35 min", price: "₹289", icon: "food" },
    rides: { title: "Current ride", subtitle: "Booking summary", item: "Auto to Gomti Nagar", detail: "Pickup: Hazratganj · 5 min away", price: "₹96", icon: "car" },
    grocery: { title: "Your grocery cart", subtitle: "2 daily essentials", item: "Fresh produce basket", detail: "Tomatoes, organic broccoli · 15 min", price: "₹328", icon: "bag" },
    courier: { title: "Package in progress", subtitle: "Your delivery quote", item: "Small box · Up to 2 kg", detail: "Hazratganj to Gomti Nagar · 6.2 km", price: "₹139", icon: "box" },
  }[service];
  return <div className="utility-page cart-destination">
    <UtilityHeader title={content.title} subtitle={serviceMeta[service].label}/>
    <div className="context-chip"><span><Icon name={content.icon} size={15}/></span>{serviceMeta[service].label}</div>
    <article className="nav-cart-card"><span className="nav-cart-icon"><Icon name={content.icon} size={25}/></span><div><p>{content.subtitle}</p><h2>{content.item}</h2><small>{content.detail}</small><strong>{content.price}</strong></div></article>
    {service === "food" || service === "grocery" ? <div className="quantity-row"><span>Quantity</span><div className="stepper"><button>−</button><b>{service === "grocery" ? 2 : 1}</b><button>+</button></div></div> : <div className="route-summary"><LocationRows courier={service === "courier"}/></div>}
    <BillSummary service={service}/>
    <button data-interactive="true" className="browse-link" onClick={onBrowse}>Continue browsing {serviceMeta[service].label}</button>
    <div className="utility-action"><Button onClick={onCheckout}>{service === "rides" ? "Continue booking" : service === "courier" ? "Review quote" : "Proceed to checkout"}</Button></div>
  </div>;
}

function WalletScreen() {
  const transactions = [
    ["food", "Royal Biryani House", "Today, 1:24 PM", "− ₹289"],
    ["car", "Ride to Gomti Nagar", "Yesterday, 6:42 PM", "− ₹96"],
    ["wallet", "Money added", "18 May, 10:10 AM", "+ ₹500"],
  ];
  return <div className="utility-page">
    <UtilityHeader title="Wallet" subtitle="PAYMENTS & BALANCE"/>
    <section className="wallet-hero"><p>AVAILABLE BALANCE</p><h2>₹320.00</h2><span>RoadRider Wallet</span><button>+ Add money</button></section>
    <div className="quick-actions">{[["card","Payment methods"],["shield","Auto top-up"],["list","Statements"]].map(([icon,label])=><button key={label}><span><Icon name={icon}/></span><small>{label}</small></button>)}</div>
    <div className="section-heading"><h2>Recent transactions</h2><button>See all</button></div>
    <div className="transaction-list">{transactions.map(([icon,label,date,amount])=><article key={label}><span><Icon name={icon} size={18}/></span><div><strong>{label}</strong><small>{date}</small></div><b className={amount.startsWith("+") ? "credit" : ""}>{amount}</b></article>)}</div>
    <section className="linked-card"><span><Icon name="card"/></span><div><small>LINKED PAYMENT METHOD</small><strong>Visa ending in 4821</strong></div><button>Manage</button></section>
  </div>;
}

function OrdersScreen() {
  const orders: [Service, string, string, string][] = [
    ["food", "Royal Biryani House", "Arriving in 18 minutes", "₹289"],
    ["courier", "Package to Gomti Nagar", "Courier is at pickup", "₹139"],
    ["rides", "Ride to Aminabad", "Completed · 18 May", "₹124"],
    ["grocery", "Fresh grocery basket", "Delivered · 16 May", "₹346"],
  ];
  return <div className="utility-page">
    <UtilityHeader title="Your orders" subtitle="ALL ROADRIDER SERVICES"/>
    <div className="utility-tabs"><button className="active">Active <i>2</i></button><button>Past</button></div>
    <div className="cross-order-list">{orders.map(([type,title,status,price],index)=><article key={title} className={`order-${type}`}>
      <span className="service-order-icon"><Icon name={type === "rides" ? "car" : type === "grocery" ? "bag" : type === "courier" ? "box" : "food"}/></span>
      <div><p>{serviceMeta[type].label} · {index < 2 ? "ACTIVE" : "PAST"}</p><h3>{title}</h3><small>{status}</small></div><div className="order-price"><strong>{price}</strong><Icon name="arrow" size={16}/></div>
    </article>)}</div>
  </div>;
}

function Account({ onSelect }: { onSelect: (s: Service) => void }) {
  return <div className="account-page"><UtilityHeader title="Account" subtitle="PROFILE & SETTINGS"/><section className="profile-card"><div className="avatar large">AK</div><div><h1>Arjun Khanna</h1><p>+91 98765 43210</p></div><button>Edit</button></section>
    <div className="wallet-card"><div><small>ROADRIDER WALLET</small><strong>₹320.00</strong><p>Available balance</p></div><button>+ Add money</button></div>
    <div className="section-heading"><h2>Your activity</h2><button>See all</button></div><div className="order-tabs"><button className="selected">Active</button><button>Past</button></div>
    <article className="active-order"><span className="order-icon"><Icon name="food"/></span><div><small>FOOD · ON THE WAY</small><strong>Royal Biryani House</strong><p>Arriving in 18 minutes</p></div><Icon name="arrow"/></article>
    <div className="menu-list">{[["pin","Saved addresses"],["card","Payment methods"],["box","Your orders"],["shield","Help & support"],["user","Profile & settings"]].map(([icon,label])=><button key={label}><span><Icon name={icon}/></span><strong>{label}</strong><Icon name="arrow" size={18}/></button>)}</div>
    <div className="explore-services"><p>Explore services</p><div>{(["food","rides","grocery","courier"] as Service[]).map(s=><button data-interactive="true" onClick={()=>onSelect(s)} key={s}>{serviceMeta[s].label}</button>)}</div></div>
  </div>;
}

const actionContent: Record<string, { eyebrow: string; title: string; description: string; items: string[] }> = {
  notification: { eyebrow: "YOU'RE ALL CAUGHT UP", title: "Notifications", description: "Updates from every RoadRider service appear together here.", items: ["Your food order is being prepared", "Wallet cashback of ₹25 received", "Courier partner reached the pickup"] },
  address: { eyebrow: "SAVED PLACES", title: "Choose a location", description: "Use a saved place or add a new address for faster checkout.", items: ["Home · Hazratganj", "Work · Gomti Nagar", "Add a new address"] },
  payment: { eyebrow: "SAFE & SECURE", title: "Payment methods", description: "Manage the ways you pay across RoadRider.", items: ["RoadRider Wallet · ₹320", "Visa ending in 4821", "Add UPI or a new card"] },
  help: { eyebrow: "24/7 SUPPORT", title: "How can we help?", description: "Get quick help with an order, payment, ride, or delivery.", items: ["Chat with support", "Report an order issue", "Safety and emergency help"] },
  order: { eyebrow: "ORDER DETAILS", title: "Track your activity", description: "See live progress, receipts, and support options in one place.", items: ["View live tracking", "Download invoice", "Get help with this order"] },
  profile: { eyebrow: "PERSONAL DETAILS", title: "Profile & settings", description: "Keep your RoadRider account details up to date.", items: ["Arjun Khanna", "+91 98765 43210", "Language · English"] },
  wallet: { eyebrow: "ROADRIDER WALLET", title: "Add money", description: "Top up once and pay quickly across every service.", items: ["₹200", "₹500", "₹1,000"] },
  default: { eyebrow: "EXPLORE ROADRIDER", title: "More options", description: "Everything you need is ready in the RoadRider prototype.", items: ["Recommended for you", "Popular nearby", "Offers and savings"] },
};

function MoreScreen({ label, onBack }: { label: string; onBack: () => void }) {
  const [selected, setSelected] = useState("");
  const normalized = label.toLowerCase();
  const key = normalized.includes("notif") ? "notification"
    : normalized.includes("address") || normalized.includes("location") || normalized.includes("pickup") || normalized.includes("destination") ? "address"
    : normalized.includes("pay") || normalized.includes("card") || normalized.includes("upi") ? "payment"
    : normalized.includes("help") || normalized.includes("phone") ? "help"
    : normalized.includes("order") || normalized.includes("active") || normalized.includes("past") || normalized.includes("track") ? "order"
    : normalized.includes("profile") || normalized.includes("edit") || normalized.includes("account") ? "profile"
    : normalized.includes("money") || normalized.includes("wallet") || normalized.includes("top-up") ? "wallet"
    : "default";
  const content = actionContent[key];
  const title = key === "default" && label ? label : content.title;
  return <div className="more-page">
    <FlowHeader title="" onBack={onBack}/>
    <div className="more-hero"><span><Icon name={key === "notification" ? "bell" : key === "address" ? "pin" : key === "payment" || key === "wallet" ? "wallet" : key === "order" ? "list" : key === "profile" ? "user" : key === "help" ? "shield" : "star"} size={28}/></span><p>{content.eyebrow}</p><h1>{title}</h1><p>{content.description}</p></div>
    <div className="more-list">{content.items.map((item, index) => <button data-interactive="true" className={selected === item ? "selected" : ""} onClick={() => setSelected(item)} key={item}><span>{selected === item ? <Icon name="check" size={15}/> : index + 1}</span><strong>{item}</strong><Icon name="arrow" size={17}/></button>)}</div>
    {selected && <p className="action-feedback"><Icon name="check" size={14}/> {selected} selected</p>}
    <div className="more-action"><Button onClick={onBack}>Done</Button></div>
  </div>;
}

function App() {
  const [entry, setEntry] = useState<"splash" | "phone" | "otp" | "app">("splash");
  const [service, setService] = useState<Service>("food");
  const [screen, setScreen] = useState<Screen>("home");
  const [moreLabel, setMoreLabel] = useState("");
  const [returnScreen, setReturnScreen] = useState<Screen>("home");

  if (entry === "splash") return <Splash onStart={() => setEntry("phone")}/>;
  if (entry === "phone") return <AuthScreen step="phone" onBack={() => setEntry("splash")} onNext={() => setEntry("otp")}/>;
  if (entry === "otp") return <AuthScreen step="otp" onBack={() => setEntry("phone")} onNext={() => setEntry("app")}/>;

  const selectService = (value: Service) => {
    setService(value);
    setScreen("home");
  };
  const selectUtility = (value: "navcart" | "wallet" | "orders" | "account") => {
    setScreen(value);
  };
  const next = () => {
    const order: Screen[] = service === "rides" ? ["detail","cart","payment","confirmed","tracking","complete"] : ["detail","cart","address","payment","confirmed","tracking","complete"];
    const index = order.indexOf(screen);
    if (screen === "complete") setScreen("home");
    else setScreen(order[Math.min(index + 1, order.length - 1)]);
  };
  const back = () => {
    const order: Screen[] = service === "rides" ? ["home","detail","cart","payment","confirmed","tracking","complete"] : ["home","detail","cart","address","payment","confirmed","tracking","complete"];
    const index = order.indexOf(screen);
    setScreen(order[Math.max(index - 1, 0)]);
  };
  const openSecondaryAction = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button");
    if (!button || button.dataset.interactive === "true" || screen === "more") return;
    const label = button.getAttribute("aria-label") || button.textContent?.trim() || "More options";
    setMoreLabel(label);
    setReturnScreen(screen);
    setScreen("more");
  };

  return <div className={`app-shell theme-${service}`} onClick={openSecondaryAction}>
    <div className="mobile-frame">
      <div className="screen-scroll">
        {screen === "home" && service === "food" && <FoodHome onOpen={() => setScreen("detail")} onService={selectService}/>}
        {screen === "home" && service === "rides" && <RidesHome onOpen={() => setScreen("detail")} onService={selectService}/>}
        {screen === "home" && service === "grocery" && <GroceryHome onOpen={() => setScreen("detail")} onService={selectService}/>}
        {screen === "home" && service === "courier" && <CourierHome onOpen={() => setScreen("detail")} onService={selectService}/>}
        {screen === "detail" && <ServiceDetail service={service} onBack={back} onNext={next}/>}
        {["cart","address","payment","confirmed","tracking","complete"].includes(screen) && <CheckoutScreen service={service} screen={screen} onBack={back} onNext={next}/>}
        {screen === "navcart" && <NavCart service={service} onBrowse={() => setScreen("home")} onCheckout={() => setScreen("cart")}/>}
        {screen === "wallet" && <WalletScreen/>}
        {screen === "orders" && <OrdersScreen/>}
        {screen === "account" && <Account onSelect={selectService}/>}
        {screen === "more" && <MoreScreen label={moreLabel} onBack={() => setScreen(returnScreen)}/>}
      </div>
      {(["home","navcart","wallet","orders","account"] as Screen[]).includes(screen) && <BottomNav active={screen as "home" | "navcart" | "wallet" | "orders" | "account"} count={service === "grocery" ? 2 : 1} onSelect={selectUtility}/>}
    </div>
  </div>;
}

export default App;
