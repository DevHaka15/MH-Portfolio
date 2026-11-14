import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>© 2026 Malambo Hakabwandi</span>
        <a href="https://www.behance.net/lambohaka" target="_blank" rel="noopener">Behance</a>
        <Link to="/contact">Start a project</Link>
      </div>
    </footer>
  );
}
