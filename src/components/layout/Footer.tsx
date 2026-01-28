import vtbLogo from "../../assets/icons/vtb.svg";
import sberLogo from "../../assets/icons/sber.svg";
import alfaLogo from "../../assets/icons/alfa.svg";
import tinkoffLogo from "../../assets/icons/tinkoff.svg";
import { USDT_SVG, TON_SVG, ETH_SVG, BTC_SVG } from "../../assets/icons/crypto";

export default function Footer() {
  const banks = [
    { src: vtbLogo, alt: "ВТБ" },
    { src: alfaLogo, alt: "Альфа-Банк" },
    { src: sberLogo, alt: "Сбербанк" },
    { src: tinkoffLogo, alt: "Тинькофф" }
  ];

  const cryptos = [
    { svg: USDT_SVG, alt: "USDT" },
    { svg: TON_SVG, alt: "TON" },
    { svg: ETH_SVG, alt: "Ethereum" },
    { svg: BTC_SVG, alt: "Bitcoin" }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-icons-section">
          <div className="footer-row footer-row--crypto">
            <div className="footer-icons-row">
              {cryptos.map((crypto) => (
                <div
                  key={crypto.alt}
                  className="footer-icon"
                  title={crypto.alt}
                  dangerouslySetInnerHTML={{ __html: crypto.svg }}
                />
              ))}
              <div className="footer-icon footer-icon--more">+5</div>
            </div>
          </div>

          <div className="footer-row footer-row--banks">
            <div className="footer-icons-row">
              {banks.map((bank) => (
                <img
                  key={bank.alt}
                  src={bank.src}
                  alt={bank.alt}
                  className="footer-icon footer-icon--bank"
                />
              ))}
            </div>
            <span className="footer-pill">Переводы на карту</span>
          </div>
        </div>

        <div className="footer-legal">
          <p>© Finora 2026</p>
          <p>
            Все права и торговые знаки защищены в соответствии с правилами и политикой компании, а также законодательством страны, где она официально зарегистрирована и подчиняется её регуляторам.
          </p>
        </div>
      </div>
    </footer>
  );
}
