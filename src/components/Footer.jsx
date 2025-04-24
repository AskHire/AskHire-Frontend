import React from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
    <div>
  <footer className="footer bg-blue-950 text-white p-5 flex justify-between">
    <nav>
      <h6 className="text-white font-bold text-lg mb-4">Quick Links</h6>
      <a className="link link-hover">Home</a><br/>
      <a className="link link-hover">Jobs</a><br/>
      <a className="link link-hover">Companies</a><br/>
    </nav>
    <nav>
      <h6 className="text-white font-bold text-lg mb-4">About Us</h6>
      <a className="link link-hover">Our Story</a><br/>
      <a className="link link-hover">Careers</a><br/>
      <a className="link link-hover">Contact</a><br/>
    </nav>
    <nav>
      <h6 className="text-white font-bold text-lg mb-4">Support</h6>
      <a className="link link-hover">Help Center</a><br/>
      <a className="link link-hover">FAQs</a><br/>
      <a className="link link-hover">Privacy Policy</a><br/>
    </nav>
  </footer>
</div>

<footer className="footer bg-blue-950 text-white border-base-300 border-t px-10 py-4 flex justify-between items-center">
  <div className="flex gap-10">
    <a className='text-2xl'>
      <FaPhoneSquareAlt />
    </a>
    <a className='text-2xl'>
      <FaGooglePlus />
    </a>
    <a className='text-2xl'>
      <FaFacebook />
    </a>
    <a className='text-2xl'>
      <FaLinkedin />
    </a>
  </div>
  <p className="text-sm">Copyright © {new Date().getFullYear()} AskHire. All Rights Reserved</p>
</footer>

    </div>
  );
};

export default Footer;
