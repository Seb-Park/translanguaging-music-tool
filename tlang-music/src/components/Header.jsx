import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/" className="header-home">Música y Music</Link>
      </nav>
    </header>
  );
};

export default Header;