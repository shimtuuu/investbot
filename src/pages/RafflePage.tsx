import { TerminalIcon } from "../components/icons";

export default function RafflePage() {
  return (
    <section className="page">
      <div className="section-header reveal">
        <h1>Розыгрыш</h1>
        <p className="muted">Праздничный ивент · скоро</p>
      </div>

      <div className="card maintenance-card reveal" style={{ animationDelay: "80ms" }}>
        <div className="maintenance-icon">
          <TerminalIcon size={26} />
        </div>
        <h2>Технические работы</h2>
        <p className="muted">
          Розыгрыш временно недоступен. Скоро будет доступен!
        </p>
        <div className="terminal">
          <div className="terminal-header">session: orbit</div>
          <pre className="terminal-body">
            <code>$ sudo ./orbit_trading_init
&gt; Initializing trading system...
&gt; Connecting to blockc</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
