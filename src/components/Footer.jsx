import React from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* Top Footer Section */}
      <footer className="footer bg-blue-950 text-white p-10 flex justify-between">
        <nav className="flex flex-col">
          <h6 className="text-white font-bold text-lg mb-2">Quick Links</h6>
          <a className="link link-hover">Home</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Companies</a>
        </nav>
        <nav className="flex flex-col">
          <h6 className="text-white font-bold text-lg mb-2">About Us</h6>
          <a className="link link-hover">Our Story</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Contact</a>
        </nav>
        <nav className="flex flex-col">
          <h6 className="text-white font-bold text-lg mb-2">Support</h6>
          <a className="link link-hover">Help Center</a>
          <a className="link link-hover">FAQs</a>
          <a className="link link-hover">Privacy Policy</a>
        </nav>
      </footer>

      {/* Bottom Footer Section */}
      <footer className="bg-blue-950 text-white border-t border-base-300 px-10 py-4">
        <div className="flex justify-between items-center">
          {/* Social Media Icons */}
          <div className="flex gap-6">
            <a className="text-2xl">
              <FaPhoneSquareAlt />
            </a>
            <a className="text-2xl">
              <FaGooglePlus />
            </a>
            <a className="text-2xl">
              <FaFacebook />
            </a>
            <a className="text-2xl">
              <FaLinkedin />
            </a>
          </div>

          {/* Copyright Text */}
          <p className="text-sm text-gray-300">
            Copyright © {new Date().getFullYear()} AskHire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
