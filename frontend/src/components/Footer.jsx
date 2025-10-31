import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground">
      &copy; {currentYear} Nidhi Pushtika. All rights reserved.
    </footer>
  );
};

export default Footer;
