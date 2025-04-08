import React from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { FaGooglePlus } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
    <div>
  <footer className="flex justify-between p-10 text-white footer bg-blue-950">
    <nav>

      <h6 className="text-lg font-bold text-white">Quick Links</h6>

      <a className="link link-hover">Home</a><br/>
      <a className="link link-hover">Jobs</a><br/>
      <a className="link link-hover">Companies</a><br/>
    </nav>
    <nav>

      <h6 className="text-lg font-bold text-white">About Us</h6>

      <a className="link link-hover">Our Story</a><br/>
      <a className="link link-hover">Careers</a><br/>
      <a className="link link-hover">Contact</a><br/>
    </nav>
    <nav>

      <h6 className="text-lg font-bold text-white">Support</h6>

      <a className="link link-hover">Help Center</a><br/>
      <a className="link link-hover">FAQs</a><br/>
      <a className="link link-hover">Privacy Policy</a><br/>
    </nav>
  </footer>
</div>

<footer className="justify-between px-10 py-4 text-white border-t footer bg-blue-950 border-base-300">
   <nav className="md:place-self-center md:justify-self-start">
    <div className="grid grid-flow-col gap-10 ">
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
  </nav>
  <nav className="md:place-self-center md:justify-self-end">
  <p>Copyright © {new Date().getFullYear()} AskHire. All right reserved</p>
  </nav>
</footer>
    </div>
  );
};

export default Footer;
