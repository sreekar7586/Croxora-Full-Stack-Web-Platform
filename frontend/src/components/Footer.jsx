const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <p className="font-bold text-lg">Croxora</p>
        <p>Full-Stack E-commerce Platform</p>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover">About</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
