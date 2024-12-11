import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="top-header">
      <nav>
        <Link to="/" className="header-home">Música y Music</Link>
      </nav>
    </header>
  );
};

export default Header;